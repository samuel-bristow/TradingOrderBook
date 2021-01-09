/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mthree.orderbook.controller;

import com.mthree.orderbook.entities.Order;
import com.mthree.orderbook.entities.OrderType;
import com.mthree.orderbook.entities.Stock;
import com.mthree.orderbook.entities.Trade;
import com.mthree.orderbook.entities.User;
import com.mthree.orderbook.service.ServiceLayer;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author Samuel Bristow
 */
@RestController
@CrossOrigin
@RequestMapping("/orderbook")
public class Controller {
    @Autowired
    ServiceLayer service;
    
    @GetMapping("/stocks")
    public List<Stock> getAllStocks(){
        return service.getAllStocks();
    }
    
    @GetMapping("/trades") 
    public ResponseEntity<TradesPageResponse> getAllTrades() {
        List<Trade> trades = service.getAllTrades();
        List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
        int orderActivity = service.getTodaysOrderActivity();
        int tradeVolume = service.getTodaysTradeVolume();
        return ResponseEntity.ok(new TradesPageResponse(stockSymbols,null,trades,null,orderActivity,tradeVolume));
    }

    @GetMapping("/trades/lastfive")
    public ResponseEntity<List<Trade>> getLastFiveTrades() {
        List<Trade> trades = service.getLastFiveTrades();
        return ResponseEntity.ok(trades);
    }

    @GetMapping("/mytrades/{userId}")
    public ResponseEntity<TradesPageResponse> getTradesByUser(@PathVariable int userId) {
        if(service.getUser(userId) == null){
            return new ResponseEntity("User " + userId + " does not exist.", HttpStatus.NOT_FOUND);
        } else {
            List<Trade> trades = service.getTradesByUser(userId);
            List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
            return ResponseEntity.ok(new TradesPageResponse(stockSymbols, null ,trades, null, -1,-1));
        }
    }

    @GetMapping("/trades/between/{startTime}/{endTime}")
    public ResponseEntity<List<Trade>> getTradesBetweenTimes(@PathVariable String startTime, @PathVariable String endTime) {
        try {
            LocalDateTime start = LocalDateTime.parse(startTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            LocalDateTime end = LocalDateTime.parse(endTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException ex) {
            return new ResponseEntity("Not a valid date/time", HttpStatus.BAD_REQUEST);
        }
        List<Trade> trades = service.getTradesBetweenTimes(startTime, endTime);
        return ResponseEntity.ok(trades);
    }

    @GetMapping("/trades/{symbol}")
    public ResponseEntity<TradesPageResponse> getTradesByStock(@PathVariable String symbol){
        Stock stock = service.getStock(symbol);
        if(stock == null){
            return new ResponseEntity("Stock " + symbol + " does not exist.", HttpStatus.NOT_FOUND);
        }
        else{
            List<Trade> trades = service.getTradesByStock(stock);
            List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
            Trade lastMatch = service.getLastTradeForStock(symbol);
            int orderActivity = service.getTodaysOrderActivityByStock(stock);
            int tradeVolume = service.getTodaysTradeVolumeByStock(stock);
            return ResponseEntity.ok(new TradesPageResponse(stockSymbols,stock,trades,lastMatch,orderActivity,tradeVolume));
        }
    }
    
    @GetMapping("/orders")
    public ResponseEntity<OrdersPageResponse> getAllActiveOrders(){
        List<Order> buyOrders = service.getAllActiveBuyOrders();
        List<Order> sellOrders = service.getAllActiveSellOrders();
        List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
        int orderActivity = service.getTodaysOrderActivity();
        int tradeVolume = service.getTodaysTradeVolume();
        return ResponseEntity.ok(new OrdersPageResponse(stockSymbols,null,buyOrders,sellOrders,null, orderActivity, tradeVolume));
    }

    @GetMapping("/orders/{symbol}")
    public ResponseEntity<OrdersPageResponse> getOrdersByStock(@PathVariable String symbol){
        Stock stock = service.getStock(symbol);
        if(stock == null){
            return new ResponseEntity("Stock " + symbol + " does not exist.", HttpStatus.NOT_FOUND);
        }
        else{
            List<Order> buyOrders = service.getAllActiveBuyOrdersByStock( symbol );
            List<Order> sellOrders = service.getAllActiveSellOrdersByStock( symbol );
            List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
            Trade lastMatch = service.getLastTradeForStock(symbol);
            int orderActivity = service.getTodaysOrderActivityByStock(stock);
            int tradeVolume = service.getTodaysTradeVolumeByStock(stock);
            return ResponseEntity.ok(new OrdersPageResponse(stockSymbols,stock,buyOrders,sellOrders,lastMatch, orderActivity, tradeVolume));
        }
    }
    
    @PostMapping("/addorder")
    public ResponseEntity<List<Trade>> addOrder(@RequestBody Order order){
        
        User inputUser = order.getUser();
        User retrievedUser = service.getUser(inputUser.getUserId());
        Stock inputStock = order.getStock();
        Stock retrievedStock = service.getStock(inputStock.getSymbol());
        
        if (order.getInitialSize()<= 0){
            return new ResponseEntity("Order size must be greater than 0.", HttpStatus.BAD_REQUEST);
        }else if (order.getPrice().compareTo(BigDecimal.ZERO)<=0) {
            return new ResponseEntity("Price must be greater than 0.", HttpStatus.BAD_REQUEST);
        }else if (order.getType() == null) {
            return new ResponseEntity("Please choose either a 'BUY' or 'SELL' order.", HttpStatus.BAD_REQUEST);
        }else if (retrievedUser == null) {
            return new ResponseEntity("That user does not exist.", HttpStatus.BAD_REQUEST);
        }else if (retrievedStock == null) {
            return new ResponseEntity("Stock " + inputStock.getSymbol() + " does not exist.", HttpStatus.BAD_REQUEST);
        }else{
            return ResponseEntity.ok(service.addOrder(order));
        }
    }
    
    @GetMapping("/myorders/{userId}")
    public ResponseEntity<OrdersPageResponse> getOrdersByUser(@PathVariable int userId){
        User user = service.getUser(userId);
        if(user == null){
            return new ResponseEntity("User " + userId + " does not exist.", HttpStatus.NOT_FOUND);
        }
        else{
            List<Order> buyOrders = service.findAllActiveByTypeAndUser( userId, OrderType.BUY );
            List<Order> sellOrders = service.findAllActiveByTypeAndUser(  userId, OrderType.SELL  );
            List<String> stockSymbols = service.getAllStocks().stream().map( (item) -> item.getSymbol()).collect(Collectors.toList());
            
            return ResponseEntity.ok(new OrdersPageResponse(stockSymbols,null,buyOrders,sellOrders,null, 0, 0));
        }
    }
    
    @PostMapping("/addstock")
    public ResponseEntity addStock(@RequestBody Stock stock){

        if (stock.getSymbol()== null){
            return new ResponseEntity("Please enter the stock symbol.", HttpStatus.BAD_REQUEST);
        }
        else if (stock.getName()== null){
            return new ResponseEntity("Please enter the name of the stock.", HttpStatus.BAD_REQUEST);
        }
        else {
            service.addStock(stock);
            return ResponseEntity.ok("Stock added.");
        }
    }
    
    @GetMapping("/removeorder/{orderId}")
    public ResponseEntity removeOrder(@PathVariable int orderId){
        if (!service.removeOrder(orderId)) {
            return new ResponseEntity("Order: " + orderId + " does not exist.", HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(null);
    }
    
    @PostMapping("/changeorder")
    public ResponseEntity<List<Trade>>  changeOrder(@RequestBody Order order){
        if (order == null) {
            return new ResponseEntity("Empty order1 input.", HttpStatus.BAD_REQUEST);
        } else if (order.getType() != OrderType.BUY && order.getType() != OrderType.SELL) {
            return new ResponseEntity("Empty order2 input.", HttpStatus.BAD_REQUEST);
        } else if (order.getOrderId() < 0) {
            return new ResponseEntity("Empty order3 input.", HttpStatus.BAD_REQUEST);
        } else if (order.getCurrentSize() < 0) {
            return new ResponseEntity("Order quantity cannot be negative", HttpStatus.BAD_REQUEST);
        } else if (order.getInitialSize() < 0) {
            return new ResponseEntity("Order quantity cannot be negative", HttpStatus.BAD_REQUEST);
        } else if (order.getPrice() == null) {
            return new ResponseEntity("No price associated with order", HttpStatus.BAD_REQUEST);
        } else if (order.getStock() == null) {
            return new ResponseEntity("No stock associated with order", HttpStatus.BAD_REQUEST);
        } else{
            List<Trade> matches = service.updateOrder(order);
            if(matches == null){
                return new ResponseEntity("Could not update order. Order: " + order.getOrderId() + " does not exist.", HttpStatus.BAD_REQUEST);
            }
            else
                return  ResponseEntity.ok(matches);
        }
    }
    
    @PostMapping("/adduser")
    public ResponseEntity addUser(@RequestBody User user){
        if (user.getEmail() == null){
            return new ResponseEntity("Please enter an email address", HttpStatus.BAD_REQUEST);
        }
        else if (user.getPassword() == null){
            return new ResponseEntity("Please enter a password", HttpStatus.BAD_REQUEST);
        }
        else {
            service.addUser(user);
            return ResponseEntity.ok("User added.");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<User> checkLogin(@RequestBody User user) {
        User existingUser = service.checkLogin(user.getEmail(), user.getPassword());
        if (existingUser != null) {
            return ResponseEntity.ok(existingUser);
        } else {
            return new ResponseEntity("Invalid Login", HttpStatus.NOT_FOUND);
        }
    }

    private static class OrdersPageResponse{
        public List<String> stockSymbols;
        public Stock stock;
        public List<Order> buyOrders;
        public List<Order> sellOrders;
        public Trade lastMatch;
        public int orderActivity;
        public int tradeVolume;

        public OrdersPageResponse(List<String> stockSymbols, Stock stock, List<Order> buyOrders, List<Order> sellOrders, Trade lastMatch, int orderActivity, int tradeVolume) {
            this.stockSymbols = stockSymbols;
            this.stock = stock;
            this.buyOrders = buyOrders;
            this.sellOrders = sellOrders;
            this.lastMatch = lastMatch;
            this.orderActivity = orderActivity;
            this.tradeVolume = tradeVolume;
        }
    }

    private static class TradesPageResponse{
        public List<String> stockSymbols;
        public Stock stock;
        public List<Trade> trades;
        public Trade lastMatch;
        public int orderActivity;
        public int tradeVolume;

        public TradesPageResponse(List<String> stockSymbols, Stock stock, List<Trade> trades, Trade lastMatch, int orderActivity, int tradeVolume) {
            this.stockSymbols = stockSymbols;
            this.stock = stock;
            this.trades = trades;
            this.lastMatch = lastMatch;
            this.orderActivity = orderActivity;
            this.tradeVolume = tradeVolume;
        }
    }
}
