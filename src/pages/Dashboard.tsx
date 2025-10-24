import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Scan, BookmarkCheck, TrendingUp, ExternalLink, Trash2, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AppDetailModal } from "@/components/AppDetailModal";

interface App {
  id: string;
  app_name: string;
  category: string;
  trust_score: number;
  developer: string;
  icon_url: string | null;
  play_store_link: string | null;
  rbi_verified: boolean;
  permissions?: string[];
  reason?: string;
}

interface ScannedApp extends App {
  scanned_at: string;
  scan_id: string;
}

interface WatchlistApp extends App {
  added_at: string;
  notes: string | null;
  watchlist_id: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scannedApps, setScannedApps] = useState<ScannedApp[]>([]);
  const [watchlistApps, setWatchlistApps] = useState<WatchlistApp[]>([]);
  const [recommendedApps, setRecommendedApps] = useState<App[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch scanned apps
      const { data: scans } = await supabase
        .from('user_scans')
        .select(`
          id,
          scanned_at,
          apps (*)
        `)
        .eq('user_id', user!.id)
        .order('scanned_at', { ascending: false })
        .limit(10);

      if (scans) {
        const scannedAppsData = scans
          .filter(scan => scan.apps)
          .map(scan => ({
            ...(scan.apps as any),
            scanned_at: scan.scanned_at,
            scan_id: scan.id,
          }));
        setScannedApps(scannedAppsData);
      }

      // Fetch watchlist apps
      const { data: watchlist } = await supabase
        .from('user_watchlist')
        .select(`
          id,
          added_at,
          notes,
          apps (*)
        `)
        .eq('user_id', user!.id)
        .order('added_at', { ascending: false });

      if (watchlist) {
        const watchlistAppsData = watchlist
          .filter(item => item.apps)
          .map(item => ({
            ...(item.apps as any),
            added_at: item.added_at,
            notes: item.notes,
            watchlist_id: item.id,
          }));
        setWatchlistApps(watchlistAppsData);
      }

      // Fetch recommended apps (high trust score, not in user's history)
      const scannedAppIds = scans?.map(s => (s.apps as any)?.id).filter(Boolean) || [];
      const watchlistAppIds = watchlist?.map(w => (w.apps as any)?.id).filter(Boolean) || [];
      const allUserAppIds = [...scannedAppIds, ...watchlistAppIds];

      let recommendedQuery = supabase
        .from('apps')
        .select('*')
        .gte('trust_score', 80)
        .order('trust_score', { ascending: false })
        .limit(6);

      if (allUserAppIds.length > 0) {
        recommendedQuery = recommendedQuery.not('id', 'in', `(${allUserAppIds.join(',')})`);
      }

      const { data: recommended } = await recommendedQuery;
      if (recommended) {
        setRecommendedApps(recommended);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleRemoveScan = async (scanId: string) => {
    const { error } = await supabase
      .from('user_scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove from scan history",
      });
    } else {
      setScannedApps(scannedApps.filter(app => app.scan_id !== scanId));
      toast({
        title: "Removed",
        description: "App removed from scan history",
      });
    }
  };

  const handleRemoveFromWatchlist = async (watchlistId: string) => {
    const { error } = await supabase
      .from('user_watchlist')
      .delete()
      .eq('id', watchlistId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove from watchlist",
      });
    } else {
      setWatchlistApps(watchlistApps.filter(app => app.watchlist_id !== watchlistId));
      toast({
        title: "Removed",
        description: "App removed from watchlist",
      });
    }
  };

  const handleUpdateNotes = async (watchlistId: string, notes: string) => {
    const { error } = await supabase
      .from('user_watchlist')
      .update({ notes })
      .eq('id', watchlistId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notes",
      });
    } else {
      setWatchlistApps(watchlistApps.map(app => 
        app.watchlist_id === watchlistId ? { ...app, notes } : app
      ));
      setEditingNotes({ ...editingNotes, [watchlistId]: notes });
      toast({
        title: "Updated",
        description: "Notes updated successfully",
      });
    }
  };

  const handleAddToWatchlist = async (appId: string) => {
    const { error } = await supabase
      .from('user_watchlist')
      .insert({
        user_id: user!.id,
        app_id: appId,
      });

    if (error) {
      if (error.message.includes('duplicate')) {
        toast({
          variant: "destructive",
          title: "Already Added",
          description: "This app is already in your watchlist",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add to watchlist",
        });
      }
    } else {
      toast({
        title: "Added",
        description: "App added to watchlist",
      });
      fetchDashboardData();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-blue-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const avgTrustScore = scannedApps.length > 0
    ? Math.round(scannedApps.reduce((sum, app) => sum + app.trust_score, 0) / scannedApps.length)
    : 0;

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Apps Scanned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{scannedApps.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4" />
                Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{watchlistApps.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(avgTrustScore)}`}>
                {avgTrustScore}/100
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Scanned Apps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recently Scanned Apps</CardTitle>
            <CardDescription>Apps you've recently checked for safety</CardDescription>
          </CardHeader>
          <CardContent>
            {scannedApps.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No apps scanned yet. Start by scanning an app!
              </p>
            ) : (
              <div className="space-y-4">
                {scannedApps.map((app) => (
                  <div key={app.scan_id} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.app_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{app.app_name}</h4>
                      <p className="text-sm text-muted-foreground">{app.developer}</p>
                    </div>
                    <Badge className={getScoreColor(app.trust_score)}>
                      {app.trust_score}/100
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToWatchlist(app.id)}
                      >
                        Add to Watchlist
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveScan(app.scan_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Watchlist */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Watchlist</CardTitle>
            <CardDescription>Apps you're monitoring for changes</CardDescription>
          </CardHeader>
          <CardContent>
            {watchlistApps.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No apps in watchlist. Add apps you want to monitor!
              </p>
            ) : (
              <div className="space-y-4">
                {watchlistApps.map((app) => (
                  <div key={app.watchlist_id} className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt={app.app_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{app.app_name}</h4>
                        <p className="text-sm text-muted-foreground">{app.developer}</p>
                      </div>
                      <Badge className={getScoreColor(app.trust_score)}>
                        {app.trust_score}/100
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                          Details
                        </Button>
                        {app.play_store_link && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(app.play_store_link!, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFromWatchlist(app.watchlist_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add notes about this app..."
                        value={editingNotes[app.watchlist_id] ?? app.notes ?? ''}
                        onChange={(e) => setEditingNotes({ ...editingNotes, [app.watchlist_id]: e.target.value })}
                        className="min-h-[60px]"
                      />
                      {(editingNotes[app.watchlist_id] !== undefined && editingNotes[app.watchlist_id] !== app.notes) && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNotes(app.watchlist_id, editingNotes[app.watchlist_id])}
                        >
                          Save Notes
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Safe Apps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Safe Apps</CardTitle>
            <CardDescription>High trust score apps you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedApps.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recommendations available
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedApps.map((app) => (
                  <div key={app.id} className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt={app.app_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-sm">{app.app_name}</h4>
                        <Badge variant="secondary" className="text-xs">{app.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getScoreColor(app.trust_score)}>
                        {app.trust_score}/100
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedApp(app)}>
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAddToWatchlist(app.id)}
                      >
                        Add to Watchlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppDetailModal
        app={selectedApp}
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      />
    </div>
  );
}
