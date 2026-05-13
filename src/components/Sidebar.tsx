"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const mainNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Progetti", href: "/dashboard/projects", icon: "📁" },
    { label: "Ricerca", href: "/dashboard/search", icon: "🔍" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">📍 Project Hub</h1>
        <p className="text-xs text-slate-400 mt-1">Timezone-aware Project Mgmt</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Menu Principale
        </h2>
        <div className="space-y-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.href)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Accesso Veloce
        </p>
        <Link
          href="/dashboard/projects/new"
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
        >
          + Nuovo Progetto
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700 text-xs text-slate-400">
        <p>v1.0 • Timezone Aware</p>
      </div>
    </aside>
  );
}
