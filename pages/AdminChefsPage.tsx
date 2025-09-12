import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { Chef } from '../types';

const AdminChefsPage: React.FC = () => {
    const { chefs, addChef, updateChef, deleteChef, uploadImage } = useData();
    const [editingItem, setEditingItem] = useState<Partial<Chef> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const openModal = useCallback((item: Chef | null = null) => {
        setEditingItem(item || { name: '', title: '', bio: '', image_url: '' });
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
        
        let finalItem: Partial<Chef> = { ...editingItem };
        const imageFile = (e.currentTarget.elements.namedItem('image_url') as HTMLInputElement).files?.[0];

        if (imageFile) {
            const { url: newImageUrl, error } = await uploadImage(imageFile, 'chef-images');
            if (newImageUrl) {
                finalItem.image_url = newImageUrl;
            } else {
                alert(`Image upload failed: ${error || 'Please try again.'}`);
                setIsSaving(false);
                return;
            }
        }

        if (finalItem.id) {
            await updateChef(finalItem as Chef);
        } else {
            const { id, ...newItemData } = finalItem;
            await addChef(newItemData as Omit<Chef, 'id'>);
        }
        setIsModalOpen(false);
        setIsSaving(false);
    };

    const handleDelete = useCallback((item: Chef) => {
        if(window.confirm(`Are you sure you want to delete Chef ${item.name}? This will also remove their image.`)) {
            deleteChef(item);
        }
    }, [deleteChef]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Chefs Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add New Chef</button>
            
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Image</th>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chefs.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-3"><img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-full"/></td>
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">
                                    <button onClick={() => openModal(item)} className="text-coffee-brown hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(item)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingItem && (
                    <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold">{editingItem.id ? 'Edit' : 'Add'} Chef</h2>
                        <div><label className="block text-sm font-medium">Name</label><input name="name" value={editingItem.name || ''} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded"/></div>
                        <div><label className="block text-sm font-medium">Title</label><input name="title" value={editingItem.title || ''} onChange={handleFormChange} required className="mt-1 block w-full p-2 border rounded"/></div>
                        <div><label className="block text-sm font-medium">Bio</label><textarea name="bio" value={editingItem.bio || ''} onChange={handleFormChange} required rows={4} className="mt-1 block w-full p-2 border rounded" /></div>
                        <div>
                            <label className="block text-sm font-medium">Image</label>
                            <input name="image_url" type="file" accept="image/*" className="mt-1 block w-full" />
                            {editingItem.image_url && <img src={editingItem.image_url} alt="Current" className="w-24 h-24 mt-2 object-cover rounded-full"/>}
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

export default AdminChefsPage;