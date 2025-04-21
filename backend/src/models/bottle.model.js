const mariadb = require('mariadb');
const dbConfig = require('../config/database');

class BottleModel {
  // Récupérer tous les biberons
  async getAllBottles() {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      return await conn.query('SELECT * FROM bottles ORDER BY timestamp DESC');
    } catch (err) {
      console.error('Erreur lors de la récupération des biberons:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  // Récupérer les biberons pour une date spécifique
  async getBottlesByDate(date) {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      return await conn.query(
        'SELECT * FROM bottles WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp ASC',
        [startDate, endDate]
      );
    } catch (err) {
      console.error('Erreur lors de la récupération des biberons par date:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  // Ajouter un nouveau biberon
  async addBottle(bottle) {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      const result = await conn.query(
        'INSERT INTO bottles (volume, timestamp) VALUES (?, ?)',
        [bottle.volume, bottle.timestamp]
      );
      return { id: result.insertId, ...bottle };
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un biberon:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  // Récupérer les statistiques pour une date spécifique
  async getBottleStats(date) {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const result = await conn.query(
        'SELECT COUNT(*) as totalBottles, SUM(volume) as totalVolume FROM bottles WHERE timestamp BETWEEN ? AND ?',
        [startDate, endDate]
      );
      
      return {
        totalBottles: result[0].totalBottles || 0,
        totalVolume: result[0].totalVolume || 0
      };
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new BottleModel();
