import React from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';
import { getTransformedImageUrl } from '../utils/imageTransformer';

const AboutPage: React.FC = () => {
  const { aboutInfo, chefs } = useData();
  usePageTitle('About Us');

  const whyChooseUsDescriptions: { [key: string]: string } = {
    'Authentic Taste': 'Our chefs use time-honored recipes and traditional cooking methods to bring you the true, rich flavors of Indian cuisine.',
    'Fresh Ingredients': "We believe in quality you can taste. That's why we source the freshest local produce and finest spices for every dish.",
    'Cozy Ambiance': 'Our warm and inviting atmosphere is designed to make you feel right at home, perfect for any occasion from family dinners to quiet evenings.',
    'Great Service': 'Our friendly and attentive staff are dedicated to providing you with an exceptional dining experience from the moment you walk in.',
  };

  return (
    <div className="bg-coffee-light min-h-screen">
      <section 
        className="h-96 bg-cover bg-center flex items-center justify-center text-white relative" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center z-10 p-4 animate-[fadeIn_1.5s_ease-in-out]">
          <h1 className="text-5xl md:text-6xl font-bold font-display uppercase tracking-wider drop-shadow-lg">
            Our Story
          </h1>
          <p className="text-lg md:text-xl mt-2 font-sans text-gray-200">
            Crafting Authentic Indian Cuisine With Passion
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed">{aboutInfo.story}</p>
          </AnimatedSection>
        </div>
      </div>

      <div className="bg-white py-20">
         <div className="container mx-auto px-4">
            <AnimatedSection className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold text-coffee-dark font-display mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{aboutInfo.mission}</p>
                </div>
                 <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold text-coffee-dark font-display mb-4">Our Vision</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{aboutInfo.vision}</p>
                </div>
            </AnimatedSection>
        </div>
      </div>
      
      <div className="bg-coffee-dark text-white py-20">
        <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold font-display text-coffee-gold mb-4">Our Culinary Philosophy</h2>
                <p className="text-xl text-gray-300 leading-relaxed italic border-l-4 border-coffee-gold pl-6">
                    "{aboutInfo.culinary_philosophy}"
                </p>
            </AnimatedSection>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <AnimatedSection>
                <h2 className="text-4xl font-bold text-coffee-dark font-display mb-12 text-center">Meet Our Chefs</h2>
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {chefs.map(chef => (
                        <div key={chef.id} className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            <div className="w-40 h-40 rounded-full shadow-lg flex-shrink-0 bg-coffee-light overflow-hidden">
                                <img src={getTransformedImageUrl(chef.image_url, { width: 600 })} alt={chef.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-coffee-brown font-display">{chef.name}</h3>
                                <p className="text-md font-semibold text-coffee-gold mb-2">{chef.title}</p>
                                <p className="text-gray-600">{chef.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-4xl font-bold text-coffee-dark font-display mb-12 text-center">Why Choose Us?</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {aboutInfo.why_us.map((reason, index) => (
                  <li key={index} className="bg-white p-8 rounded-lg shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-t-4 border-coffee-gold">
                    <h3 className="text-2xl font-bold font-display text-coffee-dark mb-3">{reason}</h3>
                    {whyChooseUsDescriptions[reason] && (
                        <p className="text-gray-600 leading-relaxed">{whyChooseUsDescriptions[reason]}</p>
                    )}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;