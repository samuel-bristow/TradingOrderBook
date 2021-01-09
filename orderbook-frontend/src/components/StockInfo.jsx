import React from 'react';
import { Row, Col } from 'react-bootstrap'

import "../resources/formatDate";

const DATE_FORMAT = "%d%b%y %H:%M:%S.%L";

export default function StockInfo(props) {
    const { stock ,  lastMatch, title = "Page title", orderActivity, tradeVolume } = props;
    console.log("orderActivity:" + orderActivity);
    return (
        <div className="stock-info-container">
            <Row>
                <Col xs={3} className="stock-info-left-col">
                    { stock ? <div className="stock-info-left-inside-col">
                        <div className="symbol-box">{stock.symbol}</div>
                        <div className="exchange-text"> {stock.exchange}</div>
                    </div>  : ""}
                    { (orderActivity || orderActivity === 0) && (orderActivity >= 0)  ? 
                    <div className="d-md-flex d-none stock-info-left-inside-col">
                        <table className="activity-table">
                            <tr><th colSpan="2">Today's Activity</th></tr>
                            <tr><td>Orders:</td> <td>{orderActivity}</td></tr>
                            <tr><td>Volume:</td> <td>{tradeVolume}</td></tr>
                        </table>
                    </div> : ""}
                </Col>
                <Col className="stock-info-center-col">
                    <div className="stock-name">{stock ? stock.name : title}</div>
                </Col>
                <Col xs={3} className="stock-info-right-col">
                    { stock ? <div className="last-match-text">Last Match:</div> : ""}
                    { stock ? <div className="last-match-price" > ${lastMatch ? lastMatch.tradePrice.toFixed(2) : "---.--"}</div> : ""}
                    { stock ? <div className="last-match-time" > {lastMatch ? new Date(lastMatch.tradeTimestamp).format(DATE_FORMAT) : "(no trades yet)"}</div> : ""}
                </Col>
            </Row>
        </div>
    );
}