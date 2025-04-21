const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medication.controller');

// Récupérer tous les médicaments
router.get('/', medicationController.getAllMedications);

// Récupérer les médicaments pour une date spécifique
router.get('/date/:date', medicationController.getMedicationsByDate);

// Ajouter un nouveau médicament
router.post('/', medicationController.addMedication);

module.exports = router;
