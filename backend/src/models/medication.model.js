const mariadb = require('mariadb');
const dbConfig = require('../config/database');

class MedicationModel {
  // Récupérer tous les médicaments
  async getAllMedications() {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      return await conn.query('SELECT * FROM medications ORDER BY timestamp DESC');
    } catch (err) {
      console.error('Erreur lors de la récupération des médicaments:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  // Récupérer les médicaments pour une date spécifique
  async getMedicationsByDate(date) {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      return await conn.query(
        'SELECT * FROM medications WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp ASC',
        [startDate, endDate]
      );
    } catch (err) {
      console.error('Erreur lors de la récupération des médicaments par date:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  // Ajouter un nouveau médicament
  async addMedication(medication) {
    let conn;
    try {
      conn = await dbConfig.getConnection();
      const result = await conn.query(
        'INSERT INTO medications (name, dose, unit, timestamp) VALUES (?, ?, ?, ?)',
        [medication.name, medication.dose, medication.unit, medication.timestamp]
      );
      return { id: result.insertId, ...medication };
    } catch (err) {
      console.error('Erreur lors de l\'ajout d\'un médicament:', err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new MedicationModel();
