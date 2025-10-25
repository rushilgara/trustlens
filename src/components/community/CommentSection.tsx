import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment, useCommunity } from '@/hooks/useCommunity';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { addComment } = useCommunity();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    const success = await addComment(postId, newComment);
    if (success) {
      setNewComment('');
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link to={`/user/${comment.profiles?.username}`}>
                <Avatar>
                  <AvatarImage src={comment.profiles?.profile_photo_url || ''} />
                  <AvatarFallback>{comment.profiles?.full_name[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <Link
                    to={`/user/${comment.profiles?.username}`}
                    className="font-semibold hover:underline"
                  >
                    {comment.profiles?.full_name}
                  </Link>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-3">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
