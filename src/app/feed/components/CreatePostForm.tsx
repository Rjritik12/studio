
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, LinkIcon, Loader2, StickyNote } from 'lucide-react';
import type { Post } from '@/lib/types';

interface CreatePostFormProps {
  onPostCreate: (postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>) => void;
}

export function CreatePostForm({ onPostCreate }: CreatePostFormProps) {
  const [content, setContent] = useState(''); // For notes, questions, meme text, link descriptions
  const [type, setType] = useState<Post['type']>('note');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState(''); // Dedicated for link URLs
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (newType: Post['type']) => {
    setType(newType);
    // Reset specific fields when type changes to avoid confusion
    if (newType !== 'link') {
        setLinkUrl(''); // Clear link URL if not a link post
    }
    if (newType !== 'image' && newType !== 'meme') {
        setImageUrl(''); // Clear image URL if not an image/meme post
    }
    // Content might be preserved or cleared based on user's intent, for now, let them manage it.
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'> & { linkUrl?: string } = {
      content: content, // This is the description for links, or main content for others
      type,
    };

    if (type === 'link') {
      if (!linkUrl.trim()) {
        setIsLoading(false);
        alert("Link URL is required for link posts."); 
        return;
      }
      postData.linkUrl = linkUrl;
      // The 'content' state (which is postData.content here) holds the optional description for the link.
    } else if ((type === 'image' || type === 'meme')) {
      if (!content.trim() && !imageUrl.trim()) {
        setIsLoading(false);
        alert("For Meme/Image posts, please provide either content (description) or an Image URL.");
        return;
      }
    } else { // For 'note', 'question'
       if (!content.trim()) {
        setIsLoading(false);
        alert("Content cannot be empty for this post type.");
        return;
      }
    }

    if ((type === 'image' || type === 'meme') && imageUrl.trim()) {
      postData.imageUrl = imageUrl.trim();
    }
    
    onPostCreate(postData as Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>);
    
    setContent('');
    setImageUrl('');
    setLinkUrl('');
    // setType('note'); // Optionally reset type
    setIsLoading(false);
  };

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    if (type === 'link') return !linkUrl.trim();
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
          
          {/* Content Textarea: Used for notes, questions, meme text, link descriptions */}
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
              required={type !== 'link' && type !== 'image' && type !== 'meme'}
              className="focus:border-primary transition-colors"
            />
          </div>

          {/* Image URL Input: For 'image' and 'meme' types */}
          {(type === 'image' || type === 'meme') && (
            <div>
              <Label htmlFor="post-image-url" className="text-sm font-medium">Image URL {type === 'meme' && content.trim() ? '(Optional if text provided)' : type === 'image' && content.trim() ? '(Optional if caption provided)' : '(Required if no text/caption)'}</Label>
              <div className="flex items-center gap-2">
                 <ImagePlus className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="post-image-url"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}
          
          {/* Link URL Input: For 'link' type */}
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
