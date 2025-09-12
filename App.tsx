import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import { Layout } from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import { preloadImagesWithProgress } from './utils/imagePreloader';

// Import all pages directly to load them upfront
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ReviewsPage from './pages/ReviewsPage';
import GalleryPage from './pages/GalleryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import AdminDishOfTheDayPage from './pages/AdminDishOfTheDayPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminChefsPage from './pages/AdminChefsPage';
import AdminOffersPage from './pages/AdminOffersPage';
import AdminInfoPage from './pages/AdminInfoPage';
import AdminFAQPage from './pages/AdminFAQPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [areImagesPreloaded, setAreImagesPreloaded] = useState(false);
  const { isDataLoaded, chefSpecial, menuItems, chefs, galleryImages, offers } = useData();
  const [preloadProgress, setPreloadProgress] = useState(0);


  useEffect(() => {
    const handleLoad = () => setIsSiteLoaded(true);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  // Preload all images across the site and track progress
  useEffect(() => {
    if (isDataLoaded) {
      const imageUrls = [
        // Static background images from pages
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', // HomePage Hero, ContactPage Map
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop', // HomePage About Snapshot
        'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1974&auto=format&fit=crop', // HomePage Reservation CTA, ContactPage Header
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop', // AboutPage Header
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', // OffersPage Header
        // Static offers from OffersPage
        'https://images.unsplash.com/photo-1565557623262-b9a35fcde3a4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600375836394-e038a3424164?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606787366850-de6330128214?q=80&w=2070&auto=format&fit=crop',
        // Dynamic images from data context
        chefSpecial?.image_url,
        ...menuItems.map(item => item.image_url),
        ...chefs.map(chef => chef.image_url),
        ...galleryImages.map(img => img.src),
        ...offers.map(offer => offer.image_url),
      ].filter(Boolean) as string[];

      const uniqueImageUrls = [...new Set(imageUrls)];

      preloadImagesWithProgress(uniqueImageUrls, (progress) => {
        setPreloadProgress(progress);
      }).then(() => {
        setAreImagesPreloaded(true);
      });
    }
  }, [isDataLoaded, chefSpecial, menuItems, chefs, galleryImages, offers]);

  const isEverythingLoaded = isSiteLoaded && isDataLoaded && areImagesPreloaded;

  useEffect(() => {
    if (isEverythingLoaded) {
      const fadeTimer = setTimeout(() => {
        setIsPreloaderVisible(false);
      }, 1000); // Keep preloader for 1s after 100%
      return () => clearTimeout(fadeTimer);
    }
  }, [isEverythingLoaded]);

  return (
    <>
      {isPreloaderVisible && <Preloader isLoaded={isEverythingLoaded} progress={preloadProgress} />}
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="reservations" element={<AdminReservationsPage />} />
              <Route path="dish-of-the-day" element={<AdminDishOfTheDayPage />} />
              <Route path="menu" element={<AdminMenuPage />} />
              <Route path="chefs" element={<AdminChefsPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="info" element={<AdminInfoPage />} />
              <Route path="faq" element={<AdminFAQPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;