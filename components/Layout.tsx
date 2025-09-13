
import React, { useState, useEffect } from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../context/DataContext';
import ReservationModal from './ReservationModal';
import AIChefModal from './AIChefModal';
import AIChefButton from './AIChefButton';
import BackToTopButton from './BackToTopButton';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Menu', path: '/menu' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Offers', path: '/offers' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'FAQ', path: '/faq' },
];

const Navbar: React.FC<{ onReserveClick: () => void; isScrolled: boolean }> = ({ onReserveClick, isScrolled }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  const linkClasses = "text-coffee-light hover:text-coffee-gold transition duration-300 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "text-coffee-gold bg-black/30";

  return (
    <header>
      <nav className={`fixed w-full z-20 top-0 transition-all duration-300 ${isScrolled ? 'h-16 bg-coffee-brown/80 backdrop-blur-xl shadow-lg border-b border-white/20' : 'h-20 bg-coffee-brown'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex-shrink-0">
              <ReactRouterDOM.NavLink to="/" className="text-coffee-gold font-display text-xl font-bold flex items-center gap-2">
                 <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                    <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                    <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                <span className="text-coffee-gold font-display text-xl font-bold tracking-wider hidden sm:inline">NAVJIVAN RESTAURANT</span>
              </ReactRouterDOM.NavLink>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <ReactRouterDOM.NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                >
                  {item.name}
                </ReactRouterDOM.NavLink>
              ))}
              <button
                onClick={onReserveClick}
                className="bg-coffee-gold text-coffee-dark font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition duration-300 transform hover:scale-105 shadow-sm"
              >
                Reserve a Table
              </button>
            </div>
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-coffee-light hover:text-white hover:bg-black/30 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="fixed top-0 right-0 h-full w-64 bg-coffee-dark shadow-lg p-5 z-50">
           <div className="flex items-center justify-between mb-8">
             <ReactRouterDOM.NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                    <circle cx="16" cy="16" r="16" fill="#D4AF37"/>
                    <path d="M10 22V10L22 22V10" stroke="#3A2412" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </ReactRouterDOM.NavLink>
             <button
                onClick={() => setMobileMenuOpen(false)}
                type="button"
                className="p-1 rounded-md text-coffee-light hover:text-white hover:bg-black/30 focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
           </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <ReactRouterDOM.NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${linkClasses} ${isActive ? activeLinkClasses : ''}`}
                  >
                    {item.name}
                  </ReactRouterDOM.NavLink>
                ))}
                <button
                  onClick={() => {
                    onReserveClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left mt-4 px-3 py-3 rounded-md text-base font-medium bg-coffee-gold text-coffee-dark"
                >
                  Reserve a Table
                </button>
            </nav>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  const { contactInfo } = useData();

  return (
    <footer className="bg-coffee-dark text-coffee-light border-t-4 border-coffee-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-400 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Navjivan Restaurant. All Rights Reserved. | <ReactRouterDOM.Link to="/admin" className="hover:text-coffee-gold">Admin</ReactRouterDOM.Link>
            </p>
            <div className="flex space-x-4">
                <a href={contactInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coffee-gold" aria-label="Visit our Facebook page"><span className="sr-only">Facebook</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
                <a href={contactInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coffee-gold" aria-label="Visit our Instagram page"><span className="sr-only">Instagram</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg></a>
                <a href={contactInfo.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coffee-gold" aria-label="Visit our Twitter page"><span className="sr-only">Twitter</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC = () => {
  const [isReservationModalOpen, setReservationModalOpen] = useState(false);
  const [isAIChefModalOpen, setAIChefModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onReserveClick={() => setReservationModalOpen(true)} isScrolled={isScrolled} />
      <main className={`flex-grow ${isScrolled ? 'pt-16' : 'pt-20'} transition-all duration-300`}>
        <ReactRouterDOM.Outlet context={{ openReservationModal: () => setReservationModalOpen(true) }}/>
      </main>
      <Footer />
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-center gap-3">
        <BackToTopButton />
        <AIChefButton onClick={() => setAIChefModalOpen(true)} />
      </div>
      <AIChefModal 
        isOpen={isAIChefModalOpen}
        onClose={() => setAIChefModalOpen(false)}
      />
    </div>
  );
};