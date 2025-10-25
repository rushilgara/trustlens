import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/hooks/useCommunity';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import CommunityHeader from '@/components/community/CommunityHeader';
import { Briefcase, Users } from 'lucide-react';

export default function ProfileEdit() {
  const { user } = useAuth();
  const { userProfile, loading: profileLoading } = useCommunity();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    bio: '',
    profession_category: 'finance_professional' as 'finance_professional' | 'other_professional',
    organization: '',
    location: '',
    website: '',
    linkedin_url: '',
    profile_photo_url: '',
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name,
        bio: userProfile.bio || '',
        profession_category: userProfile.profession_category,
        organization: userProfile.organization || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        linkedin_url: userProfile.linkedin_url || '',
        profile_photo_url: userProfile.profile_photo_url || '',
      });
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name.trim(),
          bio: profileData.bio.trim() || null,
          profession_category: profileData.profession_category,
          organization: profileData.organization.trim() || null,
          location: profileData.location.trim() || null,
          website: profileData.website.trim() || null,
          linkedin_url: profileData.linkedin_url.trim() || null,
          profile_photo_url: profileData.profile_photo_url || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated successfully!',
      });
      navigate(`/user/${userProfile.username}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
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

      <div className="container py-8 max-w-2xl">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
              <Input
                id="profile_photo_url"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={profileData.profile_photo_url}
                onChange={(e) =>
                  setProfileData({ ...profileData, profile_photo_url: e.target.value })
                }
              />
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                required
                value={profileData.full_name}
                onChange={(e) =>
                  setProfileData({ ...profileData, full_name: e.target.value })
                }
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                maxLength={200}
                rows={3}
              />
            </div>

            {/* Profession Category */}
            <div>
              <Label>
                Profession Category <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      profession_category: 'finance_professional',
                    })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    profileData.profession_category === 'finance_professional'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Finance Professional</p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setProfileData({
                      ...profileData,
                      profession_category: 'other_professional',
                    })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    profileData.profession_category === 'other_professional'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Other Professional</p>
                </button>
              </div>
            </div>

            {/* Optional Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="Company name"
                  value={profileData.organization}
                  onChange={(e) =>
                    setProfileData({ ...profileData, organization: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={profileData.website}
                  onChange={(e) =>
                    setProfileData({ ...profileData, website: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profileData.linkedin_url}
                  onChange={(e) =>
                    setProfileData({ ...profileData, linkedin_url: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/user/${userProfile?.username}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
