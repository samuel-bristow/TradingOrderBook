import React from 'react';
import { Modal, Button } from 'react-bootstrap'

export default function NewOrderResult(props) {
    const defaultProps = {
        onHide: () => {},
    };

    const { onHide = defaultProps.onHide, newOrder, newOrderMatchedTrades, editResults } = props;

    let orderAfterTrades = newOrder;

    if(newOrderMatchedTrades != null && newOrderMatchedTrades.length > 0 && newOrder != null){
        orderAfterTrades = newOrder.type === "BUY" ? newOrderMatchedTrades[0].buyOrder : newOrderMatchedTrades[0].sellOrder;
    }

    let messageBody = "";
    if(newOrderMatchedTrades != null && newOrderMatchedTrades.length === 0){
        messageBody = <div> <p>There were no immediate matches for your order.</p>
                <p>Your order has been added to the orders list and may be matched in the future.</p> </div>
    }
    else if(newOrderMatchedTrades != null && newOrderMatchedTrades.length > 0){
        let tradeRows = [];
        newOrderMatchedTrades.forEach((item, index) => 
            tradeRows.push(<tr key={index}> <td>{item.stock.symbol}</td> <td>{item.size}</td> <td>{item.tradePrice}</td> </tr>));
        messageBody = <div> <p>Your order had immediate matches. The following trades were performed.</p>
                <table className="table table-striped table-sm text-center">
                    <thead className="thead-light"> <tr> <th>Stock</th> <th>Size</th> <th>Price</th> </tr> </thead>
                    <tbody>
                        {tradeRows}
                    </tbody>
                </table>
                {orderAfterTrades.currentSize > 0 ?
                    <p>Your order has not been completely fufilled and has been added to the orders list and may be matched in the future.</p>
                    : <p>Your order has been completely fufilled.</p>} </div>
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
                {editResults ? "Order edited successfully" : (newOrder != null && newOrder.type === "BUY") ? "New buy order created" : "New sell order created"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="normal-text">
          {messageBody}
        </Modal.Body>
        <Modal.Footer className="medium-text">
          <Button onClick={onHide} >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }