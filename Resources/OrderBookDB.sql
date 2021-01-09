drop database if exists order_book_db;
create database order_book_db;
use order_book_db;

create table stocks (
    symbol  varchar(10) primary key not null,
    `name` varchar(100) not null,
    `exchange` varchar(10) not null
);

create table users (
    user_id int primary key auto_increment,
    email varchar(30) not null,
    password varchar(30) not null
);

create table orders (
    order_id int primary key auto_increment,
    `type` enum('BUY','SELL') not null,
    price decimal(9,2) not null,
    initial_size int not null,
    current_size int not null,
    symbol varchar(10) not null,
    order_timestamp timestamp(3) not null,
    user_id int not null,
    constraint fk_orders_stocks
        foreign key (symbol)
        references stocks(symbol) on delete cascade,

    constraint fk_user_id
        foreign key (user_id)
        references users(user_id) 
);

create table trades (
    trade_id int primary key auto_increment,
    sell_id int not null,
    buy_id int not null,
    size int not null,
    trade_price decimal(9,2),
    trade_timestamp timestamp(3) not null,
    symbol varchar(10) not null,
    constraint fk_trades_orders_buy
        foreign key (sell_id)
        references orders(order_id),
    constraint fk_trades_orders_sell
        foreign key (buy_id)
        references orders(order_id),
    constraint fk_trades_stocks
        foreign key (symbol)
        references stocks(symbol)  
);


insert into stocks (symbol, `name`, `exchange`) values
    ('APPL','Apple Inc.','NASDAQ'),
    ('ATVI','Activision Blizzard Inc','NASDAQ'),
    ('AMZN','Amazon.com Inc','NASDAQ'),
    ('AV','Aviva plc','LON');