import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, ShieldAlert, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // --- TON MOT DE PASSE (Modifie-le si besoin) ---
  const ADMIN_PASSWORD = "WALTER_SECRET_2024"; 

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const savedPass = localStorage.getItem("walter_admin_session");
    if (savedPass === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("walter_admin_session", ADMIN_PASSWORD);
      setIsAuthorized(true);
      toast.success("Accès autorisé, bienvenue Walter !");
    } else {
      toast.error("Code incorrect. Accès refusé.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("walter_admin_session");
    setIsAuthorized(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
        <Card className="w-full max-w-md p-8 space-y-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-white rounded-[2rem]">
          <div className="text-center space-y-3">
            <div className="bg-primary/10 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto rotate-3">
              <KeyRound className="h-10 w-10 text-primary -rotate-3" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                Admin Walter
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Connexion sécurisée requise
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                type="password" 
                placeholder="Entrez le code secret" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 pl-12 text-center text-lg font-bold tracking-[0.5em] bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-14 font-black uppercase tracking-wider text-md rounded-2xl shadow-lg shadow-primary/20">
              Déverrouiller le Dashboard
            </Button>
          </form>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase justify-center pt-4 border-t border-slate-100">
            <ShieldAlert className="h-3 w-3 text-red-500" /> 
            Accès strictement réservé à l'administration
          </div>
        </Card>
      </div>
    );
  }

  // Si autorisé, on affiche le dashboard avec un petit bouton déconnexion caché quelque part ? 
  // Non, on garde ça simple. Tu es Walter, tu es chez toi !
  return <>{children}</>;
}