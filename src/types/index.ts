export type ServiceCategory = 'hair' | 'skin' | 'nails' | 'packages';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  price_from: number;
  price_label: string;
  description?: string;
}

export interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  status: BookingStatus;
}

export interface GalleryItem {
  id: string;
  category: string;
  image_url: string;
  caption?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  rating: number;
  review: string;
}