import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield, Scan, ArrowRight, MessageSquare, Compass, User, LogIn, Users, Star, CheckCircle, Play, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AppScanModal } from "./AppScanModal";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MobileNav } from "./MobileNav";

export const HeroSection = () => {
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen overflow-hidden bg-bento-light">
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex absolute top-0 left-0 right-0 z-20 items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-bento-dark" />
          <span className="text-xl font-bold text-bento-dark">TrustLens AI</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/explore" className="text-bento-dark/80 hover:text-bento-dark transition-colors font-medium">
            Explore Apps
          </Link>
          <Link to="/community" className="text-bento-dark/80 hover:text-bento-dark transition-colors font-medium">
            Community
          </Link>
          <Link to="/finsage" className="text-bento-dark/80 hover:text-bento-dark transition-colors font-medium">
            FinSage
          </Link>
          {user ? (
            <Link to="/dashboard">
              <Button className="bg-bento-dark text-foreground hover:bg-bento-dark/90 rounded-full px-6">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button className="bg-bento-dark text-foreground hover:bg-bento-dark/90 rounded-full px-6">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Bento Grid */}
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto">
          
          {/* Main Hero Card - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-bento-light rounded-3xl p-6 md:p-10 relative overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col justify-between border border-bento-dark/10"
          >
            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 hidden md:flex gap-2">
              <div className="w-3 h-3 rounded-full bg-bento-dark/20" />
              <div className="w-3 h-3 rounded-full bg-bento-dark/20" />
            </div>
            
            <div>
              <span className="text-sm font-medium text-bento-dark/60 tracking-wider">
                [ FINANCIAL SAFETY GUARDIAN ]
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-bento-dark mt-4 leading-[1.1]">
                Protect your
                <span className="inline-flex items-center mx-3">
                  <span className="bg-bento-dark text-foreground px-3 py-1 rounded-lg text-3xl sm:text-4xl md:text-5xl">
                    <TrendingUp className="inline w-6 h-6 md:w-8 md:h-8" />
                  </span>
                </span>
                finances with AI
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
              <Button 
                onClick={() => setScanModalOpen(true)}
                className="bg-accent-lime text-bento-dark hover:bg-accent-lime/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <button className="flex items-center gap-3 text-bento-dark/70 hover:text-bento-dark transition-colors group">
                <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 text-bento-dark fill-current ml-1" />
                </div>
                <span className="font-medium">How it works?</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6">
            
            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-1 bg-bento-purple rounded-3xl p-5 md:p-6 text-foreground flex flex-col justify-between min-h-[200px]"
            >
              <span className="text-xs font-medium opacity-70 tracking-wider">[ RATING ]</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl md:text-5xl font-bold">4.9</span>
                  <Star className="w-6 h-6 text-accent-gold fill-accent-gold" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-8 h-8 rounded-full bg-accent-lime flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-bento-dark" />
                  </div>
                  <p className="text-xs opacity-80">Trusted by 100K+ users</p>
                </div>
              </div>
            </motion.div>

            {/* Scams Detected Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-1 bg-bento-dark rounded-3xl p-5 md:p-6 text-foreground flex flex-col justify-between min-h-[200px]"
            >
              <span className="text-xs font-medium opacity-70 tracking-wider">[ SCAMS BLOCKED ]</span>
              <div>
                <span className="text-4xl md:text-5xl font-bold text-accent-lime">+12K</span>
                <div className="flex gap-1 mt-4">
                  <div className="h-8 w-2 rounded-full bg-accent-cyan" />
                  <div className="h-6 w-2 rounded-full bg-accent-emerald" />
                  <div className="h-10 w-2 rounded-full bg-accent-lime" />
                  <div className="h-4 w-2 rounded-full bg-accent-gold" />
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="col-span-2 bg-foreground rounded-3xl p-5 md:p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-bento-dark text-lg font-semibold">Quick Actions</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald" />
                  <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Link to="/explore">
                  <Button variant="outline" className="w-full justify-start bg-bento-light/50 border-bento-dark/10 text-bento-dark hover:bg-bento-light rounded-xl py-5">
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Apps
                  </Button>
                </Link>
                <Link to="/community">
                  <Button variant="outline" className="w-full justify-start bg-bento-light/50 border-bento-dark/10 text-bento-dark hover:bg-bento-light rounded-xl py-5">
                    <Users className="w-4 h-4 mr-2" />
                    Community
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setScanModalOpen(true)}
                  className="w-full justify-start bg-bento-light/50 border-bento-dark/10 text-bento-dark hover:bg-bento-light rounded-xl py-5"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan App
                </Button>
                <Link to="/finsage">
                  <Button variant="outline" className="w-full justify-start bg-bento-light/50 border-bento-dark/10 text-bento-dark hover:bg-bento-light rounded-xl py-5">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    FinSage AI
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4 bg-bento-purple rounded-3xl p-5 md:p-6 text-foreground"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium opacity-70 tracking-wider">[ APPS SCANNED ]</span>
                <p className="text-3xl md:text-4xl font-bold mt-2">50,000+</p>
                <p className="text-sm opacity-80 mt-2">Financial apps verified for safety</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-lime flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-bento-dark" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-5 bg-foreground rounded-3xl p-5 md:p-6"
          >
            <p className="text-bento-dark text-lg md:text-xl font-medium leading-relaxed">
              "Use AI-powered protection to safeguard your financial decisions every day."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-bento-purple flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-bento-dark font-semibold text-sm">TrustLens AI</p>
                <p className="text-bento-dark/60 text-xs">Your Financial Safety Guardian</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-3 bg-bento-dark rounded-3xl p-5 md:p-6 text-foreground"
          >
            <span className="text-xs font-medium opacity-70 tracking-wider">[ USERS PROTECTED ]</span>
            <div className="flex items-end justify-between mt-4">
              <span className="text-3xl md:text-4xl font-bold text-accent-emerald">100K+</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-bento-dark flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* App Scan Modal */}
      <AppScanModal open={scanModalOpen} onOpenChange={setScanModalOpen} />
    </section>
  );
};
