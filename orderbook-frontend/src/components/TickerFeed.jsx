import React, { Component } from 'react';
import{ TransitionGroup, CSSTransition } from 'react-transition-group';
import "../resources/formatDate";
import uuid from 'uuid';

const SERVICE_URL = "http://localhost:8080/orderbook/";

const TIME_FORMAT = "%H:%M:%S.%L";
const TIME_FORMAT_WITH_DATE = "%d-%b-%y %H:%M:%S.%L";
const ISO_FORMAT = "%Y-%m-%dT%H:%M:%S.%L";

export default class TickerFeed extends Component {
    state = {
        lastFetchTime: undefined,
        trades: [],
    };

    componentDidMount() {
        this.fetchLast5Trades();
        
        this.interval = setInterval(() => {
            let currentTime = new Date();
            if(this.state.lastFetchTime) this.fetchInInterval(currentTime);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    fetchLast5Trades() {
        let URL = SERVICE_URL + "trades/lastfive";

        fetch(URL)
        .then(response => {
            if (response.status === 200) {
                response.json().then( data => {
                    this.setState({ trades: data, lastFetchTime: new Date() });
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

    fetchInInterval(currentTime) {
        let currentTimeStr = currentTime.format(ISO_FORMAT);
        let lastFetchTimeStr = this.state.lastFetchTime.format(ISO_FORMAT);
        let URL = SERVICE_URL + "trades/between/" + lastFetchTimeStr + "/" + currentTimeStr;

        fetch(URL)
        .then(response => {
            if (response.status === 200) {
                response.json().then( newTrades => {
                    if(newTrades.length === 0) {
                        this.setState({ lastFetchTime: currentTime });
                    }
                    else{
                        let trades = this.state.trades.slice();
                        newTrades.forEach( newTrade => trades.unshift(newTrade));
                        if(trades.length > 5) trades = trades.slice(0,5);
                        this.setState({ lastFetchTime: currentTime, trades:trades }/*, () => console.log(this.state)*/);
                    }
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
        const entries = this.state.trades.map((trade, i) =>
        <CSSTransition key={trade.tradeId} timeout={500} timein={1000} classNames="feed" >
            <FeedEntry trade={trade} />
        </CSSTransition>
        );

        return(
            <div className="ticker-feed">
                <div className="feed-title">Lastest Trades Feed</div>
                <TransitionGroup>
                    {entries}
                </TransitionGroup>
                {/*this.state.trades.map((trade, i) => 
                    <FeedEntry key={i} trade={trade}/>
                )*/}
            </div>
        );
            
    }
}

const FeedEntry = ({ trade }) =>{
    let timestamp = new Date(trade.tradeTimestamp);
    const tradeIsFromToday = timestamp.toDateString() === new Date().toDateString();
    return(
        <div className="feed-entry-wrapper">
            <div className="feed-timestamp">
                {tradeIsFromToday ? timestamp.format(TIME_FORMAT) : timestamp.format(TIME_FORMAT_WITH_DATE)}
            </div>
            <div className="feed-entry">
                <div className="feed-left-col">
                    <div className="feed-symbol">
                        {trade.stock.symbol}
                    </div>
                    <div className="feed-exchange">
                        {trade.stock.exchange}
                    </div>
                </div>
                <div className="feed-right-col">
                    <div className="feed-price">
                        $ {trade.tradePrice.toFixed(2)}
                    </div>
                    <div>
                        size: {trade.size}
                    </div>
                </div>
            </div>
        </div>
    );
}
