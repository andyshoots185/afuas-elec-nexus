import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  productId?: string;
  onImagesUploaded: (imageUrls: string[]) => void;
  maxFiles?: number;
}

interface UploadedImage {
  id: string;
  url: string;
  file: File;
  uploading?: boolean;
}

export function ImageUpload({ productId, onImagesUploaded, maxFiles = 10 }: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: UploadedImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      uploading: true
    }));

    setImages(prev => [...prev, ...newImages]);

    try {
      const uploadPromises = newImages.map(async (image) => {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${productId || 'temp'}_${image.id}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, image.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setImages(prev => prev.map((img, index) => 
        newImages.some(newImg => newImg.id === img.id) 
          ? { ...img, uploading: false, url: uploadedUrls[newImages.findIndex(newImg => newImg.id === img.id)] }
          : img
      ));

      onImagesUploaded(uploadedUrls);
      toast.success(`${uploadedUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      // Remove failed uploads
      setImages(prev => prev.filter(img => !newImages.some(newImg => newImg.id === img.id)));
    } finally {
      setUploading(false);
    }
  }, [images.length, maxFiles, productId, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: uploading
  });

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      const urls = filtered.filter(img => !img.uploading).map(img => img.url);
      onImagesUploaded(urls);
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to select files (max {maxFiles - images.length} more)
        </p>
        <Button type="button" variant="outline" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Select Images'}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                {image.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(image.id)}
                disabled={image.uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}