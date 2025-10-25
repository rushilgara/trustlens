import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ScanLine, Compass, Bot, Newspaper, AlertTriangle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCommunity } from '@/hooks/useCommunity';

export default function CommunityHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile } = useCommunity();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/community" className="flex items-center gap-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TrustLens Community
          </div>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search posts or users..." className="pl-10" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ScanLine className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Scan App</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
            <Compass className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Explore</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={() => navigate('/finsage')}>
            <Bot className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">FinSage</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Newspaper className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">News</span>
          </Button>

          <Button variant="ghost" size="sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Report</span>
          </Button>

          {/* User Menu */}
          {user && userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={userProfile.profile_photo_url || ''} />
                    <AvatarFallback>{userProfile.full_name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar>
                    <AvatarImage src={userProfile.profile_photo_url || ''} />
                    <AvatarFallback>{userProfile.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userProfile.full_name}</p>
                    <p className="text-xs text-muted-foreground">@{userProfile.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/user/${userProfile.username}`)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
