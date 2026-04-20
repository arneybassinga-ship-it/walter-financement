import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCFA, STATUS_LABELS } from "@/lib/loan";

// Type strict pour correspondre à ta base de données
type LoanStatus = "en_attente" | "approuve" | "refuse";

interface LoanRow {
  amount: number;
  status: LoanStatus;
  created_at: string;
}

// Couleurs charte graphique Walter
const STATUS_COLORS: Record<LoanStatus, string> = {
  en_attente: "#f59e0b", // Orange/Ambre
  approuve: "#10b981",   // Vert
  refuse: "#ef4444",     // Rouge
};

export function AdminCharts({ requests }: { requests: LoanRow[] }) {
  // 1. Statistiques des statuts (Camembert)
  const statusData = useMemo(() => {
    const counts: Record<LoanStatus, number> = {
      en_attente: 0,
      approuve: 0,
      refuse: 0,
    };
    
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });

    return (Object.keys(counts) as LoanStatus[])
      .filter((k) => counts[k] > 0)
      .map((k) => ({
        name: STATUS_LABELS[k] || k,
        value: counts[k],
        key: k,
      }));
  }, [requests]);

  // 2. Statistiques mensuelles (Histogramme)
  const monthlyData = useMemo(() => {
    const map = new Map<string, { month: string; total: number; count: number; sortKey: string }>();
    const now = new Date();
    
    // Initialise les 6 derniers mois pour éviter les vides
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      map.set(sortKey, { month: label, total: 0, count: 0, sortKey });
    }

    requests.forEach((r) => {
      const d = new Date(r.created_at);
      const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = map.get(sortKey);
      if (entry) {
        entry.total += Number(r.amount);
        entry.count += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [requests]);

  // Calculs des totaux
  const totalAmount = requests.reduce((sum, r) => sum + Number(r.amount), 0);
  const approvedAmount = requests
    .filter((r) => r.status === "approuve")
    .reduce((sum, r) => sum + Number(r.amount), 0);

  if (requests.length === 0) return null;

  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-3">
      
      {/* RÉPARTITION DES STATUTS */}
      <Card className="p-6 shadow-xl border-none bg-card/60 backdrop-blur-md">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            États des demandes
          </p>
          <p className="mt-1 text-2xl font-black">
            {requests.length} <span className="text-sm font-medium opacity-50 text-muted-foreground uppercase">Dossiers</span>
          </p>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={8}
                stroke="none"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* VOLUMES FINANCIERS */}
      <Card className="p-6 shadow-xl border-none bg-card/60 backdrop-blur-md lg:col-span-2">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Volume Total (CFA)
            </p>
            <p className="mt-1 text-2xl font-black text-primary">
              {formatCFA(totalAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">
              Total Approuvé
            </p>
            <p className="mt-1 text-2xl font-black text-green-500">
              {formatCFA(approvedAmount)}
            </p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--primary))", opacity: 0.05 }}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value: number) => [formatCFA(value), "Montant"]}
              />
              <Bar 
                dataKey="total" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}