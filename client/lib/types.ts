export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio?: string;
  phone?: string;
  createdAt?: string;
}

export type EventCategory =
  | 'Cleanup'
  | 'Plantation'
  | 'Donation'
  | 'Food Rescue'
  | 'Healthcare'
  | 'Education'
  | 'Relief'
  | 'Other';

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: EventCategory | string;
  thumbnail: string;
  location: string;
  eventDate: string;
  organizerEmail: string;
  organizerName: string;
  organizerPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinedEvent {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  organizerEmail: string;
  organizerName?: string;
  userEmail: string;
  userName?: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface Participant {
  userEmail: string;
  userName: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface EventDetailResponse {
  success: boolean;
  event: EventItem;
  participantCount: number;
  participants: Participant[];
  hasJoined: boolean;
}
