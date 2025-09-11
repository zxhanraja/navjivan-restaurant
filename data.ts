import type { MenuItem, ContactInfo, AboutInfo, OfferItem, FAQItem, ChefSpecial, ReviewItem, GalleryImage } from './types';

// This file is no longer the source of truth. 
// Data is now fetched from the Supabase backend.
// These empty arrays are used for initial state before the data is loaded.

export const initialMenuCategories: string[] = [];
export const initialMenuItems: MenuItem[] = [];
export const initialContactInfo: ContactInfo = {
  phone: '', email: '', whatsapp: '', address: '', map_url: '',
  opening_hours: [], socials: { facebook: '', instagram: '', twitter: '' }
};
export const initialAboutInfo: AboutInfo = { story: '', mission: '', vision: '', why_us: [] };
export const initialOffers: OfferItem[] = [];
export const initialFaqs: FAQItem[] = [];
export const initialChefSpecial: ChefSpecial = { id: 1, name: '', description: '', price: 0, image_url: '' };
export const initialReviews: ReviewItem[] = [];
export const initialGalleryImages: GalleryImage[] = [];
