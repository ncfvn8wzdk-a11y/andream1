"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import RoleBadges from "./RoleBadges";
import { Project, UserRole } from "@/types";

interface ProjectCardProps {
  project: Project & {
    owner: { name: string };
    members: Array<{
      user: { name: string };
      role: UserRole;
    }>;
    timeLogs: Array<{ hours: number }>;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const totalHours = project.timeLogs.reduce((sum, log) => sum + log.hours, 0);
  const startDateStr = project.startDate
    ? new Date(project.startDate).toLocaleDateString("it-IT")
    : "-";
  const endDateStr = project.endDate
    ? new Date(project.endDate).toLocaleDateString("it-IT")
    : "-";

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-5 space-y-4 cursor-pointer">
        {/* Header: title, commessa, status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {project.name}
            </h3>
            {project.commessa && (
              <p className="text-xs text-gray-500 mt-0.5">
                Commessa: {project.commessa}
              </p>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Dates and hours */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-gray-500 mb-0.5">Inizio</p>
            <p className="font-medium text-gray-900">{startDateStr}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Fine</p>
            <p className="font-medium text-gray-900">{endDateStr}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Ore</p>
            <p className="font-medium text-gray-900">{totalHours.toFixed(1)}</p>
          </div>
        </div>

        {/* Team */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-600 font-medium mb-2">
            Team ({project.members.length})
          </p>
          <RoleBadges members={project.members} />
        </div>
      </div>
    </Link>
  );
}
