CREATE DATABASE IF NOT EXISTS baby_bottle_tracker;

USE baby_bottle_tracker;

-- Table pour les biberons
CREATE TABLE IF NOT EXISTS bottles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volume INT NOT NULL,
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les médicaments
CREATE TABLE IF NOT EXISTS medications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dose FLOAT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  timestamp DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
