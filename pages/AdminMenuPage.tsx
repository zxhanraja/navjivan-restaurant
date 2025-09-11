import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { MenuItem } from '../types';

const AdminMenuPage: React.FC = () => {
    const { menuItems, menuCategories, addMenuItem, updateMenuItem, deleteMenuItem, uploadImage } = useData();
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const openModal = useCallback((item: MenuItem | null = null) => {
        setEditingItem(item || { name: '', description: '', price: 0, image_url: '', category: menuCategories[0] || '' });
        setIsModalOpen(true);
    }, [menuCategories]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem({ ...editingItem, [name]: name === 'price' ? Number(value) : value });
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSaving(true);

        const imageFile = (e.currentTarget.elements.namedItem('image_url') as HTMLInputElement).files?.[0];
        let finalItem = { ...editingItem };

        if (imageFile) {
            const newImageUrl = await uploadImage(imageFile, 'menu-images');
            if (newImageUrl) {
                finalItem.image_url = newImageUrl;
            } else {
                alert('Image upload failed. Please try again.');
                setIsSaving(false);
                return;
            }
        }
        
        if (finalItem.id) {
            await updateMenuItem(finalItem as MenuItem);
        } else {
            const { id, ...newItemData } = finalItem;
            await addMenuItem(newItemData as Omit<MenuItem, 'id'>);
        }
        setIsModalOpen(false);
        setIsSaving(false);
    };

    const handleDelete = useCallback((item: MenuItem) => {
        if(window.confirm('Are you sure you want to delete this item? This will also delete its image permanently.')) {
            deleteMenuItem(item);
        }
    }, [deleteMenuItem]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Menu Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add New Item</button>
            
            <div className="hidden md:block bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Image</th>
                            <th className="text-left p-3">Name</th>
                            <th className="text-left p-3">Category</th>
                            <th className="text-left p-3">Price</th>
                            <th className="text-left p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td><img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded"/></td>
                                <td className="p-3 font-semibold">{item.name}</td>
                                <td className="p-3">{item.category}</td>
                                <td className="p-3">₹{item.price}</td>
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
                {menuItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded mb-3"/>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-coffee-dark mr-2">{item.name}</h3>
                            <p className="font-semibold text-lg text-coffee-dark flex-shrink-0">₹{item.price}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.category}</p>
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
                        <h2 className="text-2xl font-bold">{editingItem.id ? 'Edit' : 'Add'} Menu Item</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input name="name" value={editingItem.name || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={editingItem.description || ''} onChange={handleFormChange} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input name="price" type="number" value={editingItem.price || 0} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="category" value={editingItem.category || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                                {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
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

export default AdminMenuPage;