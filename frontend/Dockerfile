# Utiliser une image Node.js officielle comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier uniquement package.json d'abord
COPY package.json ./

# Installer les dépendances avec --force pour éviter les problèmes de dépendances optionnelles
RUN apt-get update && apt-get install -y build-essential python3 && \
    npm install --force && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Installer un serveur HTTP simple pour servir les fichiers statiques
RUN npm install -g serve

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5173

# Commande pour démarrer l'application avec serve en mode SPA
CMD ["serve", "-s", "dist", "-l", "5173"]