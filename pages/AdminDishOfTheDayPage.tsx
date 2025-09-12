import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { ChefSpecial, MenuItem } from '../types';
import { getTransformedImageUrl } from '../utils/imageTransformer';

const AdminDishOfTheDayPage: React.FC = () => {
    const { chefSpecial, updateChefSpecial, uploadImage, deleteImage, menuItems, updateMenuItem } = useData();
    const [localChefSpecial, setLocalChefSpecial] = useState<ChefSpecial>(chefSpecial);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    
    useEffect(() => {
        setLocalChefSpecial(chefSpecial);
    }, [chefSpecial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setLocalChefSpecial(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormError('');
        setSuccessMessage('');
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsSaving(true);
            const { url: newImageUrl, error } = await uploadImage(file, 'special-images');
            setIsSaving(false);
            if(newImageUrl) {
                if(localChefSpecial.image_url) {
                    await deleteImage(localChefSpecial.image_url);
                }
                setLocalChefSpecial(prev => ({ ...prev, image_url: newImageUrl }));
            } else {
                setFormError(error || "An unknown error occurred during image upload.");
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setFormError('');
        setSuccessMessage('');
        await updateChefSpecial(localChefSpecial);
        setIsSaving(false);
        setSuccessMessage("Dish of the Day updated successfully!");
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleToggleHighlight = async (item: MenuItem) => {
        setUpdatingId(item.id);
        await updateMenuItem({ ...item, is_highlighted: !item.is_highlighted });
        setUpdatingId(null);
    };

    const highlightedCount = menuItems.filter(item => item.is_highlighted).length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Featured Dishes Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-coffee-dark border-b pb-3">Dish of the Day</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name</label>
                    <input type="text" name="name" value={localChefSpecial?.name || ''} onChange={handleChange} className="w-full p-2 border rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input type="number" name="price" value={localChefSpecial?.price || 0} onChange={handleChange} className="w-full p-2 border rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={localChefSpecial?.description || ''} onChange={handleChange} className="w-full p-2 border rounded-md shadow-sm" rows={4} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-coffee-light file:text-coffee-brown hover:file:bg-coffee-gold/50" />
                    {localChefSpecial?.image_url && <img src={getTransformedImageUrl(localChefSpecial.image_url, { width: 800 })} alt="Chef Special Preview" className="w-40 h-40 object-cover rounded-md mt-4 shadow-sm"/>}
                    {formError && <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-md">{formError}</p>}
                </div>
                 <div className="pt-4">
                    <button 
                        onClick={handleSave} 
                        className="w-full bg-coffee-brown text-white font-bold py-3 px-6 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {successMessage && <p className="text-sm text-green-600 mt-2 text-center">{successMessage}</p>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-coffee-dark border-b pb-3">Homepage Culinary Highlights</h2>
                <p className="text-gray-600 pt-2">
                    Select which menu items to feature on the homepage. 
                    The first <strong>two</strong> selected items will be displayed.
                </p>

                {highlightedCount > 2 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                        <p>You have selected {highlightedCount} items, but only the first two will be shown on the homepage.</p>
                    </div>
                )}

                <ul className="divide-y divide-gray-200">
                    {menuItems.map(item => (
                        <li key={item.id} className="py-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-coffee-dark">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex items-center">
                                {updatingId === item.id ? (
                                    <div className="w-20 flex justify-center">
                                        <svg className="animate-spin h-5 w-5 text-coffee-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : (
                                    <label htmlFor={`toggle-${item.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id={`toggle-${item.id}`} 
                                                className="sr-only"
                                                checked={!!item.is_highlighted}
                                                onChange={() => handleToggleHighlight(item)}
                                            />
                                            <div className="block bg-gray-200 w-14 h-8 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${item.is_highlighted ? 'transform translate-x-6 bg-coffee-gold' : ''}`}></div>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDishOfTheDayPage;