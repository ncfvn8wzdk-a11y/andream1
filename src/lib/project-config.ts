import { ProjectType, ProjectPhase } from "@/types";

export const PROJECT_TYPES: Record<ProjectType, { label: string; description: string }> = {
  plant: { label: "Impianto", description: "Progettazione e costruzione impianto" },
  production_line: {
    label: "Linea Produzione",
    description: "Progettazione e costruzione linea di produzione",
  },
  retrofit: { label: "Retrofit", description: "Modifica/aggiornamento sistema esistente" },
  maintenance: { label: "Manutenzione", description: "Manutenzione e miglioramenti" },
};

export const PROJECT_PHASES: Record<ProjectPhase, { label: string; order: number }> = {
  concept: { label: "Concept / Fattibilità", order: 1 },
  basic_eng: { label: "Basic Engineering", order: 2 },
  detail_eng: { label: "Detail Engineering", order: 3 },
  procurement: { label: "Procurement", order: 4 },
  build: { label: "Manufacturing / Build", order: 5 },
  fat: { label: "FAT (Factory Acceptance)", order: 6 },
  installation: { label: "Trasporto / Installazione", order: 7 },
  sat: { label: "SAT (Site Acceptance)", order: 8 },
  training: { label: "Training", order: 9 },
  handover: { label: "Handover / Collaudo", order: 10 },
};

export function getPhaseLabel(phase: ProjectPhase): string {
  return PROJECT_PHASES[phase]?.label ?? phase;
}

export function getPhaseOrder(phase: ProjectPhase): number {
  return PROJECT_PHASES[phase]?.order ?? 0;
}

// Tariffa oraria standard (€/ora) - può essere configurata
const HOURLY_RATE = 75;

export function calculateProjectCost(totalHours: number, customRate?: number): number {
  const rate = customRate ?? HOURLY_RATE;
  return Math.round(totalHours * rate * 100) / 100;
}

export function calculateBudgetStatus(
  budget: number | undefined,
  totalHours: number
): {
  actual: number;
  remaining: number;
  percentUsed: number;
  status: "ok" | "warning" | "over";
} {
  const actual = calculateProjectCost(totalHours);

  if (!budget) {
    return {
      actual,
      remaining: 0,
      percentUsed: 0,
      status: "ok",
    };
  }

  const remaining = budget - actual;
  const percentUsed = Math.round((actual / budget) * 100);

  return {
    actual,
    remaining,
    percentUsed,
    status: percentUsed <= 80 ? "ok" : percentUsed <= 100 ? "warning" : "over",
  };
}
