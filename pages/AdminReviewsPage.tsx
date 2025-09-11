import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { ReviewItem } from '../types';

const AdminReviewsPage: React.FC = () => {
    const { reviews, updateReview, deleteReview } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

    const openEditModal = useCallback((review: ReviewItem) => {
        setEditingReview(review);
        setIsModalOpen(true);
    }, []);

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingReview) return;
        
        updateReview(editingReview);
        setIsModalOpen(false);
        setEditingReview(null);
    };

    const handleDelete = useCallback((id: number) => {
        if (window.confirm('Are you sure you want to permanently delete this review?')) {
            deleteReview(id);
        }
    }, [deleteReview]);
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingReview) return;
        const { name, value } = e.target;
        setEditingReview({
            ...editingReview,
            [name]: name === 'rating' ? parseInt(value) : value,
        });
    };
    
    const sortedReviews = [...reviews].sort((a,b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Reviews Management</h1>
            
            <div className="hidden md:block bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Dish</th>
                            <th className="text-left p-3">Rating</th>
                            <th className="text-left p-3">Comment</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReviews.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3 whitespace-nowrap">{new Date(item.review_date).toLocaleDateString()}</td>
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3 italic">{item.dish_name || 'N/A'}</td>
                                <td className="p-3">{item.rating}/5</td>
                                <td className="p-3 max-w-xs truncate" title={item.comment}>{item.comment}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.status === 'approved' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    <button onClick={() => openEditModal(item)} className="text-coffee-brown hover:underline mr-4">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {sortedReviews.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-bold text-coffee-dark">{item.name}</p>
                                <p className="text-sm text-gray-500">{new Date(item.review_date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {item.status}
                            </span>
                        </div>
                        <p className="text-amber-500 mb-2">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</p>
                        {item.dish_name && (
                            <p className="text-sm text-gray-500 mb-2">
                                Reviewed: <span className="font-semibold italic">{item.dish_name}</span>
                            </p>
                        )}
                        <p className="text-gray-700 italic mb-4">"{item.comment}"</p>
                        <div className="text-right space-x-4 border-t pt-3 mt-3">
                            <button onClick={() => openEditModal(item)} className="text-coffee-brown hover:underline font-semibold">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                        </div>
                    </div>
                ))}
            </div>


            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingReview && (
                    <form onSubmit={handleSave} className="p-4 space-y-4">
                        <h2 className="text-2xl font-bold">Edit Review</h2>
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input name="name" value={editingReview.name} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Dish Name</label>
                            <input name="dish_name" value={editingReview.dish_name || ''} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Rating</label>
                            <select name="rating" value={editingReview.rating} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded">
                                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Comment</label>
                            <textarea name="comment" value={editingReview.comment} onChange={handleFormChange} rows={4} className="mt-1 block w-full p-2 border rounded" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select name="status" value={editingReview.status} onChange={handleFormChange} className="mt-1 block w-full p-2 border rounded">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminReviewsPage;