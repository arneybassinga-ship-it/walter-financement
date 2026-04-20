import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/Hero";
import { LoanSimulator } from "@/components/LoanSimulator";
import { LoanRequestForm } from "@/components/LoanRequestForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Walter Entreprise — Simulez votre prêt en FCFA" },
      {
        name: "description",
        content:
          "Simulateur de prêt Walter Entreprise : choisissez votre montant en CFA, votre durée, et obtenez votre mensualité à 5% par an.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  // Montant par défaut adapté au CFA (ex: 1 000 000 FCFA)
  const [amount, setAmount] = useState(1000000);
  const [duration, setDuration] = useState(12);

  return (
    <div className="flex min-h-screen flex-col bg-background scroll-smooth">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero : Impact visuel immédiat */}
        <Hero />

        {/* SECTION SIMULATEUR */}
        <section id="simulateur" className="bg-slate-50/50 py-16 md:py-24 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 mb-4">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                  Étape 1 : Simulation
                </span>
              </div>
              <h2 className="font-display text-3xl font-black text-slate-900 md:text-5xl tracking-tight">
                Simulez votre prêt en <span className="text-primary text-gradient">CFA</span>
              </h2>
              <p className="mt-4 text-sm md:text-lg text-muted-foreground leading-relaxed">
                Ajustez le montant et la durée pour voir votre mensualité (Taux fixe de 5%).
              </p>
            </div>
            
            {/* Carte du simulateur avec effet de profondeur */}
            <div className="mx-auto max-w-5xl bg-background rounded-3xl shadow-2xl shadow-primary/5 border border-border p-4 md:p-8">
              <LoanSimulator
                amount={amount}
                duration={duration}
                onAmountChange={setAmount}
                onDurationChange={setDuration}
              />
            </div>
          </div>
        </section>

        {/* SECTION FORMULAIRE */}
        <section id="demande" className="py-16 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 mb-4">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-700">
                  Étape 2 : Inscription
                </span>
              </div>
              <h2 className="font-display text-3xl font-black text-slate-900 md:text-5xl tracking-tight">
                Déposez votre dossier
              </h2>
              <p className="mt-4 text-sm md:text-lg text-muted-foreground">
                Étude de dossier rapide sous 48h. Sécurisé et confidentiel.
              </p>
            </div>

            {/* Formulaire : Max-width réduit pour une meilleure lecture sur PC */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                {/* Petit élément décoratif pour souligner le sérieux */}
                <div className="absolute -top-4 -right-4 hidden md:block">
                  <div className="bg-primary text-white p-4 rounded-2xl shadow-lg rotate-12 text-xs font-bold uppercase">
                    100% Sécurisé
                  </div>
                </div>
                
                <div className="border border-border rounded-[2.5rem] p-6 md:p-12 bg-card shadow-elegant relative z-10">
                  <LoanRequestForm amount={amount} duration={duration} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}