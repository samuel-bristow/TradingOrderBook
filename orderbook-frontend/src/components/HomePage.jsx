import React from "react";
import Stock from "./Stock";
import StockModal from "./StockModal";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import { withRouter } from "react-router";
import { HiRefresh } from "react-icons/hi";

const SERVICE_URL = "http://localhost:8080/orderbook/";

const DATE_FORMAT = "%d%b%y %H:%M:%S.%L";

class HomePage extends React.Component {
  state = {
    stocks: [],
    newStockData: [],
    fetchTime: new Date(),
    newStockModal: false,
  };

  componentDidMount() {
    console.log("HomePage mounted");
    this.loadAvailableStocks();
  }

  loadAvailableStocks() {
    let URL = SERVICE_URL + "stocks";

    fetch(URL)
      .then((data) => data.json())
      .then((d) => this.setState({ stocks: d, fetchTime: new Date() }));
  }

  handleToggleNewStockModal = () => {
    this.setState({ newStockModal: !this.state.newStockModal });
    console.log("Toggle status: " + this.state.newStockModal);
  };

  handleTradeSelect = (trade) => {
    alert(
      "Trading: " +
      trade.symbol +
      " | " +
      trade.recentPrice +
      " | " +
      trade.exchange
    );
  };

  reloadData = () => {
    this.handleToggleNewStockModal();
    console.log("Hello :)");
    this.loadAvailableStocks();
  }


  render() {
    return (
      <div>
        <div className="App-main-container">
          <Container>
            <Row className="container-space-between top-row">
              <button onClick={() => this.props.history.goBack()} className="transparent-btn back-btn"> <FaChevronLeft /></button>
            </Row>
            <Row>
              <Col>
                <Stock onTrade={this.handleTradeSelect} stocks={this.state.stocks} />
              </Col>
            </Row>
            <Row>
              <Col>
                <button className="btn-style new-stock-btn" onClick={this.handleToggleNewStockModal}>Add New Stock</button>
              </Col>

            </Row>

            <StockModal
              show={this.state.newStockModal}
              close={this.handleToggleNewStockModal}
              reload={this.reloadData}
            />
          </Container>
        </div>
        <footer className="App-footer">
          <div>
            As of {this.state.fetchTime.format(DATE_FORMAT)}
            <button onClick={() => this.loadAvailableStocks()} className="btn-style refresh-btn"><HiRefresh /></button>
          </div>
          <div>
            &copy; Alice, Niran, Sam, Siva
          </div>
        </footer>
      </div>

    );
  }
}

export default withRouter(HomePage);
