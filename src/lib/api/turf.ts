import api from './client';
import { API_CONFIG } from '@/lib/constants/api';
import type { Turf, TurfSearchParams } from '@/types/turf';

export const turfApi = {
  // Get all turfs with optional filters
  getTurfs: async (params?: TurfSearchParams): Promise<{ turfs: Turf[]; total: number }> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TURFS.LIST, { params });
    return response.data;
  },

  // Get turf details
  getTurfDetails: async (id: string): Promise<Turf> => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.TURFS.DETAILS}/${id}`);
    return response.data;
  },

  // Search turfs
  searchTurfs: async (params: TurfSearchParams): Promise<{ turfs: Turf[]; total: number }> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TURFS.SEARCH, { params });
    return response.data;
  },

  // Get nearby turfs
  getNearbyTurfs: async (lat: number, lng: number, radius = 10): Promise<{ turfs: Turf[]; total: number }> => {
    const response = await api.get(API_CONFIG.ENDPOINTS.TURFS.NEARBY, {
      params: { lat, lng, radius },
    });
    return response.data;
  },

  // Get turf time slots for a specific date
  getTurfTimeSlots: async (turfId: string, date: string) => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.TURFS.DETAILS}/${turfId}/slots`, {
      params: { date },
    });
    return response.data;
  },
};