// Configuration des variables d'environnement pour le frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fonction pour récupérer tous les médicaments
export const fetchMedications = async () => {
  try {
    const response = await fetch(`${API_URL}/api/medications`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    throw error;
  }
};

// Fonction pour récupérer les médicaments par date
export const fetchMedicationsByDate = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await fetch(`${API_URL}/api/medications/date/${formattedDate}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments par date:', error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau médicament
export const addMedication = async (medication) => {
  try {
    const response = await fetch(`${API_URL}/api/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un médicament:', error);
    throw error;
  }
};
