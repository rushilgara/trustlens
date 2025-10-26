import { motion } from "framer-motion";
import { Target, Heart, Zap } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-block glass-card px-4 sm:px-6 py-2 mb-4 sm:mb-6">
            <span className="text-accent-emerald font-semibold text-sm sm:text-base">🎯 Our Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Why We Built <span className="gradient-text">TrustLens</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 sm:p-8 md:p-12 animated-border"
        >
          <div className="space-y-6 sm:space-y-8">
            {/* Mission Statement */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground">
                Misinformation and fake fintech apps exploit millions of users every year. 
                People lose their money, data, and dignity to predatory practices.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mt-4 sm:mt-6 font-semibold">
                <span className="gradient-text">TrustLens restores digital trust proactively.</span>
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
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
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-accent-${value.color}/20 to-accent-${value.color}/5 flex items-center justify-center mb-3 sm:mb-4`}>
                    <value.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-accent-${value.color}`} />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Vision Statement */}
            <div className="pt-6 sm:pt-8 border-t border-accent-cyan/20">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center">
                <span className="gradient-text">The Future We're Building</span>
              </h3>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
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
