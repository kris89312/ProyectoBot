"use client";

import { useState } from "react";
import { FormPiloto } from "@/components/pilotos/form-piloto";
import { formatDate } from "@/lib/utils";

type PilotoRow = {
  id: string;
  nombre: string;
  tel_whatsapp: string;
  activo: boolean;
  created_at: Date;
  _count: { guias: number };
};

interface TablaPilotosProps {
  pilotos: PilotoRow[];
}

export function TablaPilotos({ pilotos }: TablaPilotosProps) {
  const [mostrarForm, setMostrarForm] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-[#1A56DB] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1E429F] transition-colors"
        >
          + Nuevo Piloto
        </button>
      </div>
      {mostrarForm && <FormPiloto onClose={() => setMostrarForm(false)} />}
      <div className="bg-white rounded-lg border border-[#E5E7EB]">
        <table className="w-full text-sm">
          <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">WhatsApp</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Guías Activas</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-[#6B7280]">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {pilotos.map((piloto) => (
              <tr key={piloto.id} className="hover:bg-[#F9FAFB]">
                <td className="px-4 py-3 font-medium">{piloto.nombre}</td>
                <td className="px-4 py-3 font-mono text-sm">{piloto.tel_whatsapp}</td>
                <td className="px-4 py-3">{piloto._count.guias}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${piloto.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {piloto.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{formatDate(piloto.created_at)}</td>
              </tr>
            ))}
            {pilotos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#6B7280]">
                  No hay pilotos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
