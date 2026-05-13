"use client";

import { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; bg: string; text: string }
> = {
  active: {
    label: "Attivo",
    bg: "bg-green-100",
    text: "text-green-800",
  },
  "on-hold": {
    label: "In Pausa",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  completed: {
    label: "Completato",
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
  closed: {
    label: "Chiuso",
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
  archived: {
    label: "Archiviato",
    bg: "bg-slate-100",
    text: "text-slate-800",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
