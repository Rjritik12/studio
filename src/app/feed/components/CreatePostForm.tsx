
"use client";

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, LinkIcon, Loader2, StickyNote, UploadCloud, X } from 'lucide-react';
import type { Post } from '@/lib/types';
import Image from 'next/image'; // For image preview

interface CreatePostFormProps {
  onPostCreate: (postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>) => void;
}

export function CreatePostForm({ onPostCreate }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<Post['type']>('note');
  const [imageUrl, setImageUrl] = useState(''); // Will store the data URI of the uploaded image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (newType: Post['type']) => {
    setType(newType);
    if (newType !== 'link') {
        setLinkUrl('');
    }
    if (newType !== 'image' && newType !== 'meme') {
        setImageUrl('');
        setImagePreview(null);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        event.target.value = ''; // Reset file input
        setImageUrl('');
        setImagePreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl('');
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setImagePreview(null);
    // Reset the file input value if you have a ref to it
    const fileInput = document.getElementById('post-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'> & { linkUrl?: string } = {
      content: content,
      type,
    };

    if (type === 'link') {
      if (!linkUrl.trim()) {
        setIsLoading(false);
        alert("Link URL is required for link posts."); 
        return;
      }
      postData.linkUrl = linkUrl;
    } else if ((type === 'image' || type === 'meme')) {
      if (!content.trim() && !imageUrl.trim()) { // imageUrl now holds data URI
        setIsLoading(false);
        alert("For Meme/Image posts, please provide either content (description) or an uploaded image.");
        return;
      }
    } else {
       if (!content.trim()) {
        setIsLoading(false);
        alert("Content cannot be empty for this post type.");
        return;
      }
    }

    if ((type === 'image' || type === 'meme') && imageUrl.trim()) {
      postData.imageUrl = imageUrl; // Assign data URI
    }
    
    onPostCreate(postData as Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>);
    
    setContent('');
    setImageUrl('');
    setImagePreview(null);
    setLinkUrl('');
    const fileInput = document.getElementById('post-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    setIsLoading(false);
  };

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    if (type === 'link') return !linkUrl.trim();
    // For image/meme, ensure either content or an image (data URI in imageUrl) is present
    if (type === 'image' || type === 'meme') return !content.trim() && !imageUrl.trim();
    return !content.trim();
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <StickyNote className="mr-2 h-6 w-6 text-primary" /> Create New Post
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="post-type" className="text-sm font-medium">Post Type</Label>
            <Select value={type} onValueChange={(value) => handleTypeChange(value as Post['type'])}>
              <SelectTrigger id="post-type" className="focus:border-primary transition-colors">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="meme">Meme</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="post-content" className="text-sm font-medium">
              {type === 'link' ? 'Link Description (Optional)' : 
               type === 'meme' ? 'Meme Text / Description' :
               type === 'image' ? 'Image Caption / Description' :
               'Content'}
            </Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === 'question' ? "What's your question?" :
                type === 'link' ? "Add a brief description for your link (optional)..." :
                type === 'meme' ? "Enter meme text or description..." :
                type === 'image' ? "Enter image caption or description..." :
                "Share your thoughts or notes..."
              }
              rows={type === 'link' ? 2 : 4}
              required={type !== 'link' && !( (type === 'image' || type === 'meme') && imageUrl) }
              className="focus:border-primary transition-colors"
            />
          </div>

          {(type === 'image' || type === 'meme') && (
            <div>
              <Label htmlFor="post-image-upload" className="text-sm font-medium">
                Upload Image {content.trim() ? '(Optional if text/caption provided)' : '(Required if no text/caption)'}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <UploadCloud className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="post-image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  onChange={handleImageChange}
                  className="focus:border-primary transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              {imagePreview && (
                <div className="mt-3 relative w-48 h-48 border rounded-md overflow-hidden shadow">
                  <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={removeImage}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. Accepted: PNG, JPG, GIF, WEBP.</p>
            </div>
          )}
          
          {type === 'link' && (
             <div>
              <Label htmlFor="post-link-url" className="text-sm font-medium">Link URL (Required)</Label>
               <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="post-link-url"
                  type="url"
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                  required={type === 'link'}
                  className="focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitDisabled()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
