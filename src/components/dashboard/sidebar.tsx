"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  ClipboardList,
  MapPin,
  BarChart3,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/overview", label: "Resumen", icon: LayoutDashboard },
  { href: "/guias", label: "Guías", icon: Package },
  { href: "/asignaciones", label: "Asignaciones", icon: ClipboardList },
  { href: "/tracking", label: "Tracking", icon: MapPin },
  { href: "/pilotos", label: "Pilotos", icon: Users },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#1F2937] flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-white font-bold text-lg tracking-tight">
          GuiaExpress GT
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href as Route}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-white/10 text-white"
                : "text-[#D1D5DB] hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
