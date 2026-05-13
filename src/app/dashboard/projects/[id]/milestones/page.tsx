"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectNavTabs from "@/components/ProjectNavTabs";
import Breadcrumb from "@/components/Breadcrumb";
import { Milestone } from "@/types";

interface FormData {
  title: string;
  description: string;
  plannedDate: string;
  status: "pending" | "in-progress" | "completed";
}

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  plannedDate: "",
  status: "pending",
};

export default function MilestonesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [projectName, setProjectName] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectRes, milestonesRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/milestones`),
        ]);

        const projectJson = await projectRes.json();
        setProjectName(projectJson.data?.name ?? "Progetto");

        const milestonesJson = await milestonesRes.json();
        setMilestones(milestonesJson.data ?? []);
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

    if (!form.title || !form.plannedDate) {
      setError("Compila titolo e data pianificata");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingId
        ? `/api/projects/${projectId}/milestones?id=${editingId}`
        : `/api/projects/${projectId}/milestones`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          plannedDate: form.plannedDate,
          status: form.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Errore");
        return;
      }

      if (editingId) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === editingId ? json.data : m))
        );
        setEditingId(null);
      } else {
        setMilestones((prev) => [json.data, ...prev]);
      }

      setForm(EMPTY_FORM);
    } catch {
      setError("Errore di rete");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setForm({
      title: milestone.title,
      description: milestone.description || "",
      plannedDate: new Date(milestone.plannedDate)
        .toISOString()
        .split("T")[0],
      status: milestone.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questo milestone?")) return;

    try {
      const res = await fetch(
        `/api/projects/${projectId}/milestones?id=${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      } else {
        setError("Errore nell'eliminazione");
      }
    } catch {
      setError("Errore di rete");
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Caricamento...</div>
      </div>
    );
  }

  const completedCount = milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const progressPercent =
    milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectNavTabs projectId={projectId} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Progetti", href: "/dashboard/projects" },
              { label: projectName || "Progetto", href: `/dashboard/projects/${projectId}/overview` },
              { label: "Milestone", href: "#" },
            ]}
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Milestone</h1>
        <p className="text-gray-600 text-sm mb-8">{projectName}</p>

        {/* Progress */}
        {milestones.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-700">Avanzamento</p>
              <p className="text-sm text-gray-500">
                {completedCount} di {milestones.length}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Modifica Milestone" : "Aggiungi Milestone"}
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
                placeholder="es. FAT Completato, Ordinazione Componenti..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Pianificata <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.plannedDate}
                  onChange={(e) =>
                    setForm({ ...form, plannedDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  <option value="pending">In Attesa</option>
                  <option value="in-progress">In Corso</option>
                  <option value="completed">Completato</option>
                </select>
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
                placeholder="Note sul milestone..."
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
                  onClick={handleCancel}
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
                {submitting
                  ? "Salvataggio..."
                  : editingId
                  ? "Aggiorna"
                  : "Aggiungi Milestone"}
              </button>
            </div>
          </form>
        </div>

        {/* Milestones List */}
        {milestones.length === 0 ? (
          <div className="bg-gray-50 rounded-lg px-4 py-6 text-center text-gray-500 text-sm">
            Nessun milestone aggiunto
          </div>
        ) : (
          <div className="space-y-3">
            {milestones
              .sort(
                (a, b) =>
                  new Date(a.plannedDate).getTime() -
                  new Date(b.plannedDate).getTime()
              )
              .map((m) => {
                const statusColors = {
                  pending: "bg-gray-100 text-gray-800",
                  "in-progress": "bg-blue-100 text-blue-800",
                  completed: "bg-green-100 text-green-800",
                };

                const statusLabels = {
                  pending: "In Attesa",
                  "in-progress": "In Corso",
                  completed: "Completato",
                };

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {m.title}
                        </h3>
                        {m.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {m.description}
                          </p>
                        )}
                        <div className="flex gap-4 mt-3 text-xs text-gray-500">
                          <span>
                            📅{" "}
                            {new Date(m.plannedDate).toLocaleDateString(
                              "it-IT"
                            )}
                          </span>
                          {m.actualDate && (
                            <span className="text-green-700 font-medium">
                              ✓ Completato:{" "}
                              {new Date(m.actualDate).toLocaleDateString(
                                "it-IT"
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded font-medium ${statusColors[m.status]}`}
                        >
                          {statusLabels[m.status]}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
