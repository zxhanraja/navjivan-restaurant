import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AnimatedSection from '../components/AnimatedSection';
import Modal from '../components/Modal';
import usePageTitle from '../hooks/usePageTitle';

type Category = 'All' | 'Food' | 'Ambiance';

const GalleryPage: React.FC = () => {
    const { galleryImages } = useData();
    usePageTitle('Gallery');
    const [filter, setFilter] = useState<Category>('All');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const filteredImages = filter === 'All'
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    const categories: Category[] = ['All', 'Food', 'Ambiance'];

    return (
        <div className="bg-coffee-light py-12 min-h-screen">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center text-coffee-brown font-display mb-4">
                    Our Gallery
                </h1>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    A visual journey through the flavors and atmosphere of Navjivan Restaurant.
                </p>

                <AnimatedSection className="flex justify-center space-x-2 md:space-x-4 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
                                filter === category
                                    ? 'bg-coffee-brown text-white shadow-md'
                                    : 'bg-white text-coffee-dark hover:bg-coffee-brown/80 hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </AnimatedSection>

                <AnimatedSection>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredImages.map(image => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                                onClick={() => setSelectedImage(image.src)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                    <p className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        View
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>

            <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
                {selectedImage && (
                    <div className="p-2">
                        <img src={selectedImage} alt="Enlarged gallery view" className="w-full max-h-[85vh] object-contain rounded-lg" />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default GalleryPage;