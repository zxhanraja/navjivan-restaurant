import React, { useState } from 'react';
import Modal from './Modal';
import StarRating from './StarRating';
import { useData } from '../context/DataContext';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishName: string;
}

const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose, dishName }) => {
  const { addReview } = useData();
  const [formData, setFormData] = useState({ name: '', comment: '' });
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const resetForm = () => {
    setFormData({ name: '', comment: '' });
    setRating(5);
    setIsSubmitting(false);
    setSubmitStatus(null);
    setSubmitMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      setSubmitStatus('error');
      setSubmitMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const newReview = {
        name: formData.name,
        rating,
        comment: formData.comment,
        dish_name: dishName,
        review_date: new Date().toISOString(),
        status: 'pending' as const,
      };
      await addReview(newReview);

      setSubmitStatus('success');
      setSubmitMessage("Thank you! Your review has been submitted for approval.");
      setTimeout(() => {
          handleClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-coffee-dark font-display mb-2">Leave a Review for</h2>
            <p className="text-xl font-semibold text-coffee-brown mb-6">{dishName}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="review-name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={isSubmitting}/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                    <textarea id="review-comment" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required disabled={isSubmitting}/>
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-coffee-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
                {submitMessage && (
                    <p className={`text-center text-sm ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{submitMessage}</p>
                )}
            </form>
        </div>
    </Modal>
  );
};

export default ReviewFormModal;