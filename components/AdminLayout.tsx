import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../context/DataContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { fetchData } = useData();

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : 'auto';
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  // Auto-refresh data every 10 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
        fetchData();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [fetchData]);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error);
    } else {
        navigate('/admin/login');
    }
  };
  
  const icons = {
    dashboard: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    reservations: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    dish: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
    menu: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>,
    chefs: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    offers: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
    reviews: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
    gallery: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    info: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    faq: <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  const navItems = [
    { to: "/admin/dashboard", text: "Dashboard", icon: icons.dashboard },
    { to: "/admin/reservations", text: "Reservations", icon: icons.reservations },
    { to: "/admin/dish-of-the-day", text: "Dish of the Day", icon: icons.dish },
    { to: "/admin/menu", text: "Menu Management", icon: icons.menu },
    { to: "/admin/chefs", text: "Chefs Management", icon: icons.chefs },
    { to: "/admin/offers", text: "Offer Management", icon: icons.offers },
    { to: "/admin/reviews", text: "Reviews Management", icon: icons.reviews },
    { to: "/admin/gallery", text: "Gallery Management", icon: icons.gallery },
    { to: "/admin/info", text: "Info Management", icon: icons.info },
    { to: "/admin/faq", text: "FAQ Management", icon: icons.faq },
  ];
  
  const linkClasses = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-coffee-light/70 transition-colors duration-200 hover:bg-white/10 hover:text-white";
  const activeLinkClasses = "bg-coffee-gold text-coffee-dark font-semibold";

  // Reusable sidebar content
  const SidebarContent: React.FC<{onClose: () => void, isMobile?: boolean}> = ({ onClose, isMobile }) => (
    <>
      <div className="h-16 flex items-center justify-between px-4 text-coffee-gold text-xl font-bold border-b border-coffee-gold/20 flex-shrink-0">
        <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-display tracking-wider">Admin Panel</span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="text-gray-300 p-1" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map(item => (
            <NavLink key={item.to} to={item.to} onClick={onClose} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                {item.icon}
                <span>{item.text}</span>
            </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-coffee-gold/20 flex-shrink-0">
        <Link 
          to="/" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mb-2 flex items-center justify-center gap-2 text-coffee-light/80 py-2 px-4 rounded-lg border border-coffee-gold/50 hover:bg-coffee-gold hover:text-coffee-dark transition-all duration-200"
        >
          View Main Site
          <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-coffee-light font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-60 bg-coffee-dark text-white flex-col hidden md:flex">
        <SidebarContent onClose={() => {}} isMobile={false} />
      </aside>
      
      {/* Mobile Sidebar (Overlay) */}
      <div className={`fixed inset-0 z-[90] flex md:hidden ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/60 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'} ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
        <aside className={`relative w-64 bg-coffee-dark text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent onClose={() => setSidebarOpen(false)} isMobile={true} />
        </aside>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white flex items-center justify-between px-4 shadow-md flex-shrink-0 z-10">
           <button onClick={() => setSidebarOpen(true)} className="text-coffee-dark" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="text-lg font-bold text-coffee-dark">Admin Panel</h1>
            <div className="w-6"></div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;