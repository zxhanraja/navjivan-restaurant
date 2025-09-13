
import React, { useState, useEffect } from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from './context/DataContext';
import { Layout } from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import { preloadImagesWithProgress } from './utils/imagePreloader';
import { getTransformedImageUrl } from './utils/imageTransformer';

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
      const dynamicImageUrls = [
        chefSpecial?.image_url,
        ...menuItems.map(item => item.image_url),
        ...chefs.map(chef => chef.image_url),
        ...galleryImages.map(img => img.src),
        ...offers.map(offer => offer.image_url),
      ].filter(Boolean) as string[];

      // Preload optimized versions of dynamic images for faster loading
      const transformedDynamicUrls = dynamicImageUrls.map(url => getTransformedImageUrl(url, { width: 1200 }));

      const imageUrls = [
        // Static background images from pages
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', // HomePage Hero, ContactPage Map
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop', // HomePage About Snapshot
        'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1974&auto=format&fit=crop', // HomePage Reservation CTA, ContactPage Header
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop', // AboutPage Header
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop', // OffersPage Header
        ...transformedDynamicUrls,
      ];

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
      {/* FIX: Changed to use namespaced import. */}
      <ReactRouterDOM.HashRouter>
        <ScrollToTop />
        {/* FIX: Changed to use namespaced import. */}
        <ReactRouterDOM.Routes>
          {/* Public Routes */}
          {/* FIX: Changed to use namespaced import. */}
          <ReactRouterDOM.Route path="/" element={<Layout />}>
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route index element={<HomePage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="menu" element={<MenuPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="gallery" element={<GalleryPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="offers" element={<OffersPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="reviews" element={<ReviewsPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="about" element={<AboutPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="contact" element={<ContactPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="faq" element={<FAQPage />} />
            {/* FIX: Changed to use namespaced import. */}
            <ReactRouterDOM.Route path="*" element={<NotFoundPage />} />
          </ReactRouterDOM.Route>
          
          {/* Admin Routes */}
          {/* FIX: Changed to use namespaced import. */}
          <ReactRouterDOM.Route path="/admin/login" element={<AdminLoginPage />} />
          {/* FIX: Changed to use namespaced import. */}
          <ReactRouterDOM.Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route index element={<ReactRouterDOM.Navigate to="/admin/dashboard" replace />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="dashboard" element={<AdminDashboardPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="reservations" element={<AdminReservationsPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="dish-of-the-day" element={<AdminDishOfTheDayPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="menu" element={<AdminMenuPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="chefs" element={<AdminChefsPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="offers" element={<AdminOffersPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="reviews" element={<AdminReviewsPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="gallery" element={<AdminGalleryPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="info" element={<AdminInfoPage />} />
              {/* FIX: Changed to use namespaced import. */}
              <ReactRouterDOM.Route path="faq" element={<AdminFAQPage />} />
          </ReactRouterDOM.Route>
        </ReactRouterDOM.Routes>
      </ReactRouterDOM.HashRouter>
    </>
  );
}

export default App;
