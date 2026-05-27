import { cn } from "@/lib/utils";
import type { Estado } from "@/types";

const BADGE_STYLES: Record<Estado, string> = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  ASIGNADO: "bg-blue-100 text-blue-700",
  RECIBIDO: "bg-purple-100 text-purple-700",
  EN_CAMINO: "bg-amber-100 text-amber-700",
  ENTREGADO: "bg-green-100 text-green-700",
  FALLIDO: "bg-red-100 text-red-600",
};

const LABELS: Record<Estado, string> = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  RECIBIDO: "Recibido",
  EN_CAMINO: "En Camino",
  ENTREGADO: "Entregado",
  FALLIDO: "Fallido",
};

interface EstadoBadgeProps {
  estado: Estado | string;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  const e = estado as Estado;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium",
        BADGE_STYLES[e] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {LABELS[e] ?? estado}
    </span>
  );
}
