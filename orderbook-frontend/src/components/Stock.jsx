import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

class Stock extends React.Component {
  render() {
    const { stocks } = this.props;

    return (
      <Row>
        <Col className="text-center">
          <table className="table-style stocks-table">
            <thead>
              <tr>
                <th colspan="3">Available Instruments</th>
              </tr>
              <tr>
                <th>Instrument</th>
                <th>Organisation</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <Link to={`/orders/${stock.symbol}`}>
                  <tr>
                    <td>{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td>{stock.exchange}</td>
                  </tr>
                </Link>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
    );
  }
}

export default Stock;
