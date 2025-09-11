import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import type { GalleryImage } from '../types';

const AdminGalleryPage: React.FC = () => {
    const { galleryImages, addGalleryImage, deleteGalleryImage, uploadImage } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [altText, setAltText] = useState('');
    const [category, setCategory] = useState<'Food' | 'Ambiance'>('Food');
    const [isSaving, setIsSaving] = useState(false);

    const openModal = () => {
        setNewImageFile(null);
        setAltText('');
        setCategory('Food');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newImageFile || !altText) {
            alert('Please provide an image file and alt text.');
            return;
        }
        setIsSaving(true);
        const imageUrl = await uploadImage(newImageFile, 'gallery-images');

        if (imageUrl) {
            await addGalleryImage({
                src: imageUrl,
                alt: altText,
                category: category,
            });
            setIsModalOpen(false);
        } else {
            alert('Image upload failed. Please try again.');
        }
        setIsSaving(false);
    };

    const handleDelete = useCallback((image: GalleryImage) => {
        if (window.confirm('Are you sure you want to delete this image from the gallery and storage?')) {
            deleteGalleryImage(image);
        }
    }, [deleteGalleryImage]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-coffee-dark">Gallery Management</h1>
                <button onClick={openModal} className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-coffee-dark transition duration-300">
                    Add New Image
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map(image => (
                    <div key={image.id} className="relative group bg-white p-2 rounded-lg shadow-md">
                        <img src={image.src} alt={image.alt} className="w-full h-40 object-cover rounded" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                            <button onClick={() => handleDelete(image)} className="text-white bg-red-600/80 rounded-full p-2 hover:bg-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                         <p className="text-xs text-gray-500 mt-2 truncate" title={image.alt}>
                            {image.alt}
                        </p>
                        <p className="text-xs font-semibold text-coffee-brown">
                            {image.category}
                        </p>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSave} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold">Add New Gallery Image</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image File</label>
                        <input name="imageFile" type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files ? e.target.files[0] : null)} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-coffee-light file:text-coffee-brown hover:file:bg-coffee-gold/50" />
                        {newImageFile && <img src={URL.createObjectURL(newImageFile)} alt="Preview" className="w-32 h-32 mt-2 object-cover rounded" />}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alt Text (Description)</label>
                        <input name="alt" value={altText} onChange={(e) => setAltText(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" value={category} onChange={(e) => setCategory(e.target.value as 'Food' | 'Ambiance')} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="Food">Food</option>
                            <option value="Ambiance">Ambiance</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-coffee-brown text-white font-bold py-2 px-4 rounded-lg" disabled={isSaving}>
                            {isSaving ? 'Uploading...' : 'Save Image'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminGalleryPage;