import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  profile_photo_url: string | null;
  profession_category: 'finance_professional' | 'other_professional';
  organization: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'finance' | 'market_news' | 'scam_awareness' | 'personal_finance' | 'investment_tips';
  image_url: string | null;
  hashtags: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export const useCommunity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setUserProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to like posts',
      });
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const toggleSave = async (postId: string, isSaved: boolean) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to save posts',
      });
      return;
    }

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        toast({ title: 'Post removed from saved' });
      } else {
        const { error } = await supabase
          .from('post_saves')
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
        toast({ title: 'Post saved successfully' });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to comment',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, user_id: user.id, content: content.trim() });

      if (error) throw error;
      toast({ title: 'Comment added successfully' });
      return true;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
      return false;
    }
  };

  return {
    userProfile,
    loading,
    toggleLike,
    toggleSave,
    addComment,
    refreshProfile: fetchUserProfile,
  };
};
