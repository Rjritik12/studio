
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
  const [content, setContent] = useState('');
  const [type, setType] = useState<Post['type']>('note');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState(''); // Used when type is 'link'
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (newType: Post['type']) => {
    setType(newType);
    // Reset content if switching away from link type and content was a URL
    // Or reset if switching to link type to clear out previous note text
    if (newType === 'link') {
        if (content && !linkUrl) setLinkUrl(content); // preserve if it looked like a URL
        setContent(''); // Content becomes description for link type
    } else {
        // if switching from 'link' to something else, content might be description or empty
        // linkUrl will hold the actual URL.
        // For now, let's clear content if it was a description for a link.
        // Or if it was the URL itself, it's now in linkUrl.
        // Let user decide to re-type for note/question if they switch.
        if (type === 'link') setContent(''); 
    }
  };


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let postContent = content;
    if (type === 'link') {
      if (!linkUrl.trim()) {
        setIsLoading(false);
        // Basic validation, could be more robust with react-hook-form
        alert("Link URL is required for link posts."); 
        return;
      }
      postContent = linkUrl; // For link type, the main 'content' is the URL itself.
                           // The 'content' state here is used for description if needed.
                           // For now, matching PostCard logic where content is the link URL.
    } else if (!content.trim()) {
        setIsLoading(false);
        alert("Content cannot be empty.");
        return;
    }


    // Simulate API call
    setTimeout(() => {
      const postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'> = {
        content: postContent, // This will be the linkUrl if type is link
        type,
      };
      if ((type === 'image' || type === 'meme') && imageUrl) {
        postData.imageUrl = imageUrl;
      }
      // If type is 'link', the `content` field (now `postContent`) already holds the URL.
      // If we wanted a separate description for links, postData structure would need `linkDescription` field.
      // For simplicity, the PRD implies links are just the link itself.

      onPostCreate(postData);
      
      setContent('');
      setImageUrl('');
      setLinkUrl('');
      // setType('note'); // Optionally reset type
      setIsLoading(false);
    }, 500);
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
              <SelectTrigger id="post-type">
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

          {type !== 'link' && (
            <div>
              <Label htmlFor="post-content" className="text-sm font-medium">Content</Label>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'question' ? "What's your question?" :
                  "Share your thoughts, notes, or a meme description..."
                }
                rows={4}
                required={type !== 'link'} 
                className="focus:border-primary transition-colors"
              />
            </div>
          )}

          {(type === 'image' || type === 'meme') && (
            <div>
              <Label htmlFor="post-image-url" className="text-sm font-medium">Image URL (Optional for Meme/Image)</Label>
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
              <Label htmlFor="post-link-description" className="text-sm font-medium mt-2 block">Optional Description for Link</Label>
                <Textarea
                    id="post-link-description"
                    value={content} // Use content state for the description of the link
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a brief description for your link (optional)..."
                    rows={2}
                    className="focus:border-primary transition-colors mt-1"
                />
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || (type === 'link' ? !linkUrl.trim() : !content.trim())} 
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
