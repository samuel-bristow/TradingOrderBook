import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Row, Form } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
import { Dropdown } from 'semantic-ui-react'

import StockInfo from "./StockInfo";
import OrdersTable from "./OrdersTable";
import NewOrderForm from "./OrderForm";
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

class Orders extends Component {
  static defaultProps = {
    stockSymbol: "SYMB",
  };

  state = {
    stock: { symbol: "", name: "", exchange: "" },
    lastMatch: { tradePrice: 0, tradeTimestamp: new Date() },
    sellOrders: [],
    buyOrders: [],
    orderActivity: "",
    tradeVolume: "",
    newBidModalShow: false,
    newAskModalShow: false,
    allStockSymbols: [],
    newOrderMatchedTrades: [],
    newOrder: undefined,
    addResultModalShow: false,
    newOrderFormErrors: CLEAR_ERRORS,
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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.symbol !== this.props.match.params.symbol) {
      const stockSymbol = this.props.match.params.symbol;
      this.fetchData(stockSymbol);
    }
  }

  fetchData(stockSymbol) {
    if (stockSymbol === undefined) stockSymbol = "";
    else stockSymbol = "/" + stockSymbol;
    console.log(stockSymbol);

    fetch(SERVICE_URL + "/orders" + stockSymbol)
      .then(response => {
        console.log(response.status, response.statusText)
        if (response.status === 200) {
          response.json().then(data => {
            this.setState({
              sellOrders: data.sellOrders, buyOrders: data.buyOrders, stock: data.stock,
              allStockSymbols: data.stockSymbols, lastMatch: data.lastMatch, 
              orderActivity: data.orderActivity, tradeVolume: data.tradeVolume, fetchTime: new Date()
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

  setNewBidModalShow = (value) => {
    this.setState({ newBidModalShow: value, newOrderFormErrors: CLEAR_ERRORS });
  };
  setNewAskModalShow = (value) => {
    this.setState({ newAskModalShow: value, newOrderFormErrors: CLEAR_ERRORS });
  };
  setAddResultModalShow = (value) => {
    this.setState({ addResultModalShow: value });
  };

  onStockChange = (event, data) => {
    let newStockValue = data.value;
    if (newStockValue === 'ALL') this.props.history.push("/orders");
    else this.props.history.push("/orders/" + newStockValue);
  };

  handleNewOrderSubmit = (data) => {
    let validationErrors = this.validateNewOrder(data);
    if (!validationErrors.isValid) {
      console.log("New order is invalid. Reporting errors.", validationErrors);
      this.setState({ newOrderFormErrors: validationErrors });
      return;
    }

    fetch(SERVICE_URL + "/addorder", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(trades => {
            const stockSymbol = this.props.match.params.symbol;
            this.setState({
              newBidModalShow: false, newAskModalShow: false, addResultModalShow: true,
              newOrderMatchedTrades: trades, newOrder: data
            }, this.fetchData(stockSymbol));
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
    let { stock, lastMatch, sellOrders, buyOrders, allStockSymbols, newOrderMatchedTrades, newOrder, orderActivity, tradeVolume } = this.state;
    const stockSymbol = (this.props.match.params.symbol === undefined) ? "ALL" : this.props.match.params.symbol;

    let stockOptions = [];
    stockOptions.push({ text: ALL_ORDERS_VALUE, value: 'ALL' });
    allStockSymbols.forEach(symbol => stockOptions.push({ text: symbol, value: symbol }));

    return (
      <div>
        <div className="App-main-container">
          <Container>
            <Row className="container-space-between top-row">
              <button onClick={() => this.props.history.goBack()} className="transparent-btn back-btn"> <FaChevronLeft /></button>
              <Dropdown placeholder='Stock' search selection options={stockOptions} value={stockSymbol} onChange={this.onStockChange} />
            </Row>
            <Row>
              <StockInfo stock={stock} lastMatch={lastMatch} title="All Orders" orderActivity={orderActivity} tradeVolume={tradeVolume}></StockInfo>
            </Row>
            <Row className="container-space-around">
              <button className="btn-style add-ord-btn" onClick={() => this.setNewBidModalShow(true)}> Add Bid </button>
              <button className="btn-style add-ord-btn" onClick={() => this.setNewAskModalShow(true)}> Add Ask </button>
            </Row>
            <Row className="container-space-between">
              <OrdersTable type="buy" orders={buyOrders} allOrders={stock === null} user={this.props.user}></OrdersTable>
              <OrdersTable type="sell" orders={sellOrders} allOrders={stock === null} user={this.props.user}></OrdersTable>
            </Row>
            <NewOrderForm user={this.props.user} type="buy" stockSymbol={stock !== null ? stock.symbol : undefined} allStockSymbols={allStockSymbols}
              onSubmit={this.handleNewOrderSubmit}
              show={this.state.newBidModalShow}
              onHide={() => this.setNewBidModalShow(false)}
              orderErrors={this.state.newOrderFormErrors}
            />
            <NewOrderForm user={this.props.user} type="sell" stockSymbol={stock !== null ? stock.symbol : undefined} allStockSymbols={allStockSymbols}
              onSubmit={this.handleNewOrderSubmit}
              show={this.state.newAskModalShow}
              onHide={() => this.setNewAskModalShow(false)}
              orderErrors={this.state.newOrderFormErrors}
            />
            <NewOrderResult newOrder={newOrder} newOrderMatchedTrades={newOrderMatchedTrades}
              show={this.state.addResultModalShow}
              onHide={() => this.setAddResultModalShow(false)} />
          </Container>
        </div>
        <footer className="App-footer">
          <div>
            As of {this.state.fetchTime.format(DATE_FORMAT)}
            <button onClick={() => this.fetchData(this.props.match.params.symbol)} className="btn-style refresh-btn"><HiRefresh /></button>
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

export default withRouter(Orders);
