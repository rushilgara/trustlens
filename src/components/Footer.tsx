import { Shield, Twitter, Linkedin, Youtube, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const links = {
    product: [
      { name: "Home", href: "#hero" },
      { name: "Features", href: "#features" },
      { name: "Trust Score", href: "#trust-score" },
      { name: "FinSage Chat", href: "/finsage" },
      { name: "Contact", href: "#contact" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Support", href: "#" },
    ],
  };

  const socials = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative py-16 px-4 border-t border-accent-cyan/20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center">
                <Shield className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-bold gradient-text">TrustLens AI</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your Financial Safety Guardian. Powered by advanced AI to protect you from predatory loan apps and financial scams.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-accent-cyan/20 hover:scale-110 transition-all"
                >
                  <social.icon className="w-5 h-5 text-accent-cyan" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent-cyan">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link, idx) => (
                <li key={idx}>
                  {link.href.startsWith('#') ? (
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-accent-cyan transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-accent-cyan transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent-emerald">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent-emerald transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-accent-cyan/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 TrustLens AI. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with <span className="text-accent-cyan">♥</span> to protect financial freedom
          </p>
        </div>
      </div>
    </footer>
  );
};
