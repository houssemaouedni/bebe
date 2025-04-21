import { create } from 'zustand';
import { fetchBottles, fetchBottlesByDate, addBottle as apiAddBottle } from '../api/bottleApi';

// Store pour la gestion des biberons
const useBottleStore = create((set, get) => ({
  bottles: [],
  todayTotal: 0,
  todayVolume: 0,
  loading: false,
  error: null,
  
  // Ajouter un nouveau biberon
  addBottle: async (bottle) => {
    try {
      set({ loading: true, error: null });
      // Appel à l'API pour ajouter le biberon
      const newBottle = await apiAddBottle(bottle);
      
      set((state) => {
        const newBottles = [...state.bottles, newBottle];
        
        // Calculer les totaux pour aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const todayBottles = newBottles.filter(b => 
          new Date(b.timestamp).toISOString().split('T')[0] === today
        );
        
        const todayTotal = todayBottles.length;
        const todayVolume = todayBottles.reduce((sum, b) => sum + b.volume, 0);
        
        return { 
          bottles: newBottles,
          todayTotal,
          todayVolume,
          loading: false
        };
      });
      
      return newBottle;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors de l\'ajout d\'un biberon:', error);
      throw error;
    }
  },
  
  // Récupérer les biberons pour une date spécifique
  getBottlesByDate: async (date) => {
    try {
      set({ loading: true, error: null });
      const bottles = await fetchBottlesByDate(date);
      set({ loading: false });
      return bottles;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors de la récupération des biberons par date:', error);
      return [];
    }
  },
  
  // Charger les biberons depuis l'API
  fetchBottles: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchBottles();
      
      // Calculer les totaux pour aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todayBottles = data.filter(b => 
        new Date(b.timestamp).toISOString().split('T')[0] === today
      );
console.log('todayBottles', todayBottles);
      
      const todayTotal = todayBottles.length;
      const todayVolume = todayBottles.reduce((sum, b) => sum + b.volume, 0);
      
      set({ 
        bottles: data,
        todayTotal,
        todayVolume,
        loading: false
      });
      
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      console.error('Erreur lors du chargement des biberons:', error);
      return [];
    }
  }
}));

export default useBottleStore;
