import { CreatePostForm } from './components/CreatePostForm';
import { PostCard } from './components/PostCard';
import type { Post } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, FilterIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for posts - in a real app, this would come from a database
const mockPosts: Post[] = [
  {
    id: '1',
    userName: 'Student123',
    userAvatar: 'https://placehold.co/40x40.png?text=S1',
    content: 'Just finished my notes on Quantum Physics! Anyone want to discuss entanglement? 🤯 #physics #studygram',
    type: 'note',
    likes: 15,
    commentsCount: 3,
    createdAt: Date.now() - 3600000 * 2, // 2 hours ago
    expiresAt: Date.now() + 3600000 * 46, // Expires in 46 hours
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    userName: 'JEEAspirant',
    userAvatar: 'https://placehold.co/40x40.png?text=JA',
    content: 'Stuck on this calculus problem for JEE Advanced. Any hints? 🙏 #jee #maths #doubt',
    type: 'question',
    likes: 8,
    commentsCount: 5,
    createdAt: Date.now() - 3600000 * 10, // 10 hours ago
    expiresAt: Date.now() + 3600000 * 38, // Expires in 38 hours
  },
  {
    id: '3',
    userName: 'BioGeek',
    userAvatar: 'https://placehold.co/40x40.png?text=BG',
    content: 'Found an amazing PDF on Cell Biology for NEET. Link in bio! (Figuratively, of course, since there is no bio here) #neet #biology #studymaterial',
    type: 'link',
    likes: 22,
    commentsCount: 1,
    createdAt: Date.now() - 3600000 * 24, // 24 hours ago
    expiresAt: Date.now() + 3600000 * 24, // Expires in 24 hours
  },
];


export default function FeedPage() {
  // In a real app, posts would be fetched and managed with state
  // const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handlePostCreate = (newPostData: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'createdAt' | 'expiresAt' | 'userAvatar' | 'userName'>) => {
    // Mock adding a post
    const newPost: Post = {
      ...newPostData,
      id: String(Date.now()),
      userName: 'CurrentUser', // Replace with actual user
      userAvatar: 'https://placehold.co/40x40.png?text=CU',
      likes: 0,
      commentsCount: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * 48, // Expires in 48 hours
    };
    // setPosts(prevPosts => [newPost, ...prevPosts]);
    console.log("New post created (mock):", newPost);
    alert("New post created (mock). Check console.");
  };


  return (
    <div className="container mx-auto py-8 px-2 md:px-4 lg:px-6">
      <header className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-3">Community Feed</h1>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto">
          Share notes, ask questions, and connect with fellow learners. Posts vanish after 48 hours!
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-10">
        <CreatePostForm onPostCreate={handlePostCreate} />
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-10" />
          </div>
          <Select defaultValue="latest">
            <SelectTrigger className="w-full sm:w-[180px]">
              <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {mockPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        {mockPosts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-muted-foreground">No posts yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
