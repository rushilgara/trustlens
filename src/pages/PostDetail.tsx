import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Brain } from 'lucide-react';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommentSection from '@/components/community/CommentSection';
import { Post, useCommunity } from '@/hooks/useCommunity';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleLike, toggleSave } = useCommunity();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPost();
      if (user) {
        checkLikeStatus();
        checkSaveStatus();
      }
    }
  }, [id, user]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/community');
        return;
      }
      setPost(data as any);
      setLikesCount(data.likes_count);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsLiked(!!data);
  };

  const checkSaveStatus = async () => {
    if (!user || !id) return;
    const { data } = await supabase
      .from('post_saves')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsSaved(!!data);
  };

  const handleLike = async () => {
    if (!id) return;
    await toggleLike(id, isLiked);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = async () => {
    if (!id) return;
    await toggleSave(id, isSaved);
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  const categoryColors: Record<string, string> = {
    finance: 'bg-blue-500/10 text-blue-500',
    market_news: 'bg-green-500/10 text-green-500',
    scam_awareness: 'bg-red-500/10 text-red-500',
    personal_finance: 'bg-purple-500/10 text-purple-500',
    investment_tips: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader />

      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/community')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>

        <div className="space-y-6">
          {/* Post Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/user/${post.profiles?.username}`}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.profiles?.profile_photo_url || ''} />
                  <AvatarFallback>{post.profiles?.full_name[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  to={`/user/${post.profiles?.username}`}
                  className="font-semibold text-lg hover:underline"
                >
                  {post.profiles?.full_name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  @{post.profiles?.username} •{' '}
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={categoryColors[post.category] || 'bg-primary/10 text-primary'}
            >
              {post.category.replace('_', ' ')}
            </Badge>
          </div>

          {/* Post Content */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full rounded-lg object-cover"
            />
          )}

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, index) => (
                <span key={index} className="text-sm text-primary hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-b py-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likesCount} Likes
              </Button>

              <Button variant="ghost" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                {post.comments_count} Comments
              </Button>

              <Button variant="ghost" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="lg">
                <Brain className="w-5 h-5 mr-2" />
                Know About
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleSave}
                className={isSaved ? 'text-primary' : ''}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
