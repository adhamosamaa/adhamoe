'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface ImageUploaderProps {
  name: string; // The form input name
  value?: string[];
  onChange?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUploader({ 
  name, 
  value: controlledValue, 
  onChange, 
  multiple = false, 
  maxFiles = 10 
}: ImageUploaderProps) {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createClient();
  const BUCKET_NAME = 'portfolio-media';

  const updateValue = (newUrls: string[]) => {
    if (onChange) {
      onChange(newUrls);
    } else {
      setInternalValue(newUrls);
    }
  };

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    const filesList = Array.from(files).filter((f): f is File => Boolean(f));
    const filesToUpload = multiple ? filesList.slice(0, maxFiles - value.length) : filesList.slice(0, 1);
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error, data } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        console.error(error);
      } else if (data) {
        const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
        newUrls.push(publicData.publicUrl);
      }
    }

    if (newUrls.length > 0) {
      toast.success(`Successfully uploaded ${newUrls.length} file(s)`);
      updateValue(multiple ? [...value, ...newUrls] : [newUrls[0]!]);
    }
    
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (indexToRemove: number) => {
    updateValue(value.filter((_, idx) => idx !== indexToRemove));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const showDropzone = (!multiple && value.length === 0) || (multiple && value.length < maxFiles);

  return (
    <div className="space-y-4">
      {/* Hidden inputs to bind to form action */}
      {value.map((url, idx) => (
        <input key={`${name}-${idx}`} type="hidden" name={name} value={url} />
      ))}
      
      {/* If no value and not showing dropzone (edge case), just add empty hidden input so FormData works */}
      {value.length === 0 && <input type="hidden" name={name} value="" />}

      {/* Dropzone */}
      {showDropzone && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors duration-300',
            isDragging
              ? 'border-dash-brand bg-dash-brand/5'
              : 'border-dash-line-strong bg-dash-canvas hover:border-dash-brand hover:bg-dash-surface',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          <input
            type="file"
            multiple={multiple}
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files);
            }}
            className="hidden"
          />
          <div className="grid size-10 place-items-center rounded-full bg-dash-elevated text-dash-muted transition-colors group-hover:text-dash-brand">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-dash-brand" />
            ) : (
              <UploadCloud className="size-5" strokeWidth={1.5} />
            )}
          </div>
          <p className="mt-4 text-sm font-medium text-dash-fg">
            {isUploading ? 'Uploading...' : 'Click or drag images to upload'}
          </p>
          <p className="mt-1 text-xs text-dash-subtle">
            SVG, PNG, JPG or GIF
          </p>
        </div>
      )}

      {/* Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-video overflow-hidden rounded-xl border border-dash-line bg-dash-surface shadow-dash-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="grid size-8 place-items-center rounded-lg bg-dash-danger/20 text-red-200 backdrop-blur-md transition-colors hover:bg-dash-danger/40 hover:text-white"
                  title="Remove Image"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
