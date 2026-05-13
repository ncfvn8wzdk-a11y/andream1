"use client";

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

interface TeamMemberSelectorProps {
  users: User[];
  value: MemberAssignment[];
  onChange: (members: MemberAssignment[]) => void;
}

const ROLES: { key: UserRole; label: string; color: string }[] = [
  { key: "project_leader", label: "Project Leader", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "project_support", label: "Project Support", color: "bg-green-100 text-green-800 border-green-300" },
  { key: "supervisor", label: "Supervisor", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

export default function TeamMemberSelector({ users, value, onChange }: TeamMemberSelectorProps) {
  const getAssignment = (userId: string): UserRole | null => {
    return value.find((m) => m.userId === userId)?.role ?? null;
  };

  const handleRoleClick = (userId: string, role: UserRole) => {
    const existing = value.find((m) => m.userId === userId);

    if (existing?.role === role) {
      // Deselect: remove the member
      onChange(value.filter((m) => m.userId !== userId));
    } else if (existing) {
      // Change role
      onChange(value.map((m) => (m.userId === userId ? { ...m, role } : m)));
    } else {
      // Add new assignment
      onChange([...value, { userId, role }]);
    }
  };

  return (
    <div className="space-y-1">
      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {ROLES.map((r) => (
          <span key={r.key} className={`text-xs px-2 py-1 rounded border font-medium ${r.color}`}>
            {r.label}
          </span>
        ))}
        <span className="text-xs px-2 py-1 rounded border bg-gray-50 text-gray-400 border-gray-200 font-medium">
          Nessun ruolo
        </span>
      </div>

      {/* User list */}
      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
        {users.map((user) => {
          const assigned = getAssignment(user.id);
          return (
            <div
              key={user.id}
              className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Name + email */}
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {/* Role flags */}
              <div className="flex gap-2">
                {ROLES.map((r) => {
                  const active = assigned === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleRoleClick(user.id, r.key)}
                      className={`text-xs px-3 py-1 rounded border font-medium transition-all ${
                        active
                          ? r.color + " shadow-sm"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {value.length} {value.length === 1 ? "persona assegnata" : "persone assegnate"}
        </p>
      )}
    </div>
  );
}
