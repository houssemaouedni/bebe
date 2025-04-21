import { create } from 'zustand';
import { fetchMedications, fetchMedicationsByDate, addMedication as apiAddMedication } from '../api/medicationApi';

// Store pour la gestion des médicaments
const useMedicationStore = create((set, get) => ({
  medications: [],
  todayMedications: [],
  loading: false,
  error: null,
  
  // Ajouter un nouveau médicament
  addMedication: async (medication) => {
    try {
      set({ loading: true, error: null });
      // Appel à l'API pour ajouter le médicament
      const newMedication = await apiAddMedication(medication);
      
      set((state) => {
        const newMedications = [...state.medications, newMedication];
        
        // Mettre à jour la liste des médicaments d'aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const todayMeds = newMedications.filter(m => 
          new Date(m.timestamp).toISOString().split('T')[0] === today
        );
        
        return { 
          medications: newMedications,
          todayMedications: todayMeds,
          loading: false
        };
      });
      
      return newMedication;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors de l\'ajout d\'un médicament:', error);
      throw error;
    }
  },
  
  // Récupérer les médicaments pour une date spécifique
  getMedicationsByDate: async (date) => {
    try {
      set({ loading: true, error: null });
      const medications = await fetchMedicationsByDate(date);
      set({ loading: false });
      return medications;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors de la récupération des médicaments par date:', error);
      return [];
    }
  },
  
  // Charger les médicaments depuis l'API
  fetchMedications: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchMedications();
      
      // Mettre à jour la liste des médicaments d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todayMeds = data.filter(m => 
        new Date(m.timestamp).toISOString().split('T')[0] === today
      );
      
      set({ 
        medications: data,
        todayMedications: todayMeds,
        loading: false
      });
      
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors du chargement des médicaments:', error);
      return [];
    }
  }
}));

export default useMedicationStore;
