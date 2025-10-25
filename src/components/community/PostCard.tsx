import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark, Brain } from 'lucide-react';
import { Post, useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onCommentClick: () => void;
}

export default function PostCard({ post, onCommentClick }: PostCardProps) {
  const { user } = useAuth();
  const { toggleLike, toggleSave } = useCommunity();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
      checkSaveStatus();
    }
  }, [user, post.id]);

  const checkLikeStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsLiked(!!data);
  };

  const checkSaveStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('post_saves')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsSaved(!!data);
  };

  const handleLike = async () => {
    await toggleLike(post.id, isLiked);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = async () => {
    await toggleSave(post.id, isSaved);
    setIsSaved(!isSaved);
  };

  const categoryColors: Record<string, string> = {
    finance: 'bg-blue-500/10 text-blue-500',
    market_news: 'bg-green-500/10 text-green-500',
    scam_awareness: 'bg-red-500/10 text-red-500',
    personal_finance: 'bg-purple-500/10 text-purple-500',
    investment_tips: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/user/${post.profiles?.username}`}>
              <Avatar>
                <AvatarImage src={post.profiles?.profile_photo_url || ''} />
                <AvatarFallback>{post.profiles?.full_name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link
                to={`/user/${post.profiles?.username}`}
                className="font-semibold hover:underline"
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
      </CardHeader>

      <CardContent className="space-y-4">
        <Link to={`/community/post/${post.id}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-3">{post.content}</p>
        </Link>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full rounded-lg object-cover max-h-96"
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
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>

          <Button variant="ghost" size="sm" onClick={onCommentClick}>
            <MessageCircle className="w-4 h-4 mr-1" />
            {post.comments_count}
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Brain className="w-4 h-4 mr-1" />
            Know About
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={isSaved ? 'text-primary' : ''}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
