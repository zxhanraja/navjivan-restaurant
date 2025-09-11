import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';

const ContactPage: React.FC = () => {
  const { contactInfo } = useData();
  usePageTitle('Contact Us');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [showMap, setShowMap] = useState(false);
  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setSubmitMessage('');
      setSubmitStatus(null);
      
      const jsonFormData = {
          ...formData,
          access_key: "2a3e3b3e-c365-4dbb-b8a9-386ed001d25f", // User's API key
          subject: `New Contact Message from ${formData.name}`,
          from_name: "Navjivan Restaurant Website",
      };
      
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(jsonFormData),
        });

        const result = await response.json();

        if (result.success) {
            setSubmitMessage("Thank you! Your message has been sent successfully.");
            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => {
                setSubmitMessage('');
                setSubmitStatus(null);
            }, 5000);
        } else {
            console.error("Web3Forms Error:", result.message);
            setSubmitMessage(result.message || "An error occurred. Please try again later.");
            setSubmitStatus('error');
        }
      } catch (error) {
        console.error("Submission Error:", error);
        setSubmitMessage("An error occurred. Please try again later.");
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-4">
      <div className="flex-shrink-0 text-coffee-gold w-10 h-10">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-coffee-dark font-display">{title}</h3>
        {children}
      </div>
    </div>
  );
  
  const inputClass = (field: keyof typeof errors) =>
    `mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-gold/80 focus:border-coffee-gold ${errors[field] ? 'border-red-500 ring-red-500' : 'border-gray-300'}`;

  return (
    <div className="bg-coffee-light min-h-screen">
       <section 
        className="h-80 bg-cover bg-center flex items-center justify-center text-white relative" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center z-10 p-4 animate-[fadeIn_1.5s_ease-in-out]">
          <h1 className="text-5xl md:text-6xl font-bold font-display uppercase tracking-wider drop-shadow-lg">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl mt-2 font-sans text-gray-200">
            We're here to help and answer any question you might have.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Info Cards */}
          <div className="space-y-8">
            <InfoCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
              title="Visit Us"
            >
              <p className="text-gray-600 mt-1">{contactInfo.address}</p>
              <a href={contactInfo.map_url} target="_blank" rel="noopener noreferrer" className="text-coffee-brown font-semibold hover:underline mt-2 inline-block">Get Directions</a>
            </InfoCard>

            <InfoCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
              title="Contact Us"
            >
              <a href={`tel:${contactInfo.phone}`} className="text-gray-600 hover:text-coffee-brown block mt-1 transition-colors">Phone: {contactInfo.phone}</a>
              <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-coffee-brown block mt-1 transition-colors">Email: {contactInfo.email}</a>
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-coffee-brown block mt-1 transition-colors">WhatsApp: {contactInfo.whatsapp}</a>
            </InfoCard>
            
            <InfoCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Opening Hours"
            >
              <ul className="space-y-1 text-gray-600 mt-2">
                  {contactInfo.opening_hours.map(item => (
                      <li key={item.day} className={`flex justify-between w-full pr-2 ${item.day === today ? 'font-bold text-coffee-gold' : ''}`}>
                          <span className="mr-4">{item.day}</span>
                          <span>{item.hours}</span>
                      </li>
                  ))}
              </ul>
            </InfoCard>
          </div>
          {/* Right Column: Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-coffee-dark font-display mb-6">Send a Message</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="John Doe" />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
               <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="you@example.com" />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
               <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea id="message" rows={5} value={formData.message} onChange={handleChange} className={inputClass('message')} placeholder="Let us know how we can help..."></textarea>
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-coffee-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400 flex items-center justify-center transform hover:scale-105">
                  {isSubmitting ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                      </>
                  ) : 'Submit Message'}
                </button>
              </div>
              {submitMessage && (
                <p className={`text-center mt-4 text-sm ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {submitMessage}
                </p>
              )}
            </form>
          </div>
        </AnimatedSection>
        
        <AnimatedSection className="mt-16">
            <h2 className="text-4xl font-bold text-center text-coffee-brown font-display mb-8">Find Us Here</h2>
            <div className="rounded-lg shadow-lg overflow-hidden">
              {showMap ? (
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.970172513364!2d73.98184067520516!3d19.06509988213693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc576000000001%3A0x3f3503f19f187311!2sNavjivan%20Restaurant!5e0!3m2!1sen!2sin!4v1717616198886!5m2!1sen!2sin" width="100%" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              ) : (
                <div 
                  className="w-full h-[450px] bg-cover bg-center flex items-center justify-center cursor-pointer relative"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')"}}
                  onClick={() => setShowMap(true)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setShowMap(true)}
                >
                   <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>
                  <div className="text-center text-white z-10 p-6 bg-black/30 rounded-lg">
                      <svg className="w-16 h-16 mx-auto mb-4 text-coffee-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <h3 className="text-2xl font-bold font-display">Click to Load Map</h3>
                      <p className="text-coffee-light mt-2">Our location will be displayed here.</p>
                  </div>
                </div>
              )}
            </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ContactPage;