"use client";

import { calculateBudgetStatus } from "@/lib/project-config";

interface BudgetTrackerProps {
  budget?: number;
  totalHours: number;
}

export default function BudgetTracker({ budget, totalHours }: BudgetTrackerProps) {
  const budgetStatus = calculateBudgetStatus(budget, totalHours);

  if (!budget) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Nessun budget pianificato</p>
        <p className="text-xs text-gray-400 mt-1">Costo consuntivo: €{budgetStatus.actual.toFixed(2)}</p>
      </div>
    );
  }

  const statusColors = {
    ok: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    over: "bg-red-50 border-red-200",
  };

  const statusTextColors = {
    ok: "text-green-800",
    warning: "text-yellow-800",
    over: "text-red-800",
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${statusColors[budgetStatus.status]}`}>
      {/* Top row: Budget vs Actual */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-600 text-xs uppercase font-medium">Budget Pianificato</p>
          <p className={`text-xl font-bold mt-1 ${statusTextColors[budgetStatus.status]}`}>
            €{budget.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-xs uppercase font-medium">Consuntivo</p>
          <p className={`text-xl font-bold mt-1 ${statusTextColors[budgetStatus.status]}`}>
            €{budgetStatus.actual.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-xs uppercase font-medium">Rimanente</p>
          <p
            className={`text-xl font-bold mt-1 ${
              budgetStatus.remaining >= 0
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            €{budgetStatus.remaining.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-medium text-gray-700">Utilizzo Budget</p>
          <p className={`text-xs font-semibold ${statusTextColors[budgetStatus.status]}`}>
            {budgetStatus.percentUsed}%
          </p>
        </div>
        <div className={`w-full rounded-full h-2 border ${
          budgetStatus.status === "ok"
            ? "bg-green-100 border-green-300"
            : budgetStatus.status === "warning"
            ? "bg-yellow-100 border-yellow-300"
            : "bg-red-100 border-red-300"
        }`}>
          <div
            className={`h-2 rounded-full transition-all ${
              budgetStatus.status === "ok"
                ? "bg-green-600"
                : budgetStatus.status === "warning"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
            style={{ width: `${Math.min(budgetStatus.percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Status message */}
      <div className={`text-xs font-medium ${statusTextColors[budgetStatus.status]}`}>
        {budgetStatus.status === "ok" && (
          <p>✓ Budget OK - Ore consuntivate: {totalHours.toFixed(1)}</p>
        )}
        {budgetStatus.status === "warning" && (
          <p>⚠ Attenzione: {budgetStatus.percentUsed}% del budget utilizzato</p>
        )}
        {budgetStatus.status === "over" && (
          <p>✕ Budget superato di €{Math.abs(budgetStatus.remaining).toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}
