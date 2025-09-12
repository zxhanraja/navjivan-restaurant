export const preloadImages = (urls: string[]): Promise<void[]> => {
  const promises = urls.map(url => {
    return new Promise<void>((resolve) => {
      // Handle cases where URL might be null, empty, or invalid
      if (!url || typeof url !== 'string') {
        resolve();
        return;
      }
      const img = new Image();
      img.src = url;
      // Resolve on both load and error to prevent one broken image from blocking the entire app
      img.onload = () => resolve();
      img.onerror = () => resolve(); 
    });
  });
  return Promise.all(promises);
};
