"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CostDocumentUploader from "@/components/CostDocumentUploader";
import CostTracker from "@/components/CostTracker";
import { ProjectCost } from "@/types";

interface ProjectInfo {
  id: string;
  name: string;
  budget?: number;
}

export default function ProjectCostsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [costs, setCosts] = useState<ProjectCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch project info
        const projectRes = await fetch(`/api/projects/${projectId}`);
        const projectJson = await projectRes.json();

        if (!projectRes.ok || !projectJson.data) {
          setError("Progetto non trovato");
          return;
        }

        setProject({
          id: projectJson.data.id,
          name: projectJson.data.name,
          budget: projectJson.data.budget,
        });

        // Fetch costs
        const costsRes = await fetch(`/api/projects/${projectId}/costs`);
        const costsJson = await costsRes.json();
        setCosts(costsJson.data ?? []);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  const handleUploadSuccess = (newCost: ProjectCost) => {
    setCosts((prev) => [newCost, ...prev]);
  };

  const handleDeleteCost = async (costId: string) => {
    if (!confirm("Eliminare questo documento di costo?")) return;

    try {
      const res = await fetch(
        `/api/projects/${projectId}/costs?id=${costId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCosts((prev) => prev.filter((c) => c.id !== costId));
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Costi Progetto</h1>
        <p className="text-gray-600 text-sm mb-6">{project.name}</p>

        {/* Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Carica Documenti di Costo
          </h2>
          <CostDocumentUploader
            projectId={projectId}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>

        {/* Costs Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Riepilogo Costi
          </h2>
          <CostTracker
            costs={costs}
            budgetPlanned={project.budget}
            onDeleteCost={handleDeleteCost}
          />
        </div>
      </div>
    </div>
  );
}
