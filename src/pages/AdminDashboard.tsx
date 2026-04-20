import { useEffect, useState } from "react";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { LoanRequestTable } from "@/components/admin/LoanRequestTable";
import { AdminGuard } from "@/components/admin/AdminGuard"; // Assure-toi de l'import
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, RefreshCw, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les données depuis Supabase
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Erreur Fetch:", error);
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du temps réel et chargement initial
  useEffect(() => {
    fetchRequests();

    const channel = supabase
      .channel('db-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'loans' 
      }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fonction pour se déconnecter du mode admin
  const handleLogout = () => {
    localStorage.removeItem("walter_admin_session");
    window.location.reload(); // Recharge la page pour afficher le Guard
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* HEADER PREMIUM */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                Accès Administrateur
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
                Walter <span className="text-primary text-stroke-sm">Entreprise</span>
              </h1>
              <p className="text-slate-500 font-medium italic">
                Gestion des flux financiers et dossiers clients.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Bouton Actualiser */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchRequests} 
                disabled={isLoading}
                className="bg-white border-slate-200 shadow-sm hover:bg-slate-50 font-bold rounded-xl h-11"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualiser
              </Button>

              {/* Statut Live */}
              <div className="flex items-center gap-3 bg-white px-4 h-11 rounded-xl shadow-sm border border-slate-200">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Flux Live</span>
              </div>

              {/* Bouton Déconnexion */}
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="h-11 px-4 rounded-xl font-bold shadow-lg shadow-red-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Quitter
              </Button>
            </div>
          </div>

          {isLoading && requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                <Loader2 className="h-16 w-16 animate-spin text-primary absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              </div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Synchronisation avec Supabase...</p>
            </div>
          ) : (
            <>
              {/* SECTION STATISTIQUES */}
              <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <AdminCharts requests={requests} />
              </section>

              {/* SECTION LISTE DES DEMANDES */}
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                      Demandes de crédit
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                      Examinez les pièces d'identité avant toute validation.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-2xl shadow-xl shadow-slate-200">
                    <span className="text-2xl font-black">{requests.length}</span>
                    <span className="text-[10px] font-bold uppercase leading-tight opacity-70">Dossiers<br/>Enregistrés</span>
                  </div>
                </div>

                {/* Tableau principal */}
                <div className="shadow-2xl shadow-slate-200 rounded-[2rem]">
                  <LoanRequestTable requests={requests} onRefresh={fetchRequests} />
                </div>
              </section>
            </>
          )}

          {/* FOOTER DISCRET */}
          <div className="text-center pb-10 pt-10 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            Walter Entreprise Dashboard Proprietary System — 2024
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}