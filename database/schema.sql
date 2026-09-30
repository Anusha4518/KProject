-- Military Asset Management System - MySQL Database Schema
-- Database Name: kproject_db

CREATE DATABASE IF NOT EXISTS kproject_db;
USE kproject_db;

-- Drop existing tables to allow clean initialization
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS asset_balances;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS equipment_types;
DROP TABLE IF EXISTS bases;

-- 1. Bases Table
CREATE TABLE bases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    location VARCHAR(150) NOT NULL,
    command_region VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Equipment Types Table
CREATE TABLE equipment_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table (Role-Based Access Control)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL, -- 'ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'
    base_id BIGINT,
    email VARCHAR(100),
    rank_title VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_base FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE SET NULL
);

-- 4. Asset Balances Table
CREATE TABLE asset_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    base_id BIGINT NOT NULL,
    equipment_type_id BIGINT NOT NULL,
    opening_balance INT NOT NULL DEFAULT 0,
    closing_balance INT NOT NULL DEFAULT 0,
    assigned_quantity INT NOT NULL DEFAULT 0,
    expended_quantity INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_balances_base FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE CASCADE,
    CONSTRAINT fk_balances_equipment FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id) ON DELETE CASCADE,
    CONSTRAINT uq_base_equipment UNIQUE (base_id, equipment_type_id)
);

-- 5. Purchases Table
CREATE TABLE purchases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_code VARCHAR(50) NOT NULL UNIQUE,
    base_id BIGINT NOT NULL,
    equipment_type_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(12, 2) NOT NULL,
    total_cost DECIMAL(14, 2) NOT NULL,
    supplier VARCHAR(100),
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchases_base FOREIGN KEY (base_id) REFERENCES bases(id),
    CONSTRAINT fk_purchases_equipment FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id),
    CONSTRAINT fk_purchases_user FOREIGN KEY (created_by_id) REFERENCES users(id)
);

-- 6. Asset Transfers Table
CREATE TABLE transfers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transfer_code VARCHAR(50) NOT NULL UNIQUE,
    source_base_id BIGINT NOT NULL,
    destination_base_id BIGINT NOT NULL,
    equipment_type_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
    notes TEXT,
    requested_by_id BIGINT,
    approved_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_transfers_source FOREIGN KEY (source_base_id) REFERENCES bases(id),
    CONSTRAINT fk_transfers_dest FOREIGN KEY (destination_base_id) REFERENCES bases(id),
    CONSTRAINT fk_transfers_equipment FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id),
    CONSTRAINT fk_transfers_req_user FOREIGN KEY (requested_by_id) REFERENCES users(id),
    CONSTRAINT fk_transfers_app_user FOREIGN KEY (approved_by_id) REFERENCES users(id)
);

-- 7. Assignments & Expenditures Table
CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_code VARCHAR(50) NOT NULL UNIQUE,
    base_id BIGINT NOT NULL,
    equipment_type_id BIGINT NOT NULL,
    personnel_name VARCHAR(100),
    personnel_rank VARCHAR(50),
    quantity INT NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'ASSIGNMENT', 'EXPENDITURE'
    status VARCHAR(20) NOT NULL, -- 'ACTIVE', 'RETURNED', 'EXPENDED'
    notes TEXT,
    created_by_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_base FOREIGN KEY (base_id) REFERENCES bases(id),
    CONSTRAINT fk_assignments_equipment FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id),
    CONSTRAINT fk_assignments_user FOREIGN KEY (created_by_id) REFERENCES users(id)
);

-- 8. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    username VARCHAR(50),
    user_role VARCHAR(30),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45)
);
