import { db } from "@/lib/db";
import { EstadoBadge } from "@/components/dashboard/estado-badge";
import { formatDate } from "@/lib/utils";
import type { Estado } from "@/types";

const ESTADOS_ACTIVOS: Estado[] = ["ASIGNADO", "RECIBIDO", "EN_CAMINO"];

async function getGuiasActivas() {
  return db.guia.findMany({
    where: { estado: { in: ESTADOS_ACTIVOS } },
    include: { piloto: { select: { nombre: true } } },
    orderBy: { updated_at: "desc" },
  });
}

export default async function TrackingPage() {
  const guias = await getGuiasActivas();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Tracking en Tiempo Real</h1>
        <span className="text-sm text-[#6B7280]">Actualiza cada 30 segundos</span>
      </div>
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Guía</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Piloto</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Destino</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Última actualización</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {guias.map((guia) => (
              <tr key={guia.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 font-mono text-[#1A56DB]">{guia.numero_guia}</td>
                <td className="px-4 py-3"><EstadoBadge estado={guia.estado} /></td>
                <td className="px-4 py-3">{guia.piloto?.nombre ?? "—"}</td>
                <td className="px-4 py-3">{guia.entrega_zona}</td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(guia.updated_at)}</td>
              </tr>
            ))}
            {guias.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">
                  No hay envíos activos en este momento
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
