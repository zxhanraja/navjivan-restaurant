export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string; 
  category: string;
}

export interface OfferItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  valid_until: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ReviewItem {
  id: number;
  name: string;
  rating: number; // 1-5
  comment: string;
  review_date: string;
  status: 'pending' | 'approved';
  dish_name?: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'Food' | 'Ambiance';
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  map_url: string;
  opening_hours: { day: string; hours: string; }[];
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export interface AboutInfo {
  story: string;
  mission: string;
  vision: string;
  why_us: string[];
}

export interface ChefSpecial {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface Chef {
  id: number;
  name: string;
  title: string;
  bio: string;
  image_url: string;
}

export interface ReservationItem {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at: string;
}

export interface AIRecommendation {
  name: string;
  reason: string;
  description: string;
}

export interface ContactMessageItem {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}