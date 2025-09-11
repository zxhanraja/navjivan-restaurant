import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { ChefSpecial } from '../types';

const AdminDishOfTheDayPage: React.FC = () => {
    const { chefSpecial, updateChefSpecial, uploadImage, deleteImage } = useData();
    const [localChefSpecial, setLocalChefSpecial] = useState<ChefSpecial>(chefSpecial);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        setLocalChefSpecial(chefSpecial);
    }, [chefSpecial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setLocalChefSpecial(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsSaving(true);
            const newImageUrl = await uploadImage(file, 'special-images');
            setIsSaving(false);
            if(newImageUrl) {
                // Delete the old image if it exists
                if(localChefSpecial.image_url) {
                    await deleteImage(localChefSpecial.image_url);
                }
                setLocalChefSpecial(prev => ({ ...prev, image_url: newImageUrl }));
            } else {
                alert("Image upload failed. Please try again.");
            }
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateChefSpecial(localChefSpecial);
        setIsSaving(false);
        alert("Dish of the Day updated successfully!");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Dish of the Day Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-2xl mx-auto">
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
                    {localChefSpecial?.image_url && <img src={localChefSpecial.image_url} alt="Chef Special Preview" className="w-40 h-40 object-cover rounded-md mt-4 shadow-sm"/>}
                </div>
                 <div className="pt-4">
                    <button 
                        onClick={handleSave} 
                        className="w-full bg-coffee-brown text-white font-bold py-3 px-6 rounded-lg hover:bg-coffee-dark transition duration-300 disabled:bg-gray-400"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDishOfTheDayPage;