"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import RoleBadges from "@/components/RoleBadges";
import PhaseTracker from "@/components/PhaseTracker";
import { Project, UserRole, ProjectPhase } from "@/types";

interface ProjectDetail extends Project {
  owner: { name: string };
  members: Array<{
    user: { id: string; name: string };
    role: UserRole;
  }>;
  timeLogs: Array<{
    id: string;
    userId: string;
    hours: number;
    date: Date;
    description?: string;
  }>;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isUpdatingPhase, setIsUpdatingPhase] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setProject(json.data);
        } else {
          setError("Progetto non trovato");
        }
      })
      .catch(() => setError("Errore nel caricamento"))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleClose = async () => {
    setIsClosing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/close`, {
        method: "POST",
      });

      if (res.ok) {
        const json = await res.json();
        setProject(json.data);
        setShowCloseConfirm(false);
      } else {
        setError("Errore nella chiusura del progetto");
      }
    } catch {
      setError("Errore di rete");
    } finally {
      setIsClosing(false);
    }
  };

  const handleDownloadReport = async () => {
    window.location.href = `/api/projects/${projectId}/report`;
  };

  const handlePhaseChange = async (newPhase: ProjectPhase) => {
    if (!project) return;

    setIsUpdatingPhase(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPhase: newPhase }),
      });

      if (res.ok) {
        const json = await res.json();
        setProject(json.data);
      } else {
        setError("Errore nell'aggiornamento della fase");
      }
    } catch {
      setError("Errore di rete");
    } finally {
      setIsUpdatingPhase(false);
    }
  };

  const hoursPerMember = project?.timeLogs.reduce(
    (acc, log) => {
      if (!acc[log.userId]) acc[log.userId] = 0;
      acc[log.userId] += log.hours;
      return acc;
    },
    {} as Record<string, number>
  ) ?? {};

  const totalHours = project?.timeLogs.reduce((sum, log) => sum + log.hours, 0) ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Caricamento progetto...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
          >
            ← Indietro
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700">
            {error ?? "Progetto non trovato"}
          </div>
        </div>
      </div>
    );
  }

  const startDateStr = project.startDate
    ? new Date(project.startDate).toLocaleDateString("it-IT")
    : "-";
  const endDateStr = project.endDate
    ? new Date(project.endDate).toLocaleDateString("it-IT")
    : "-";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
        >
          ← Progetti
        </button>

        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.commessa && (
              <p className="text-sm text-gray-500 mt-1">Commessa: {project.commessa}</p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Phase Tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <PhaseTracker
            currentPhase={project.currentPhase}
            onPhaseChange={handlePhaseChange}
            readonly={isUpdatingPhase}
          />
        </div>

        {/* Description */}
        {project.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Descrizione
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
          </div>
        )}

        {/* Business Benefit */}
        {project.businessBenefit && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Benefici Aziendali
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{project.businessBenefit}</p>
          </div>
        )}

        {/* Info Grid */}
        <div className={`grid gap-4 mb-6 ${project.budget ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium uppercase mb-2">Data Inizio</p>
            <p className="text-lg font-semibold text-gray-900">{startDateStr}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium uppercase mb-2">Data Fine</p>
            <p className="text-lg font-semibold text-gray-900">{endDateStr}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium uppercase mb-2">Ore Totali</p>
            <p className="text-lg font-semibold text-gray-900">{totalHours.toFixed(1)}</p>
          </div>

          {project.budget && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 font-medium uppercase mb-2">Budget Pianificato</p>
              <p className="text-lg font-semibold text-gray-900">€{project.budget.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Team ({project.members.length})
          </h2>

          {project.members.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Nessun team assegnato</p>
          ) : (
            <div className="space-y-3">
              {project.members.map((member) => (
                <div key={member.user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {member.role.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {(hoursPerMember[member.user.id] ?? 0).toFixed(1)} ore
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Logs Summary */}
        {project.timeLogs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Tracciamento Ore
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Persona</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Data</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Ore</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  {project.timeLogs.map((log) => {
                    const member = project.members.find((m) => m.user.id === log.userId);
                    return (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">{member?.user.name}</td>
                        <td className="px-4 py-2 text-gray-500">
                          {new Date(log.date).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">{log.hours}</td>
                        <td className="px-4 py-2 text-gray-600 max-w-xs truncate">
                          {log.description ?? "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-between">
          <div></div>
          <div className="flex gap-3">
            {project.status === "closed" && (
              <button
                onClick={handleDownloadReport}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
              >
                ↓ Scarica Report
              </button>
            )}

            {project.status !== "closed" && (
              <>
                {!showCloseConfirm ? (
                  <button
                    onClick={() => setShowCloseConfirm(true)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm font-medium hover:bg-gray-300"
                  >
                    Chiudi Progetto
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCloseConfirm(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleClose}
                      disabled={isClosing}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {isClosing ? "Chiusura..." : "Conferma Chiusura"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
