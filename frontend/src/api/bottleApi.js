// Configuration des variables d'environnement pour le frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fonction pour récupérer tous les biberons
export const fetchBottles = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bottles`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des biberons:', error);
    throw error;
  }
};

// Fonction pour récupérer les biberons par date
export const fetchBottlesByDate = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await fetch(`${API_URL}/api/bottles/date/${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des biberons par date:', error);
    throw error;
  }
};

// Fonction pour récupérer les statistiques des biberons par date
export const fetchBottleStats = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await fetch(`${API_URL}/api/bottles/stats/${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau biberon
export const addBottle = async (bottle) => {
  try {
    const response = await fetch(`${API_URL}/api/bottles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bottle),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un biberon:', error);
    throw error;
  }
};
