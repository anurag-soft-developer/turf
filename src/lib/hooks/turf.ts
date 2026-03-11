'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { turfApi } from '@/lib/api/turf';
import { sportsApi } from '@/lib/api/sports';
import type { TurfSearchParams } from '@/types/turf';

// Query keys
export const TURF_QUERY_KEYS = {
  turfs: ['turfs'],
  turf: (id: string) => ['turfs', id],
  search: (params: TurfSearchParams) => ['turfs', 'search', params],
  nearby: (lat: number, lng: number, radius: number) => ['turfs', 'nearby', { lat, lng, radius }],
  timeSlots: (turfId: string, date: string) => ['turfs', turfId, 'slots', date],
} as const;

export const SPORTS_QUERY_KEYS = {
  sports: ['sports'],
  sport: (id: string) => ['sports', id],
} as const;

// Turf hooks
export const useTurfs = (params?: TurfSearchParams) => {
  return useQuery({
    queryKey: params ? TURF_QUERY_KEYS.search(params) : TURF_QUERY_KEYS.turfs,
    queryFn: () => turfApi.getTurfs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTurfDetails = (id: string) => {
  return useQuery({
    queryKey: TURF_QUERY_KEYS.turf(id),
    queryFn: () => turfApi.getTurfDetails(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchTurfs = (params: TurfSearchParams) => {
  return useQuery({
    queryKey: TURF_QUERY_KEYS.search(params),
    queryFn: () => turfApi.searchTurfs(params),
    enabled: Object.keys(params).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useNearbyTurfs = (lat: number, lng: number, radius = 10) => {
  return useQuery({
    queryKey: TURF_QUERY_KEYS.nearby(lat, lng, radius),
    queryFn: () => turfApi.getNearbyTurfs(lat, lng, radius),
    enabled: !!lat && !!lng,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTurfTimeSlots = (turfId: string, date: string) => {
  return useQuery({
    queryKey: TURF_QUERY_KEYS.timeSlots(turfId, date),
    queryFn: () => turfApi.getTurfTimeSlots(turfId, date),
    enabled: !!turfId && !!date,
    staleTime: 30 * 1000, // 30 seconds (time slots can change frequently)
  });
};

// Sports hooks
export const useSports = () => {
  return useQuery({
    queryKey: SPORTS_QUERY_KEYS.sports,
    queryFn: sportsApi.getSports,
    staleTime: 10 * 60 * 1000, // 10 minutes (sports don't change often)
  });
};

export const useSportDetails = (id: string) => {
  return useQuery({
    queryKey: SPORTS_QUERY_KEYS.sport(id),
    queryFn: () => sportsApi.getSportDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};