/**
 * Image optimization utilities for better performance
 */

export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return '/placeholder.svg';
  
  // If it's a Supabase storage URL, we can add query params for optimization
  if (url.includes('supabase')) {
    const urlObj = new URL(url);
    if (width) {
      urlObj.searchParams.set('width', width.toString());
      urlObj.searchParams.set('quality', '80');
    }
    return urlObj.toString();
  }
  
  return url;
}

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(preloadImage));
}
