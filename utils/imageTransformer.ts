interface TransformOptions {
  width: number;
  quality?: number;
}

const PLACEHOLDER_URL = 'https://placehold.co/600x400/fff8e1/3a2412?text=Image+Not+Available';

export const getTransformedImageUrl = (url: string | null | undefined, options: TransformOptions): string => {
  if (!url || !url.includes('supabase.co')) {
    return url || PLACEHOLDER_URL;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    const objectIndex = pathParts.indexOf('object');
    if (objectIndex === -1) {
      return url; // Not a standard Supabase object URL or already transformed
    }
    
    pathParts.splice(objectIndex, 1, 'render', 'image');
    urlObj.pathname = pathParts.join('/');

    // Clear existing search params if any
    urlObj.search = '';
    
    urlObj.searchParams.set('width', String(options.width));
    urlObj.searchParams.set('quality', String(options.quality || 90)); // High quality default
    urlObj.searchParams.set('format', 'auto'); // Serve WebP/AVIF when possible
    urlObj.searchParams.set('resize', 'cover');

    return urlObj.toString();
  } catch (e) {
    console.error("Failed to transform image URL:", url, e);
    return url; // Fallback to the original URL on error
  }
};