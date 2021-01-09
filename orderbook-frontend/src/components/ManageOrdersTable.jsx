import React, { Component } from 'react';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { MdKeyboardArrowUp as ArrowUp, MdKeyboardArrowDown as ArrowDown } from "react-icons/md";

import { compareValues } from '../resources/sortArray'

const DATE_FORMAT = "%d%b%y %H:%M:%S.%L";

export default class ManageOrdersTable extends Component {

    static defaultProps = {
        orders: [],
        type: 'buy',
        onEdit: () => {},
        onRemove: () => {},
    }

    state = {
        orderField: 'orderTimestamp',
        orderDirection: 'desc',
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
        let { orders, type, onEdit, onRemove } = this.props;
        let { orderField, orderDirection } = this.state;
        const tableTitle = type === 'buy' ? "BUY ORDERS" : "SELL ORDERS";
        const priceTag = type === 'buy' ? "Bid" : "Ask";

        orders.sort(compareValues(orderField,orderDirection));

        return (
            <table striped bordered hover className="table-style manage-table">
                <thead> 
                    <tr> <th colSpan="6">{tableTitle}</th> </tr> 
                    <tr> 
                        <th onClick={() => this.onOrderFieldChange('orderTimestamp')}>Time
                                {orderField === 'orderTimestamp'? orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                        <th onClick={() => this.onOrderFieldChange('stock.symbol')}>Stock
                                {orderField === 'stock.symbol'? orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                        <th onClick={() => this.onOrderFieldChange('currentSize')}>Size
                                {orderField === 'currentSize'? orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                        <th onClick={() => this.onOrderFieldChange('price')}>{priceTag}
                                {orderField === 'price'? orderDirection === 'desc' ? <ArrowDown/> : <ArrowUp /> : ""}</th>
                        <th>Edit</th> <th>Remove</th> </tr> </thead>
                <tbody>
                    {orders.map( order =>
                        <tr key={order.orderId}> <td> {new Date(order.orderTimestamp).format(DATE_FORMAT)} </td> 
                        <td>{order.stock.symbol}</td> <td> {order.currentSize} </td> <td> {typeof order.price === "number" ? order.price.toFixed(2) : ""} </td> 
                        <td> <button className="transparent-btn" onClick={() => onEdit(order)}> <FaEdit /> </button> </td>
                        <td><button className="transparent-btn" onClick={() => onRemove(order)}> <FaTrashAlt /> </button></td></tr>)}
                </tbody>

            </table>
            
            )
    }
}