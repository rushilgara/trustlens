import { motion } from "framer-motion";
import { Brain, Bell, Database, Users } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scam Detector",
    description: "Advanced machine learning analyzes app behavior, permissions, and patterns to detect predatory practices instantly",
    gradient: "from-accent-cyan to-accent-emerald",
  },
  {
    icon: Bell,
    title: "Real-Time Risk Alerts",
    description: "Get notified immediately when an installed app's risk profile changes or new threats emerge",
    gradient: "from-accent-emerald to-accent-gold",
  },
  {
    icon: Database,
    title: "Cross-Verified Data",
    description: "Combines RBI registrations, user complaints, and regulatory data for comprehensive risk assessment",
    gradient: "from-accent-gold to-accent-cyan",
  },
  {
    icon: Users,
    title: "Community Lens",
    description: "Real user reviews and experiences help identify scams faster through collective intelligence",
    gradient: "from-accent-cyan to-primary-glow",
  },
];

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-accent-cyan font-semibold">⚡ Core Features</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Complete <span className="gradient-text">Protection Suite</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Multi-layered AI defense system that adapts and evolves with emerging threats
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 group cursor-pointer relative overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent-cyan transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated Border */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-emerald"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 glass-card p-8 animated-border"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Agentic AI Behavior</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Unlike traditional scanners, TrustLens AI actively monitors, learns, and notifies you when risk profiles change. 
                It's not just reactive — it's <span className="text-accent-emerald font-semibold">proactive protection</span>.
              </p>
            </div>
            <div className="glass-card p-6 rounded-full">
              <Brain className="w-20 h-20 text-accent-cyan animate-pulse-glow" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
