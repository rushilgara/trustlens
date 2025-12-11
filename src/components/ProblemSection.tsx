import { motion } from "framer-motion";
import { AlertTriangle, Users, Phone, TrendingUp } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    icon: TrendingUp,
    title: "300% Surge",
    description: "Fake loan apps are multiplying at an alarming rate, targeting unsuspecting users daily.",
    gradient: "from-rose-500 via-orange-400 to-amber-300",
  },
  {
    icon: Phone,
    title: "Data Theft",
    description: "Contacts, photos, and personal data stolen without consent through deceptive permissions.",
    gradient: "from-cyan-400 via-blue-500 to-purple-500",
  },
  {
    icon: AlertTriangle,
    title: "Harassment",
    description: "Users threatened and harassed by illegal recovery agents using stolen contact data.",
    gradient: "from-purple-500 via-pink-500 to-rose-400",
  },
  {
    icon: Users,
    title: "Unregistered",
    description: "Apps operating without RBI registration or any regulatory oversight whatsoever.",
    gradient: "from-emerald-400 via-cyan-500 to-blue-500",
  },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-destructive bg-destructive/10 rounded-full border border-destructive/20">
            ⚠️ The Crisis
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5">
            The Core <span className="bg-gradient-to-r from-accent-cyan via-accent-emerald to-accent-gold bg-clip-text text-transparent">Problem</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            People don't know which apps they can trust — and they realize{" "}
            <span className="text-destructive font-semibold">too late</span>.
          </p>
        </motion.div>

        {/* Glowing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative"
            >
              {/* Gradient Border Glow */}
              <div className={`absolute -inset-[1px] bg-gradient-to-br ${problem.gradient} rounded-3xl opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500`} />
              
              {/* Card Content */}
              <div className="relative h-full bg-background/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-white/5">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-5 opacity-90`}>
                  <problem.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-muted-foreground text-lg sm:text-xl">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-destructive to-orange-400 bg-clip-text text-transparent">₹10,000 Cr+</span>
            <span className="block mt-2">lost to loan app scams in 2024 alone</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
