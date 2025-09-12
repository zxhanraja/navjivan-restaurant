import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';
import StarRating from '../components/StarRating';

const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useData();
  usePageTitle('Reviews');
  const [formData, setFormData] = useState({ name: '', comment: '' });
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const approvedReviews = useMemo(() => {
    const dbApproved = reviews.filter(review => review.status === 'approved');
    // Sort by date descending
    dbApproved.sort((a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime());
    return dbApproved;
  }, [reviews]);

  const { averageRating, totalReviews } = useMemo(() => {
    if (approvedReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    const total = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: parseFloat((total / approvedReviews.length).toFixed(1)),
      totalReviews: approvedReviews.length
    };
  }, [approvedReviews]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
        setSubmitStatus('error');
        setSubmitMessage("Please fill out all fields.");
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    const newReview = {
        name: formData.name,
        rating,
        comment: formData.comment,
        review_date: new Date().toISOString(),
        status: 'pending' as const,
    };
    
    const success = await addReview(newReview);

    if (success) {
        setSubmitStatus('success');
        setSubmitMessage("Thank you! Your review has been submitted for approval.");
        setFormData({ name: '', comment: '' });
        setRating(5);
        setTimeout(() => {
            setSubmitMessage('');
            setSubmitStatus(null);
        }, 5000);
    } else {
      setSubmitStatus('error');
      setSubmitMessage("An error occurred. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-coffee-light py-20 min-h-screen">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center">
            <h1 className="text-5xl font-bold text-coffee-brown font-display mb-4">
            Hear From Our Guests
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We value our customers' feedback. See what others are saying about their experience at Navjivan.
            </p>
        </AnimatedSection>
        
        {approvedReviews.length > 0 && (
            <AnimatedSection className="my-12 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto flex items-center justify-center gap-8">
                <div className="text-center">
                    <p className="text-5xl font-bold text-coffee-dark">{averageRating}</p>
                    <StarRating rating={averageRating} interactive={false} size="text-2xl" />
                    <p className="text-gray-500 mt-1">Based on {totalReviews} reviews</p>
                </div>
            </AnimatedSection>
        )}

        <div className="max-w-3xl mx-auto mt-12 space-y-8">
            {approvedReviews.length > 0 ? approvedReviews.map(review => (
                <AnimatedSection key={review.id} className="bg-white p-8 rounded-lg shadow-lg relative">
                    <div className="absolute top-4 left-4 text-8xl text-coffee-gold opacity-10 font-display">“</div>
                    <div className="relative z-10">
                        <StarRating rating={review.rating} interactive={false} />
                        <p className="text-gray-700 mt-4 text-lg italic leading-relaxed">"{review.comment}"</p>
                        <div className="flex items-center justify-between mt-6">
                           <p className="font-bold text-coffee-dark text-md">- {review.name}</p>
                           <span className="text-sm text-gray-500">{new Date(review.review_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </AnimatedSection>
            )) : (
                <AnimatedSection className="bg-white p-8 text-center rounded-lg shadow-lg">
                    <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
                </AnimatedSection>
            )}
        </div>

        <AnimatedSection className="bg-white p-8 md:p-12 rounded-lg shadow-2xl mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-coffee-dark font-display mb-6 text-center">Share Your Experience</h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-gold" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                    <textarea id="comment" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} rows={4} className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-gold" required />
                </div>
                <div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-coffee-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400 flex items-center justify-center">
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </button>
                </div>
                {submitMessage && (
                    <p className={`text-center text-sm ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{submitMessage}</p>
                )}
            </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReviewsPage;