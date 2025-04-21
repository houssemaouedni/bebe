const medicationModel = require('../models/medication.model');

class MedicationController {
  // Récupérer tous les médicaments
  async getAllMedications(req, res) {
    try {
      const medications = await medicationModel.getAllMedications().then((result) => result[0]);
      res.status(200).json(medications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des médicaments' });
    }
  }

  // Récupérer les médicaments pour une date spécifique
  async getMedicationsByDate(req, res) {
    try {
      const { date } = req.params;
      const medications = await medicationModel.getMedicationsByDate(date).then((result) => result[0]);
      res.status(200).json(medications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de la récupération des médicaments par date' });
    }
  }

  // Ajouter un nouveau médicament
  async addMedication(req, res) {
    try {
      const { name, dose, unit, timestamp } = req.body;
      
      // Validation des données
      if (!name || !dose || !unit) {
        return res.status(400).json({ message: 'Le nom, la dose et l\'unité sont requis' });
      }
      
      const newMedication = {
        name,
        dose: parseFloat(dose),
        unit,
        timestamp: timestamp || new Date().toISOString()
      };
      
      const result = await medicationModel.addMedication(newMedication);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un médicament' });
    }
  }
}

module.exports = new MedicationController();
