import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

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
}

export const AppScanModal = ({ open, onOpenChange }: AppScanModalProps) => {
  const [appInput, setAppInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AppAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error('Error analyzing app:', err);
      setError(err.message || 'Failed to analyze app. Please try again.');
    } finally {
      setLoading(false);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gradient-text">
            Scan App Safety
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter an app name or paste an app link to check its safety and trust score
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-4"
            >
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive"
                >
                  {error}
                </motion.div>
              )}

              <Button
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
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 py-4"
            >
              {/* App Header */}
              <div className="flex items-center gap-4 p-6 glass-card rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 flex items-center justify-center overflow-hidden">
                  {analysis.icon_url ? (
                    <img src={analysis.icon_url} alt={analysis.app_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📱</span>
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
              <div className="glass-card p-8 text-center animated-border">
                <div className="text-sm text-muted-foreground mb-2">Trust Score</div>
                <div className={`text-6xl font-bold ${getScoreColor(analysis.trust_score)}`}>
                  {analysis.trust_score}
                </div>
                <div className="text-sm text-muted-foreground mt-2">out of 100</div>
                
                {/* Score Bar */}
                <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.trust_score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
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
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 glass-card rounded-lg"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      analysis.status === "Safe" ? "bg-success/20" : "bg-destructive/20"
                    }`}>
                      {analysis.status === "Safe" ? "✓" : "!"}
                    </div>
                    <p className="text-sm text-muted-foreground">{reason}</p>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="glass"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setAnalysis(null);
                    setAppInput("");
                  }}
                >
                  Scan Another App
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
