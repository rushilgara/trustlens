import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Link as LinkIcon, Edit } from 'lucide-react';
import CommunityHeader from '@/components/community/CommunityHeader';
import PostCard from '@/components/community/PostCard';
import { Profile, Post } from '@/hooks/useCommunity';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    if (!username) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData) {
        navigate('/community');
        return;
      }

      setProfile(profileData);
      setIsOwnProfile(user?.id === profileData.id);

      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts((postsData as any) || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader />

      <div className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.profile_photo_url || ''} />
              <AvatarFallback className="text-3xl">{profile.full_name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <p className="text-muted-foreground mb-2">@{profile.username}</p>

              <Badge
                variant="secondary"
                className={
                  profile.profession_category === 'finance_professional'
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-purple-500/10 text-purple-500'
                }
              >
                {profile.profession_category === 'finance_professional'
                  ? '💼 Finance Professional'
                  : '🧠 Other Professional'}
              </Badge>

              {profile.bio && <p className="mt-4 text-lg">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                {profile.organization && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {profile.organization}
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Website
                  </a>
                )}
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <LinkIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>

              <div className="flex gap-6 mt-4 text-sm">
                <div>
                  <span className="font-bold">{posts.length}</span> Posts
                </div>
                <div>
                  <span className="font-bold">
                    {posts.reduce((acc, post) => acc + post.likes_count, 0)}
                  </span>{' '}
                  Likes Received
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {isOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onCommentClick={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
