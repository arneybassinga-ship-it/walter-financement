import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminCharts } from "@/components/AdminCharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { formatEUR, STATUS_LABELS } from "@/lib/loan";
import { Loader2, LogOut, ShieldAlert, Inbox } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Walter Entreprise" },
      { name: "description", content: "Tableau de bord administrateur Walter Entreprise." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type LoanStatus = "en_attente" | "approuve" | "refuse";

interface LoanRequest {
  id: string;
  firstname: string;
  lastname: string;
  whatsapp: string;
  amount: number;
  duration: number;
  document_url: string;
  status: LoanStatus;
  created_at: string;
}

const STATUS_VARIANT: Record<LoanStatus, string> = {
  en_attente: "bg-warning/15 text-warning-foreground border-warning/30",
  approuve: "bg-success/15 text-success border-success/30",
  refuse: "bg-destructive/15 text-destructive border-destructive/30",
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selected, setSelected] = useState<LoanRequest | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void fetchRequests();
  }, [isAdmin]);

  const fetchRequests = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });
    setLoadingData(false);
    if (error) {
      toast.error("Impossible de charger les demandes");
      return;
    }
    setRequests((data as unknown as LoanRequest[]) ?? []);
  };

  const updateStatus = async (id: string, status: LoanStatus) => {
    const { error } = await supabase.from("loans").update({ status }).eq("id", id);
    if (error) {
      toast.error("Mise à jour impossible");
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Statut mis à jour : ${STATUS_LABELS[status]}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-subtle">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <Card className="max-w-md p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Accès refusé</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre compte n'a pas le rôle administrateur. Contactez un administrateur Walter
              Entreprise pour obtenir l'accès.
            </p>
            <p className="mt-3 break-all text-xs text-muted-foreground">
              ID utilisateur : <span className="font-mono">{user.id}</span>
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <SiteHeader />
      <main className="container mx-auto flex-1 px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Tableau de bord
            </span>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
              Demandes de prêt
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connecté en tant que <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Total" value={requests.length} />
          <StatCard
            label="En attente"
            value={requests.filter((r) => r.status === "en_attente").length}
            tone="warning"
          />
          <StatCard
            label="Approuvées"
            value={requests.filter((r) => r.status === "approuve").length}
            tone="success"
          />
          <StatCard
            label="Refusées"
            value={requests.filter((r) => r.status === "refuse").length}
            tone="destructive"
          />
        </div>

        <AdminCharts requests={requests} />

        <Card className="overflow-hidden shadow-card">
          {loadingData ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium text-foreground">Aucune demande pour le moment</p>
              <p className="text-sm text-muted-foreground">
                Les nouvelles demandes apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow
                      key={r.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(r)}
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">{r.firstname} {r.lastname}</div>
                        <div className="text-xs text-muted-foreground">{r.whatsapp}</div>
                      </TableCell>
                      <TableCell className="font-medium">{formatEUR(r.amount)}</TableCell>
                      <TableCell>{r.duration} mois</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_VARIANT[r.status]} variant="outline">
                          {STATUS_LABELS[r.status]}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={r.status}
                          onValueChange={(v) => updateStatus(r.id, v as LoanStatus)}
                        >
                          <SelectTrigger className="ml-auto w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="approuve">Approuvé</SelectItem>
                            <SelectItem value="refuse">Refusé</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selected.firstname} {selected.lastname}</DialogTitle>
                <DialogDescription>
                  Demande soumise le{" "}
                  {new Date(selected.created_at).toLocaleString("fr-FR")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <DetailField label="WhatsApp" value={selected.whatsapp} />
                <DetailField label="Statut" value={STATUS_LABELS[selected.status]} />
                <DetailField label="Montant demandé" value={formatEUR(selected.amount)} />
                <DetailField label="Durée" value={`${selected.duration} mois`} />
              </div>
              {selected.document_url && (
                <div className="mt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Pièce d'identité
                  </p>
                  <a
                    href={selected.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    Voir le document
                  </a>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning" | "success" | "destructive";
}) {
  const toneClass = {
    default: "text-primary",
    warning: "text-warning",
    success: "text-success",
    destructive: "text-destructive",
  }[tone];

  return (
    <Card className="p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl font-bold ${toneClass}`}>{value}</p>
    </Card>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
