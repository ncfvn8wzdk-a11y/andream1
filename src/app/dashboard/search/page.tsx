"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// --- Types ---
interface CostResult {
  id: string;
  fileName: string;
  documentType: string;
  amount: number;
  vendor?: string;
  description?: string;
  date: Date;
  project: { id: string; name: string; commessa?: string };
}

interface ProjectResult {
  id: string;
  name: string;
  commessa?: string;
  description?: string;
  status: string;
  currentPhase: string;
  owner: { name: string };
  _count: { timeLogs: number; costs: number };
}

interface MilestoneResult {
  id: string;
  title: string;
  description?: string;
  plannedDate: Date;
  status: string;
  project: { id: string; name: string; commessa?: string };
}

interface PunchResult {
  id: string;
  title: string;
  description?: string;
  severity: string;
  status: string;
  foundDuring?: string;
  project: { id: string; name: string; commessa?: string };
}

interface SearchResults {
  projects: ProjectResult[];
  costs: CostResult[];
  milestones: MilestoneResult[];
  punchItems: PunchResult[];
}

const DOC_TYPE_LABELS: Record<string, string> = {
  invoice: "Fattura",
  order: "Ordine",
  estimate: "Preventivo",
  other: "Altro",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-700 bg-red-100",
  major: "text-orange-700 bg-orange-100",
  minor: "text-yellow-700 bg-yellow-100",
  cosmetic: "text-blue-700 bg-blue-100",
};

// --- Component ---
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<"all" | "costs" | "projects" | "milestones" | "punch">("all");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [results, setResults] = useState<SearchResults>({
    projects: [],
    costs: [],
    milestones: [],
    punchItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const totalResults =
    results.projects.length +
    results.costs.length +
    results.milestones.length +
    results.punchItems.length;

  const doSearch = useCallback(async () => {
    const hasInput =
      query.trim() || amountMin || amountMax || dateFrom || dateTo;
    if (!hasInput) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (activeType !== "all") params.set("type", activeType);
      if (amountMin) params.set("amountMin", amountMin);
      if (amountMax) params.set("amountMax", amountMax);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/search?${params.toString()}`);
      const json = await res.json();
      setResults(json.data ?? { projects: [], costs: [], milestones: [], punchItems: [] });
      setSearched(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [query, activeType, amountMin, amountMax, dateFrom, dateTo]);

  // Debounced search on query change
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(doSearch, 500);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/projects"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← Progetti
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Ricerca</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cerca tra fatture, costi, progetti e documenti per stimare un nuovo progetto
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-5"
        >
          {/* Main search input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Parola chiave: fornitore, descrizione, progetto, commessa..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Ricerca..." : "Cerca"}
            </button>
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Importo min (€)
              </label>
              <input
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Importo max (€)
              </label>
              <input
                type="number"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="999999"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Dal
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Al
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { key: "all", label: "Tutto" },
                { key: "costs", label: "💰 Fatture & Costi" },
                { key: "projects", label: "📁 Progetti" },
                { key: "milestones", label: "🎯 Milestone" },
                { key: "punch", label: "📝 Punch List" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveType(key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                  activeType === key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </form>

        {/* Results */}
        {!searched && !loading && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Inserisci una parola chiave per cercare tra tutti i dati del progetto
          </div>
        )}

        {searched && totalResults === 0 && !loading && (
          <div className="text-center py-12 text-gray-400 text-sm">
            Nessun risultato trovato per "{query}"
          </div>
        )}

        {searched && totalResults > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {totalResults} risultat{totalResults === 1 ? "o" : "i"}
          </p>
        )}

        <div className="space-y-8">
          {/* COSTS section */}
          {results.costs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                💰 Fatture & Costi ({results.costs.length})
              </h2>

              {/* Cost totals for quick estimation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-3 flex items-center gap-6 text-sm">
                <div>
                  <span className="text-blue-700 font-semibold">Totale risultati: </span>
                  <span className="text-blue-900 font-bold text-lg">
                    €{results.costs.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-blue-600 text-xs">
                  Media per documento: €
                  {(
                    results.costs.reduce((sum, c) => sum + c.amount, 0) /
                    results.costs.length
                  ).toFixed(2)}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Fornitore</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Progetto</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Importo</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.costs.map((cost) => (
                      <tr
                        key={cost.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {DOC_TYPE_LABELS[cost.documentType] || cost.documentType}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {cost.vendor || <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dashboard/projects/${cost.project.id}/costs`}
                            className="text-blue-600 hover:underline"
                          >
                            {cost.project.name}
                          </Link>
                          {cost.project.commessa && (
                            <span className="text-gray-400 text-xs ml-1">
                              ({cost.project.commessa})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(cost.date).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 whitespace-nowrap">
                          €{cost.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                          {cost.description || cost.fileName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
                        Totale:
                      </td>
                      <td className="px-4 py-2 text-right font-bold text-gray-900">
                        €{results.costs.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )}

          {/* PROJECTS section */}
          {results.projects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                📁 Progetti ({results.projects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}/overview`}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{project.name}</p>
                        {project.commessa && (
                          <p className="text-xs text-gray-500">
                            Commessa: {project.commessa}
                          </p>
                        )}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 whitespace-nowrap">
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span>{project._count.timeLogs} log ore</span>
                      <span>{project._count.costs} doc costi</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* MILESTONES section */}
          {results.milestones.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                🎯 Milestone ({results.milestones.length})
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {results.milestones.map((m) => (
                  <div key={m.id} className="px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <Link
                          href={`/dashboard/projects/${m.project.id}/milestones`}
                          className="text-blue-600 hover:underline"
                        >
                          {m.project.name}
                        </Link>
                        {m.project.commessa && (
                          <span className="ml-1">({m.project.commessa})</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                      <p>{new Date(m.plannedDate).toLocaleDateString("it-IT")}</p>
                      <p className="font-medium mt-0.5">{m.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PUNCH LIST section */}
          {results.punchItems.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                📝 Punch List ({results.punchItems.length})
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {results.punchItems.map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${SEVERITY_COLORS[item.severity] || "text-gray-700 bg-gray-100"}`}
                        >
                          {item.severity}
                        </span>
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <Link
                          href={`/dashboard/projects/${item.project.id}/punch-list`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.project.name}
                        </Link>
                        {item.foundDuring && (
                          <span className="ml-1 text-gray-400">— {item.foundDuring}</span>
                        )}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                        item.status === "closed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
