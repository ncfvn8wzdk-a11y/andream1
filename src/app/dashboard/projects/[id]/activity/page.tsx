"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Activity } from "@/types";

const ACTIVITY_ICONS: Record<string, string> = {
  phase_change: "🔄",
  milestone_update: "🎯",
  cost_added: "💰",
  hours_logged: "⏰",
  punch_added: "📝",
  file_uploaded: "📄",
};

const ACTIVITY_LABELS: Record<string, string> = {
  phase_change: "Fase Cambiata",
  milestone_update: "Milestone Aggiornato",
  cost_added: "Costo Aggiunto",
  hours_logged: "Ore Registrate",
  punch_added: "Item Punch Aggiunto",
  file_uploaded: "File Caricato",
};

interface ProjectWithOwner {
  id: string;
  name: string;
  ownerId: string;
}

export default function ActivityPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectWithOwner | null>(null);
  const [projectName, setProjectName] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectRes = await fetch(`/api/projects/${projectId}`);
        const projectJson = await projectRes.json();

        if (!projectRes.ok || !projectJson.data) {
          setError("Progetto non trovato");
          return;
        }

        const projectData = projectJson.data as ProjectWithOwner;
        setProject(projectData);
        setProjectName(projectData.name);

        // Check if user is owner (for now, assume PLACEHOLDER is always owner)
        // In production, this should check against authenticated user
        const isCurrentUserOwner = projectData.ownerId === "PLACEHOLDER" || projectData.ownerId;
        setIsOwner(isCurrentUserOwner);

        if (!isCurrentUserOwner) {
          setError("Solo il proprietario del progetto può accedere a questa pagina");
          return;
        }

        const activitiesRes = await fetch(`/api/projects/${projectId}/activities`);
        const activitiesJson = await activitiesRes.json();
        setActivities(activitiesJson.data ?? []);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <button
          onClick={() => router.push(`/dashboard/projects/${projectId}`)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
        >
          ← Progetto
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline Attività</h1>
        <p className="text-gray-600 text-sm mb-8">{projectName}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 mb-8">
            {error}
          </div>
        )}

        {activities.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-8 text-center text-gray-500">
            Nessuna attività registrata
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, idx) => (
              <div
                key={activity.id}
                className="relative flex gap-4"
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center text-lg">
                    {ACTIVITY_ICONS[activity.type] || "📌"}
                  </div>
                  {idx !== activities.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {ACTIVITY_LABELS[activity.type] || activity.type}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-gray-500 text-xs mt-2">
                            {activity.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(activity.createdAt).toLocaleDateString(
                            "it-IT"
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.createdAt).toLocaleTimeString(
                            "it-IT",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </div>
                    </div>
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
