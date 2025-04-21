# Baby Bottle Tracker

Une application pour suivre les biberons et les médicaments de bébé.

## Fonctionnalités

- Enregistrement des biberons (volume, heure)
- Suivi des médicaments (nom, dose, unité, heure)
- Dashboard avec statistiques quotidiennes
- Rapport quotidien avec export CSV

## Technologies utilisées

### Frontend
- React avec Vite
- JavaScript
- Tailwind CSS
- Zustand pour la gestion d'état

### Backend
- Node.js avec Express
- MariaDB pour le stockage des données

## Structure du projet

```
baby-bottle-tracker/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── stores/         # Stores Zustand
│   │   ├── api/            # Appels API
│   │   └── App.jsx         # Composant principal
│   ├── index.html          # Point d'entrée HTML
│   └── package.json        # Dépendances frontend
│
└── backend/                # API Node.js/Express
    ├── src/
    │   ├── controllers/    # Contrôleurs
    │   ├── models/         # Modèles de données
    │   ├── routes/         # Routes API
    │   ├── config/         # Configuration
    │   └── index.js        # Point d'entrée
    └── package.json        # Dépendances backend
```

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- MariaDB (v10.6 ou supérieur)

### Étapes d'installation

1. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/baby-bottle-tracker.git
cd baby-bottle-tracker
```

2. Configurer la base de données
```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE baby_bottle_tracker;
CREATE USER 'bbtracker'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON baby_bottle_tracker.* TO 'bbtracker'@'localhost';
FLUSH PRIVILEGES;
exit;
```

3. Configurer le backend
```bash
cd backend
npm install
# Créer un fichier .env avec les informations suivantes
echo "DB_HOST=localhost
DB_USER=bbtracker
DB_PASSWORD=password
DB_NAME=baby_bottle_tracker
PORT=3000" > .env
```

4. Configurer le frontend
```bash
cd ../frontend
npm install
# Créer un fichier .env avec l'URL de l'API
echo "VITE_API_URL=http://localhost:3000" > .env
```

## Démarrage

1. Démarrer le backend
```bash
cd backend
npm run dev
```

2. Démarrer le frontend (dans un autre terminal)
```bash
cd frontend
npm run dev
```

3. Accéder à l'application dans votre navigateur à l'adresse indiquée (généralement http://localhost:5173 ou http://localhost:5174)

## API Endpoints

### Biberons
- `GET /api/bottles` - Récupérer tous les biberons
- `GET /api/bottles/date/:date` - Récupérer les biberons pour une date spécifique
- `POST /api/bottles` - Ajouter un nouveau biberon

### Médicaments
- `GET /api/medications` - Récupérer tous les médicaments
- `GET /api/medications/date/:date` - Récupérer les médicaments pour une date spécifique
- `POST /api/medications` - Ajouter un nouveau médicament

## Évolutions futures possibles

- Authentification des utilisateurs
- Support pour plusieurs bébés
- Notifications et rappels
- Application mobile avec React Native
- Graphiques avancés pour les statistiques

## Installation locale avec Docker

```bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd baby-bottle-tracker

# Démarrer les services
docker-compose up -d

# L'application frontend est accessible sur http://localhost:5173
# L'API backend est accessible sur http://localhost:3000
```

## Pipeline CI/CD GitHub Actions

Ce projet utilise GitHub Actions pour automatiser la construction et la publication des images Docker vers GitHub Container Registry (GHCR).

### Fonctionnalités de la pipeline

- Construction automatique des images Docker pour le frontend et le backend
- Publication des images vers GitHub Container Registry
- Utilisation du cache pour accélérer les builds
- Tagging des images avec le hash du commit et "latest" pour la branche principale

### Comment utiliser les images Docker publiées

Après que la pipeline a poussé les images vers GHCR, vous pouvez les utiliser comme ceci :

```bash
# Télécharger les images
docker pull ghcr.io/<votre-nom-utilisateur>/baby-bottle-tracker/backend:latest
docker pull ghcr.io/<votre-nom-utilisateur>/baby-bottle-tracker/frontend:latest

# Créer un fichier docker-compose-prod.yml
version: '3.8'

services:
  backend:
    image: ghcr.io/<votre-nom-utilisateur>/baby-bottle-tracker/backend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=your-db-host
      - DB_USER=your-db-user
      - DB_PASSWORD=your-db-password
      - DB_NAME=baby_tracker
      - PORT=3000

  frontend:
    image: ghcr.io/<votre-nom-utilisateur>/baby-bottle-tracker/frontend:latest
    ports:
      - "80:80"  # Supposant que l'image frontend est configurée pour servir sur le port 80 en production
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend
```

### Configuration requise pour GitHub Actions

Pour que la pipeline fonctionne correctement, vous devez :

1. Héberger votre code sur GitHub
2. S'assurer que les packages GitHub sont activés pour votre dépôt
3. Vérifier que le workflow a les permissions pour écrire des packages

La pipeline utilise le token GitHub automatiquement fourni par GitHub Actions, donc aucune configuration supplémentaire de secrets n'est nécessaire.
