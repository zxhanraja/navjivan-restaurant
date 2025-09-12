import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { MenuItem } from '../types';

const AdminMenuPage: React.FC = () => {
    const { menuItems, menuCategories, addMenuItem, updateMenuItem, deleteMenuItem, uploadImage } = useData();
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');

    const openModal = useCallback((item: MenuItem | null = null) => {
        setEditingItem(item || { name: '', description: '', price: 0, image_url: '', category: menuCategories[0] || '', is_highlighted: false });
        setFormError('');
        setIsModalOpen(true);
    }, [menuCategories]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        
        if (e.target.type === 'checkbox') {
            setEditingItem({ ...editingItem, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setEditingItem({ ...editingItem, [name]: name === 'price' ? Number(value) : value });
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingItem) return;
        setIsSaving(true);
        setFormError('');

        const imageFile = (e.currentTarget.elements.namedItem('image_url') as HTMLInputElement).files?.[0];
        let finalItem = { ...editingItem };

        if (imageFile) {
            const { url: newImageUrl, error } = await uploadImage(imageFile, 'menu-images');
            if (newImageUrl) {
                finalItem.image_url = newImageUrl;
            } else {
                setFormError(error || "An unknown error occurred during image upload.");
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
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://placehold.co/150x150/fff8e1/3a2412?text=No+Image';
        e.currentTarget.onerror = null; // Prevent infinite loop if placeholder is also broken
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Menu Management</h1>
            <button onClick={() => openModal()} className="mb-6 bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add New Item</button>
            
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3 text-right">Price</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50 align-middle">
                                <td className="px-6 py-4">
                                    <img 
                                        src={item.image_url} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded"
                                        onError={handleImageError}
                                    />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {item.is_highlighted && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><title>Highlighted on Homepage</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{item.category}</td>
                                <td className="px-6 py-4 text-right font-medium">₹{item.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openModal(item)} className="font-medium text-coffee-brown hover:underline mr-4">Edit</button>
                                    <button onClick={() => handleDelete(item)} className="font-medium text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4">
                {menuItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-40 object-cover rounded mb-3"
                            onError={handleImageError}
                        />
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold text-lg text-coffee-dark mr-2 flex items-center gap-2">
                                {/* FIX: Replaced invalid 'title' attribute on SVG with a <title> element for accessibility. */}
                                {item.is_highlighted && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><title>Highlighted on Homepage</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                                {item.name}
                            </h3>
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
                         <div>
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <input 
                                    name="is_highlighted" 
                                    type="checkbox" 
                                    checked={!!editingItem.is_highlighted} 
                                    onChange={handleFormChange}
                                    className="rounded border-gray-300 text-coffee-brown focus:ring-coffee-gold"
                                />
                                <span>Highlight on Homepage</span>
                            </label>
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

export default AdminMenuPage;