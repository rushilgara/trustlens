import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield, Scan, ArrowRight, MessageSquare, Compass, User, LogIn } from "lucide-react";
import { useState } from "react";
import { AppScanModal } from "./AppScanModal";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const HeroSection = () => {
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Auth Navigation */}
      <div className="absolute top-4 right-4 z-20">
        {user ? (
          <Link to="/dashboard">
            <Button variant="hero" size="lg">
              <User className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button variant="hero" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Button>
          </Link>
        )}
      </div>
      {/* Animated Background Particles */}
      <div className="particles absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent-cyan rounded-full opacity-20"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Floating Shield Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="glass-card p-6 rounded-full glow-cyan inline-block">
              <Shield className="w-16 h-16 text-accent-cyan animate-pulse-glow" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold leading-tight"
          >
            <span className="gradient-text">TrustLens AI</span>
            <br />
            <span className="text-4xl md:text-5xl font-normal text-muted-foreground">
              Your Financial Safety Guardian
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            AI-powered protection against fake loan apps, scams, and misinformation.
            <br />
            <span className="gradient-text font-semibold">Intelligent. Proactive. Trustworthy.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              variant="premium" 
              size="xl" 
              className="group"
              onClick={() => setScanModalOpen(true)}
            >
              <Scan className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Scan an App
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/explore">
              <Button variant="hero" size="xl" className="group">
                <Compass className="w-5 h-5 mr-2" />
                Explore Safe Apps
              </Button>
            </Link>
            <Link to="/finsage">
              <Button variant="hero" size="xl" className="group">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with FinSage
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            {[
              { label: "Apps Scanned", value: "50K+" },
              { label: "Scams Detected", value: "12K+" },
              { label: "Users Protected", value: "100K+" },
            ].map((stat, idx) => (
              <div key={idx} className="glass-card px-6 py-4 min-w-[140px]">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-accent-cyan rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent-cyan rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* App Scan Modal */}
      <AppScanModal open={scanModalOpen} onOpenChange={setScanModalOpen} />
    </section>
  );
};
