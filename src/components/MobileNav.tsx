import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Shield, Scan, Compass, MessageSquare, Users, User, LogIn, Home, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useAuth } from "@/hooks/useAuth";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/explore", label: "Explore Apps", icon: Compass },
    { to: "/finsage", label: "FinSage AI", icon: MessageSquare },
    { to: "/community", label: "Community", icon: Users },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden bg-foreground/90 backdrop-blur-sm text-bento-dark hover:bg-foreground shadow-lg rounded-full"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] bg-bento-light border-r border-bento-dark/10">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-bento-dark" />
            <span className="text-xl font-bold text-bento-dark">TrustLens AI</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-bento-dark hover:bg-foreground transition-colors"
            >
              <item.icon className="w-5 h-5 text-bento-purple" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <div className="my-4 h-px bg-bento-dark/10" />

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-bento-dark hover:bg-foreground transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-bento-purple" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/profile/edit"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-bento-dark hover:bg-foreground transition-colors"
              >
                <User className="w-5 h-5 text-bento-purple" />
                <span className="font-medium">Profile</span>
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bento-purple text-foreground hover:bg-bento-purple/90 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Login / Sign Up</span>
            </Link>
          )}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            className="w-full bg-accent-lime text-bento-dark hover:bg-accent-lime/90 rounded-full py-6 font-semibold"
            onClick={() => setOpen(false)}
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan an App
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
