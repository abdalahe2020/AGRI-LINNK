-- ============================================
-- AGRI-CHAIN — database.sql
-- Run this file once to create all tables
-- Usage: mysql -u root -p < database.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS agrichain
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrichain;

-- ===== USERS =====
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(60)  NOT NULL,
    last_name       VARCHAR(60)  NOT NULL,
    phone           VARCHAR(15)  NOT NULL UNIQUE,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('farmer','trader','admin') NOT NULL DEFAULT 'farmer',
    is_verified     TINYINT(1)   NOT NULL DEFAULT 0,
    avatar_url      VARCHAR(255)          DEFAULT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== FARMER PROFILES =====
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    user_id               INT          NOT NULL UNIQUE,
    governorate           VARCHAR(60)  NOT NULL,
    city                  VARCHAR(100) NOT NULL,
    crop_type             VARCHAR(80)  NOT NULL,
    land_area_feddan      DECIMAL(8,2) NOT NULL DEFAULT 0,
    expected_qty_ton      DECIMAL(8,2) NOT NULL DEFAULT 0,
    is_verified           TINYINT(1)   NOT NULL DEFAULT 0,
    rating                DECIMAL(3,2)          DEFAULT NULL,
    total_sales           INT          NOT NULL DEFAULT 0,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_governorate (governorate),
    INDEX idx_crop        (crop_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== TRADER PROFILES =====
CREATE TABLE IF NOT EXISTS trader_profiles (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT          NOT NULL UNIQUE,
    company_name  VARCHAR(120)          DEFAULT NULL,
    goods_type    VARCHAR(80)           DEFAULT 'متعدد',
    rating        DECIMAL(3,2)          DEFAULT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CROP LISTINGS =====
CREATE TABLE IF NOT EXISTS crop_listings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id       INT          NOT NULL,
    crop_name       VARCHAR(80)  NOT NULL,
    quantity_kg     DECIMAL(10,2)NOT NULL,
    price_per_kg    DECIMAL(10,2)NOT NULL,
    governorate     VARCHAR(60)  NOT NULL,
    city            VARCHAR(100) NOT NULL,
    description     TEXT                  DEFAULT NULL,
    status          ENUM('active','sold','expired') NOT NULL DEFAULT 'active',
    harvest_date    DATE                  DEFAULT NULL,
    storage_type    ENUM('fresh','cold','dry') NOT NULL DEFAULT 'fresh',
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_crop_name  (crop_name),
    INDEX idx_status     (status),
    INDEX idx_gov        (governorate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== ORDERS =====
CREATE TABLE IF NOT EXISTS orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    listing_id      INT          NOT NULL,
    farmer_id       INT          NOT NULL,
    trader_id       INT          NOT NULL,
    quantity_kg     DECIMAL(10,2)NOT NULL,
    total_price     DECIMAL(12,2)NOT NULL,
    status          ENUM('pending','approved','in_transit','delivered','cancelled')
                    NOT NULL DEFAULT 'pending',
    pickup_date     DATETIME              DEFAULT NULL,
    delivery_date   DATETIME              DEFAULT NULL,
    notes           TEXT                  DEFAULT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES crop_listings(id),
    FOREIGN KEY (farmer_id)  REFERENCES users(id),
    FOREIGN KEY (trader_id)  REFERENCES users(id),
    INDEX idx_farmer  (farmer_id),
    INDEX idx_trader  (trader_id),
    INDEX idx_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CROP PRICES (live market) =====
CREATE TABLE IF NOT EXISTS crop_prices (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    crop_name       VARCHAR(80)   NOT NULL,
    price_per_kg    DECIMAL(10,2) NOT NULL,
    change_pct      DECIMAL(6,2)  NOT NULL DEFAULT 0,
    volume_ton      DECIMAL(10,2)          DEFAULT NULL,
    source          VARCHAR(100)           DEFAULT 'market',
    updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_crop (crop_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== SEED INITIAL PRICES =====
INSERT INTO crop_prices (crop_name, price_per_kg, change_pct, volume_ton) VALUES
('طماطم',  89,  1.5,  12),
('بطاطس',  56, -0.8,   8),
('ذرة',   245,  3.2,  20),
('بصل',    42,  2.1,   5),
('فلفل',  112, -1.3,   3),
('قمح',   380,  0.5,  50),
('برتقال', 65,  4.0,   7),
('فراولة',180,  5.2,   2);

-- ===== SHIPMENTS (GPS tracking) =====
CREATE TABLE IF NOT EXISTS shipments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT          NOT NULL,
    truck_number    VARCHAR(30)           DEFAULT NULL,
    driver_name     VARCHAR(100)          DEFAULT NULL,
    driver_phone    VARCHAR(15)           DEFAULT NULL,
    origin_address  VARCHAR(200)          DEFAULT NULL,
    dest_address    VARCHAR(200)          DEFAULT NULL,
    current_lat     DECIMAL(10,7)         DEFAULT NULL,
    current_lng     DECIMAL(10,7)         DEFAULT NULL,
    temp_celsius    DECIMAL(5,2)          DEFAULT NULL,
    status          ENUM('loading','in_transit','arrived') NOT NULL DEFAULT 'loading',
    eta_minutes     INT                   DEFAULT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== REVIEWS =====
CREATE TABLE IF NOT EXISTS reviews (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT          NOT NULL,
    reviewer_id     INT          NOT NULL,
    reviewed_id     INT          NOT NULL,
    rating          TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT                  DEFAULT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)    REFERENCES orders(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_id) REFERENCES users(id),
    UNIQUE KEY uq_review (order_id, reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CONTACT MESSAGES =====
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(120) NOT NULL,
    email       VARCHAR(120) NOT NULL,
    user_type   VARCHAR(60)           DEFAULT NULL,
    message     TEXT         NOT NULL,
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== LOGIN LOGS =====
CREATE TABLE IF NOT EXISTS login_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT                   DEFAULT NULL,
    email       VARCHAR(120) NOT NULL,
    ip_address  VARCHAR(45)           DEFAULT NULL,
    user_agent  TEXT                  DEFAULT NULL,
    success     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_success (success)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
