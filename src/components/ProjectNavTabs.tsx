"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectNavTab {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export default function ProjectNavTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  const tabs: ProjectNavTab[] = [
    {
      label: "Panoramica",
      href: `/dashboard/projects/${projectId}/overview`,
      icon: "📊",
      description: "Riepilogo del progetto",
    },
    {
      label: "Ore Lavorate",
      href: `/dashboard/projects/${projectId}/time-logs`,
      icon: "⏰",
      description: "Traccia le ore di lavoro",
    },
    {
      label: "Costi",
      href: `/dashboard/projects/${projectId}/costs`,
      icon: "💰",
      description: "Carica e gestisci i costi",
    },
    {
      label: "Milestone",
      href: `/dashboard/projects/${projectId}/milestones`,
      icon: "🎯",
      description: "Pianifica le tappe",
    },
    {
      label: "Punch List",
      href: `/dashboard/projects/${projectId}/punch-list`,
      icon: "📝",
      description: "Gestisci i problemi",
    },
    {
      label: "Attività",
      href: `/dashboard/projects/${projectId}/activity`,
      icon: "📋",
      description: "Cronologia del progetto",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                isActive(tab.href)
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
