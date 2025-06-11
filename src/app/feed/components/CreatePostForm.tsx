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
  const [imageUrl, setImageUrl] = useState(''); // For image/meme type
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const postData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'> = {
        content,
        type,
      };
      if ((type === 'image' || type === 'meme') && imageUrl) {
        postData.imageUrl = imageUrl;
      }
      onPostCreate(postData);
      setContent('');
      setImageUrl('');
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
            <Select value={type} onValueChange={(value) => setType(value as Post['type'])}>
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

          <div>
            <Label htmlFor="post-content" className="text-sm font-medium">Content</Label>
            <Textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === 'question' ? "What's your question?" :
                type === 'link' ? "Share a useful link..." :
                "Share your thoughts, notes, or a meme description..."
              }
              rows={4}
              required
              className="focus:border-primary transition-colors"
            />
          </div>

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
              <Label htmlFor="post-link-url" className="text-sm font-medium">Link URL (Required for Link type)</Label>
               <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-muted-foreground" />
                <Input
                  id="post-link-url"
                  type="url"
                  value={content} // For link type, content IS the URL. Could be separate field too.
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com/resource"
                  required
                  className="focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading || !content.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
