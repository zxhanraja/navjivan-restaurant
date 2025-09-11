import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import { Layout } from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';

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
import AdminOffersPage from './pages/AdminOffersPage';
import AdminInfoPage from './pages/AdminInfoPage';
import AdminFAQPage from './pages/AdminFAQPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminGalleryPage from './pages/AdminGalleryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const { isDataLoaded } = useData();

  useEffect(() => {
    const handleLoad = () => setIsSiteLoaded(true);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  const isEverythingLoaded = isSiteLoaded && isDataLoaded;

  useEffect(() => {
    if (isEverythingLoaded) {
      const fadeTimer = setTimeout(() => {
        setIsPreloaderVisible(false);
      }, 0); // Changed from 500 to 0 for instant transition
      return () => clearTimeout(fadeTimer);
    }
  }, [isEverythingLoaded]);

  return (
    <>
      {isPreloaderVisible && <Preloader isLoaded={isEverythingLoaded} />}
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