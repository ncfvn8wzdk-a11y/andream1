"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface TimeLog {
  id: string;
  userId: string;
  hours: number;
  date: Date;
  description?: string;
}

interface User {
  id: string;
  name: string;
}

interface FormData {
  userId: string;
  hours: string;
  date: string;
  description: string;
}

export default function TimeLogsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [projectName, setProjectName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    userId: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectRes, usersRes, logsRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch("/api/users"),
          fetch(`/api/projects/${projectId}/time-logs`),
        ]);

        const projectJson = await projectRes.json();
        setProjectName(projectJson.data?.name ?? "Progetto");

        const usersJson = await usersRes.json();
        setUsers(usersJson.data ?? []);

        const logsJson = await logsRes.json();
        setTimeLogs(logsJson.data ?? []);
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

    if (!form.userId || !form.hours || !form.date) {
      setError("Compila tutti i campi obbligatori");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/time-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.userId,
          hours: parseFloat(form.hours),
          date: form.date,
          description: form.description || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Errore nell'inserimento");
        return;
      }

      setTimeLogs((prev) => [json.data, ...prev]);
      setForm({
        userId: "",
        hours: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch {
      setError("Errore di rete");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (logId: string) => {
    if (!confirm("Eliminare questa voce di ore?")) return;

    try {
      const res = await fetch(
        `/api/projects/${projectId}/time-logs?id=${logId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setTimeLogs((prev) => prev.filter((log) => log.id !== logId));
      } else {
        setError("Errore nell'eliminazione");
      }
    } catch {
      setError("Errore di rete");
    }
  };

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);
  const hoursByUser = users.map((u) => ({
    ...u,
    hours: timeLogs
      .filter((log) => log.userId === u.id)
      .reduce((sum, log) => sum + log.hours, 0),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Caricamento...</div>
      </div>
    );
  }

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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tracciamento Ore</h1>
        <p className="text-gray-600 text-sm mb-8">{projectName}</p>

        {/* Form Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inserisci Ore</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.userId}
                  onChange={(e) =>
                    setForm({ ...form, userId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleziona...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ore <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.hours}
                  onChange={(e) =>
                    setForm({ ...form, hours: e.target.value })
                  }
                  placeholder="es. 8"
                  step="0.5"
                  min="0"
                  max="24"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione (cosa è stato fatto)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="es. Installazione motore principale, test impianto..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Salvataggio..." : "Aggiungi Ore"}
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Ore Totali</p>
            <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Voci Inserite</p>
            <p className="text-3xl font-bold text-gray-900">{timeLogs.length}</p>
          </div>
        </div>

        {/* Hours by Person */}
        {hoursByUser.some((u) => u.hours > 0) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ore per Persona</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {hoursByUser.map((u) => (
                <div
                  key={u.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900">{u.name}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {u.hours.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Logs Table */}
        {timeLogs.length === 0 ? (
          <div className="bg-gray-50 rounded-lg px-4 py-6 text-center text-gray-500 text-sm">
            Nessuna voce di ore inserita
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Persona
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Data
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-700">
                    Ore
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">
                    Descrizione
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {timeLogs.map((log) => {
                  const user = users.find((u) => u.id === log.userId);
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {user?.name || "Sconosciuto"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(log.date).toLocaleDateString("it-IT")}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                        {log.hours}h
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                        {log.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
