import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { OfferItem } from '../types';
import { getTransformedImageUrl } from '../utils/imageTransformer';

const AdminOffersPage: React.FC = () => {
    const { offers, addOffer, updateOffer, deleteOffer, uploadImage } = useData();
    const [editingItem, setEditingItem] = useState<Partial<OfferItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const openModal = useCallback((item: OfferItem | null = null) => {
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 1); // Default validity: 1 month from now
        const validUntil = item?.valid_until ? item.valid_until.split('T')[0] : defaultDate.toISOString().split('T')[0];
        
        setEditingItem(item || { title: '', description: '', image_url: '', valid_until: validUntil });
        setFormError('');
        setIsModalOpen(true);
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: value });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSaving(true);
        setFormError('');

        const imageFile = (e.currentTarget.elements.namedItem('image_url') as HTMLInputElement).files?.[0];
        let finalItem = { ...editingItem };

        if (imageFile) {
            const { url: newImageUrl, error } = await uploadImage(imageFile, 'offer-images');
            if (newImageUrl) {
                finalItem.image_url = newImageUrl;
            } else {
                setFormError(error || "An unknown error occurred during image upload.");
                setIsSaving(false);
                return;
            }
        }
        
        // Ensure valid_until is in ISO format with time
        const dateValue = finalItem.valid_until?.split('T')[0];
        finalItem.valid_until = `${dateValue}T23:59:59Z`;

        if (finalItem.id) {
            await updateOffer(finalItem as OfferItem);
        } else {
            const { id, ...newItemData } = finalItem;
            await addOffer(newItemData as Omit<OfferItem, 'id'>);
        }
        setIsModalOpen(false);
        setIsSaving(false);
    };

    const handleDelete = useCallback((item: OfferItem) => {
        if(window.confirm('Are you sure you want to delete this offer? This will also delete its image permanently.')) {
            deleteOffer(item);
        }
    }, [deleteOffer]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Offer Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add New Offer</button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        <img src={getTransformedImageUrl(item.image_url, { width: 400 })} alt={item.title} className="w-full h-48 object-cover"/>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-coffee-dark">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 flex-grow">{item.description}</p>
                            <p className="text-xs text-gray-500 mt-2">Valid until: {new Date(item.valid_until).toLocaleDateString()}</p>
                            <div className="text-right space-x-4 border-t pt-3 mt-3">
                                <button onClick={() => openModal(item)} className="text-coffee-brown hover:underline font-semibold">Edit</button>
                                <button onClick={() => handleDelete(item)} className="text-red-600 hover:underline font-semibold">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingItem && (
                    <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold">{editingItem.id ? 'Edit' : 'Add'} Offer</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input name="title" value={editingItem.title || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={editingItem.description || ''} onChange={handleFormChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                            <input name="valid_until" type="date" value={editingItem.valid_until?.split('T')[0] || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input name="image_url" type="file" accept="image/*" className="mt-1 block w-full" />
                            {editingItem.image_url && <img src={getTransformedImageUrl(editingItem.image_url, { width: 300 })} alt="Current" className="w-24 h-24 mt-2 object-cover rounded"/>}
                        </div>
                        
                        {formError && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{formError}</p>}

                        <div className="flex justify-end space-x-2 pt-4">
                           <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                           <button type="submit" className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg" disabled={isSaving}>
                               {isSaving ? 'Saving...' : 'Save'}
                           </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminOffersPage;