const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Configuration du pool de connexions MySQL/MariaDB
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '11059586',
  database: process.env.DB_NAME || 'baby_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convertir le pool en version promesse
const promisePool = pool.promise();

// Fonction pour obtenir une connexion du pool
async function getConnection() {
  try {
    return await promisePool.getConnection();
  } catch (err) {
    console.error('Erreur de connexion à la base de données:', err);
    throw err;
  }
}

// Fonction pour initialiser la base de données
async function initDatabase() {
  try {
    // Créer la base de données si elle n'existe pas
    await promisePool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'baby_tracker'}`);
    
    // Utiliser la base de données
    await promisePool.query(`USE ${process.env.DB_NAME || 'baby_tracker'}`);
    
    // Créer la table des biberons
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS bottles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        volume INT NOT NULL,
        timestamp DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Créer la table des médicaments
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dose FLOAT NOT NULL,
        unit VARCHAR(20) NOT NULL,
        timestamp DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Base de données initialisée avec succès');
    return true;
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    throw err;
  }
}

module.exports = {
  getConnection,
  initDatabase,
  pool: promisePool
};
