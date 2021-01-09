import React from "react";
import { withRouter  } from "react-router";
import { Container, Row, Form } from 'react-bootstrap'
import { FaChevronLeft } from "react-icons/fa";
import { compareValues } from '../resources/sortArray'
import { MdKeyboardArrowUp as ArrowUp, MdKeyboardArrowDown as ArrowDown } from "react-icons/md";
import { HiRefresh } from "react-icons/hi";
import { Dropdown } from 'semantic-ui-react'

import StockInfo from "./StockInfo";

const SERVICE_URL = "http://localhost:8080/orderbook/";

const ALL_TRADES_VALUE = "-- all trades --";
const USER_TRADES_VALUE = "-- my trades --";
const DATE_FORMAT = "%d%b%y %H:%M:%S.%L";

class Trade extends React.Component {
    state = {
        trades: [],
        stock: { symbol: "", name: "", exchange: "" },
        lastMatch: {tradePrice: 0, tradeTimestamp: new Date()},
        orderActivity: "",
        tradeVolume: "",
        allStockSymbols: [],
        orderField: 'tradeTimestamp',
        orderDirection: 'desc',
        fetchTime: new Date(),
    }

    constructor(props) {
        super(props);
        this.stockSelect = React.createRef();
    }


    componentDidMount() {
        console.log("Trades page mounted");
        const stockSymbol = this.props.match.params.symbol;
        console.log(this.props);
        this.loadAllTrades(stockSymbol);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.symbol !== this.props.match.params.symbol || prevProps.match.path !== this.props.match.path) {
            const stockSymbol = this.props.match.params.symbol;
            this.loadAllTrades(stockSymbol);
        }
    }

    loadAllTrades(stockSymbol) {
        if(stockSymbol === undefined) stockSymbol = "";
        else stockSymbol = "/" + stockSymbol;
        console.log(stockSymbol);

        const path = this.props.match.path;
        const URL = path.includes("mytrades") ?
            SERVICE_URL + "mytrades/" + this.props.user :
            SERVICE_URL + "trades" + stockSymbol;

        fetch(URL)
        .then(response => {
            if (response.status === 200) {
                response.json().then( data => {
                    this.setState({trades: data.trades, stock: data.stock, allStockSymbols: data.stockSymbols, 
                        lastMatch: data.lastMatch, orderActivity: data.orderActivity, tradeVolume: data.tradeVolume, 
                        fetchTime: new Date()})
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

    onStockChange = (event, data) => {
        let newStockValue = data.value;
        if(newStockValue === 'ALL') this.props.history.push("/trades");
        else if(newStockValue === 'USER') this.props.history.push("/mytrades");
        else this.props.history.push("/trades/" + newStockValue);
    }

    onOrderFieldChange = (newOrderField) => {
        if(newOrderField === this.state.orderField){
            if(this.state.orderDirection === 'desc')
                this.setState({orderDirection: 'asc'});
            else
                this.setState({orderDirection: 'desc'});
        }
        else{
            this.setState({orderField: newOrderField});
        }
    }

    render() {
        let { trades, stock, lastMatch, allStockSymbols, orderField, orderDirection, orderActivity, tradeVolume } = this.state;
        const path = this.props.match.path;
        const stockSymbol = (this.props.match.params.symbol === undefined) ? (
            path.includes("mytrades") ? "USER" : "ALL" ) : this.props.match.params.symbol;
        
        const title = path.includes("mytrades") ? "My Trades" : "All Trades";

        let stockOptions = [];
        stockOptions.push({text: ALL_TRADES_VALUE, value: 'ALL'});
        stockOptions.push({text: USER_TRADES_VALUE, value: 'USER'});
        allStockSymbols.forEach( symbol => stockOptions.push({text: symbol, value: symbol}) );
        
        trades.sort(compareValues(orderField,orderDirection));

        return (
            <div>
            <div className="App-main-container">
            <Container>
                <Row className="container-space-between top-row">
                    <button onClick={() => this.props.history.goBack()} className="transparent-btn back-btn"> <FaChevronLeft /></button>
                    <Dropdown placeholder='Stock' search selection options={stockOptions} value={stockSymbol} onChange={this.onStockChange}/>
                </Row>
                <Row>
                    <StockInfo stock={stock} lastMatch={lastMatch} title={title} orderActivity={orderActivity} tradeVolume={tradeVolume}></StockInfo>
                </Row>
                <table className="table-style trades-table">
                    <thead>
                        <tr><th colSpan="6">TRADES</th></tr>
                        <tr>
                            <th onClick={() => this.onOrderFieldChange('stock.name')}>Organisation
                                {this.state.orderField === 'stock.name'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                            <th onClick={() => this.onOrderFieldChange('stock.symbol')}>Symbol
                                {this.state.orderField === 'stock.symbol'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                            <th onClick={() => this.onOrderFieldChange('stock.exchange')}>Exchange
                                {this.state.orderField === 'stock.exchange'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                            <th onClick={() => this.onOrderFieldChange('size')}>Size
                                {this.state.orderField === 'size'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                            <th onClick={() => this.onOrderFieldChange('tradePrice')}>Price
                                {this.state.orderField === 'tradePrice'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                            <th onClick={() => this.onOrderFieldChange('tradeTimestamp')}>Time
                                {this.state.orderField === 'tradeTimestamp'? this.state.orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade) => (
                            <tr>
                                <td>{trade.stock.name}</td>
                                <td>{trade.stock.symbol}</td>
                                <td>{trade.stock.exchange}</td>
                                <td>{trade.size}</td>
                                <td>{trade.tradePrice.toFixed(2)}</td>
                                <td>{new Date(trade.tradeTimestamp).format(DATE_FORMAT)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Container>
            </div>
            <footer className="App-footer">
                <div>
                    As of {this.state.fetchTime.format(DATE_FORMAT)}
                    <button onClick={() => this.fetchData(this.props.match.params.symbol)} className="btn-style refresh-btn"><HiRefresh/></button>
                </div>
                <div>
                    &copy; Alice, Niran, Sam, Siva
                </div>
            </footer>
            </div>
        );
    }
}

export default withRouter(Trade);
