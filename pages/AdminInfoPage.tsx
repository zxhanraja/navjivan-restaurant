import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { ContactInfo } from '../types';

const AdminInfoPage: React.FC = () => {
    const { contactInfo, aboutInfo, menuCategories, updateContactInfo, updateAboutInfo, addMenuCategory, deleteMenuCategory } = useData();
    const [localContactInfo, setLocalContactInfo] = useState(contactInfo);
    const [localAboutInfo, setLocalAboutInfo] = useState(aboutInfo);
    const [newCategory, setNewCategory] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // FIX: Sync local state with context state when data loads/changes
    useEffect(() => {
        setLocalContactInfo(contactInfo);
        setLocalAboutInfo(aboutInfo);
    }, [contactInfo, aboutInfo]);

    useEffect(() => {
        let timer: number;
        if (showSuccess) {
            timer = window.setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in localContactInfo.socials) {
            setLocalContactInfo(prev => ({
                ...prev,
                socials: { ...prev.socials, [name]: value }
            }));
        } else if (name === 'opening_hours') {
             const hoursArray = value.split('\n').map(line => {
                const [day, ...rest] = line.split(':');
                return { day: day.trim(), hours: rest.join(':').trim() };
            }).filter(item => item.day && item.hours);
            setLocalContactInfo(prev => ({ ...prev, opening_hours: hoursArray }));
        }
        else {
            setLocalContactInfo({ ...localContactInfo, [name]: value });
        }
    };

    const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalAboutInfo({ ...localAboutInfo, [e.target.name]: e.target.value });
    };
    
    const handleWhyUsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalAboutInfo({ ...localAboutInfo, why_us: e.target.value.split('\n') });
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !menuCategories.includes(newCategory.trim())) {
            addMenuCategory(newCategory.trim());
            setNewCategory('');
        } else if (menuCategories.includes(newCategory.trim())) {
            alert('This category already exists.');
        }
    };

    const handleDeleteCategory = (categoryToDelete: string) => {
        if (window.confirm(`Are you sure you want to delete the "${categoryToDelete}" category? This cannot be undone.`)) {
            deleteMenuCategory(categoryToDelete);
        }
    };

    const handleSave = () => {
        updateContactInfo(localContactInfo);
        updateAboutInfo(localAboutInfo);
        setShowSuccess(true);
    };
    
    const openingHoursToString = (hours: ContactInfo['opening_hours']) => {
        return hours.map(h => `${h.day}: ${h.hours}`).join('\n');
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-6">Info Management</h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-bold text-coffee-dark">Contact & Location</h2>
                     <div><label className="font-semibold">Phone</label><input type="text" name="phone" value={localContactInfo.phone} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                     <div><label className="font-semibold">Email</label><input type="email" name="email" value={localContactInfo.email} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                     <div><label className="font-semibold">WhatsApp Number (e.g., +91...)</label><input type="text" name="whatsapp" value={localContactInfo.whatsapp} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                     <div><label className="font-semibold">Address</label><textarea name="address" value={localContactInfo.address} onChange={handleContactChange} className="w-full p-2 border rounded" rows={3}/></div>
                     <div><label className="font-semibold">Google Maps URL</label><textarea name="map_url" value={localContactInfo.map_url} onChange={handleContactChange} className="w-full p-2 border rounded" rows={3}/></div>
                     <div><label className="font-semibold">Opening Hours (one day per line, e.g., "Monday: 9 am - 5 pm")</label><textarea name="opening_hours" value={openingHoursToString(localContactInfo.opening_hours)} onChange={handleContactChange} className="w-full p-2 border rounded" rows={7}/></div>
                     <h3 className="text-xl font-bold text-coffee-dark pt-4">Social Media Links</h3>
                     <div><label className="font-semibold">Facebook URL</label><input type="text" name="facebook" value={localContactInfo.socials.facebook} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                     <div><label className="font-semibold">Instagram URL</label><input type="text" name="instagram" value={localContactInfo.socials.instagram} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                     <div><label className="font-semibold">Twitter URL</label><input type="text" name="twitter" value={localContactInfo.socials.twitter} onChange={handleContactChange} className="w-full p-2 border rounded"/></div>
                </div>
                 <div className="space-y-8">
                     <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-2xl font-bold text-coffee-dark">About Page</h2>
                        <div><label className="font-semibold">Our Story</label><textarea name="story" value={localAboutInfo.story} onChange={handleAboutChange} className="w-full p-2 border rounded" rows={5}/></div>
                        <div><label className="font-semibold">Our Mission</label><textarea name="mission" value={localAboutInfo.mission} onChange={handleAboutChange} className="w-full p-2 border rounded" rows={3}/></div>
                        <div><label className="font-semibold">Our Vision</label><textarea name="vision" value={localAboutInfo.vision} onChange={handleAboutChange} className="w-full p-2 border rounded" rows={3}/></div>
                        <div><label className="font-semibold">Our Culinary Philosophy</label><textarea name="culinary_philosophy" value={localAboutInfo.culinary_philosophy || ''} onChange={handleAboutChange} className="w-full p-2 border rounded" rows={4}/></div>
                        <div><label className="font-semibold">Why Choose Us (one reason per line)</label><textarea value={localAboutInfo.why_us.join('\n')} onChange={handleWhyUsChange} className="w-full p-2 border rounded" rows={4}/></div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-2xl font-bold text-coffee-dark">Menu Categories Management</h2>
                        <div className="space-y-2">
                            {menuCategories.map(cat => (
                                <div key={cat} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span>{cat}</span>
                                    <button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <input 
                                type="text" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add new category"
                                className="w-full p-2 border rounded"
                            />
                            <button onClick={handleAddCategory} className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">Add</button>
                        </div>
                     </div>
                 </div>
            </div>
            <div className="mt-8 flex items-center space-x-4">
                <button onClick={handleSave} className="bg-coffee-brown text-white font-bold py-3 px-6 rounded-lg hover:bg-coffee-dark transition duration-300">Save All Changes</button>
                <div className={`transition-opacity duration-500 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-green-600 font-semibold">✓ Saved successfully!</span>
                </div>
            </div>
        </div>
    );
};

export default AdminInfoPage;