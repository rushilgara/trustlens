import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Send, Mail } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-accent-cyan font-semibold">📬 Get In Touch</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Join the <span className="gradient-text">Waitlist</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Be among the first to experience financial safety powered by AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-8 md:p-12 animated-border"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input 
                  placeholder="Enter your name" 
                  className="glass border-accent-cyan/30 focus:border-accent-cyan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="glass border-accent-cyan/30 focus:border-accent-cyan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Message (Optional)</label>
              <Textarea 
                placeholder="Tell us how TrustLens AI can help you..." 
                rows={5}
                className="glass border-accent-cyan/30 focus:border-accent-cyan resize-none"
              />
            </div>

            <Button variant="premium" size="xl" className="w-full group">
              <Mail className="w-5 h-5 mr-2" />
              Join Waitlist
              <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              By joining, you'll get early access and exclusive updates on TrustLens AI
            </p>
          </form>

          {/* AI Assistant Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 p-6 glass-card border border-accent-emerald/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-emerald to-accent-cyan flex items-center justify-center animate-pulse-glow">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h4 className="font-semibold">AI Assistant Available</h4>
                <p className="text-sm text-muted-foreground">Ask me if an app is safe!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
