import React from "react";
import { NavLink } from "react-router-dom";
import { Row, Button } from "react-bootstrap";

export default function StockInfo(props) {

    return (
        <header className="App-header">
            <Row />
            <Row className="header-title">ORDER BOOK</Row>
            <Row>
                <NavLink to="/homepage" className="App-nav-link" activeClassName="App-nav-link-active">Home</NavLink>
                <NavLink to="/orders" className="App-nav-link" activeClassName="App-nav-link-active">Orders</NavLink>
                <NavLink to="/trades" className="App-nav-link" activeClassName="App-nav-link-active">Trades</NavLink>
                <NavLink to="/myorders" className="App-nav-link" activeClassName="App-nav-link-active">Manage Orders</NavLink>
            </Row>
        </header>
    )
}