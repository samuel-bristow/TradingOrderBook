import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import StockForm from "./StockForm";

const SERVICE_URL = "http://localhost:8080/orderbook/";

class StockModal extends React.Component {
  state = {
    newStockData: {
      symbol: "",
      name: "",
      exchange: "",
    },
    newStockHints: {
      symbol: "",
      name: "",
      exchange: ""
    },
    exchanges: ["LSE", "NASDAQ", "NYSE", "SSE"],
  };

  handleNewStockChange = (event) => {
    let inputName = event.target.name;
    let inputValue = event.target.value;
    let newStock = this.state.newStockData;

    if (newStock.hasOwnProperty(inputName)) {
      newStock[inputName] = inputValue;
      this.setState({ newStockData: newStock });
    }
  };

  validateNewStock() {
    let symbol = this.state.newStockData.symbol.replace(/\s/g, "");
    let name = this.state.newStockData.name.replace(/\s/g, "");
    let exchange = this.state.newStockData.exchange.replace(/\s/g, "");
    let symbolHint = "Please enter between 2 to 10 uppercase letters ";
    let lettersHint = "Please enter only letters!";
    let lettersNumbersHint = "Please enter only letters and numbers";
    let valid = true;
    let hints = { symbol: "", name: "" };

    let empty = "";
    let lettersOnly = /^[A-Z]{2,10}$/;
    let lettersAndNumbers = /^([a-zA-Z0-9 _-]+)$/;

    if (!lettersAndNumbers.test(name)) {
      console.log("Name should only contain letters");
      hints.name = lettersNumbersHint;
      valid = false;
    }

    if (!lettersOnly.test(symbol)) {
      console.log("Symbol name only be made up of letters");
      hints.symbol = symbolHint;
      valid = false;
    }
    if (symbol === empty) {
      console.log("Please fill out the symbol field");
      hints.symbol = symbolHint;
      valid = false;
    }

    if (name === empty) {
      console.log("Please fill out the name field");
      hints.name = "Please fill out this field";
      valid = false;
    }

    if (exchange == empty) {
      console.log("Please select an exchange");
      hints.exchange = "Please fill out this field";
      valid = false
    }

    this.setState({ newStockHints: hints });
    return valid;
  }

  handleKeyDown = (event) => {
    // prevent user from entering white space
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  handleStockSubmit = (event) => {
    this.setState({ newStockHints: { symbol: "", name: "" } });

    event.preventDefault();
    if (this.validateNewStock()) {
      this.addNewStock();

    }
  };

  addNewStock() {
    console.log("New stock: ", this.state.newStockData);

    fetch(SERVICE_URL + "addstock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.newStockData),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Add Stock - Success!", data);
        this.setState({
          newStockData: {
            symbol: "",
            name: "",
            exchange: "",
          },
        },this.props.reload());
      })
      .catch((error) => {
        console.log("Add Stock - Error");
        console.log(error);
      });

    //this.props.reload();

  }
  render() {
    return (
      <Modal show={this.props.show} size="md" aria-labelledby="contained-modal-title-vcenter" centered>

        <Modal.Header closeButton>
          <Modal.Title>Add Stock</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <StockForm
            handleChange={this.handleNewStockChange}
            newStock={this.state.newStockData}
            handleSubmit={this.handleStockSubmit}
            exchanges={this.state.exchanges}
            hints={this.state.newStockHints}
            keyPress={this.handleKeyDown}

          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.close} variant="secondary">
            Close
            </Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default StockModal;
