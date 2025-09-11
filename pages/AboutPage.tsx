import React from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';

const AboutPage: React.FC = () => {
  const { aboutInfo, chefs } = useData();
  usePageTitle('About Us');

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
                    "We believe in honoring tradition while embracing innovation. Our kitchen is a canvas where timeless recipes are painted with a modern brush, using only the freshest, locally-sourced ingredients to create a dining experience that is both authentic and surprising."
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
                            <img src={chef.image_url} alt={chef.name} className="w-40 h-40 rounded-full object-cover shadow-lg flex-shrink-0" />
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
                  <li key={index} className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
                    <svg className="w-12 h-12 text-coffee-gold mb-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-xl font-bold text-coffee-dark">{reason}</h3>
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