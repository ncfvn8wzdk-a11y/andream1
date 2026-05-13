"use client";

import { ProjectCost } from "@/types";

interface CostTrackerProps {
  costs: ProjectCost[];
  budgetPlanned?: number;
  onDeleteCost?: (costId: string) => void;
}

const DOCUMENT_TYPES: Record<string, string> = {
  invoice: "Fattura",
  order: "Ordine",
  estimate: "Preventivo",
  other: "Altro",
};

export default function CostTracker({ costs, budgetPlanned, onDeleteCost }: CostTrackerProps) {
  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const remaining = budgetPlanned ? budgetPlanned - totalCosts : null;
  const percentUsed = budgetPlanned ? Math.round((totalCosts / budgetPlanned) * 100) : 0;

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

  let status: "ok" | "warning" | "over" = "ok";
  if (budgetPlanned) {
    if (percentUsed > 100) status = "over";
    else if (percentUsed > 80) status = "warning";
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {budgetPlanned && (
        <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-600 text-xs uppercase font-medium mb-1">Budget Pianificato</p>
              <p className={`text-xl font-bold ${statusTextColors[status]}`}>
                €{budgetPlanned.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-xs uppercase font-medium mb-1">Consuntivo</p>
              <p className={`text-xl font-bold ${statusTextColors[status]}`}>
                €{totalCosts.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-xs uppercase font-medium mb-1">Rimanente</p>
              <p
                className={`text-xl font-bold ${
                  remaining && remaining >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                €{remaining ? remaining.toFixed(2) : "-"}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-gray-700">Utilizzo Budget</p>
              <p className={`text-xs font-semibold ${statusTextColors[status]}`}>
                {percentUsed}%
              </p>
            </div>
            <div className={`w-full rounded-full h-2 border ${
              status === "ok"
                ? "bg-green-100 border-green-300"
                : status === "warning"
                ? "bg-yellow-100 border-yellow-300"
                : "bg-red-100 border-red-300"
            }`}>
              <div
                className={`h-2 rounded-full transition-all ${
                  status === "ok"
                    ? "bg-green-600"
                    : status === "warning"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Costs Table */}
      {costs.length === 0 ? (
        <div className="bg-gray-50 rounded-lg px-4 py-6 text-center text-gray-500 text-sm">
          Nessun documento di costo caricato
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Fornitore</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Data</th>
                <th className="text-right px-4 py-3 font-medium text-gray-700">Importo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">File</th>
                {onDeleteCost && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {DOCUMENT_TYPES[cost.documentType] || cost.documentType}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {cost.vendor || "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(cost.date).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                    €{cost.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs truncate max-w-xs">
                    {cost.fileName}
                  </td>
                  {onDeleteCost && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeleteCost(cost.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Elimina
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">
                  Totale:
                </td>
                <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">
                  €{totalCosts.toFixed(2)}
                </td>
                <td colSpan={onDeleteCost ? 2 : 1}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
