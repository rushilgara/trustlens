import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const apps = [
  { name: "PhonePe", score: 95, status: "safe", color: "emerald" },
  { name: "Paytm", score: 92, status: "safe", color: "emerald" },
  { name: "ModerateRisk App", score: 65, status: "moderate", color: "warning" },
  { name: "FastCash Scam", score: 25, status: "danger", color: "destructive" },
];

export const TrustScoreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedApp, setSelectedApp] = useState(apps[3]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="w-6 h-6 text-success" />;
      case "moderate": return <AlertTriangle className="w-6 h-6 text-warning" />;
      case "danger": return <XCircle className="w-6 h-6 text-destructive" />;
    }
  };

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-accent-cyan font-semibold">🎯 Key Innovation</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Trust Score</span> System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every app gets a holographic Trust Score (0-100) based on AI analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Trust Score Meter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">
              {selectedApp.name}
            </h3>

            {/* Circular Trust Score */}
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="20"
                />
                {/* Progress Circle */}
                <motion.circle
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (628 * selectedApp.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke={
                    selectedApp.status === "safe"
                      ? "hsl(var(--success))"
                      : selectedApp.status === "moderate"
                      ? "hsl(var(--warning))"
                      : "hsl(var(--destructive))"
                  }
                  strokeWidth="20"
                  strokeDasharray="628"
                  strokeLinecap="round"
                  className="glow-cyan"
                />
              </svg>

              {/* Center Score */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-6xl font-bold gradient-text"
                >
                  {selectedApp.score}
                </motion.div>
                <div className="text-muted-foreground">Trust Score</div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="glass-card p-6 animated-border">
              <div className="flex items-start gap-3 mb-3">
                {getStatusIcon(selectedApp.status)}
                <div>
                  <h4 className="font-bold text-lg">AI Analysis</h4>
                  {selectedApp.status === "danger" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="text-destructive font-semibold">High Risk Detected:</span>
                      <br />• Low transparency (no RBI registration)
                      <br />• Unrealistic loan claims (instant approval)
                      <br />• Excessive permissions (camera, contacts)
                      <br />• User complaints about harassment
                    </p>
                  )}
                  {selectedApp.status === "safe" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="text-success font-semibold">Verified Safe:</span>
                      <br />• RBI registered & regulated
                      <br />• Transparent data practices
                      <br />• Minimal required permissions
                      <br />• Strong user reviews & trust signals
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Score Range Guide */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold mb-6">Score Breakdown</h3>

            {/* Safe Apps */}
            <div className="glass-card p-6 border-l-4 border-success hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <div>
                    <h4 className="font-bold text-lg">80-100 Safe</h4>
                    <p className="text-sm text-muted-foreground">Verified & Trustworthy</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div>✅ {apps[0].name} - Score: {apps[0].score}</div>
                <div>✅ {apps[1].name} - Score: {apps[1].score}</div>
              </div>
            </div>

            {/* Moderate Risk */}
            <div className="glass-card p-6 border-l-4 border-warning hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                  <div>
                    <h4 className="font-bold text-lg">50-79 Moderate Risk</h4>
                    <p className="text-sm text-muted-foreground">Use with Caution</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Apps in this range may have some red flags but aren't outright scams
              </div>
            </div>

            {/* High Risk */}
            <div 
              className="glass-card p-6 border-l-4 border-destructive hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setSelectedApp(apps[3])}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-destructive" />
                  <div>
                    <h4 className="font-bold text-lg">0-49 High Risk</h4>
                    <p className="text-sm text-muted-foreground">Likely Scam - Avoid!</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="text-destructive font-semibold">⚠️ {apps[3].name} - Score: {apps[3].score}</div>
                <div className="text-muted-foreground mt-1">Click to see full AI analysis</div>
              </div>
            </div>

            {/* Interactive Demo CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 bg-gradient-to-r from-accent-cyan/10 to-accent-emerald/10 animated-border cursor-pointer"
            >
              <p className="text-center text-lg font-semibold gradient-text">
                Try scanning your own app →
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
