import { Sport, Turf } from './turf';

export interface Event {
  id: string;
  title: string;
  description: string;
  sport: Sport;
  turf?: Turf;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  isPublic: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface EventRegistration {
  eventId: string;
  participantId: string;
  registeredAt: string;
  status: 'registered' | 'cancelled';
}