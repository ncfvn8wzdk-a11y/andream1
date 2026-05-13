"use client";

import { UserRole } from "@/types";

interface RoleBadgesProps {
  members: Array<{
    user: { name: string };
    role: UserRole;
  }>;
}

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; bg: string; text: string }
> = {
  project_leader: {
    label: "Project Leader",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  project_support: {
    label: "Project Support",
    bg: "bg-green-100",
    text: "text-green-700",
  },
  supervisor: {
    label: "Supervisor",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
};

export default function RoleBadges({ members }: RoleBadgesProps) {
  if (members.length === 0) {
    return <p className="text-xs text-gray-400">Nessun team assegnato</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => {
        const config = ROLE_CONFIG[m.role];
        return (
          <span
            key={`${m.user.name}-${m.role}`}
            className={`text-xs px-2 py-1 rounded font-medium ${config.bg} ${config.text}`}
            title={m.user.name}
          >
            {m.user.name}
          </span>
        );
      })}
    </div>
  );
}
