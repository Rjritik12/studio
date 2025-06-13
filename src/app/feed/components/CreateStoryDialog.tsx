
"use client";

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreate: (imageDataUri: string) => void;
  currentUserName: string; 
}

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function CreateStoryDialog({ isOpen, onClose, onStoryCreate, currentUserName }: CreateStoryDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Image is too large. Max size: ${MAX_FILE_SIZE_MB}MB.`);
        setImagePreview(null);
        setImageDataUri(null);
        event.target.value = ''; 
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError('Invalid file type. Please select a JPG, PNG, WEBP, or GIF image.');
        setImagePreview(null);
        setImageDataUri(null);
        event.target.value = ''; 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageDataUri(null);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageDataUri(null);
    setError(null);
    const fileInput = document.getElementById('story-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri) {
      setError("Please select an image for your story.");
      return;
    }
    setError(null);
    setIsLoading(true);
    // Simulate upload/processing delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    onStoryCreate(imageDataUri);
    setIsLoading(false);
    toast({ title: "Story Posted!", description: "Your story has been added (locally for this session)." });
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    removeImage(); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline flex items-center">
            <UploadCloud className="mr-2 h-6 w-6 text-primary" /> Add to {currentUserName}'s Story
          </DialogTitle>
          <DialogDescription>
            Upload an image for your story. Max {MAX_FILE_SIZE_MB}MB. Accepted: JPG, PNG, WEBP, GIF.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="story-image-upload" className="text-sm font-medium sr-only">Upload Image</Label>
            <Input
              id="story-image-upload"
              type="file"
              accept="image/jpeg, image/png, image/webp, image/gif"
              onChange={handleImageChange}
              className="focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          {imagePreview && (
            <div className="mt-3 relative w-full aspect-[9/16] max-h-[400px] border rounded-md overflow-hidden shadow bg-muted/50 flex items-center justify-center">
              <Image src={imagePreview} alt="Story preview" layout="fill" objectFit="contain" data-ai-hint="story preview" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 z-10"
                onClick={removeImage}
                type="button"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
           {!imagePreview && !error && (
            <div className="mt-3 w-full aspect-[9/16] max-h-[400px] border-2 border-dashed border-muted-foreground/30 rounded-md flex flex-col items-center justify-center text-muted-foreground">
              <UploadCloud className="h-12 w-12 mb-2" />
              <p className="text-sm">Image preview will appear here</p>
            </div>
           )}
        </div>

        <DialogFooter className="sm:justify-between gap-2 flex-col sm:flex-row">
           <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isLoading} className="w-full sm:w-auto">
                Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={!imageDataUri || isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Story
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

