import { useEffect, useState } from "react";
import { AdminCharts } from "@/components/admin/AdminCharts";
import { LoanRequestTable } from "@/components/admin/LoanRequestTable";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // 1. Initialise avec un tableau vide, PAS avec MOCK_DATA
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // 2. On appelle la table 'loans'
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // 3. On met à jour l'état avec les vraies données
      console.log("Données récupérées :", data); // Pour vérifier dans ta console
      setRequests(data || []);
      
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-between items-center border-b pb-6">
          <h1 className="text-4xl font-black uppercase">Tableau de Bord</h1>
          <Button onClick={fetchRequests} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Actualiser
          </Button>
        </div>

        {/* Si c'est vide après le chargement */}
        {requests.length === 0 && !isLoading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400 font-bold uppercase">Aucune donnée réelle trouvée dans Supabase</p>
          </div>
        ) : (
          <>
            <AdminCharts requests={requests} />
            <div className="mt-10">
               <h2 className="text-2xl font-bold mb-4">Demandes Réelles</h2>
               <LoanRequestTable requests={requests} onRefresh={fetchRequests} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}