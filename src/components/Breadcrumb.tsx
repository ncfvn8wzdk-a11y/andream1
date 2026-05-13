"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <Link
            href={item.href}
            className={
              index === items.length - 1
                ? "text-gray-900 font-semibold"
                : "text-blue-600 hover:text-blue-700"
            }
          >
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <span className="text-gray-400">/</span>
          )}
        </div>
      ))}
    </div>
  );
}
