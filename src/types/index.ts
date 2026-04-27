export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

   export interface Service {
     id: string;
     name: string;
     category: string;
     price_label: string;
     is_active: boolean;
     sort_order: number;
   }

   export interface Booking {
     id: string;
     client_name: string;
     client_phone: string;
     client_email?: string;
     service_id: string;
     service_name: string;
     preferred_date: string;
     preferred_time: string;
     notes?: string;
     status: BookingStatus;
     created_at: string;
   }

   export interface GalleryItem {
     id: string;
     image_url: string;
     caption?: string;
     sort_order: number;
   }

   export interface Testimonial {
     id: string;
     client_name: string;
     review: string;
     is_approved: boolean;
   }