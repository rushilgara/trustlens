import { Shield, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface App {
  id: string;
  app_name: string;
  category: string;
  trust_score: number;
  developer: string;
  rbi_verified: boolean;
  permissions: string[];
  reason: string;
  icon_url: string | null;
  play_store_link: string | null;
}

interface AppDetailModalProps {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-emerald-500";
  if (score >= 75) return "text-blue-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Highly Trusted";
  if (score >= 75) return "Trusted";
  if (score >= 60) return "Moderately Trusted";
  return "Use with Caution";
};

export const AppDetailModal = ({ app, open, onOpenChange }: AppDetailModalProps) => {
  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              {app.icon_url ? (
                <img 
                  src={app.icon_url} 
                  alt={app.app_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{app.app_name}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {app.developer}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trust Score Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className={`w-5 h-5 ${getScoreColor(app.trust_score)}`} />
                Trust Score
              </h3>
              <span className={`text-3xl font-bold ${getScoreColor(app.trust_score)}`}>
                {app.trust_score}/100
              </span>
            </div>
            <Progress value={app.trust_score} className="h-3 mb-2" />
            <p className={`text-sm font-medium ${getScoreColor(app.trust_score)}`}>
              {getScoreLabel(app.trust_score)}
            </p>
          </div>

          {/* Category and Verification */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <Badge variant="secondary" className="mt-1">{app.category}</Badge>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">RBI Verification</p>
              <div className="flex items-center gap-2 mt-1">
                {app.rbi_verified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Not Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              🤖 AI Analysis
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm leading-relaxed text-foreground/90">
                {app.reason}
              </p>
            </div>
          </div>

          {/* Permissions */}
          {app.permissions && app.permissions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Data Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {app.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {app.play_store_link && (
            <Button
              onClick={() => {
                if (app.play_store_link) {
                  window.open(app.play_store_link, '_blank', 'noopener,noreferrer');
                }
              }}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Play Store
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
