import api from './client';
import { API_CONFIG } from '@/lib/constants/api';
import type { Sport } from '@/types/turf';

// Since sports endpoints aren't implemented yet, using static data
export const sportsApi = {
  // Get all sports
  getSports: async (): Promise<Sport[]> => {
    // For now, return static data - will be replaced when backend is ready
    return Promise.resolve([
      { id: '1', name: 'Cricket', description: 'Bat and ball sport', icon: '🏏', isPopular: true },
      { id: '2', name: 'Football', description: 'Association football', icon: '⚽', isPopular: true },
      { id: '3', name: 'Basketball', description: 'Hoop sport', icon: '🏀', isPopular: true },
      { id: '4', name: 'Tennis', description: 'Racquet sport', icon: '🎾', isPopular: false },
      { id: '5', name: 'Badminton', description: 'Racquet sport', icon: '🏸', isPopular: true },
      { id: '6', name: 'Volleyball', description: 'Net sport', icon: '🏐', isPopular: false },
      { id: '7', name: 'Table Tennis', description: 'Ping pong', icon: '🏓', isPopular: false },
      { id: '8', name: 'Hockey', description: 'Stick and ball sport', icon: '🏒', isPopular: false },
    ]);
    
    // Uncomment when backend endpoint is ready:
    // const response = await api.get(API_CONFIG.ENDPOINTS.SPORTS.LIST);
    // return response.data;
  },

  // Get sport details
  getSportDetails: async (id: string): Promise<Sport> => {
    // For now, return static data
    const sports = await sportsApi.getSports();
    const sport = sports.find(s => s.id === id);
    if (!sport) {
      throw new Error('Sport not found');
    }
    return sport;
    
    // Uncomment when backend endpoint is ready:
    // const response = await api.get(`${API_CONFIG.ENDPOINTS.SPORTS.LIST}/${id}`);
    // return response.data;
  },
};