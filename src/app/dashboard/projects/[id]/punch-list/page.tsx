"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PunchListItem } from "@/types";

interface FormData {
  title: string;
  description: string;
  severity: "critical" | "major" | "minor" | "cosmetic";
  status: "open" | "in-progress" | "closed";
  foundDuring?: string;
  dueDate: string;
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  severity: "minor",
  status: "open",
  foundDuring: "",
  dueDate: "",
};

export default function PunchListPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [projectName, setProjectName] = useState("");
  const [items, setItems] = useState<PunchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectRes, listRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/punch-list`),
        ]);

        const projectJson = await projectRes.json();
        setProjectName(projectJson.data?.name ?? "Progetto");

        const listJson = await listRes.json();
        setItems(listJson.data ?? []);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title) {
      setError("Compila il titolo");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId
        ? `/api/projects/${projectId}/punch-list?id=${editingId}`
        : `/api/projects/${projectId}/punch-list`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          severity: form.severity,
          status: form.status,
          foundDuring: form.foundDuring || undefined,
          dueDate: form.dueDate || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Errore");
        return;
      }

      if (editingId) {
        setItems((prev) =>
          prev.map((item) => (item.id === editingId ? json.data : item))
        );
        setEditingId(null);
      } else {
        setItems((prev) => [json.data, ...prev]);
      }

      setForm(EMPTY_FORM);
    } catch {
      setError("Errore di rete");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: PunchListItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      severity: item.severity,
      status: item.status,
      foundDuring: item.foundDuring || "",
      dueDate: item.dueDate
        ? new Date(item.dueDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questo item?")) return;

    try {
      const res = await fetch(
        `/api/projects/${projectId}/punch-list?id=${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError("Errore nell'eliminazione");
      }
    } catch {
      setError("Errore di rete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Caricamento...</div>
      </div>
    );
  }

  const openCount = items.filter((i) => i.status === "open").length;
  const closedCount = items.filter((i) => i.status === "closed").length;

  const severityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    major: "bg-orange-100 text-orange-800 border-orange-200",
    minor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cosmetic: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const severityLabels = {
    critical: "🔴 Critico",
    major: "🟠 Maggiore",
    minor: "🟡 Minore",
    cosmetic: "🔵 Cosmetico",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
        >
          ← Progetto
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Punch List</h1>
        <p className="text-gray-600 text-sm mb-8">{projectName}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Totale</p>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Aperti</p>
            <p className="text-2xl font-bold text-red-600">{openCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-600 font-medium mb-1">Chiusi</p>
            <p className="text-2xl font-bold text-green-600">{closedCount}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Modifica Item" : "Aggiungi Item"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titolo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="es. Rumore motore, Perdita olio, Cable management..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      severity: e.target.value as any,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="critical">🔴 Critico</option>
                  <option value="major">🟠 Maggiore</option>
                  <option value="minor">🟡 Minore</option>
                  <option value="cosmetic">🔵 Cosmetico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Aperto</option>
                  <option value="in-progress">In Corso</option>
                  <option value="closed">Chiuso</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trovato Durante
                </label>
                <select
                  value={form.foundDuring || ""}
                  onChange={(e) =>
                    setForm({ ...form, foundDuring: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Seleziona --</option>
                  <option value="FAT">FAT (Factory Acceptance Test)</option>
                  <option value="SAT">SAT (Site Acceptance Test)</option>
                  <option value="installation">Installazione</option>
                  <option value="other">Altro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Scadenza
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Dettagli del problema, cosa serve risolvere..."
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  Annulla
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Salvataggio..." : editingId ? "Aggiorna" : "Aggiungi"}
              </button>
            </div>
          </form>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="bg-gray-50 rounded-lg px-4 py-6 text-center text-gray-500 text-sm">
            Nessun item nella punch list
          </div>
        ) : (
          <div className="space-y-3">
            {items
              .sort((a, b) => {
                const severityOrder = {
                  critical: 0,
                  major: 1,
                  minor: 2,
                  cosmetic: 3,
                };
                return (
                  severityOrder[a.severity] - severityOrder[b.severity]
                );
              })
              .map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 ${severityColors[item.severity]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/50 font-medium">
                          {severityLabels[item.severity]}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm mt-2 opacity-90">
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-4 mt-3 text-xs opacity-75 flex-wrap">
                        {item.foundDuring && (
                          <span>📍 {item.foundDuring}</span>
                        )}
                        {item.dueDate && (
                          <span>
                            ⏰{" "}
                            {new Date(item.dueDate).toLocaleDateString(
                              "it-IT"
                            )}
                          </span>
                        )}
                        <span className="font-medium">
                          {item.status === "open"
                            ? "🔴 Aperto"
                            : item.status === "in-progress"
                            ? "🟡 In Corso"
                            : "✓ Chiuso"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-sm font-medium opacity-75 hover:opacity-100"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm font-medium opacity-75 hover:opacity-100"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
