import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function LoanRequestForm({ amount, duration }: { amount: number; duration: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const whatsapp = formData.get("whatsapp") as string;

    try {
      let document_url = "";

      // 1. Upload du fichier (si présent)
      if (file) {
        // On nettoie le nom du fichier pour éviter les caractères spéciaux (espaces, accents)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw new Error(`Erreur Upload: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
        document_url = publicUrl;
      }

      // 2. Enregistrement en base de données
      // IMPORTANT : On s'assure que amount et duration sont des nombres
      const { error: insertError } = await supabase
        .from("loans")
        .insert([
          {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            whatsapp: whatsapp.trim(),
            amount: Number(amount),
            duration: Number(duration),
            document_url: document_url,
            status: "en_attente",
          },
        ]);

      if (insertError) throw new Error(`Erreur Base de données: ${insertError.message}`);

      toast.success("Votre demande a été enregistrée avec succès !");
      
      // Réinitialisation du formulaire
      (e.target as HTMLFormElement).reset();
      setFile(null);

    } catch (error: any) {
      console.error("Détails de l'erreur:", error);
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 shadow-2xl border-none bg-card">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="text-center mb-6">
          <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Finaliser ma demande</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Montant : <span className="text-primary">{amount.toLocaleString()} FCFA</span> | Durée : {duration} mois
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">Prénom</Label>
            <Input id="firstname" name="firstname" required placeholder="Ex: Jean" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Nom</Label>
            <Input id="lastname" name="lastname" required placeholder="Ex: Kouassi" className="h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
          <Input id="whatsapp" name="whatsapp" type="tel" required placeholder="+225 07..." className="h-12" />
        </div>

        <div className="space-y-2">
          <Label>Pièce d'identité (Photo CNI ou Passeport)</Label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/20 rounded-xl cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all">
            <Upload className="h-6 w-6 text-primary mb-2" />
            <span className="text-xs font-bold text-center px-2 truncate w-full">
              {file ? file.name : "Cliquez pour joindre votre CNI"}
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required 
            />
          </label>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-14 text-lg font-black uppercase tracking-tight"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin mr-2" /> 
              Envoi en cours...
            </>
          ) : (
            "Soumettre ma demande"
          )}
        </Button>
      </form>
    </Card>
  );
}