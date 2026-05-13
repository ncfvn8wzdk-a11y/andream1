"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeamMemberSelector from "@/components/TeamMemberSelector";
import { UserRole } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
}

interface MemberAssignment {
  userId: string;
  role: UserRole;
}

interface FormData {
  name: string;
  commessa: string;
  description: string;
  businessBenefit: string;
  startDate: string;
  endDate: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  commessa: "",
  description: "",
  businessBenefit: "",
  startDate: "",
  endDate: "",
};

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [members, setMembers] = useState<MemberAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((json) => setUsers(json.data ?? []));
  }, []);

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Il nome del progetto è obbligatorio.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          commessa: form.commessa.trim() || undefined,
          description: form.description.trim() || undefined,
          businessBenefit: form.businessBenefit.trim() || undefined,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          ownerId: "PLACEHOLDER", // replaced with session user id after auth setup
          members,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Errore nella creazione del progetto.");
        return;
      }

      router.push("/dashboard/projects");
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
          >
            ← Indietro
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nuovo Progetto</h1>
          <p className="text-sm text-gray-500 mt-1">
            Compila i dettagli del progetto. Le ore lavorate verranno inserite dal team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Identificazione */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Identificazione
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Progetto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleField}
                  placeholder="es. Impianto fotovoltaico cliente Rossi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numero Commessa
                </label>
                <input
                  type="text"
                  name="commessa"
                  value={form.commessa}
                  onChange={handleField}
                  placeholder="es. 2025-042"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Dettagli */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Dettagli
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleField}
                rows={4}
                placeholder="Descrivi il progetto: obiettivi, attività principali, contesto..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefici Aziendali
              </label>
              <textarea
                name="businessBenefit"
                value={form.businessBenefit}
                onChange={handleField}
                rows={3}
                placeholder="Quale valore porta questo progetto all'azienda? Es. riduzione costi, nuovo mercato, efficienza..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </section>

          {/* SECTION 3: Date */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Durata
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inizio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleField}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fine Prevista
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleField}
                  min={form.startDate || undefined}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: Team */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Team
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Assegna un ruolo ad ogni persona cliccando sul pulsante corrispondente.
                Clicca di nuovo per rimuovere.
              </p>
            </div>

            {users.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Nessun utente registrato ancora.
              </p>
            ) : (
              <TeamMemberSelector
                users={users}
                value={members}
                onChange={setMembers}
              />
            )}

            {/* Summary by role */}
            {members.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { role: "project_leader" as UserRole, label: "Project Leader", color: "text-blue-700 bg-blue-50" },
                  { role: "project_support" as UserRole, label: "Project Support", color: "text-green-700 bg-green-50" },
                  { role: "supervisor" as UserRole, label: "Supervisor", color: "text-purple-700 bg-purple-50" },
                ].map(({ role, label, color }) => {
                  const count = members.filter((m) => m.role === role).length;
                  return (
                    <div key={role} className={`rounded-lg py-3 px-2 ${color}`}>
                      <p className="text-xl font-bold">{count}</p>
                      <p className="text-xs font-medium">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creazione..." : "Crea Progetto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
