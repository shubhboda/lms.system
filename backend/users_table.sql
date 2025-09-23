-- Run this SQL in phpMyAdmin or MySQL console to create the users table
CREATE DATABASE IF NOT EXISTS lms_exam;
USE lms_exam;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    otp VARCHAR(10),
    otp_expires DATETIME
);