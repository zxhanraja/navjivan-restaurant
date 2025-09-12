export const preloadImagesWithProgress = (urls: string[], onProgress: (progress: number) => void): Promise<void[]> => {
  let loadedCount = 0;
  const total = urls.length;
  if (total === 0) {
    onProgress(100);
    return Promise.resolve([]);
  }

  const promises = urls.map(url => {
    return new Promise<void>((resolve) => {
      // Handle cases where URL might be null, empty, or invalid
      if (!url || typeof url !== 'string') {
        loadedCount++;
        onProgress((loadedCount / total) * 100);
        resolve();
        return;
      }
      const img = new Image();
      img.src = url;
      // Resolve on both load and error to prevent one broken image from blocking the entire app
      const onFinish = () => {
        loadedCount++;
        onProgress((loadedCount / total) * 100);
        resolve();
      };
      img.onload = onFinish;
      img.onerror = onFinish; 
    });
  });
  return Promise.all(promises);
};
