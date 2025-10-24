import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, Shield, BookmarkPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AppScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AppAnalysis {
  app_name: string;
  icon_url: string;
  trust_score: number;
  status: "Safe" | "Unsafe";
  reasons: string[];
  app_id?: string;
}

export const AppScanModal = ({ open, onOpenChange }: AppScanModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appInput, setAppInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AppAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingToHistory, setSavingToHistory] = useState(false);

  const handleScan = async () => {
    if (!appInput.trim()) {
      setError("Please enter an app name or link");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-app', {
        body: { appInput: appInput.trim() }
      });

      if (functionError) throw functionError;
      
      setAnalysis(data);
      
      // Save to user_scans if user is logged in
      if (user && data.app_id) {
        setTimeout(async () => {
          try {
            const { error: scanError } = await supabase
              .from('user_scans')
              .insert({
                user_id: user.id,
                app_id: data.app_id,
              });

            if (scanError && !scanError.message.includes('duplicate')) {
              console.error('Error saving scan:', scanError);
            }
          } catch (err) {
            console.error('Error saving scan:', err);
          }
        }, 0);
      }
    } catch (err: any) {
      console.error('Error analyzing app:', err);
      setError(err.message || 'Failed to analyze app. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to add apps to your watchlist",
      });
      return;
    }

    if (!analysis?.app_id) return;

    setSavingToHistory(true);
    try {
      const { error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          app_id: analysis.app_id,
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
      setSavingToHistory(false);
    }
  };

  const handleClose = () => {
    setAppInput("");
    setAnalysis(null);
    setError(null);
    onOpenChange(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Safe") return <CheckCircle className="w-8 h-8 text-success" />;
    if (status === "Unsafe") return <XCircle className="w-8 h-8 text-destructive" />;
    return <AlertTriangle className="w-8 h-8 text-warning" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => analysis && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gradient-text">
            Scan App Safety
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter an app name or paste an app link to check its safety and trust score
          </DialogDescription>
        </DialogHeader>

        {!analysis ? (
          <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="appInput">Enter App Name or Paste App Link</Label>
                <Input
                  id="appInput"
                  value={appInput}
                  onChange={(e) => setAppInput(e.target.value)}
                  placeholder="e.g., PhonePe or https://play.google.com/store/apps/details?id=..."
                  className="glass border-accent-cyan/30 focus:border-accent-cyan"
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  You can enter either an app name or paste a Play Store / App Store link
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="button"
                variant="premium"
                size="lg"
                className="w-full"
                onClick={handleScan}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing App...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Scan App
                  </>
                )}
              </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
              {/* App Header */}
              <div className="flex items-center gap-4 p-6 glass-card rounded-2xl">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {analysis.icon_url ? (
                    <img src={analysis.icon_url} alt={analysis.app_name} className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <Shield className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{analysis.app_name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(analysis.status)}
                    <span className={`font-semibold ${analysis.status === "Safe" ? "text-success" : "text-destructive"}`}>
                      {analysis.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div className="glass-card p-8 text-center">
                <div className="text-sm text-muted-foreground mb-2">Trust Score</div>
                <div className={`text-6xl font-bold ${getScoreColor(analysis.trust_score)}`}>
                  {analysis.trust_score}
                </div>
                <div className="text-sm text-muted-foreground mt-2">out of 100</div>
                
                {/* Score Bar */}
                <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analysis.trust_score}%` }}
                    className={`h-full ${
                      analysis.trust_score >= 80 ? "bg-success" :
                      analysis.trust_score >= 50 ? "bg-warning" :
                      "bg-destructive"
                    }`}
                  />
                </div>
              </div>

              {/* Analysis Reasons */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Why this score?</h4>
                {analysis.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 glass-card rounded-lg"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      analysis.status === "Safe" ? "bg-success/20" : "bg-destructive/20"
                    }`}>
                      {analysis.status === "Safe" ? "✓" : "!"}
                    </div>
                    <p className="text-sm text-muted-foreground">{reason}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {user && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToWatchlist}
                    disabled={savingToHistory}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    {savingToHistory ? "Adding..." : "Add to Watchlist"}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="glass"
                  size="lg"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAnalysis(null);
                    setAppInput("");
                    setError(null);
                  }}
                >
                  Scan Another App
                </Button>
                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
