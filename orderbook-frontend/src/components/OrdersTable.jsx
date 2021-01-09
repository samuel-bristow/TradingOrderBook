import React, { Component } from 'react';
import { compareValues } from '../resources/sortArray'

export default class OrdersTable extends Component {

    static defaultProps = {
        orders: [],
        type: 'buy',
    }

    render() {
        let { orders, type, allOrders } = this.props;
        const tableHeader = allOrders ?
            (type === 'buy' ?
                <thead> <tr> <th colSpan="4">BUY ORDERS</th> </tr> <tr> <th>Time</th> <th>Stock</th> <th>Size</th><th>Bid</th> </tr> </thead> :
                <thead> <tr> <th colSpan="4">SELL ORDERS</th> </tr> <tr> <th>Ask</th><th>Size</th> <th>Stock</th> <th>Time</th> </tr> </thead>)
            : (type === 'buy' ?
                <thead> <tr> <th colSpan="3">BUY ORDERS</th> </tr> <tr> <th>Time</th><th>Size</th><th>Bid</th> </tr> </thead> :
                <thead> <tr> <th colSpan="3">SELL ORDERS</th> </tr> <tr> <th>Ask</th><th>Size</th><th>Time</th> </tr> </thead>);

        type === 'buy' ? orders.sort(compareValues('price', 'desc')) : orders.sort(compareValues('price', 'asc'));

        let ownOrdersColor = "#ceebfd";
        const tableRows = [];
        if(allOrders){
            for (const order of orders) {
                order.user.userId === this.props.user ?
                    (type === 'buy' ?
                        tableRows.push(<tr style={{backgroundColor: ownOrdersColor}} key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td>{order.stock.symbol}</td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                        tableRows.push(<tr style={{backgroundColor: ownOrdersColor}} key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td>{order.stock.symbol}</td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>))
                    : (type === 'buy' ?
                        tableRows.push(<tr key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td>{order.stock.symbol}</td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                        tableRows.push(<tr key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td>{order.stock.symbol}</td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>))
                }
        }
        else{
            for (const order of orders) {
                order.user.userId === this.props.user ?
                    (type === 'buy' ?
                    tableRows.push(<tr style={{backgroundColor: ownOrdersColor}} key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                    tableRows.push(<tr style={{backgroundColor: ownOrdersColor}} key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>))
                    : (type === 'buy' ?
                        tableRows.push(<tr key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                        tableRows.push(<tr key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>));
            }
        }
        /*for (const order of orders) {
            allOrders ?
                (type === 'buy' ?
                    tableRows.push(<tr key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td>{order.stock.symbol}</td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                    tableRows.push(<tr key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td>{order.stock.symbol}</td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>))
                : (type === 'buy' ?
                    tableRows.push(<tr key={order.orderId}> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td> <td> {order.currentSize} </td> <td> {order.price.toFixed(2)} </td></tr>) :
                    tableRows.push(<tr key={order.orderId}> <td> {order.price.toFixed(2)} </td> <td> {order.currentSize} </td> <td> {new Date(order.orderTimestamp).format("%d%b%y %H:%M:%S.%L")} </td></tr>));

        }*/

        return (
            <table striped bordered hover className="table-style orders-table">
                {tableHeader}
                <tbody>
                    {tableRows}
                </tbody>

            </table>

        )
    }
}