"use client";

import { ProjectPhase } from "@/types";
import { PROJECT_PHASES } from "@/lib/project-config";

interface PhaseTrackerProps {
  currentPhase: ProjectPhase;
  onPhaseChange: (phase: ProjectPhase) => void;
  readonly?: boolean;
}

const PHASES: ProjectPhase[] = [
  "concept",
  "basic_eng",
  "detail_eng",
  "procurement",
  "build",
  "fat",
  "installation",
  "sat",
  "training",
  "handover",
];

export default function PhaseTracker({
  currentPhase,
  onPhaseChange,
  readonly = false,
}: PhaseTrackerProps) {
  const currentOrder = PROJECT_PHASES[currentPhase]?.order ?? 1;
  const progressPercent = (currentOrder / PHASES.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Avanzamento Progetto</p>
          <p className="text-xs text-gray-500">
            Fase {currentOrder} di {PHASES.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Phase selector */}
      {!readonly ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fase Attuale</label>
          <select
            value={currentPhase}
            onChange={(e) => onPhaseChange(e.target.value as ProjectPhase)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PHASES.map((phase) => (
              <option key={phase} value={phase}>
                {PROJECT_PHASES[phase].label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Fase attuale:</span>
          <span className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
            {PROJECT_PHASES[currentPhase].label}
          </span>
        </div>
      )}

      {/* Phase timeline */}
      <div className="mt-6 hidden lg:block">
        <div className="flex gap-1">
          {PHASES.map((phase) => {
            const phaseOrder = PROJECT_PHASES[phase].order;
            const isActive = phase === currentPhase;
            const isCompleted = phaseOrder < currentOrder;

            return (
              <div
                key={phase}
                className="flex-1 group relative"
                title={PROJECT_PHASES[phase].label}
              >
                <div
                  className={`h-2 rounded transition-all ${
                    isCompleted
                      ? "bg-green-500"
                      : isActive
                      ? "bg-blue-600 ring-2 ring-blue-300"
                      : "bg-gray-300"
                  }`}
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {PROJECT_PHASES[phase].label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
