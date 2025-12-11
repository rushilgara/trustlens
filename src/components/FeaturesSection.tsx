import { motion } from "framer-motion";
import { Brain, Bell, Database, Users, Shield, ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Scam Detector",
    description: "Advanced machine learning analyzes app behavior, permissions, and patterns to detect predatory practices instantly.",
  },
  {
    icon: Bell,
    title: "Real-Time Risk Alerts",
    description: "Get notified immediately when an installed app's risk profile changes or new threats emerge.",
  },
  {
    icon: Database,
    title: "Cross-Verified Data",
    description: "Combines RBI registrations, user complaints, and regulatory data for comprehensive assessment.",
  },
  {
    icon: Users,
    title: "Community Lens",
    description: "Real user reviews and experiences help identify scams faster through collective intelligence.",
  },
];

const stats = [
  { value: "8M+", label: "Users Protected" },
  { value: "825K+", label: "Apps Scanned" },
  { value: "4K+", label: "Threats Blocked/Day" },
];

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-accent-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Financial <span className="italic font-light text-muted-foreground">protection</span>
                <br />
                to keep you <span className="text-accent-gold">secure</span>.
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
                Apply <span className="font-semibold text-foreground">quickly</span> and{" "}
                <span className="font-semibold text-foreground">easily</span> scan any financial app 
                before trusting it with your data.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-accent-gold hover:bg-accent-gold/90 text-background font-semibold px-6 py-6 rounded-full text-base">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium px-6 py-6 rounded-full text-base">
                How it works?
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-border/50">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-gold" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 sm:p-6 hover:border-accent-gold/30 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-accent-gold" />
                </div>

                {/* Content */}
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground group-hover:text-accent-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
