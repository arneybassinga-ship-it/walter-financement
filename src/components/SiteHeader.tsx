import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import walterLogo from "@/assets/walter-logo.jpg";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <img
            src={walterLogo}
            alt="Walter Entreprise"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* NAVIGATION SECTION */}
        <nav className="flex items-center gap-1 md:gap-6">
          <Link
            to="/"
            className="hidden px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary sm:inline-block"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary font-semibold" }}
          >
            Accueil
          </Link>

          <div className="hidden h-4 w-[1px] bg-border/60 sm:block" />

          <Link to="/auth">
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-elegant"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Espace Admin</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
