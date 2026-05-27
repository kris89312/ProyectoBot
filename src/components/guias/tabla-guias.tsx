"use client";

import { useState } from "react";
import Link from "next/link";
import { EstadoBadge } from "@/components/dashboard/estado-badge";
import { formatDate } from "@/lib/utils";
import type { Estado } from "@/types";

type GuiaRow = {
  id: string;
  numero_guia: string;
  estado: string;
  remitente_nombre: string;
  entrega_zona: string;
  created_at: Date;
  piloto: { nombre: string } | null;
};

interface TablaGuiasProps {
  guias: GuiaRow[];
}

const ESTADOS: Array<Estado | "TODOS"> = [
  "TODOS", "PENDIENTE", "ASIGNADO", "RECIBIDO", "EN_CAMINO", "ENTREGADO", "FALLIDO",
];

export function TablaGuias({ guias }: TablaGuiasProps) {
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [busqueda, setBusqueda] = useState("");

  const filtradas = guias.filter((g) => {
    const coincideEstado = filtroEstado === "TODOS" || g.estado === filtroEstado;
    const coincideBusqueda =
      busqueda === "" ||
      g.numero_guia.toLowerCase().includes(busqueda.toLowerCase()) ||
      g.remitente_nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB]">
      <div className="p-4 border-b border-[#E5E7EB] flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por número o remitente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-[#E5E7EB] rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
        />
        <div className="flex gap-1 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filtroEstado === e
                  ? "bg-[#1A56DB] text-white"
                  : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#E5E7EB]"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Número</th>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Estado</th>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Remitente</th>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Zona Entrega</th>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Piloto</th>
            <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Creada</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {filtradas.map((guia) => (
            <tr key={guia.id} className="hover:bg-[#F9FAFB]">
              <td className="px-4 py-3">
                <Link
                  href={`/guias/${guia.id}`}
                  className="font-mono text-[#1A56DB] hover:underline text-xs"
                >
                  {guia.numero_guia}
                </Link>
              </td>
              <td className="px-4 py-3">
                <EstadoBadge estado={guia.estado} />
              </td>
              <td className="px-4 py-3">{guia.remitente_nombre}</td>
              <td className="px-4 py-3">{guia.entrega_zona}</td>
              <td className="px-4 py-3 text-[#6B7280]">{guia.piloto?.nombre ?? "—"}</td>
              <td className="px-4 py-3 text-[#6B7280]">{formatDate(guia.created_at)}</td>
            </tr>
          ))}
          {filtradas.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                No se encontraron guías
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
