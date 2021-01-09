import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class StockForm extends React.Component {
  render() {
    let { handleChange } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Form.Group controlId="symbol">
          <Form.Label>Symbol Name</Form.Label>
          <Form.Control
            name="symbol"
            value={this.props.newStock.symbol}
            onChange={handleChange}
            type="text"
            placeholder="Enter Symbol Stock..."
            onKeyDown={this.props.keyPress}
            isInvalid={!!this.props.hints.symbol}
          />
          <Form.Control.Feedback type="invalid">
              {this.props.hints.symbol}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Organisation Name</Form.Label>
          <Form.Control
            name="name"
            value={this.props.newStock.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter Stock Name..."
            isInvalid={!!this.props.hints.name}
          />
          <Form.Control.Feedback type="invalid">
              {this.props.hints.name}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Exchange</Form.Label>

          <Form.Control onChange={handleChange} name="exchange" as="select" isInvalid={!!this.props.hints.exchange}>
            <option value="" selected disabled>Please select</option>
            {this.props.exchanges.map((exchange, index) => (
                <option value={exchange}>{exchange}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
              {this.props.hints.exchange}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}

export default StockForm;
