import { Shield, ExternalLink, BookmarkPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AppCardProps {
  app: {
    id: string;
    app_name: string;
    category: string;
    trust_score: number;
    developer: string;
    rbi_verified: boolean;
    icon_url: string | null;
    play_store_link: string | null;
  };
  onViewDetails: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-500";
  if (score >= 75) return "text-blue-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

const getScoreBg = (score: number) => {
  if (score >= 90) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 75) return "bg-blue-500/10 border-blue-500/30";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
  return "bg-red-500/10 border-red-500/30";
};

export const AppCard = ({ app, onViewDetails }: AppCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to add apps to your watchlist",
      });
      return;
    }

    setAdding(true);
    try {
      const { error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          app_id: app.id,
        });

      if (error) {
        if (error.message.includes('duplicate')) {
          toast({
            variant: "destructive",
            title: "Already Added",
            description: "This app is already in your watchlist",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Added to Watchlist",
          description: "You can view this app in your dashboard",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add to watchlist",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 overflow-hidden bg-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* App Icon */}
          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
            {app.icon_url ? (
              <img 
                src={app.icon_url} 
                alt={app.app_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* App Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {app.app_name}
              </h3>
              {app.rbi_verified && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex-shrink-0">
                  RBI Verified
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-3">{app.developer}</p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-xs">
                {app.category}
              </Badge>
            </div>

            {/* Trust Score */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getScoreBg(app.trust_score)}`}>
              <Shield className={`w-4 h-4 ${getScoreColor(app.trust_score)}`} />
              <span className={`font-bold ${getScoreColor(app.trust_score)}`}>
                {app.trust_score}/100
              </span>
              <span className="text-xs text-muted-foreground">Trust Score</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={onViewDetails}
            variant="default"
            className="flex-1"
          >
            View Details
          </Button>
          {user && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddToWatchlist}
              disabled={adding}
              title="Add to Watchlist"
            >
              <BookmarkPlus className="w-4 h-4" />
            </Button>
          )}
          {app.play_store_link && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (app.play_store_link) {
                  window.open(app.play_store_link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
