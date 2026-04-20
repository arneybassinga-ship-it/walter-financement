import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace administrateur — Walter Entreprise" },
      { name: "description", content: "Connexion à l'espace d'administration Walter Entreprise." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/admin" });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Identifiants invalides" : error.message);
      return;
    }
    toast.success("Connexion réussie");
    navigate({ to: "/admin" });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Compte créé. Un administrateur doit vous attribuer le rôle admin.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-8 shadow-elegant">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Espace administrateur</h1>
              <p className="text-sm text-muted-foreground">Accès réservé aux gestionnaires</p>
            </div>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Créer un compte</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input id="login-password" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input id="signup-password" name="password" type="password" required minLength={8} autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer un compte"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Le rôle administrateur doit être attribué manuellement après l'inscription.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
