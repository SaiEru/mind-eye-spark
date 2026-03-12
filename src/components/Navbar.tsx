import { Eye, Activity, BarChart3, FileText, Shield, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { forwardRef } from "react";

const navItems = [
  { label: "Home", icon: Eye, path: "/" },
  { label: "Patient Assessment", icon: Activity, path: "/assessment" },
  { label: "Analytics Dashboard", icon: BarChart3, path: "/dashboard" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "AI Governance", icon: Shield, path: "/governance" },
];

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const location = useLocation();

  return (
    <nav ref={ref} className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Eye className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-semibold text-foreground">Eye Complication Risk</span>
            <p className="text-xs text-muted-foreground">Intelligence Platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              className="gap-2 text-sm"
              asChild
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
