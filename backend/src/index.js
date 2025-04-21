const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const database = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Baby Bottle Tracker' });
});

// Importer les routes
const bottleRoutes = require('./routes/bottle.routes');
const medicationRoutes = require('./routes/medication.routes');

// Utiliser les routes
app.use('/api/bottles', bottleRoutes);
app.use('/api/medications', medicationRoutes);

// Initialiser la base de données et démarrer le serveur
database.initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Base de données initialisée avec succès`);
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1);
  });
