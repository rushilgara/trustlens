import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Briefcase, Users } from 'lucide-react';

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    full_name: '',
    bio: '',
    profession_category: 'finance_professional' as 'finance_professional' | 'other_professional',
    organization: '',
    location: '',
    website: '',
    linkedin_url: '',
    profile_photo_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        username: profileData.username.toLowerCase().trim(),
        full_name: profileData.full_name.trim(),
        bio: profileData.bio.trim() || null,
        profession_category: profileData.profession_category,
        organization: profileData.organization.trim() || null,
        location: profileData.location.trim() || null,
        website: profileData.website.trim() || null,
        linkedin_url: profileData.linkedin_url.trim() || null,
        profile_photo_url: profileData.profile_photo_url || null,
      });

      if (error) throw error;

      toast({
        title: 'Profile created successfully!',
        description: 'Welcome to TrustLens Community',
      });
      navigate('/community');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating profile',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create Your TrustLens Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Join the community where finance meets trust
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  {profileData.profile_photo_url ? (
                    <img
                      src={profileData.profile_photo_url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-primary/50" />
                  )}
                </div>
                <Input
                  type="url"
                  placeholder="Profile photo URL"
                  value={profileData.profile_photo_url}
                  onChange={(e) =>
                    setProfileData({ ...profileData, profile_photo_url: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                required
                placeholder="johndoe"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                pattern="[a-z0-9_]+"
                minLength={3}
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase letters, numbers, and underscores only
              </p>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                required
                placeholder="John Doe"
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
                    setProfileData({ ...profileData, profession_category: 'finance_professional' })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    profileData.profession_category === 'finance_professional'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Finance Professional</p>
                  <p className="text-xs text-muted-foreground">
                    Banker, investor, advisor, etc.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setProfileData({ ...profileData, profession_category: 'other_professional' })
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    profileData.profession_category === 'other_professional'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Other Professional</p>
                  <p className="text-xs text-muted-foreground">Non-finance background</p>
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
