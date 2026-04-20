import heroImage from "@/assets/hero-finance.jpg";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, BadgePercent } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-30">
        <img
          src={heroImage}
          alt="Skyline financier abstrait représentant Walter Entreprise"
          className="h-full w-full object-cover"
          width={1536}
          height={1024}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary" />

      <div className="container relative mx-auto px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Financement responsable
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
            Donnez vie à vos projets avec{" "}
            <span className="text-warning">Walter Entreprise</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Simulez votre prêt en quelques secondes et obtenez une réponse rapide.
            Des solutions de financement transparentes, à partir de 5% par an.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="bg-warning text-warning-foreground hover:bg-warning/90"
              asChild
            >
              <a href="#simulateur">Simuler mon prêt</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <a href="#demande">Faire une demande</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: BadgePercent, label: "Taux fixe", value: "5% / an" },
              { icon: Clock, label: "Réponse", value: "Sous 48h" },
              { icon: ShieldCheck, label: "Sécurisé", value: "100% confidentiel" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Icon className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary-foreground/60">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
