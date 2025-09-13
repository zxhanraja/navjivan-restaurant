
import React, { useState, useEffect } from 'react';
// FIX: Changed import to wildcard to bypass potential module resolution issues for react-router-dom.
import * as ReactRouterDOM from 'react-router-dom';
import { useData } from '../context/DataContext';
import useTypingEffect from '../hooks/useTypingEffect';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';
import StarRating from '../components/StarRating';
import { getTransformedImageUrl } from '../utils/imageTransformer';

type ContextType = { openReservationModal: () => void };

const HomePage: React.FC = () => {
  const { menuItems, chefSpecial, reviews, galleryImages, aboutInfo, chefs } = useData();
  usePageTitle('Home');
  // FIX: Changed to use namespaced import.
  const { openReservationModal } = ReactRouterDOM.useOutletContext<ContextType>();
  
  const specialities = menuItems.filter(item => item.is_highlighted).slice(0, 2);
  // If no specialities are set, fall back to the first 2 items on the menu.
  const culinaryHighlights = specialities.length > 0 ? specialities : menuItems.slice(0, 2);

  const typedText = useTypingEffect(['Authentic Indian Cuisine', 'A Taste of Tradition', 'Fresh, Flavorful, Fantastic'], 150, 75);
  const [offsetY, setOffsetY] = useState(0);
  
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const latestReviews = reviews.filter(r => r.status === 'approved').slice(0, 3);

  const whyUsDetails = [
    {
      title: 'Fresh Ingredients',
      description: 'We source the finest local and seasonal produce to ensure every dish is vibrant and flavorful.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: 'Authentic Recipes',
      description: 'Our chefs masterfully craft dishes using traditional recipes passed down through generations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Cozy Ambience',
      description: 'Experience a warm and inviting atmosphere perfect for families, friends, and special occasions.',
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
         </svg>
      )
    },
    {
      title: 'Exceptional Service',
      description: 'Our attentive staff is dedicated to making your dining experience memorable and enjoyable.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 18a8 8 0 0116 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 6h2" />
        </svg>
      )
    },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/fff8e1/3a2412?text=Image+Not+Available';
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="bg-coffee-light">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')`, transform: `translateY(${offsetY * 0.4}px)` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 p-4 animate-[fadeIn_2s_ease-in-out]">
          <h1 className="text-4xl md:text-6xl font-extrabold font-display uppercase tracking-wider drop-shadow-lg">
            Navjivan Restaurant
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-sans text-gray-200">
             <span className="border-r-2 border-white pr-1 animate-blinking-cursor">{typedText}</span>
          </p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <ReactRouterDOM.Link to="/menu" className="bg-coffee-gold text-coffee-dark font-bold py-3 px-8 rounded-lg hover:bg-amber-500 transition duration-300 transform hover:scale-105">Explore Our Menu</ReactRouterDOM.Link>
            <button onClick={openReservationModal} className="bg-transparent border-2 border-coffee-gold text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-gold hover:text-coffee-dark transition duration-300 transform hover:scale-105">
              Reserve a Table
            </button>
          </div>
        </div>
      </section>
      
      {/* Dish of the Day Section */}
      <AnimatedSection id="special" className="py-16 bg-coffee-light">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden md:grid md:grid-cols-2 md:items-center">
            <div className="w-full h-64 md:h-80 bg-coffee-light">
                <img 
                  src={getTransformedImageUrl(chefSpecial.image_url, { width: 1200 })} 
                  alt={chefSpecial.name} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  onError={handleImageError}
                />
            </div>
            <div className="p-6 md:p-8 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-coffee-gold mb-4">Dish of the Day</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-coffee-dark font-display">{chefSpecial.name} - ₹{chefSpecial.price}</h3>
              <p className="text-md text-gray-600 mt-4">{chefSpecial.description}</p>
              <ReactRouterDOM.Link to="/menu" className="mt-6 inline-block bg-coffee-gold text-coffee-dark font-bold py-3 px-8 rounded-lg hover:bg-amber-500 transition duration-300 transform hover:scale-105">
                See Menu
              </ReactRouterDOM.Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Why Choose Us Section */}
      <AnimatedSection id="why-us" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-display text-coffee-brown mb-10 text-center">Why Choose Navjivan?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyUsDetails.map((item, index) => (
              <div key={index} className="flex items-start text-left gap-4">
                <div className="bg-coffee-light p-4 rounded-full text-coffee-gold flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold font-display text-coffee-dark mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Meet Our Chefs Section */}
      <AnimatedSection id="chefs" className="py-20 bg-coffee-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-display text-coffee-brown mb-12">Meet Our Culinary Artists</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-12 max-w-4xl mx-auto">
            {chefs.length > 0 ? (
              chefs.slice(0, 2).map((chef) => (
                <div key={chef.id} className="flex flex-col items-center text-center group">
                  <div className="relative w-48 h-48 rounded-full bg-coffee-light overflow-hidden shadow-lg mx-auto transform group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={getTransformedImageUrl(chef.image_url, { width: 600 })}
                      alt={chef.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold text-coffee-dark font-display">{chef.name}</h3>
                    <p className="text-md font-semibold text-coffee-gold mb-2">{chef.title}</p>
                    <p className="text-gray-600 max-w-xs mx-auto text-sm">{chef.bio.substring(0, 120)}...</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 text-center text-gray-600 bg-white/50 p-8 rounded-lg">
                <p className="text-lg">Our talented chefs are working their magic in the kitchen. Full profiles coming soon!</p>
              </div>
            )}
          </div>
          <div className="mt-12">
            <ReactRouterDOM.Link to="/about" className="bg-coffee-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-dark transition duration-300">
              More About Our Team
            </ReactRouterDOM.Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Culinary Highlights Section */}
      <AnimatedSection id="specialities" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-display text-coffee-brown mb-12">Our Culinary Highlights</h2>
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-6xl mx-auto">
            {culinaryHighlights.length > 0 ? (
                culinaryHighlights.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative w-full h-80 bg-coffee-light">
                      <img 
                        src={getTransformedImageUrl(item.image_url, { width: 1200 })} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                        onError={handleImageError}
                      />
                      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full p-4">
                        <h3 className="text-3xl font-bold font-display text-white">{item.name}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-gray-600 mt-2 text-md flex-grow">{item.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-2xl font-bold text-coffee-brown">₹{item.price}</p>
                        <ReactRouterDOM.Link to="/menu" className="bg-coffee-gold text-coffee-dark font-semibold py-2 px-5 rounded-lg hover:bg-amber-500 transition duration-300">
                            View Menu
                        </ReactRouterDOM.Link>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="lg:col-span-2 text-center text-gray-600 bg-gray-50 p-8 rounded-lg">
                <p className="text-lg">Our menu is currently being updated with exciting new dishes. Please check back soon!</p>
                <ReactRouterDOM.Link to="/menu" className="mt-4 inline-block bg-coffee-gold text-coffee-dark font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition duration-300">
                  Explore Full Menu
                </ReactRouterDOM.Link>
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>
      
      {/* About Us Snapshot */}
      <AnimatedSection 
        id="about-snapshot" 
      >
        <div 
          className="py-24 bg-cover bg-center bg-fixed relative" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold font-display text-white mb-4">A Taste of Tradition</h2>
            <p className="text-lg text-gray-200 mt-4 max-w-3xl mx-auto">
              {aboutInfo.story.substring(0, 150)}...
            </p>
            <ReactRouterDOM.Link to="/about" className="mt-8 inline-block bg-coffee-gold text-coffee-dark font-bold py-3 px-8 rounded-lg hover:bg-amber-500 transition duration-300 transform hover:scale-105">
              Read Our Story
            </ReactRouterDOM.Link>
          </div>
        </div>
      </AnimatedSection>
      
       {/* What Our Guests Say Section */}
      <AnimatedSection id="testimonials" className="py-20 bg-coffee-light">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold font-display text-coffee-brown mb-4">What Our Guests Say</h2>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">Real feedback from our valued customers.</p>
              {latestReviews.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                      {latestReviews.map(review => (
                          <div key={review.id} className="bg-white p-8 rounded-lg shadow-lg text-left relative">
                              <div className="absolute top-4 left-4 text-7xl text-coffee-gold opacity-10 font-display">“</div>
                              <div className="relative z-10">
                                  <StarRating rating={review.rating} interactive={false} size="text-xl" />
                                  <p className="text-gray-600 mt-4 italic">"{review.comment}"</p>
                                  <p className="font-bold text-coffee-dark text-md mt-4">- {review.name}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
              )}
              <div className="mt-12">
                  <ReactRouterDOM.Link to="/reviews" className="bg-coffee-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-dark transition duration-300">
                      Read More Reviews
                  </ReactRouterDOM.Link>
              </div>
          </div>
      </AnimatedSection>

      {/* Reservation CTA */}
      <AnimatedSection>
        <div 
          className="py-24 bg-cover bg-center bg-fixed relative" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1974&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold font-display text-white mb-4">An Unforgettable Experience Awaits</h2>
            <p className="text-xl text-gray-200 mt-4 max-w-3xl mx-auto">
              Ready to indulge in the finest Indian cuisine? Book your table now and let us make your visit special.
            </p>
            <button 
              onClick={openReservationModal} 
              className="mt-8 inline-block bg-coffee-gold text-coffee-dark font-bold py-4 px-10 rounded-lg hover:bg-amber-500 transition duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              Reserve Your Table
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery Glimpse Section */}
      <AnimatedSection id="gallery-glimpse" className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold font-display text-coffee-brown mb-12">Glimpse of Our Ambiance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {galleryImages.slice(0, 4).map(img => (
                    <div key={img.id} className="group relative overflow-hidden rounded-lg shadow-lg w-full h-64 bg-coffee-light">
                       <img src={getTransformedImageUrl(img.src, { width: 600 })} alt={img.alt} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" loading="lazy" />
                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
                    </div>
                ))}
            </div>
             <div className="mt-12">
                <ReactRouterDOM.Link to="/gallery" className="bg-coffee-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-dark transition duration-300">
                    Explore Gallery
                </ReactRouterDOM.Link>
            </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;