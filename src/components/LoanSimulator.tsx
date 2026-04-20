import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Wallet, Info } from "lucide-react";

const formatCFA = (val: number) => new Intl.NumberFormat("fr-FR").format(Math.round(val)) + " FCFA";

export function LoanSimulator({ amount, duration, onAmountChange, onDurationChange }: any) {
  
  // NOUVELLE LOGIQUE DE CALCUL SELON TES PALIERS
  const calculation = useMemo(() => {
    let rate = 0;
    
    if (duration <= 10) {
      rate = 0.15; // 15% pour 10 jours ou moins
    } else if (duration <= 20) {
      rate = 0.30; // 30% pour 11 à 20 jours
    } else {
      rate = 0.45; // 45% au-delà (jusqu'à 45 jours)
    }

    const interest = amount * rate;
    const total = amount + interest;

    return {
      interest,
      total,
      ratePercent: rate * 100
    };
  }, [amount, duration]);

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-card">
      <div className="flex flex-col md:grid md:grid-cols-5">
        
        {/* ZONE DE RÉGLAGES (BLANCHE/GRISE) */}
        <div className="space-y-8 p-6 md:col-span-3 md:p-10 text-foreground">
          <div>
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" /> Walter Entreprise
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Simulation de prêt à taux fixe par palier.
            </p>
          </div>

          <div className="space-y-10">
            {/* RÉGLAGE MONTANT */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold opacity-70 uppercase tracking-wider">Montant</Label>
                <span className="text-2xl font-black text-primary">{formatCFA(amount)}</span>
              </div>
              <Slider 
                value={[amount]} 
                min={5000} 
                max={500000} 
                step={5000} 
                onValueChange={([v]) => onAmountChange(v)} 
                className="py-4"
              />
            </div>

            {/* RÉGLAGE DURÉE (JOURS) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold opacity-70 uppercase tracking-wider">Durée du prêt</Label>
                <span className="text-2xl font-black text-primary">{duration} Jours</span>
              </div>
              <Slider 
                value={[duration]} 
                min={1} 
                max={45} 
                step={1} 
                onValueChange={([v]) => onDurationChange(v)} 
                className="py-4"
              />
              
              {/* INDICATEUR DE PALIER VISUEL */}
              <div className="flex items-start gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200">
                <Info className="h-4 w-4 text-slate-500 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-tight">
                   <strong>Tarification Walter :</strong> 1-10j (15%) • 11-20j (30%) • 21-45j (45%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE DE RÉSULTAT (ZONE BLEUE) */}
        <div className="bg-primary p-8 text-primary-foreground md:col-span-2 flex flex-col justify-center text-center md:text-left">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-70 mb-1">
                Total à rembourser
              </p>
              <p className="text-4xl md:text-5xl font-black tracking-tighter">
                {formatCFA(calculation.total)}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/20">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Capital emprunté</span>
                <span className="font-medium">{formatCFA(amount)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="opacity-70">Frais ({calculation.ratePercent}%)</span>
                <span className="font-bold text-green-300">+{formatCFA(calculation.interest)}</span>
              </div>
              
              <div className="mt-6 p-3 bg-white/10 rounded-xl">
                <p className="text-[10px] uppercase opacity-60">Date de remboursement</p>
                <p className="text-sm font-bold">
                  Dans {duration} jours
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}