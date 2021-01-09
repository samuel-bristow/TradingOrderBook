import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { Dropdown } from 'semantic-ui-react'

export default function NewOrderForm(props) {
  const defaultProps = {
    onHide: () => { },
  };

  const { onHide = defaultProps.onHide, allStockSymbols, onSubmit, orderErrors, orderToEdit } = props;
  let { type, stockSymbol } = props;
  let price, size;

  if (orderToEdit) {
    price = orderToEdit.price;
    size = orderToEdit.currentSize;
    type = orderToEdit.type;
    stockSymbol = orderToEdit.stock.symbol;
  }
  if (type) type = type.toUpperCase();

    let stockOptions = [];
    allStockSymbols.forEach(symbol => stockOptions.push({ text: symbol, value: symbol }));

  let typeRef = React.createRef();
  let stockRef = React.createRef();
  let priceRef = React.createRef();
  let sizeRef = React.createRef();

  let handleSubmit = (event) => {
    event.preventDefault();

    let data;
    if (orderToEdit) {
      data = orderToEdit;
      data.currentSize = sizeRef.current.value;
      data.price = priceRef.current.value;
    }
    else {
      data = {
        "type": typeRef.current.value.toUpperCase(),
        "price": priceRef.current.value,
        "initialSize": sizeRef.current.value,
        "currentSize": sizeRef.current.value,
        "stock": { "symbol": stockSymbol },
        "user": { "userId": props.user }
      }
    }

    if (onSubmit) {
      console.log(data);
      onSubmit(data);
    }
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="large-text">
          {orderToEdit ? "Edit order" : (type === "buy") ? "Add new buy order" : "Add new sell order"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="medium-text">
        <Form>
          <Form.Group as={Row}>
            <Form.Label column sm="4" xs="6"> Order type: </Form.Label>
            <Col sm="8" xs="6">
              <Form.Control readOnly defaultValue={type} ref={typeRef}
                isInvalid={!!orderErrors.type} />
              <Form.Control.Feedback type="invalid">
                {orderErrors.type}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4" xs="6"> Stock: </Form.Label>
            <Col sm="8" xs="6">
            <Dropdown placeholder='Stock' search selection options={stockOptions} placeholder="Please select stock"
                  value={stockSymbol} disabled={!!stockSymbol} ref={stockRef}  error={!!orderErrors.stockSymbol}
                  onChange={(e, d) => { stockSymbol = d.value; } }/>
              <Form.Control.Feedback type="invalid" className="d-block">
                {orderErrors.stockSymbol}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4" xs="6"> {type === "buy" ? "Bid" : "Ask"} price: </Form.Label>
            <Col sm="8" xs="6">
              <Form.Control type="number" min="0.01" ref={priceRef} isInvalid={!!orderErrors.price} defaultValue={price} />
              <Form.Control.Feedback type="invalid">
                {orderErrors.price}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm="4" xs="6"> Size: </Form.Label>
            <Col sm="8" xs="6">
              <Form.Control type="number" min="1" ref={sizeRef} isInvalid={!!orderErrors.size} defaultValue={size} />
              <Form.Control.Feedback type="invalid">
                {orderErrors.size}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="medium-text">
        <Button onClick={handleSubmit}>{orderToEdit ? "Edit order" : "Add new order"}</Button>
        <Button onClick={onHide} variant="secondary" >Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}