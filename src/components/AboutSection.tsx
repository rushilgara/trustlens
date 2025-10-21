import { motion } from "framer-motion";
import { Target, Heart, Zap } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--accent-cyan) / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--accent-cyan) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-accent-emerald font-semibold">🎯 Our Mission</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Why We Built <span className="gradient-text">TrustLens</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-12 animated-border"
        >
          <div className="space-y-8">
            {/* Mission Statement */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                Misinformation and fake fintech apps exploit millions of users every year. 
                People lose their money, data, and dignity to predatory practices.
              </p>
              <p className="text-xl md:text-2xl leading-relaxed mt-6 font-semibold">
                <span className="gradient-text">TrustLens restores digital trust proactively.</span>
              </p>
            </div>

            {/* Core Values */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              {[
                {
                  icon: Target,
                  title: "Precision",
                  description: "AI-driven accuracy in every scan",
                  color: "cyan",
                },
                {
                  icon: Heart,
                  title: "Empathy",
                  description: "Built for real people facing real threats",
                  color: "emerald",
                },
                {
                  icon: Zap,
                  title: "Action",
                  description: "Proactive protection, not reactive response",
                  color: "gold",
                },
              ].map((value, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-accent-${value.color}/20 to-accent-${value.color}/5 flex items-center justify-center mb-4`}>
                    <value.icon className={`w-7 h-7 text-accent-${value.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Vision Statement */}
            <div className="pt-8 border-t border-accent-cyan/20">
              <h3 className="text-2xl font-bold mb-4 text-center">
                <span className="gradient-text">The Future We're Building</span>
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  ✨ <strong className="text-foreground">Chrome extension:</strong> Live TrustLens verification badges on fintech websites
                </p>
                <p>
                  ✨ <strong className="text-foreground">Play Store integration:</strong> "Install Safely" button for every app
                </p>
                <p>
                  ✨ <strong className="text-foreground">Banking partnerships:</strong> API for banks to auto-verify partner apps
                </p>
                <p>
                  ✨ <strong className="text-foreground">Community database:</strong> User-submitted suspicious apps for collective safety
                </p>
                <p>
                  ✨ <strong className="text-foreground">Regulatory collaboration:</strong> Working with RBI and fintech regulators
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
