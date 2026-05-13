"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

interface Project {
  id: string;
  name: string;
  commessa?: string;
  status: string;
  createdAt: Date;
  owner: { name: string };
  timeLogs: Array<{ hours: number }>;
  costs: Array<{ amount: number }>;
  milestones: Array<{ status: string }>;
  punchList: Array<{ status: string; severity: string }>;
}

export default function DashboardHome() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalHours: 0,
    totalCosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const allProjects = data.data ?? [];

        setProjects(allProjects.slice(0, 5));

        const totalHours = allProjects.reduce(
          (sum: number, p: Project) =>
            sum + p.timeLogs.reduce((h: number, log) => h + log.hours, 0),
          0
        );
        const totalCosts = allProjects.reduce(
          (sum: number, p: Project) =>
            sum + p.costs.reduce((c: number, cost) => c + cost.amount, 0),
          0
        );

        setStats({
          totalProjects: allProjects.length,
          activeProjects: allProjects.filter(
            (p: Project) => p.status === "active"
          ).length,
          completedProjects: allProjects.filter(
            (p: Project) => p.status === "completed" || p.status === "closed"
          ).length,
          totalHours: Math.round(totalHours * 10) / 10,
          totalCosts: Math.round(totalCosts * 100) / 100,
        });
      } catch (err) {
        console.error("Errore nel caricamento dei progetti:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const QuickStatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-md`}>
      <p className="text-4xl mb-2">{icon}</p>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      "on-hold": "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      closed: "bg-gray-100 text-gray-800",
      archived: "bg-slate-100 text-slate-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
        {status === "on-hold" ? "In Pausa" : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header with Logo */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="pointer-events-none">
              <Logo size="large" showText={true} href="" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Piattaforma di Gestione Progetti
          </h1>
          <p className="text-gray-600 text-lg">
            Gestisci i tuoi progetti con consapevolezza dei fusi orari (Italia 🇮🇹 ↔️ USA 🇺🇸)
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <QuickStatCard
            icon="📊"
            label="Progetti Totali"
            value={stats.totalProjects}
            color="bg-blue-600"
          />
          <QuickStatCard
            icon="⚡"
            label="Progetti Attivi"
            value={stats.activeProjects}
            color="bg-green-600"
          />
          <QuickStatCard
            icon="✓"
            label="Completati"
            value={stats.completedProjects}
            color="bg-purple-600"
          />
          <QuickStatCard
            icon="⏰"
            label="Ore Totali"
            value={stats.totalHours}
            color="bg-orange-600"
          />
          <QuickStatCard
            icon="💰"
            label="Costi Totali"
            value={`€${stats.totalCosts.toFixed(0)}`}
            color="bg-red-600"
          />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Projects Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-3xl mb-3">📁</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Progetti</h2>
            <p className="text-gray-600 text-sm mb-4">
              Visualizza, crea e gestisci i tuoi progetti
            </p>
            <button
              onClick={() => router.push("/dashboard/projects")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Vai ai Progetti →
            </button>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-3xl mb-3">🔍</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ricerca</h2>
            <p className="text-gray-600 text-sm mb-4">
              Cerca progetti, fatture, milestone e punch list
            </p>
            <button
              onClick={() => router.push("/dashboard/search")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Accedi alla Ricerca →
            </button>
          </div>

          {/* Create New Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-3xl mb-3">✨</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nuovo Progetto
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Crea un nuovo progetto e inizia a tracciare
            </p>
            <button
              onClick={() => router.push("/dashboard/projects/new")}
              className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              + Crea Progetto
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        {!loading && projects.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Progetti Recenti</h2>
              <Link
                href="/dashboard/projects"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Vedi Tutti →
              </Link>
            </div>

            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}/overview`)
                  }
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {project.commessa && (
                        <span className="text-xs text-gray-500">
                          Commessa: {project.commessa}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {project.timeLogs.reduce((s, l) => s + l.hours, 0).toFixed(1)}h
                      </p>
                      <p className="text-xs text-gray-500">ore</p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-2xl mb-3">📭</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nessun Progetto Ancora
            </h2>
            <p className="text-gray-600 mb-6">
              Crea il tuo primo progetto per iniziare a tracciare ore, costi e
              milestone
            </p>
            <button
              onClick={() => router.push("/dashboard/projects/new")}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              + Crea il Primo Progetto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
