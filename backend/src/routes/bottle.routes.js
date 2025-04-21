const express = require('express');
const router = express.Router();
const bottleController = require('../controllers/bottle.controller');

// Récupérer tous les biberons
router.get('/', bottleController.getAllBottles);

// Récupérer les biberons pour une date spécifique
router.get('/date/:date', bottleController.getBottlesByDate);

// Récupérer les statistiques pour une date spécifique
router.get('/stats/:date', bottleController.getBottleStats);

// Ajouter un nouveau biberon
router.post('/', bottleController.addBottle);

module.exports = router;
