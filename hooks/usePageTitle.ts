import { useEffect } from 'react';

const usePageTitle = (pageName: string) => {
  const baseTitle = 'Navjivan Restaurant';
  
  useEffect(() => {
    if (pageName && pageName.toLowerCase() !== 'home') {
        document.title = `${pageName} | ${baseTitle}`;
    } else {
        // For home page or when an empty/home title is provided
        document.title = `${baseTitle} – Authentic Indian Cuisine`;
    }

    // Note: No cleanup needed as each page sets its own title on mount.
  }, [pageName]);
};

export default usePageTitle;