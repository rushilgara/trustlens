import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
}

export default function CreatePostModal({
  open,
  onOpenChange,
  onPostCreated,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: 'finance' as 'finance' | 'market_news' | 'scam_awareness' | 'personal_finance' | 'investment_tips',
    image_url: '',
    hashtags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const hashtagsArray = postData.hashtags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter((tag) => tag.length > 0);

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        title: postData.title.trim(),
        content: postData.content.trim(),
        category: postData.category,
        image_url: postData.image_url.trim() || null,
        hashtags: hashtagsArray,
      });

      if (error) throw error;

      toast({
        title: 'Post created successfully!',
        description: 'Your post is now visible to the community',
      });

      setPostData({
        title: '',
        content: '',
        category: 'finance',
        image_url: '',
        hashtags: '',
      });
      onOpenChange(false);
      onPostCreated();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating post',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              required
              placeholder="Enter post title..."
              value={postData.title}
              onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              required
              placeholder="Share your thoughts, insights, or questions..."
              value={postData.content}
              onChange={(e) => setPostData({ ...postData, content: e.target.value })}
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={postData.category}
              onValueChange={(value: any) => setPostData({ ...postData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="market_news">Market News</SelectItem>
                <SelectItem value="scam_awareness">Scam Awareness</SelectItem>
                <SelectItem value="personal_finance">Personal Finance</SelectItem>
                <SelectItem value="investment_tips">Investment Tips</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={postData.image_url}
              onChange={(e) => setPostData({ ...postData, image_url: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="hashtags">Hashtags (optional)</Label>
            <Input
              id="hashtags"
              placeholder="finance, investing, tips (comma-separated)"
              value={postData.hashtags}
              onChange={(e) => setPostData({ ...postData, hashtags: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate hashtags with commas. Don't include the # symbol.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
