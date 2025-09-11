import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';
import StarRating from '../components/StarRating';

const staticReviews = [
  { id: 101, name: 'Rohan Sharma', rating: 5, comment: 'Absolutely authentic flavors! The Butter Chicken was the best I have ever had. Highly recommended.', review_date: '2024-05-20T10:00:00Z', status: 'approved' as const },
  { id: 102, name: 'Priya Patel', rating: 4, comment: 'Great ambiance and friendly staff. The Paneer Tikka was delicious, though the service was a bit slow during peak hours.', review_date: '2024-05-19T18:30:00Z', status: 'approved' as const },
  { id: 103, name: 'Amit Singh', rating: 5, comment: 'A hidden gem! From starters to dessert, every dish was a masterpiece. The chef really knows his craft. Will be back soon!', review_date: '2024-05-18T19:45:00Z', status: 'approved' as const },
  { id: 104, name: 'Sneha Verma', rating: 5, comment: 'Came here for a family dinner and was not disappointed. The food was delightful and the atmosphere was perfect. Kids loved the Mango Lassi.', review_date: '2024-05-17T20:00:00Z', status: 'approved' as const },
  { id: 105, name: 'Vikram Mehta', rating: 4, comment: 'The Lamb Rogan Josh was rich and flavorful. A great place for anyone craving genuine Indian food. The naan was so soft!', review_date: '2024-05-16T13:00:00Z', status: 'approved' as const },
  { id: 106, name: 'Anjali Desai', rating: 3, comment: 'The food was decent, but I found it a bit too spicy for my taste, even after requesting mild. The ambiance is lovely though.', review_date: '2024-05-15T21:00:00Z', status: 'approved' as const },
  { id: 107, name: 'Rajesh Kumar', rating: 5, comment: 'Exceptional service and mouth-watering food. The biryani was fragrant and cooked to perfection. A must-visit restaurant!', review_date: '2024-05-14T19:00:00Z', status: 'approved' as const },
  { id: 108, name: 'Natasha Rao', rating: 5, comment: 'Celebrated my birthday here and it was a wonderful experience. The staff went out of their way to make it special. Thank you, Navjivan!', review_date: '2024-05-12T20:30:00Z', status: 'approved' as const },
  { id: 109, name: 'Sandeep Reddy', rating: 4, comment: 'Good food, good prices. Their lunch thali is value for money. A regular spot for our office lunches.', review_date: '2024-05-10T13:30:00Z', status: 'approved' as const },
  { id: 110, name: 'Kavita Iyer', rating: 5, comment: 'The vegetarian selection is fantastic. I tried the Dal Makhani and it was creamy and delicious. Felt like a home-cooked meal.', review_date: '2024-05-09T18:00:00Z', status: 'approved' as const },
  { id: 111, name: 'Arjun Nair', rating: 4, comment: 'Their Tandoori platter is a must-try. The kebabs were juicy and well-marinated. Will come again to try more dishes.', review_date: '2024-05-08T22:00:00Z', status: 'approved' as const },
  { id: 112, name: 'Meera Krishnan', rating: 5, comment: 'I ordered takeout and the packaging was excellent. The food arrived hot and fresh. The taste was just as good as dining in.', review_date: '2024-05-07T19:15:00Z', status: 'approved' as const },
  { id: 113, name: 'Imran Khan', rating: 5, comment: 'Finally found a place that makes authentic Hyderabadi Biryani. The flavors were spot on. 10/10 would recommend.', review_date: '2024-05-05T14:00:00Z', status: 'approved' as const },
  { id: 114, name: 'Deepika Joshi', rating: 4, comment: 'The decor is beautiful and gives a very royal Indian vibe. A great place for a date night. The food was good too!', review_date: '2024-05-04T20:00:00Z', status: 'approved' as const },
  { id: 115, name: 'Harish Gupta', rating: 3, comment: 'A bit overpriced for the portion sizes, in my opinion. The taste was good, but I expected more for the price.', review_date: '2024-05-02T19:30:00Z', status: 'approved' as const },
  { id: 116, name: 'Sunita Chauhan', rating: 5, comment: 'The Gulab Jamun was the perfect end to a delicious meal. Soft, sweet, and served warm. Simply divine!', review_date: '2024-05-01T21:45:00Z', status: 'approved' as const },
  { id: 117, name: 'Nikhil Trivedi', rating: 5, comment: 'Clean, hygienic, and follows all safety protocols. Felt very safe dining here with my family. The food, as always, was excellent.', review_date: '2024-04-29T18:50:00Z', status: 'approved' as const },
  { id: 118, name: 'Pooja Bhatt', rating: 4, comment: 'I love their collection of chutneys! They really complement the dishes. The Malai Kofta was creamy and had a great texture.', review_date: '2024-04-28T13:10:00Z', status: 'approved' as const },
  { id: 119, name: 'Alok Nath', rating: 5, comment: 'A truly five-star experience from start to finish. The manager was very courteous and checked on us multiple times. Impeccable service.', review_date: '2024-04-25T20:15:00Z', status: 'approved' as const },
  { id: 120, name: 'Ritu Agarwal', rating: 5, comment: 'This is my go-to place for Indian food. Consistent quality and taste every single time. The Samosas are a must-try starter!', review_date: '2024-04-22T19:00:00Z', status: 'approved' as const },
];


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
    const allApproved = [...staticReviews, ...dbApproved];
    // Sort by date descending
    allApproved.sort((a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime());
    return allApproved;
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