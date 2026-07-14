export type UserRole = 'Admin' | 'Organizer' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Blocked';
  joinedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'Conference' | 'Workshop' | 'Meetup' | 'Social' | 'Other';
  status: 'Draft' | 'Pending' | 'Published' | 'Completed' | 'Cancelled';
  attendees: number;
  capacity: number;
  revenue: number;
  price: number;
  organizer_id: string;
  image?: string;
  needs_volunteers: boolean;
  needs_workers: boolean;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'Confirmed' | 'Cancelled';
  registered_at: string;
  qr_code_data: string;
  title?: string;
  date?: string;
  location?: string;
  image?: string;
  price?: number;
}

export interface Review {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
