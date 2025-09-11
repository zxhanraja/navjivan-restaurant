import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useData } from '../context/DataContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { addReservation } = useData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isOpen) {
        // Reset form on open
        setStatus('idle');
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setFormData(prev => ({
            ...prev,
            name: '',
            phone: '',
            date: `${yyyy}-${mm}-${dd}`,
            time: '19:00',
            guests: '2',
        }));
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    const reservationData = {
      name: formData.name,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests),
    };

    const success = await addReservation(reservationData);
    
    if (success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate());

  const renderContent = () => {
    switch(status) {
      case 'success':
        return (
          <div className="text-center p-8">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-coffee-dark mt-4">Thank You!</h3>
            <p className="text-gray-600 mt-2">Your reservation request for {formData.guests} guest{parseInt(formData.guests) > 1 ? 's' : ''} on {new Date(formData.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} has been received. You will be notified once it's confirmed. We look forward to seeing you!</p>
            <button onClick={onClose} className="mt-6 bg-coffee-brown text-white font-bold py-2 px-6 rounded-lg hover:bg-coffee-dark transition duration-300">
                Close
            </button>
          </div>
        );
      case 'error':
        return (
             <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-coffee-dark mt-4">Oops!</h3>
                <p className="text-gray-600 mt-2">Something went wrong. Please try submitting your reservation again.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 bg-coffee-brown text-white font-bold py-2 px-6 rounded-lg hover:bg-coffee-dark transition duration-300">
                    Try Again
                </button>
            </div>
        );
      case 'idle':
      case 'submitting':
      default:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-coffee-dark font-display mb-6 text-center">Book Your Table</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={status === 'submitting'} />
                 </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={status === 'submitting'}/>
                 </div>
              </div>
               <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" min={minDate.toISOString().split('T')[0]} value={formData.date} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={status === 'submitting'}/>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={status === 'submitting'}/>
                  </div>
               </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
                <select id="guests" value={formData.guests} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={status === 'submitting'}>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Person{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4">
                 <button type="submit" className="w-full bg-coffee-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400 flex items-center justify-center" disabled={status === 'submitting'}>
                    {status === 'submitting' ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Booking...
                        </>
                    ) : (
                        'Confirm Reservation'
                    )}
                 </button>
              </div>
            </form>
          </>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        {renderContent()}
      </div>
    </Modal>
  );
};

export default ReservationModal;