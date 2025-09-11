import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import type { MenuItem, ContactInfo, AboutInfo, OfferItem, FAQItem, ChefSpecial, ReviewItem, GalleryImage, Chef, ReservationItem, ContactMessageItem } from '../types';
import { initialMenuItems, initialContactInfo, initialAboutInfo, initialOffers, initialFaqs, initialChefSpecial, initialReviews, initialGalleryImages, initialMenuCategories } from '../data';

interface DataContextType {
  menuItems: MenuItem[];
  contactInfo: ContactInfo;
  aboutInfo: AboutInfo;
  offers: OfferItem[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
  galleryImages: GalleryImage[];
  chefSpecial: ChefSpecial;
  menuCategories: string[];
  chefs: Chef[];
  reservations: ReservationItem[];
  session: Session | null;
  isDataLoaded: boolean;
  fetchData: () => Promise<void>;
  // Image storage functions
  uploadImage: (file: File, bucketPath: string) => Promise<string | null>;
  deleteImage: (imageUrl: string) => Promise<void>;
  // All update functions are now async and interact with the database
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (item: MenuItem) => Promise<void>;
  addOffer: (offer: Omit<OfferItem, 'id'>) => Promise<void>;
  updateOffer: (offer: OfferItem) => Promise<void>;
  deleteOffer: (offer: OfferItem) => Promise<void>;
  addReview: (review: Omit<ReviewItem, 'id'>) => Promise<boolean>;
  updateReview: (review: ReviewItem) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<void>;
  deleteGalleryImage: (image: GalleryImage) => Promise<void>;
  addReservation: (reservation: Omit<ReservationItem, 'id' | 'created_at' | 'status'>) => Promise<boolean>;
  updateReservation: (reservation: ReservationItem) => Promise<void>;
  deleteReservation: (id: number) => Promise<void>;
  addContactMessage: (message: Omit<ContactMessageItem, 'id' | 'created_at'>) => Promise<boolean>;
  // Simplified update functions for single-row tables
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updateAboutInfo: (info: AboutInfo) => Promise<void>;
  updateChefSpecial: (special: ChefSpecial) => Promise<void>;
  updateFaqs: (faqs: FAQItem[]) => Promise<void>;
  addMenuCategory: (category: string) => Promise<void>;
  deleteMenuCategory: (category: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>(initialAboutInfo);
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [chefSpecial, setChefSpecial] = useState<ChefSpecial>(initialChefSpecial);
  const [menuCategories, setMenuCategories] = useState<string[]>(initialMenuCategories);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchData = useCallback(async () => {
    setIsDataLoaded(false);
    const promises = [
        supabase.from('menu_items').select('*'),
        supabase.from('contact_info').select('*').single(),
        supabase.from('about_info').select('*').single(),
        supabase.from('offers').select('*'),
        supabase.from('faqs').select('*'),
        supabase.from('reviews').select('*').order('review_date', { ascending: false }),
        supabase.from('gallery_images').select('*'),
        supabase.from('chef_special').select('*').single(),
        supabase.from('menu_categories').select('name'),
        supabase.from('chefs').select('*'),
        supabase.from('reservations').select('*').order('created_at', { ascending: false }),
    ];
    
    const [
        menuItemsRes, contactInfoRes, aboutInfoRes, offersRes, faqsRes, 
        reviewsRes, galleryImagesRes, chefSpecialRes, menuCategoriesRes, chefsRes, reservationsRes
    ] = await Promise.allSettled(promises);

    if (menuItemsRes.status === 'fulfilled' && menuItemsRes.value.data) setMenuItems(menuItemsRes.value.data);
    else if(menuItemsRes.status === 'rejected') console.error("Error fetching menu items:", menuItemsRes.reason);

    if (contactInfoRes.status === 'fulfilled' && contactInfoRes.value.data) setContactInfo(contactInfoRes.value.data);
    else if(contactInfoRes.status === 'rejected') console.error("Error fetching contact info:", contactInfoRes.reason);

    if (aboutInfoRes.status === 'fulfilled' && aboutInfoRes.value.data) setAboutInfo(aboutInfoRes.value.data);
    else if(aboutInfoRes.status === 'rejected') console.error("Error fetching about info:", aboutInfoRes.reason);
    
    if (offersRes.status === 'fulfilled' && offersRes.value.data) setOffers(offersRes.value.data);
    else if(offersRes.status === 'rejected') console.error("Error fetching offers:", offersRes.reason);

    if (faqsRes.status === 'fulfilled' && faqsRes.value.data) setFaqs(faqsRes.value.data);
    else if(faqsRes.status === 'rejected') console.error("Error fetching faqs:", faqsRes.reason);
    
    if (reviewsRes.status === 'fulfilled' && reviewsRes.value.data) setReviews(reviewsRes.value.data);
    else if(reviewsRes.status === 'rejected') console.error("Error fetching reviews:", reviewsRes.reason);

    if (galleryImagesRes.status === 'fulfilled' && galleryImagesRes.value.data) setGalleryImages(galleryImagesRes.value.data);
    else if(galleryImagesRes.status === 'rejected') console.error("Error fetching gallery images:", galleryImagesRes.reason);
    
    if (chefSpecialRes.status === 'fulfilled' && chefSpecialRes.value.data) setChefSpecial(chefSpecialRes.value.data);
    else if(chefSpecialRes.status === 'rejected') console.error("Error fetching chef special:", chefSpecialRes.reason);
    
    if (menuCategoriesRes.status === 'fulfilled' && menuCategoriesRes.value.data) setMenuCategories(menuCategoriesRes.value.data.map((c: { name: string; }) => c.name));
    else if(menuCategoriesRes.status === 'rejected') console.error("Error fetching menu categories:", menuCategoriesRes.reason);

    if (chefsRes.status === 'fulfilled' && chefsRes.value.data) setChefs(chefsRes.value.data);
    else if(chefsRes.status === 'rejected') console.error("Error fetching chefs:", chefsRes.reason);
    
    if (reservationsRes.status === 'fulfilled' && reservationsRes.value.data) setReservations(reservationsRes.value.data);
    else if(reservationsRes.status === 'rejected') console.error("Error fetching reservations:", reservationsRes.reason);
    
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const getPathFromUrl = (url: string) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.split('/restaurant-assets/')[1];
    } catch (e) {
        console.error('Invalid URL for path extraction:', url, e);
        return null;
    }
  }

  const uploadImage = async (file: File, bucketPath: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${bucketPath}/${fileName}`;
    const { error } = await supabase.storage.from('restaurant-assets').upload(filePath, file);
    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }
    const { data } = supabase.storage.from('restaurant-assets').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const deleteImage = async (imageUrl: string) => {
    if (!imageUrl) return;
    const path = getPathFromUrl(imageUrl);
    if (path) {
        const { error } = await supabase.storage.from('restaurant-assets').remove([path]);
        if (error) console.error('Error deleting image:', error);
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const { data, error } = await supabase.from('menu_items').insert([item]).select();
    if (error) console.error('addMenuItem error:', error);
    else if (data) setMenuItems(prev => [...prev, data[0]].sort((a,b) => a.id - b.id));
  };

  const updateMenuItem = async (item: MenuItem) => {
    const { data, error } = await supabase.from('menu_items').update(item).match({ id: item.id }).select();
    if (error) console.error('updateMenuItem error:', error);
    else if (data) setMenuItems(prev => prev.map(i => i.id === item.id ? data[0] : i));
  };

  const deleteMenuItem = async (item: MenuItem) => {
    await deleteImage(item.image_url);
    const { error } = await supabase.from('menu_items').delete().match({ id: item.id });
    if (error) console.error('deleteMenuItem error:', error);
    else setMenuItems(prev => prev.filter(i => i.id !== item.id));
  };
  
  const addOffer = async (offer: Omit<OfferItem, 'id'>) => {
    const { data, error } = await supabase.from('offers').insert([offer]).select();
    if(error) console.error('addOffer error:', error);
    else if(data) setOffers(prev => [...prev, data[0]]);
  };

  const updateOffer = async (offer: OfferItem) => {
    const { data, error } = await supabase.from('offers').update(offer).match({ id: offer.id }).select();
    if(error) console.error('updateOffer error:', error);
    else if(data) setOffers(prev => prev.map(o => o.id === offer.id ? data[0] : o));
  };

  const deleteOffer = async (offer: OfferItem) => {
    await deleteImage(offer.image_url);
    const { error } = await supabase.from('offers').delete().match({ id: offer.id });
    if(error) console.error('deleteOffer error:', error);
    else setOffers(prev => prev.filter(o => o.id !== offer.id));
  };
  
  const addReview = async (review: Omit<ReviewItem, 'id'>): Promise<boolean> => {
    const { error } = await supabase.from('reviews').insert([review]);
    if(error) { console.error('addReview error:', error); return false; }
    await fetchData();
    return true;
  };

  const updateReview = async (review: ReviewItem) => {
    const { data, error } = await supabase.from('reviews').update(review).match({ id: review.id }).select();
    if(error) console.error('updateReview error:', error);
    else if(data) setReviews(prev => prev.map(r => r.id === review.id ? data[0] : r));
  };

  const deleteReview = async (id: number) => {
    const { error } = await supabase.from('reviews').delete().match({ id });
    if(error) console.error('deleteReview error:', error);
    else setReviews(prev => prev.filter(r => r.id !== id));
  };
  
  const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
    const { data, error } = await supabase.from('gallery_images').insert([image]).select();
    if(error) console.error('addGalleryImage error:', error);
    else if(data) setGalleryImages(prev => [...prev, data[0]]);
  };

  const deleteGalleryImage = async (image: GalleryImage) => {
    await deleteImage(image.src);
    const { error } = await supabase.from('gallery_images').delete().match({ id: image.id });
    if(error) console.error('deleteGalleryImage error:', error);
    else setGalleryImages(prev => prev.filter(g => g.id !== image.id));
  };

  const addReservation = async (reservation: Omit<ReservationItem, 'id' | 'created_at' | 'status'>): Promise<boolean> => {
    const { error } = await supabase.from('reservations').insert([{ ...reservation, status: 'Pending' }]);
    if (error) { console.error('addReservation error:', error); return false; }
    fetchData();
    return true;
  };

  const updateReservation = async (reservation: ReservationItem) => {
      const { data, error } = await supabase.from('reservations').update(reservation).match({ id: reservation.id }).select();
      if (error) console.error('updateReservation error:', error);
      else if(data) setReservations(prev => prev.map(r => r.id === reservation.id ? data[0] : r));
  };

  const deleteReservation = async (id: number) => {
      const { error } = await supabase.from('reservations').delete().match({ id });
      if (error) console.error('deleteReservation error:', error);
      else setReservations(prev => prev.filter(r => r.id !== id));
  };
  
  const addContactMessage = async (message: Omit<ContactMessageItem, 'id' | 'created_at'>): Promise<boolean> => {
    const { error } = await supabase.from('contact_messages').insert([message]);
    if (error) { console.error('addContactMessage error:', error); return false; }
    return true;
  };
  
  const updateContactInfo = async (info: ContactInfo) => {
    const { data, error } = await supabase.from('contact_info').update(info).eq('id', 1).select();
    if (error) console.error('updateContactInfo error:', error);
    else if (data) setContactInfo(data[0]);
  };
  
  const updateAboutInfo = async (info: AboutInfo) => {
    const { data, error } = await supabase.from('about_info').update(info).eq('id', 1).select();
    if (error) console.error('updateAboutInfo error:', error);
    else if (data) setAboutInfo(data[0]);
  };
  
  const updateChefSpecial = async (special: ChefSpecial) => {
    const { data, error } = await supabase.from('chef_special').update(special).eq('id', 1).select();
    if (error) console.error('updateChefSpecial error:', error);
    else if (data) setChefSpecial(data[0]);
  };

  const updateFaqs = async (faqsToUpdate: FAQItem[]) => {
    // NOTE: This approach is not ideal for large datasets but is simple.
    // It deletes all existing FAQs and inserts the new list.
    const { error: deleteError } = await supabase.from('faqs').delete().neq('id', -1);
    if (deleteError) { console.error('updateFaqs delete error:', deleteError); return; }
    const { data, error: insertError } = await supabase.from('faqs').insert(faqsToUpdate.map(({id, ...rest}) => rest)).select();
    if (insertError) console.error('updateFaqs insert error:', insertError);
    else if(data) setFaqs(data);
  };
  
  const addMenuCategory = async (category: string) => {
      const { data, error } = await supabase.from('menu_categories').insert({ name: category }).select();
      if(error) console.error('addMenuCategory error:', error);
      else if(data) setMenuCategories(prev => [...prev, data[0].name]);
  };

  const deleteMenuCategory = async (category: string) => {
      const { error } = await supabase.from('menu_categories').delete().match({ name: category });
      if(error) console.error('deleteMenuCategory error:', error);
      else setMenuCategories(prev => prev.filter(c => c !== category));
  };

  const value = {
    menuItems, contactInfo, aboutInfo, offers, faqs, reviews, galleryImages,
    chefSpecial, menuCategories, chefs, reservations, session, isDataLoaded, fetchData,
    uploadImage, deleteImage, addMenuItem, updateMenuItem, deleteMenuItem,
    addOffer, updateOffer, deleteOffer, addReview, updateReview, deleteReview,
    addGalleryImage, deleteGalleryImage, addReservation, updateReservation, deleteReservation,
    addContactMessage, updateContactInfo, updateAboutInfo, updateChefSpecial,
    updateFaqs, addMenuCategory, deleteMenuCategory,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
