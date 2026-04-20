/**
 * Taux d'intérêt fixe pour Walter Entreprise (5%)
 */
export const ANNUAL_INTEREST_RATE = 5;

/**
 * Calcule les détails du prêt.
 * @param amount - Le capital emprunté
 * @param durationMonths - La durée
 * @param annualRate - Le taux (par défaut 5%)
 */
export function calculateLoan(amount: number, durationMonths: number, annualRate = ANNUAL_INTEREST_RATE) {
  const totalInterest = amount * (annualRate / 100);
  const totalRepayment = amount + totalInterest;
  const monthlyPayment = durationMonths > 0 ? totalRepayment / durationMonths : totalRepayment;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
  };
}

/**
 * Formate un nombre en Franc CFA (FCFA)
 */
export function formatCFA(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " FCFA";
}

/**
 * Formate un nombre en Franc CFA avec deux décimales
 */
export function formatCFADecimal(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + " FCFA";
}

/**
 * COMPATIBILITÉ : Alias pour éviter les erreurs d'import "formatEUR"
 */
export function formatEUR(value: number) {
  return formatCFA(value);
}

/**
 * COMPATIBILITÉ : Alias pour éviter l'erreur "formatEURDecimal"
 */
export function formatEURDecimal(value: number) {
  return formatCFADecimal(value);
}

/**
 * Labels des statuts
 */
export const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  approuve: "Approuvé",
  refuse: "Refusé",
};