/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mthree.orderbook.repositories;

import com.mthree.orderbook.entities.Stock;
import com.mthree.orderbook.entities.Trade;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Samuel Bristow
 */
@Repository

public interface TradeRepository extends JpaRepository <Trade, Integer>{

    @Query
    List<Trade> findByStock(Stock stock);
    
    @Query (value = "SELECT t.* from trades t" +
            " WHERE sell_id = :orderId OR buy_id = :orderId", nativeQuery = true)
    List<Trade> findByOrder(@Param("orderId") int orderId);

    @Query(value = "SELECT t.* from trades t" +
            " WHERE symbol = :symbol ORDER BY trade_timestamp DESC LIMIT 1", nativeQuery = true)
    Trade findLastTradeForStock(@Param("symbol") String symbol);

    @Query(value = "SELECT t.* from trades t" +
            " WHERE t.trade_timestamp > :startTime" +
            " AND t.trade_timestamp <= :endTime", nativeQuery = true)
    List<Trade> findTradesBetweenTimes(@Param("startTime") String startTime, @Param("endTime") String endTime);

    @Query(value = "SELECT t.* from trades t " +
            "ORDER BY t.trade_timestamp DESC LIMIT 5", nativeQuery = true)
    List<Trade> findLastFiveTrades();

    @Query(value = "SELECT COALESCE(SUM(t.size),0) from trades t" +
            " WHERE DATE(t.trade_timestamp) = :date", nativeQuery = true)
    int findDaysTradeActivity(@Param("date") LocalDate date);

    @Query(value = "SELECT COALESCE(SUM(t.size),0) from trades t" +
            " WHERE DATE(t.trade_timestamp) = :date" +
            " AND t.symbol = :symbol", nativeQuery = true)
    int findDaysTradeActivityByStock(@Param("date") LocalDate date, @Param("symbol") String symbol);

    @Query(value= "SELECT t.* from trades t" +
            " JOIN orders o on t.sell_id = o.order_id" +
            " WHERE o.user_id = :userId" +
            " UNION" +
            " SELECT t.* from trades t" +
            " JOIN orders o on t.buy_id = o.order_id" +
            " WHERE o.user_id = :userId", nativeQuery = true)
    List<Trade> findTradesByUser(@Param("userId") int userId);

}
