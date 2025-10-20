import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Camera } from "lucide-react";
import imageCompression from 'browser-image-compression';

interface ImageUploadFieldProps {
  productId?: string;
  currentImageUrls?: string[];
  onImagesUploaded: (urls: string[]) => void;
  label?: string;
  multiple?: boolean;
}

export function ImageUploadField({ 
  productId, 
  currentImageUrls = [], 
  onImagesUploaded,
  label = "Product Images",
  multiple = true
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>(currentImageUrls);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      return file;
    }
  };

  const uploadImages = async (files: FileList) => {
    if (!files || files.length === 0) return;

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image. Only JPEG, PNG, or WEBP allowed.`,
          variant: "destructive",
        });
        continue;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      const totalFiles = validFiles.length;
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const currentProgress = ((i + 1) / totalFiles) * 100;
        setProgress(Math.floor(currentProgress * 0.3)); // 0-30%
        
        // Compress image
        const compressedFile = await compressImage(file);
        setProgress(Math.floor(currentProgress * 0.6)); // 30-60%
        
        // Generate unique filename
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${productId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, compressedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;
        
        setProgress(Math.floor(currentProgress * 0.9)); // 60-90%

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }
      
      setProgress(100);
      const newUrls = [...previewUrls, ...uploadedUrls];
      setPreviewUrls(newUrls);
      onImagesUploaded(newUrls);

      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadImages(files);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onImagesUploaded(newUrls);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group h-32 border rounded-lg overflow-hidden bg-muted">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {uploading ? (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading... {progress}%
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {multiple ? 'Choose Images from Gallery' : 'Choose Image from Gallery'}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {multiple ? 'Select multiple images.' : 'Select one image.'} Max 10MB each. JPEG, PNG, or WEBP. Auto-compressed.
      </p>
    </div>
  );
}
