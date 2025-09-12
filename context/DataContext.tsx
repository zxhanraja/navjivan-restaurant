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
  isSessionLoading: boolean;
  isDataLoaded: boolean;
  fetchData: () => Promise<void>;
  // Image storage functions
  uploadImage: (file: File, bucketPath: string) => Promise<{ url: string | null; error: string | null }>;
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
  addChef: (chef: Omit<Chef, 'id'>) => Promise<void>;
  updateChef: (chef: Chef) => Promise<void>;
  deleteChef: (chef: Chef) => Promise<void>;
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
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchData = useCallback(async () => {
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set up real-time data subscriptions
  useEffect(() => {
    // Perform initial data fetch
    fetchData();

    // Subscribe to all changes in the public schema
    const channel = supabase
      .channel('public-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.log('Database change detected, refreshing data.', payload);
          // Re-fetch all data to ensure the UI is in sync with the database
          fetchData();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
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

  const uploadImage = async (file: File, bucketPath: string): Promise<{ url: string | null, error: string | null }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${bucketPath}/${fileName}`;
    const { error } = await supabase.storage.from('restaurant-assets').upload(filePath, file);

    if (error) {
        console.error('Error uploading image:', error);
        let detailedError = `Image upload failed. Supabase error: "${error.message}"`;

        if (error.message.toLowerCase().includes('jwt')) {
            detailedError = "Image upload failed due to an Authentication Error. Please make sure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables are correct and you have restarted the application.";
        } else if (error.message.toLowerCase().includes('security policy') || error.message.toLowerCase().includes('rls')) {
             detailedError = "Image upload failed. Please check Supabase storage policies. Authenticated users need INSERT permission on the 'restaurant-assets' bucket.";
        }
        
        return { url: null, error: detailedError };
    }
    const { data } = supabase.storage.from('restaurant-assets').getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
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
    const { error } = await supabase.from('menu_items').insert([item]).select();
    if (error) console.error('addMenuItem error:', error);
    // State will be updated by the real-time subscription, no need to manually set it.
  };

  const updateMenuItem = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').update(item).match({ id: item.id }).select();
    if (error) console.error('updateMenuItem error:', error);
    // State will be updated by the real-time subscription
  };

  const deleteMenuItem = async (item: MenuItem) => {
    await deleteImage(item.image_url);
    const { error } = await supabase.from('menu_items').delete().match({ id: item.id });
    if (error) console.error('deleteMenuItem error:', error);
    // State will be updated by the real-time subscription
  };
  
  const addOffer = async (offer: Omit<OfferItem, 'id'>) => {
    const { error } = await supabase.from('offers').insert([offer]).select();
    if(error) console.error('addOffer error:', error);
    // State will be updated by the real-time subscription
  };

  const updateOffer = async (offer: OfferItem) => {
    const { error } = await supabase.from('offers').update(offer).match({ id: offer.id }).select();
    if(error) console.error('updateOffer error:', error);
    // State will be updated by the real-time subscription
  };

  const deleteOffer = async (offer: OfferItem) => {
    await deleteImage(offer.image_url);
    const { error } = await supabase.from('offers').delete().match({ id: offer.id });
    if(error) console.error('deleteOffer error:', error);
    // State will be updated by the real-time subscription
  };
  
  const addReview = async (review: Omit<ReviewItem, 'id'>): Promise<boolean> => {
    const { error } = await supabase.from('reviews').insert([review]);
    if(error) { console.error('addReview error:', error); return false; }
    // No fetchData call needed, subscription will handle it.
    return true;
  };

  const updateReview = async (review: ReviewItem) => {
    const { error } = await supabase.from('reviews').update(review).match({ id: review.id }).select();
    if(error) console.error('updateReview error:', error);
    // State will be updated by the real-time subscription
  };

  const deleteReview = async (id: number) => {
    const { error } = await supabase.from('reviews').delete().match({ id });
    if(error) console.error('deleteReview error:', error);
    // State will be updated by the real-time subscription
  };
  
  const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
    const { error } = await supabase.from('gallery_images').insert([image]).select();
    if(error) console.error('addGalleryImage error:', error);
    // State will be updated by the real-time subscription
  };

  const deleteGalleryImage = async (image: GalleryImage) => {
    await deleteImage(image.src);
    const { error } = await supabase.from('gallery_images').delete().match({ id: image.id });
    if(error) console.error('deleteGalleryImage error:', error);
    // State will be updated by the real-time subscription
  };

  const addReservation = async (reservation: Omit<ReservationItem, 'id' | 'created_at' | 'status'>): Promise<boolean> => {
    const { error } = await supabase.from('reservations').insert([{ ...reservation, status: 'Pending' }]);
    if (error) { console.error('addReservation error:', error); return false; }
    // No fetchData call needed, subscription will handle it.
    return true;
  };

  const updateReservation = async (reservation: ReservationItem) => {
      const { error } = await supabase.from('reservations').update(reservation).match({ id: reservation.id }).select();
      if (error) console.error('updateReservation error:', error);
      // State will be updated by the real-time subscription
  };

  const deleteReservation = async (id: number) => {
      const { error } = await supabase.from('reservations').delete().match({ id });
      if (error) console.error('deleteReservation error:', error);
      // State will be updated by the real-time subscription
  };
  
  const addContactMessage = async (message: Omit<ContactMessageItem, 'id' | 'created_at'>): Promise<boolean> => {
    const { error } = await supabase.from('contact_messages').insert([message]);
    if (error) { console.error('addContactMessage error:', error); return false; }
    return true;
  };
  
  const updateContactInfo = async (info: ContactInfo) => {
    const { error } = await supabase.from('contact_info').update(info).eq('id', 1).select();
    if (error) console.error('updateContactInfo error:', error);
    // State will be updated by the real-time subscription
  };
  
  const updateAboutInfo = async (info: AboutInfo) => {
    const { error } = await supabase.from('about_info').update(info).eq('id', 1).select();
    if (error) console.error('updateAboutInfo error:', error);
    // State will be updated by the real-time subscription
  };
  
  const updateChefSpecial = async (special: ChefSpecial) => {
    const { error } = await supabase.from('chef_special').update(special).eq('id', 1).select();
    if (error) console.error('updateChefSpecial error:', error);
    // State will be updated by the real-time subscription
  };

  const updateFaqs = async (faqsToUpdate: FAQItem[]) => {
    const { error: deleteError } = await supabase.from('faqs').delete().neq('id', -1);
    if (deleteError) { console.error('updateFaqs delete error:', deleteError); return; }
    const { error: insertError } = await supabase.from('faqs').insert(faqsToUpdate.map(({id, ...rest}) => rest)).select();
    if (insertError) console.error('updateFaqs insert error:', insertError);
    // State will be updated by the real-time subscription
  };
  
  const addMenuCategory = async (category: string) => {
      const { error } = await supabase.from('menu_categories').insert({ name: category }).select();
      if(error) console.error('addMenuCategory error:', error);
      // State will be updated by the real-time subscription
  };

  const deleteMenuCategory = async (category: string) => {
      const { error } = await supabase.from('menu_categories').delete().match({ name: category });
      if(error) console.error('deleteMenuCategory error:', error);
      // State will be updated by the real-time subscription
  };

  const addChef = async (chef: Omit<Chef, 'id'>) => {
    const { error } = await supabase.from('chefs').insert([chef]).select();
    if (error) console.error('addChef error:', error);
    // State will be updated by the real-time subscription
  };

  const updateChef = async (chef: Chef) => {
    const { error } = await supabase.from('chefs').update(chef).match({ id: chef.id }).select();
    if (error) console.error('updateChef error:', error);
    // State will be updated by the real-time subscription
  };

  const deleteChef = async (chef: Chef) => {
    await deleteImage(chef.image_url);
    const { error } = await supabase.from('chefs').delete().match({ id: chef.id });
    if (error) console.error('deleteChef error:', error);
    // State will be updated by the real-time subscription
  };

  const value = {
    menuItems, contactInfo, aboutInfo, offers, faqs, reviews, galleryImages,
    chefSpecial, menuCategories, chefs, reservations, session, isSessionLoading, isDataLoaded, fetchData,
    uploadImage, deleteImage, addMenuItem, updateMenuItem, deleteMenuItem,
    addOffer, updateOffer, deleteOffer, addReview, updateReview, deleteReview,
    addGalleryImage, deleteGalleryImage, addReservation, updateReservation, deleteReservation,
    addContactMessage, updateContactInfo, updateAboutInfo, updateChefSpecial,
    updateFaqs, addMenuCategory, deleteMenuCategory, addChef, updateChef, deleteChef,
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