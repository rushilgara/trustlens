import { motion } from "framer-motion";
import { AlertTriangle, Users, Phone, TrendingUp, Shield } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    icon: TrendingUp,
    title: "300% Surge in Predatory Apps",
    description: "Fake loan apps are multiplying at an alarming rate",
    color: "text-destructive",
  },
  {
    icon: Phone,
    title: "Data Theft",
    description: "Contacts, photos, and personal data stolen without consent",
    color: "text-warning",
  },
  {
    icon: AlertTriangle,
    title: "Harassment & Threats",
    description: "Users threatened and harassed by illegal recovery agents",
    color: "text-accent-gold",
  },
  {
    icon: Users,
    title: "Unregistered Operations",
    description: "Apps operating without RBI registration or oversight",
    color: "text-accent-cyan",
  },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-destructive font-semibold">⚠️ The Crisis</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            The Core <span className="gradient-text">Problem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            People don't know which apps they can trust — and they realize{" "}
            <span className="text-destructive font-semibold">too late</span>.
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${problem.color}/20 to-${problem.color}/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <problem.icon className={`w-7 h-7 ${problem.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
              
              {/* Hover Reveal */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileHover={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-accent-cyan/20"
              >
                <p className="text-sm text-accent-cyan">
                  TrustLens AI instantly detects these red flags
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 glass-card max-w-4xl mx-auto p-8 text-center animated-border"
        >
          <Shield className="w-12 h-12 text-accent-emerald mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            <span className="gradient-text">₹10,000 Crores</span> lost to loan app scams in 2024 alone
          </h3>
          <p className="text-muted-foreground text-lg">
            Victims are left with stolen data, harassment, and financial ruin.
            <br />
            <span className="text-accent-emerald font-semibold">TrustLens AI is here to stop this.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
