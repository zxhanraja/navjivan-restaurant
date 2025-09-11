import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { OfferItem } from '../types';

const AdminOffersPage: React.FC = () => {
    const { offers, addOffer, updateOffer, deleteOffer, uploadImage } = useData();
    const [editingItem, setEditingItem] = useState<Partial<OfferItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const openModal = useCallback((item: OfferItem | null = null) => {
        const editableItem = item ? { ...item, valid_until: item.valid_until.split('T')[0] } : null;
        setEditingItem(editableItem || { title: '', description: '', image_url: '', valid_until: '' });
        setIsModalOpen(true);
    }, []);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSaving(true);
        
        let finalItem: Partial<OfferItem> = { ...editingItem };
        const imageFile = (e.currentTarget.elements.namedItem('image_url') as HTMLInputElement).files?.[0];

        if (imageFile) {
            const newImageUrl = await uploadImage(imageFile, 'offer-images');
            if (newImageUrl) {
                finalItem.image_url = newImageUrl;
            } else {
                alert('Image upload failed. Please try again.');
                setIsSaving(false);
                return;
            }
        }

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
        if(window.confirm('Are you sure you want to delete this offer? This will also remove the image.')) {
            deleteOffer(item);
        }
    }, [deleteOffer]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Offer Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add New Offer</button>
            
            <div className="hidden md:block bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Image</th>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Valid Until</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3"><img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded"/></td>
                                <td className="p-3 font-semibold">{item.title}</td>
                                <td className="p-3">{new Date(item.valid_until).toLocaleDateString()}</td>
                                <td className="p-3">
                                    <button onClick={() => openModal(item)} className="text-coffee-brown hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(item)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {offers.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded mb-3"/>
                        <h3 className="font-bold text-lg text-coffee-dark">{item.title}</h3>
                        <p className="text-sm text-gray-600 my-2">{item.description}</p>
                        <p className="text-sm text-gray-500 mb-3">Valid Until: {new Date(item.valid_until).toLocaleDateString()}</p>
                        <div className="text-right space-x-4 border-t pt-3 mt-3">
                            <button onClick={() => openModal(item)} className="text-coffee-brown hover:underline font-semibold">Edit</button>
                            <button onClick={() => handleDelete(item)} className="text-red-600 hover:underline font-semibold">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingItem && (
                    <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold">{editingItem.id ? 'Edit' : 'Add'} Offer</h2>
                        <div><label className="block text-sm font-medium">Title</label><input name="title" value={editingItem.title || ''} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded"/></div>
                        <div><label className="block text-sm font-medium">Description</label><textarea name="description" value={editingItem.description || ''} onChange={handleFormChange} required rows={3} className="mt-1 block w-full p-2 border rounded" /></div>
                        <div><label className="block text-sm font-medium">Valid Until</label><input name="valid_until" type="date" value={editingItem.valid_until || ''} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded" /></div>
                        <div>
                            <label className="block text-sm font-medium">Image</label>
                            <input name="image_url" type="file" accept="image/*" className="mt-1 block w-full" />
                            {editingItem.image_url && <img src={editingItem.image_url} alt="Current" className="w-24 h-24 mt-2 object-cover rounded"/>}
                        </div>
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