import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Small Business Owner",
    image: "PS",
    text: "I almost got scammed by a fake loan app. TrustLens saved me from losing my data and money!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Software Engineer",
    text: "Finally, an AI that exposes fake loan apps before they can cause harm. Every smartphone should have this!",
    image: "RK",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "Teacher",
    text: "The Trust Score system is brilliant. I now verify every financial app before installing.",
    image: "AD",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block glass-card px-6 py-2 mb-6">
            <span className="text-accent-emerald font-semibold">💬 User Stories</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real people protected from real scams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass-card p-6 space-y-4 group cursor-pointer"
            >
              {/* Rating Stars */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground italic">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-accent-cyan/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center text-background font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 glass-card px-8 py-4">
            <div className="text-4xl font-bold gradient-text">4.9/5</div>
            <div className="text-left">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Based on 10,000+ reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
