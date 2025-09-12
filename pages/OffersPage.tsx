import React from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';

const OffersPage: React.FC = () => {
  const { offers } = useData();
  usePageTitle('Offers');

  return (
    <div className="bg-coffee-light min-h-screen">
      <section 
        className="h-96 bg-cover bg-center flex items-center justify-center text-white relative" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="text-center z-10 p-4 animate-[fadeIn_1.5s_ease-in-out]">
          <h1 className="text-5xl md:text-6xl font-bold font-display uppercase tracking-wider text-shadow-lg">
            Deals & Delights
          </h1>
          <p className="text-lg md:text-xl mt-4 font-sans text-gray-200 text-shadow">
            Enjoy special deals and discounts on your favorite dishes. Don't miss out!
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            {offers.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-lg shadow-xl hover:shadow-2xl overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 flex flex-col border-b-4 border-transparent hover:border-coffee-gold">
                    <div className="relative h-56 overflow-hidden bg-coffee-light">
                        <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <span className="absolute top-4 left-0 bg-coffee-gold text-coffee-dark text-xs font-bold uppercase px-3 py-1 rounded-r-full">
                          Limited Time
                        </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold font-display text-coffee-dark">{offer.title}</h3>
                        <p className="mt-2 text-gray-600 flex-grow">{offer.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            Valid Until: {new Date(offer.valid_until).toLocaleDateString()}
                          </p>
                          <button className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300 text-sm">
                            Avail Now
                          </button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-center text-xl text-gray-500 mt-16">
                  No special offers available at the moment. Please check back soon!
               </p>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
};

export default OffersPage;