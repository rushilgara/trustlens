import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CommunityHeader from '@/components/community/CommunityHeader';
import PostCard from '@/components/community/PostCard';
import CreatePostModal from '@/components/community/CreatePostModal';
import CommentSection from '@/components/community/CommentSection';
import { Post, useCommunity } from '@/hooks/useCommunity';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useCommunity();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');

  useEffect(() => {
    // Check if user has profile, redirect to setup if not
    if (!profileLoading && user && !userProfile) {
      navigate('/profile/setup');
    }
  }, [user, userProfile, profileLoading, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [category, sortBy]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('posts').select(`
        *,
        profiles:user_id (*)
      `);

      if (category !== 'all') {
        query = query.eq('category', category as any);
      }

      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'trending') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'top') {
        query = query.order('likes_count', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts((data as any) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader />

      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            TrustLens Community
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Where finance meets trust — powered by AI</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="market_news">Market News</SelectItem>
              <SelectItem value="scam_awareness">Scam Awareness</SelectItem>
              <SelectItem value="personal_finance">Personal Finance</SelectItem>
              <SelectItem value="investment_tips">Investment Tips</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="top">Top Liked</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {user && (
            <Button onClick={() => setCreateModalOpen(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found. Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCommentClick={() => handleCommentClick(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onPostCreated={fetchPosts}
      />

      {/* Comments Modal */}
      <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          {selectedPostId && <CommentSection postId={selectedPostId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
