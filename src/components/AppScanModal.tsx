import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Search, CheckCircle, XCircle, AlertTriangle, Shield, BookmarkPlus, Sparkles } from "lucide-react";
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
    if (score >= 80) return "text-accent-emerald";
    if (score >= 50) return "text-accent-gold";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-accent-emerald";
    if (score >= 50) return "bg-accent-gold";
    return "bg-destructive";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Safe") return <CheckCircle className="w-6 h-6 text-accent-emerald" />;
    if (status === "Unsafe") return <XCircle className="w-6 h-6 text-destructive" />;
    return <AlertTriangle className="w-6 h-6 text-accent-gold" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" 
        onInteractOutside={(e) => analysis && e.preventDefault()}
      >
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center">
              <Shield className="w-6 h-6 text-background" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Scan App
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Check any app's safety score instantly
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!analysis ? (
          <div className="space-y-5 pt-2">
            <div className="space-y-3">
              <Label htmlFor="appInput" className="text-sm font-medium text-foreground">
                App Name or Store Link
              </Label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="appInput"
                  value={appInput}
                  onChange={(e) => setAppInput(e.target.value)}
                  placeholder="e.g., PhonePe or paste Play Store link..."
                  className="pl-12 h-14 bg-muted/50 border-border/50 rounded-2xl text-base focus:border-accent-cyan focus:ring-accent-cyan/20"
                  onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="button"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-emerald hover:opacity-90 text-background font-semibold text-base shadow-lg shadow-accent-cyan/20"
              onClick={handleScan}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* App Header */}
            <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-2xl border border-border/30">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {analysis.icon_url ? (
                  <img src={analysis.icon_url} alt={analysis.app_name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <Shield className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground truncate">{analysis.app_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(analysis.status)}
                  <span className={`font-semibold ${analysis.status === "Safe" ? "text-accent-emerald" : "text-destructive"}`}>
                    {analysis.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <div className="bg-muted/30 rounded-2xl p-6 text-center border border-border/30">
              <div className="text-sm text-muted-foreground mb-2 font-medium">Trust Score</div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.trust_score)}`}>
                {analysis.trust_score}
              </div>
              <div className="text-sm text-muted-foreground mt-1">out of 100</div>
              
              <div className="mt-4 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${analysis.trust_score}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBg(analysis.trust_score)}`}
                />
              </div>
            </div>

            {/* Analysis Reasons */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Analysis</h4>
              <div className="space-y-2">
                {analysis.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-muted/20 rounded-xl border border-border/20"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      analysis.status === "Safe" ? "bg-accent-emerald/20 text-accent-emerald" : "bg-destructive/20 text-destructive"
                    }`}>
                      {analysis.status === "Safe" ? "✓" : "!"}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {user && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-border/50 hover:bg-muted/50"
                  onClick={handleAddToWatchlist}
                  disabled={savingToHistory}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  {savingToHistory ? "Adding..." : "Watchlist"}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-border/50 hover:bg-muted/50"
                onClick={() => {
                  setAnalysis(null);
                  setAppInput("");
                  setError(null);
                }}
              >
                Scan Another
              </Button>
              <Button
                type="button"
                className="flex-1 h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                onClick={handleClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
