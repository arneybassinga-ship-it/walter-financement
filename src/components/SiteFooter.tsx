import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import walterLogo from "@/assets/walter-logo.jpg";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* COLONNE 1 : BRAND & LOGO */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src={walterLogo}
                alt="Walter Entreprise"
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Simplifier l'accès au financement pour les particuliers et entrepreneurs en Afrique. Rapidité, transparence et confiance.
            </p>
          </div>

          {/* COLONNE 2 : LIENS RAPIDES */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><a href="#simulateur" className="hover:text-primary transition-colors">Simulateur de prêt</a></li>
              <li><a href="#demande" className="hover:text-primary transition-colors">Faire une demande</a></li>
              <li><Link to="/auth" className="hover:text-primary transition-colors">Espace Administration</Link></li>
            </ul>
          </div>

          {/* COLONNE 3 : CONTACT */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+242 06 631 9311</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>walterjordypremier@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Brazzaville, Republique du congo</span>
              </li>
            </ul>
          </div>

          {/* COLONNE 4 : MENTION LEGALE (Important pour le crédit) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Légal</h4>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80 italic">
              *Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Taux annuel fixe de 5% (XAF).
            </p>
          </div>

        </div>

        {/* BARRE DE FIN */}
        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-[12px] text-muted-foreground">
            © {currentYear} **Walter Entreprise**. Tous droits réservés. <br className="md:hidden" /> 
            Fièrement propulsé pour le développement économique local.
          </p>
        </div>
      </div>
    </footer>
  );
}