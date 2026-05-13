"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PhaseTracker from "@/components/PhaseTracker";
import { Project, ProjectPhase } from "@/types";

interface DashboardData {
  project: Project & {
    members: Array<{ user: { name: string }; role: string }>;
    timeLogs: Array<{ hours: number }>;
    costs: Array<{ amount: number }>;
    milestones: Array<{
      id: string;
      title: string;
      status: string;
      plannedDate: Date;
    }>;
    punchList: Array<{
      id: string;
      title: string;
      severity: string;
      status: string;
    }>;
  };
}

export default function ProjectOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/overview`);
        const json = await res.json();

        if (res.ok) {
          setData(json.data);
        } else {
          setError(json.error || "Errore nel caricamento");
        }
      } catch (err) {
        setError("Errore di rete");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Caricamento...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
          >
            ← Progetti
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700">
            {error ?? "Progetto non trovato"}
          </div>
        </div>
      </div>
    );
  }

  const project = data.project;
  const totalHours = project.timeLogs.reduce((sum, log) => sum + log.hours, 0);
  const totalCosts = project.costs.reduce((sum, cost) => sum + cost.amount, 0);
  const completedMilestones = project.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const criticalPunchItems = project.punchList.filter(
    (p) => p.severity === "critical" && p.status !== "closed"
  ).length;
  const openPunchItems = project.punchList.filter(
    (p) => p.status !== "closed"
  ).length;

  const NavLink = ({
    href,
    icon,
    label,
    value,
  }: {
    href: string;
    icon: string;
    label: string;
    value: string | number;
  }) => (
    <Link
      href={href}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
        >
          ← Progetti
        </button>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.commessa && (
              <p className="text-gray-600 text-sm mt-1">
                Commessa: {project.commessa}
              </p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Phase Tracker */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <PhaseTracker
            currentPhase={project.currentPhase}
            onPhaseChange={() => {}}
            readonly={true}
          />
        </div>

        {/* Quick Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <NavLink
            href={`/dashboard/projects/${projectId}/time-logs`}
            icon="⏰"
            label="Ore Totali"
            value={totalHours.toFixed(1)}
          />
          <NavLink
            href={`/dashboard/projects/${projectId}/costs`}
            icon="💰"
            label="Costi"
            value={`€${totalCosts.toFixed(0)}`}
          />
          <NavLink
            href={`/dashboard/projects/${projectId}/milestones`}
            icon="🎯"
            label="Milestone"
            value={`${completedMilestones}/${project.milestones.length}`}
          />
          <NavLink
            href={`/dashboard/projects/${projectId}/punch-list`}
            icon={criticalPunchItems > 0 ? "🔴" : "📝"}
            label="Punch List"
            value={`${openPunchItems} aperte`}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {project.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Descrizione
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Business Benefit */}
            {project.businessBenefit && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Benefici Aziendali
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {project.businessBenefit}
                </p>
              </div>
            )}

            {/* Upcoming Milestones */}
            {project.milestones.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Prossimi Milestone
                </h2>
                <div className="space-y-2">
                  {project.milestones
                    .filter((m) => m.status !== "completed")
                    .slice(0, 3)
                    .map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <p className="text-sm text-gray-900 font-medium">
                          {m.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(m.plannedDate).toLocaleDateString(
                            "it-IT"
                          )}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Info Progetto
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs mb-1">Budget Pianificato</p>
                  <p className="text-lg font-bold text-gray-900">
                    {project.budget ? `€${project.budget.toFixed(2)}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">Data Inizio</p>
                  <p className="text-gray-900 font-medium">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString("it-IT")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1">Data Fine</p>
                  <p className="text-gray-900 font-medium">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("it-IT")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            {project.members.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Team
                </h2>
                <div className="space-y-2">
                  {project.members.map((m, idx) => (
                    <p key={idx} className="text-sm text-gray-900">
                      {m.user.name}
                      <span className="text-gray-500 text-xs ml-2">
                        ({m.role.replace(/_/g, " ")})
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Issues */}
            {criticalPunchItems > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  ⚠️ {criticalPunchItems} Problemi Critici
                </p>
                <Link
                  href={`/dashboard/projects/${projectId}/punch-list`}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Vedi Punch List →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
