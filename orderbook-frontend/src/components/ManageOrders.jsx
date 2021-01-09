import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row, Button, Form } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

import StockInfo from "./StockInfo";
import ManageOrdersTable from "./ManageOrdersTable";
import OrderForm from "./OrderForm";
import NewOrderResult from "./NewOrderResult";

const SERVICE_URL = "http://localhost:8080/orderbook";

const ALL_ORDERS_VALUE = "-- all orders --";
const CLEAR_ERRORS = {
  type: "",
  stockSymbol: "",
  size: "",
  price: "",
  isValid: true,
};
const DATE_FORMAT = "%d%b%y %H:%M:%S.%L";

class ManageOrders extends Component {
  static defaultProps = {
    stockSymbol: "SYMB",
  };

  state = {
    stock: { symbol: "", name: "", exchange: "" },
    lastMatch: { tradePrice: 0, tradeTimestamp: new Date() },
    sellOrders: [],
    buyOrders: [],
    editModalShow: false,
    newAskModalShow: false,
    allStockSymbols: [],
    editedOrderMatchedTrades: [],
    addResultModalShow: false,
    orderFormErrors: CLEAR_ERRORS,
    orderToEdit: undefined,
    editedOrder: undefined,
    fetchTime: new Date(),
  };

  constructor(props) {
    super(props);
    this.stockSelect = React.createRef();
  }

  componentDidMount() {
    const stockSymbol = this.props.match.params.symbol;
    this.fetchData(stockSymbol);
  }

  fetchData() {
    console.log("Id: " + this.props.user);
    fetch(SERVICE_URL + "/myorders/" + this.props.user)
      .then(response => {
        console.log(response.status, response.statusText)
        if (response.status === 200) {
          response.json().then(data => {
            this.setState({
              sellOrders: data.sellOrders, buyOrders: data.buyOrders, stock: data.stock,
              allStockSymbols: data.stockSymbols, lastMatch: data.lastMatch, fetchTime: new Date()
            })
          });
        }
        else {
          console.log("Response status : " + response.status);
          // redirect to error page
          this.props.history.replace("/error/" + response.status);
        }
      })
      .catch((err) => console.log("fail: " + err));
  }

  setEditModalShow = (value) => {
    this.setState({ editModalShow: value, orderFormErrors: CLEAR_ERRORS });
  };

  setAddResultModalShow = (value) => {
    this.setState({ addResultModalShow: value });
  };

  onStockChange = () => {
    let newStockValue = this.stockSelect.current.value;
    if (newStockValue === ALL_ORDERS_VALUE) this.props.history.push("/orders");
    else this.props.history.push("/orders/" + newStockValue);
  };

  handleOnEdit = (order) => {
    this.setState({ editModalShow: true, orderFormErrors: CLEAR_ERRORS, orderToEdit: order });
  }

  handleOnRemove = (order) => {
    if (window.confirm("Are you sure you want to remove this order?")) {
      fetch(SERVICE_URL + "/removeorder/" + order.orderId)
        .then(response => {
          if (response.status === 200) {
            this.fetchData();
          }
          else {
            console.log("Response status : " + response.status);
            // redirect to error page
            this.props.history.replace("/error/" + response.status);
          }
        })
        .catch((err) => console.log("fail: " + err));
    }
  }

  handleEditOrderSubmit = (data) => {
    let validationErrors = this.validateNewOrder(data);
    if (!validationErrors.isValid) {
      console.log("New order is invalid. Reporting errors.", validationErrors);
      this.setState({ orderFormErrors: validationErrors });
      return;
    }

    fetch(SERVICE_URL + "/changeorder", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(trades => {
            this.setState({
              editModalShow: false, addResultModalShow: true,
              editedOrderMatchedTrades: trades, editedOrder: data
            });
            this.fetchData();
          });
        }
        else {
          console.log("Response status : " + response.status);
          // redirect to error page
          this.props.history.replace("/error/" + response.status);
        }
      })
      .catch((err) => console.log("fail: " + err));
  }

  render() {
    let { stock, sellOrders, buyOrders, allStockSymbols, editedOrderMatchedTrades, editedOrder, orderToEdit } = this.state;
    let stockOptions = [];

    stock === null ?
      stockOptions.push(<option key={-1} selected>{ALL_ORDERS_VALUE}</option>) :
      stockOptions.push(<option key={-1}>{ALL_ORDERS_VALUE}</option>);

    if (!allStockSymbols)
      allStockSymbols.forEach((option, index) => {
        stock !== null && option === stock.symbol ?
          stockOptions.push(<option key={index} selected>{option}</option>) :
          stockOptions.push(<option key={index}>{option}</option>);
      });

    return (
      <div>
        <div className="App-main-container">
          <Container >
            <Row className="container-space-between top-row">
              <button onClick={() => this.props.history.goBack()} className="transparent-btn back-btn"> <FaChevronLeft /></button>
            </Row>
            <Row>
              <StockInfo title="Manage Orders"></StockInfo>
            </Row>

            <ManageOrdersTable type="buy" orders={buyOrders} allOrders onEdit={this.handleOnEdit} onRemove={this.handleOnRemove}></ManageOrdersTable>
            <ManageOrdersTable type="sell" orders={sellOrders} allOrders onEdit={this.handleOnEdit} onRemove={this.handleOnRemove}></ManageOrdersTable>

            <OrderForm orderToEdit={orderToEdit} allStockSymbols={allStockSymbols}
              onSubmit={this.handleEditOrderSubmit}
              show={this.state.editModalShow}
              onHide={() => this.setEditModalShow(false)}
              orderErrors={this.state.orderFormErrors}
            />
            <NewOrderResult newOrder={editedOrder} newOrderMatchedTrades={editedOrderMatchedTrades} editResults
              show={this.state.addResultModalShow}
              onHide={() => this.setAddResultModalShow(false)} />
          </Container>
        </div>
        <footer className="App-footer">
          <div>
            As of {this.state.fetchTime.format(DATE_FORMAT)}
            <button onClick={() => this.fetchData()} className="btn-style refresh-btn"><HiRefresh /></button>
          </div>
          <div>
            &copy; Alice, Niran, Sam, Siva
                </div>
        </footer>
      </div>
    );
  }

  validateNewOrder = (order) => {
    let errors = {
      type: "",
      stockSymbol: "",
      size: "",
      price: "",
      isValid: true,
    };

    // validating type
    if (!order.type) {
      errors.type = "The order must have a type.";
      errors.isValid = false;
    } else if (!order.type.match("^BUY|SELL$")) {
      errors.type = "Type must be 'BUY' or 'SELL'.";
      errors.isValid = false;
    }

    // validating stock symbol
    if (
      !order.stock ||
      !order.stock.symbol ||
      order.stock.symbol.trim().length === 0
    ) {
      errors.stockSymbol = "The order must have a stock symbol.";
      errors.isValid = false;
    } else if (!order.type.match("^[A-Z]{2,10}$")) {
      errors.stockSymbol =
        "The stock symbol must be written in capital letters only and must have at least 2 characters and at most 10.";
      errors.isValid = false;
    }

    // validating size
    if (!order.currentSize) {
      errors.size = "The order must have a size.";
      errors.isValid = false;
    } else if (typeof order.currentSize === "number") {
      errors.size = "The size must be a number.";
      errors.isValid = false;
    } else if (order.currentSize <= 0) {
      errors.size = "The size must be a value superior to 0.";
      errors.isValid = false;
    } else if (!order.currentSize.toString().match("^\\d+$")) {
      errors.size = "The size must be a whole number.";
      errors.isValid = false;
    }

    // validating price
    if (!order.price) {
      errors.price = "The order must have a price.";
      errors.isValid = false;
    } else if (typeof order.price === "number") {
      errors.price = "The price must be a number.";
      errors.isValid = false;
    } else if (order.price <= 0) {
      errors.price = "The price must be a value superior to 0.";
      errors.isValid = false;
    } else if (!order.price.toString().match("^\\d+\\.*\\d{0,2}$")) {
      errors.price =
        "The price must be a number with at most 2 decimals places.";
      errors.isValid = false;
    }

    return errors;
  };
}

export default withRouter(ManageOrders);
