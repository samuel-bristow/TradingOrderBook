package com.mthree.orderbook.repositories;

import com.mthree.orderbook.entities.Order;
import com.mthree.orderbook.entities.OrderType;
import com.mthree.orderbook.entities.Stock;
import com.mthree.orderbook.entities.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderRepositoryTest {

    @Autowired
    OrderRepository orders;

    @Autowired
    StockRepository stocks;

    @Autowired
    TradeRepository trades;
    
    @Autowired
    UserRepository users;

    @BeforeEach
    void setUp() {
        
        trades.deleteAll();
        stocks.deleteAll();
        orders.deleteAll();
        users.deleteAll();
        
        Stock amzn = new Stock();
        amzn.setSymbol("AMZN");
        amzn.setName("Amazon.com Inc");
        amzn.setExchange("NASDAQ");

        Stock appl = new Stock();
        appl.setSymbol("APPL");
        appl.setName("Apple Inc");
        appl.setExchange("NASDAQ");

        stocks.save(amzn);
        stocks.save(appl);
    }

    @AfterEach
    void tearDown() {
       
        
    }

    @Test
    void findByType() {
        // Arrange
        
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(appl);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(appl);
        buyOrder2.setOrderTimestamp(LocalDateTime.now());
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        List<Order> testSellOrders = new ArrayList<>();
        testSellOrders.add(orders.findById(sellOrder1.getOrderId()).orElse(null));
        testSellOrders.add(orders.findById(sellOrder2.getOrderId()).orElse(null));

        List<Order> testBuyOrders = new ArrayList<>();
        testBuyOrders.add(orders.findById(buyOrder1.getOrderId()).orElse(null));
        testBuyOrders.add(orders.findById(buyOrder2.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedSellOrders = orders.findByType(OrderType.SELL);
        List<Order> retrievedBuyOrders = orders.findByType(OrderType.BUY);

        // Arrange
        assertEquals(testSellOrders, retrievedSellOrders);
        assertEquals(testBuyOrders, retrievedBuyOrders);
    }

    @Test
    void findByStock() {
        // Arrange
        
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(appl);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(appl);
        buyOrder2.setOrderTimestamp(LocalDateTime.now());
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        List<Order> testAmznStockOrders = new ArrayList<>();
        testAmznStockOrders.add(orders.findById(sellOrder1.getOrderId()).orElse(null));
        testAmznStockOrders.add(orders.findById(buyOrder1.getOrderId()).orElse(null));

        List<Order> testApplStockOrders = new ArrayList<>();
        testApplStockOrders.add(orders.findById(sellOrder2.getOrderId()).orElse(null));
        testApplStockOrders.add(orders.findById(buyOrder2.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedAmznStockOrders = orders.findByStock(amzn);
        List<Order> retrievedApplStockOrders = orders.findByStock(appl);

        // Assert
        assertEquals(testAmznStockOrders, retrievedAmznStockOrders);
        assertEquals(testApplStockOrders, retrievedApplStockOrders);
    }

    @Test
    void findByTypeAndStock() {
        // Arrange
        
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(appl);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(appl);
        buyOrder2.setOrderTimestamp(LocalDateTime.now());
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        List<Order> testAmznStockSellOrders = new ArrayList<>();
        testAmznStockSellOrders.add(orders.findById(sellOrder1.getOrderId()).orElse(null));

        List<Order> testAmznStockBuyOrders = new ArrayList<>();
        testAmznStockBuyOrders.add(orders.findById(buyOrder1.getOrderId()).orElse(null));

        List<Order> testApplStockSellOrders = new ArrayList<>();
        testApplStockSellOrders.add(orders.findById(sellOrder2.getOrderId()).orElse(null));

        List<Order> testApplStockBuyOrders = new ArrayList<>();
        testApplStockBuyOrders.add(orders.findById(buyOrder2.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedAmznStockSellOrders = orders.findByTypeAndStock(OrderType.SELL, amzn);
        List<Order> retrievedAmznStockBuyOrders = orders.findByTypeAndStock(OrderType.BUY, amzn);
        List<Order> retrievedApplStockSellOrders = orders.findByTypeAndStock(OrderType.SELL, appl);
        List<Order> retrievedApplStockBuyOrders = orders.findByTypeAndStock(OrderType.BUY, appl);

        // Assert
        assertEquals(testAmznStockSellOrders, retrievedAmznStockSellOrders);
        assertEquals(testAmznStockBuyOrders, retrievedAmznStockBuyOrders);
        assertEquals(testApplStockSellOrders, retrievedApplStockSellOrders);
        assertEquals(testApplStockBuyOrders, retrievedApplStockBuyOrders);
    }

    @Test
    void findAllActiveOrders() {
        // Arrange
        
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        Stock stock = stocks.findBySymbol("AMZN");
        Stock stock2 = stocks.findBySymbol("APPL");

        Order order = new Order();
        order.setType(OrderType.SELL);
        order.setPrice(new BigDecimal("45.78"));
        order.setInitialSize(200);
        order.setCurrentSize(200);
        order.setStock(stock);
        order.setOrderTimestamp(LocalDateTime.now());
        order.setUser(user1);

        Order order2 = new Order();
        order2.setType(OrderType.SELL);
        order2.setPrice(new BigDecimal("95.78"));
        order2.setInitialSize(200);
        order2.setCurrentSize(0);
        order2.setStock(stock2);
        order2.setOrderTimestamp(LocalDateTime.now());
        order2.setUser(user1);

        orders.save(order);
        orders.save(order2);
        List<Order> testActiveOrders = new ArrayList<>();
        testActiveOrders.add(orders.findById(order.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedActiveOrders = orders.findAllActiveOrders();

        // Assert
        assertEquals(testActiveOrders, retrievedActiveOrders);
    }

    @Test
    void findActiveOrderByType() {
        // Arrange
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        
        Stock stock = stocks.findBySymbol("AMZN");
        Stock stock2 = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(stock);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(stock2);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(stock);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(stock2);
        buyOrder2.setOrderTimestamp(LocalDateTime.now());
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        List<Order> testActiveSellOrders = new ArrayList<>();
        testActiveSellOrders.add(orders.findById(sellOrder1.getOrderId()).orElse(null));

        List<Order> testActiveBuyOrders = new ArrayList<>();
        testActiveBuyOrders.add(orders.findById(buyOrder1.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedActiveSellOrders = orders.findActiveOrderByType(OrderType.SELL.toString());
        List<Order> retrievedActiveBuyOrders = orders.findActiveOrderByType(OrderType.BUY.toString());

        // Assert
        assertEquals(testActiveSellOrders, retrievedActiveSellOrders);
        assertEquals(testActiveBuyOrders, retrievedActiveBuyOrders);
    }

    @Test
    void findActiveByTypeAndStock() {
        // Arrange
        
        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);
        
        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);
        
        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(amzn);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(amzn);
        buyOrder2.setOrderTimestamp(LocalDateTime.now());
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        List<Order> testAmznStockSellOrders = new ArrayList<>();
        testAmznStockSellOrders.add(orders.findById(sellOrder1.getOrderId()).orElse(null));

        List<Order> testAmznStockBuyOrders = new ArrayList<>();
        testAmznStockBuyOrders.add(orders.findById(buyOrder1.getOrderId()).orElse(null));

        // Act
        List<Order> retrievedAmznStockSellOrders = orders.findAllActiveByTypeAndStock(OrderType.SELL.toString(), amzn.getSymbol());
        List<Order> retrievedAmznStockBuyOrders = orders.findAllActiveByTypeAndStock(OrderType.BUY.toString(), amzn.getSymbol());

        // Assert
        assertEquals(testAmznStockSellOrders, retrievedAmznStockSellOrders);
        assertEquals(testAmznStockBuyOrders, retrievedAmznStockBuyOrders);
    }

    @Test
    void findTodaysActivity() {
        // Arrange

        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.of(0,00));
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.of(23,59));

        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);

        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);

        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(appl);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(appl);
        buyOrder2.setOrderTimestamp(LocalDateTime.now().minusDays(3));
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        // ACT
        int orderCount = orders.findDaysOrderActivity(LocalDate.now());

        // Arrange
        assertTrue( orderCount == 3);
    }

    @Test
    void findTodaysActivityByStock() {
        // Arrange

        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.of(0,00));
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.of(23,59));

        User user1 = new User();
        user1.setEmail("user1@mail.com");
        user1.setPassword("1234");
        users.save(user1);

        User user2 = new User();
        user2.setEmail("user2@mail.com");
        user2.setPassword("1234");
        users.save(user2);

        Stock amzn = stocks.findBySymbol("AMZN");
        Stock appl = stocks.findBySymbol("APPL");

        Order sellOrder1 = new Order();
        sellOrder1.setType(OrderType.SELL);
        sellOrder1.setPrice(new BigDecimal("45.78"));
        sellOrder1.setInitialSize(200);
        sellOrder1.setCurrentSize(200);
        sellOrder1.setStock(amzn);
        sellOrder1.setOrderTimestamp(LocalDateTime.now());
        sellOrder1.setUser(user1);

        Order sellOrder2 = new Order();
        sellOrder2.setType(OrderType.SELL);
        sellOrder2.setPrice(new BigDecimal("95.78"));
        sellOrder2.setInitialSize(200);
        sellOrder2.setCurrentSize(0);
        sellOrder2.setStock(appl);
        sellOrder2.setOrderTimestamp(LocalDateTime.now());
        sellOrder2.setUser(user1);

        Order buyOrder1 = new Order();
        buyOrder1.setType(OrderType.BUY);
        buyOrder1.setPrice(new BigDecimal("45.78"));
        buyOrder1.setInitialSize(50);
        buyOrder1.setCurrentSize(30);
        buyOrder1.setStock(amzn);
        buyOrder1.setOrderTimestamp(LocalDateTime.now());
        buyOrder1.setUser(user2);

        Order buyOrder2 = new Order();
        buyOrder2.setType(OrderType.BUY);
        buyOrder2.setPrice(new BigDecimal("95.78"));
        buyOrder2.setInitialSize(60);
        buyOrder2.setCurrentSize(0);
        buyOrder2.setStock(appl);
        buyOrder2.setOrderTimestamp(LocalDateTime.now().minusDays(3));
        buyOrder2.setUser(user2);

        orders.save(sellOrder1);
        orders.save(sellOrder2);
        orders.save(buyOrder1);
        orders.save(buyOrder2);

        // ACT
        int orderCount = orders.findDaysOrderActivityByStock(LocalDate.now(), appl.getSymbol());

        // Arrange
        assertTrue( orderCount == 1);
    }
}