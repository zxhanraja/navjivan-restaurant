import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import type { MenuItem } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import usePageTitle from '../hooks/usePageTitle';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import ReviewFormModal from '../components/ReviewFormModal';
import { getTransformedImageUrl } from '../utils/imageTransformer';

const MenuItemCard: React.FC<{ item: MenuItem; onClick: (item: MenuItem) => void }> = React.memo(({ item, onClick }) => (
  <div 
    className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col cursor-pointer group"
    onClick={() => onClick(item)}
    onKeyPress={(e) => e.key === 'Enter' && onClick(item)}
    tabIndex={0}
    role="button"
    aria-label={`View details for ${item.name}`}
  >
    <div className="w-full h-48 bg-coffee-light rounded-md mb-4 overflow-hidden">
        <img src={getTransformedImageUrl(item.image_url, { width: 800 })} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="flex justify-between items-baseline">
      <h3 className="text-xl font-bold text-coffee-brown group-hover:text-coffee-gold">{item.name}</h3>
      <p className="text-xl font-bold text-coffee-brown flex-shrink-0">₹{item.price}</p>
    </div>
    <p className="text-gray-600 mt-1 text-sm flex-grow">{item.description}</p>
  </div>
));

const MenuPage: React.FC = () => {
  const { menuItems, menuCategories } = useData();
  usePageTitle('Menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  const allCategories = useMemo(() => {
    const categoriesWithItems = new Set(menuItems.map(item => item.category));
    return ['All', ...menuCategories.filter(cat => categoriesWithItems.has(cat))];
  }, [menuItems, menuCategories]);


  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const searchMatch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const categoryMatch = activeCategory === 'All' ? true : item.category === activeCategory;
      return searchMatch && categoryMatch;
    });
  }, [menuItems, searchTerm, activeCategory]);

  const itemsGroupedByCategory = useMemo(() => {
    const grouped: { [key: string]: MenuItem[] } = {};
    for (const item of filteredItems) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }
    
    const orderedGrouped: { [key: string]: MenuItem[] } = {};
    menuCategories.forEach(cat => {
        if (grouped[cat]) {
            orderedGrouped[cat] = grouped[cat];
        }
    });

    return orderedGrouped;
  }, [filteredItems, menuCategories]);
  
  const categoriesToRender = Object.keys(itemsGroupedByCategory);

  const handleOpenReviewModal = () => {
    setReviewModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedItem(null);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedItem(null);
  }

  return (
    <>
      <div className="bg-coffee-light text-coffee-dark py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center text-coffee-brown font-display mb-12 animate-[fadeIn_1s_ease-in-out]">Our Exquisite Menu</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Search for a dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-coffee-gold"
            />
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeCategory === cat ? 'bg-coffee-brown text-white' : 'bg-gray-100 text-coffee-dark hover:bg-coffee-dark/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {categoriesToRender.length > 0 ? (
              categoriesToRender.map(category => (
                <AnimatedSection key={category}>
                  <h2 className="text-4xl font-bold text-coffee-dark font-display text-center mb-8 border-b-2 border-coffee-gold/20 pb-4">{category}</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {itemsGroupedByCategory[category].map(item => (
                      <MenuItemCard key={item.id} item={item} onClick={setSelectedItem} />
                    ))}
                  </div>
                </AnimatedSection>
              ))
            ) : (
              <AnimatedSection className="text-center py-10">
                <p className="text-xl text-gray-600">No dishes found matching your criteria. Please try a different search or filter.</p>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={!!selectedItem && !isReviewModalOpen} onClose={handleCloseDetailsModal}>
        {selectedItem && (
          <div className="p-4 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-5/12 flex-shrink-0">
                <div className="aspect-w-1 aspect-h-1 bg-coffee-light rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                    <img 
                        src={getTransformedImageUrl(selectedItem.image_url, { width: 1200 })} 
                        alt={selectedItem.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>
            
            <div className="w-full md:w-7/12 flex flex-col">
              <span className="bg-coffee-light text-coffee-brown text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-2">{selectedItem.category}</span>
              <h2 className="text-3xl font-bold font-display text-coffee-dark">{selectedItem.name}</h2>
              <div className="my-2">
                  <StarRating rating={4} interactive={false} size="text-2xl"/> 
                  <span className="text-xs text-gray-500 ml-2">(Sample rating)</span>
              </div>
              <p className="text-gray-700 mt-2 mb-4 text-base leading-relaxed flex-grow">{selectedItem.description}</p>
              <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <p className="text-4xl font-bold text-coffee-gold">₹{selectedItem.price}</p>
                 <button 
                    onClick={handleOpenReviewModal}
                    className="bg-coffee-brown text-white font-bold py-2 px-6 rounded-lg hover:bg-coffee-dark transition duration-300 w-full sm:w-auto"
                  >
                    Leave a Review
                  </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {selectedItem && <ReviewFormModal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} dishName={selectedItem.name}/>}
    </>
  );
};

export default MenuPage;