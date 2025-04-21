const bottleModel = require('../models/bottle.model');

class BottleController {
  // Récupérer tous les biberons
  async getAllBottles(req, res) {
    try {
      const bottles = await bottleModel.getAllBottles().then((result) => result[0]);
      res.status(200).json(bottles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des biberons' });
    }
  }

  // Récupérer les biberons pour une date spécifique
  async getBottlesByDate(req, res) {
    try {
      const { date } = req.params;
      const bottles = await bottleModel.getBottlesByDate(date).then((result) => result[0]);
      res.status(200).json(bottles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des biberons par date' });
    }
  }

  // Ajouter un nouveau biberon
  async addBottle(req, res) {
    try {
      const { volume, timestamp } = req.body;
      
      // Validation des données
      if (!volume) {
        return res.status(400).json({ message: 'Le volume est requis' });
      }
      
      const newBottle = {
        volume: parseInt(volume),
        timestamp: timestamp || new Date().toISOString()
      };
      
      const result = await bottleModel.addBottle(newBottle);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un biberon' });
    }
  }

  // Récupérer les statistiques pour une date spécifique
  async getBottleStats(req, res) {
    try {
      const { date } = req.params;
      const stats = await bottleModel.getBottleStats(date).then((result) => result[0]);
      res.status(200).json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  }
}

module.exports = new BottleController();
