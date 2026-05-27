"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/overview": "Resumen del Día",
  "/guias": "Guías",
  "/pilotos": "Pilotos",
  "/asignaciones": "Asignaciones",
  "/tracking": "Tracking en Tiempo Real",
  "/reportes": "Reportes",
};

export function Topbar() {
  const pathname = usePathname();
  const segment = "/" + (pathname.split("/")[1] ?? "");
  const title = PAGE_TITLES[segment] ?? "GuiaExpress GT";

  return (
    <header className="h-14 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between flex-shrink-0">
      <span className="font-semibold text-[#111827]">{title}</span>
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  );
}
