CREATE DATABASE IF NOT EXISTS DAPP;
USE DAPP;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER'
);


CREATE TABLE IF NOT EXISTS Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    status ENUM('Pending','Confirmed') NOT NULL DEFAULT 'Pending',
    timestamp TIMESTAMP NOT NULL,
    transactionId VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    seller VARCHAR(100),
    `condition` ENUM('new', 'refurbished'), -- Backquotes added around 'condition'
    `purchased` ENUM('false', 'true') NOT NULL DEFAULT 'false'
);


CREATE TABLE IF NOT EXISTS Wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) UNIQUE,
    private_key VARCHAR(255),
    balance DECIMAL(18, 8),
    username VARCHAR(255) NOT NULL
);







