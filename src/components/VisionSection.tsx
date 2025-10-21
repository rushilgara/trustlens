import { motion } from "framer-motion";
import { Brain, Eye, Zap, Shield, TrendingUp } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  { icon: Eye, text: "Scans app permissions & data practices" },
  { icon: Brain, text: "Predicts risk using AI algorithms" },
  { icon: Zap, text: "Advises users instantly with actionable insights" },
  { icon: TrendingUp, text: "Learns continuously from new threats" },
];

export const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-emerald/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Vision Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-block glass-card px-6 py-2 mb-4">
              <span className="text-accent-cyan font-semibold">✨ Our Vision</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Make financial safety as{" "}
              <span className="gradient-text">smart</span> as financial{" "}
              <span className="gradient-text-gold">growth</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              TrustLens AI is your <span className="text-accent-cyan font-semibold">agentic financial guardian</span> — 
              proactive, explainable, and evolving. We don't just detect threats; we learn, adapt, and protect you before harm strikes.
            </p>

            {/* Capabilities List */}
            <div className="space-y-4 pt-4">
              {capabilities.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <p className="text-lg font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Animated Guardian Hologram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Central Shield */}
            <div className="relative mx-auto w-80 h-80 flex items-center justify-center">
              {/* Rotating Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-accent-cyan/30 rounded-full"
                style={{ borderStyle: "dashed" }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-4 border-accent-emerald/30 rounded-full"
                style={{ borderStyle: "dashed" }}
              />

              {/* Central Shield Glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="glass-card p-12 rounded-full glow-cyan"
              >
                <Shield className="w-32 h-32 text-accent-cyan animate-pulse-glow" />
              </motion.div>

              {/* Floating AI Indicators */}
              {[0, 90, 180, 270].map((angle, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: idx * 0.5
                  }}
                  className="absolute w-4 h-4 bg-accent-emerald rounded-full"
                  style={{
                    top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                  }}
                />
              ))}
            </div>

            {/* Scanning Effect */}
            <motion.div
              animate={{ y: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
