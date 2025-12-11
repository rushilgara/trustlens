import { motion } from "framer-motion";
import { Shield, Sparkles, Eye, Zap } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";

export const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Subtle Background Circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full border border-border/30 opacity-50" />
        <div className="absolute w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full border border-border/20" />
      </div>

      <div className="container mx-auto relative z-10 max-w-5xl">
        {/* Main Content - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 leading-[1.1]">
            Welcome
            <br />
            <span className="block">To <span className="font-semibold text-primary">TrustLens</span></span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            The ultimate financial protection hack is here. Your AI-powered guardian for safe digital finance.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 rounded-full text-base shadow-lg">
              <Sparkles className="mr-2 w-4 h-4" />
              Get Started
            </Button>
            <Button variant="outline" className="font-medium px-8 py-6 rounded-full text-base border-border/50 hover:bg-muted/50">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Feature Badges - Floating around */}
        <div className="relative h-20 sm:h-32">
          {/* Left Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-0 sm:left-10 top-0 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-cyan" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">AI Protection</p>
                <p className="text-xs text-muted-foreground">Active 24/7</p>
              </div>
            </div>
          </motion.div>

          {/* Right Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute right-0 sm:right-10 top-0 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent-emerald" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Smart Scanning</p>
                <p className="text-xs text-muted-foreground">Real-time analysis</p>
              </div>
            </div>
          </motion.div>

          {/* Center Bottom Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 sm:-bottom-4 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-5 py-2.5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-gold" />
              <span className="text-sm font-medium text-foreground">Instant Results</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground text-sm sm:text-base mt-20 sm:mt-24 max-w-lg mx-auto"
        >
          Bye bye scams. See you later fake apps. Adios financial nightmares. 
          Your safety is our priority.
        </motion.p>
      </div>
    </section>
  );
};
