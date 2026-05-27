"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EstadoBadge } from "@/components/dashboard/estado-badge";
import { formatDate } from "@/lib/utils";

type GuiaPendiente = {
  id: string;
  numero_guia: string;
  remitente_nombre: string;
  entrega_zona: string;
  entrega_direccion: string;
  created_at: Date;
};

type PilotoActivo = {
  id: string;
  nombre: string;
  tel_whatsapp: string;
};

interface PanelAsignacionProps {
  guias: GuiaPendiente[];
  pilotos: PilotoActivo[];
}

export function PanelAsignacion({ guias, pilotos }: PanelAsignacionProps) {
  const router = useRouter();
  const [guiaSeleccionada, setGuiaSeleccionada] = useState<string | null>(null);
  const [pilotoSeleccionado, setPilotoSeleccionado] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleAsignar() {
    if (!guiaSeleccionada || !pilotoSeleccionado) return;
    setLoading(true);

    await axios.post("/api/asignaciones", {
      guia_id: guiaSeleccionada,
      piloto_id: pilotoSeleccionado,
    });

    setGuiaSeleccionada(null);
    setPilotoSeleccionado("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-[#E5E7EB]">
        <div className="px-4 py-3 border-b border-[#E5E7EB]">
          <h2 className="font-semibold text-sm text-[#111827]">Guías Pendientes</h2>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {guias.map((guia) => (
            <button
              key={guia.id}
              onClick={() => setGuiaSeleccionada(guia.id)}
              className={`w-full text-left px-4 py-3 hover:bg-[#F9FAFB] transition-colors ${guiaSeleccionada === guia.id ? "bg-blue-50 border-l-2 border-[#1A56DB]" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#1A56DB]">{guia.numero_guia}</span>
                <EstadoBadge estado="PENDIENTE" />
              </div>
              <p className="text-sm mt-0.5">{guia.remitente_nombre}</p>
              <p className="text-xs text-[#6B7280]">{guia.entrega_zona} · {guia.entrega_direccion}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{formatDate(guia.created_at)}</p>
            </button>
          ))}
          {guias.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[#6B7280]">No hay guías pendientes</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
        <h2 className="font-semibold text-sm text-[#111827] mb-4">Asignar Piloto</h2>
        {!guiaSeleccionada ? (
          <p className="text-sm text-[#6B7280]">Selecciona una guía de la lista</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              Asignando guía:{" "}
              <span className="font-mono text-[#1A56DB]">
                {guias.find((g) => g.id === guiaSeleccionada)?.numero_guia}
              </span>
            </p>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Piloto</label>
              <select
                value={pilotoSeleccionado}
                onChange={(e) => setPilotoSeleccionado(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
              >
                <option value="">Seleccionar piloto...</option>
                {pilotos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAsignar}
              disabled={!pilotoSeleccionado || loading}
              className="w-full bg-[#1A56DB] text-white py-2 rounded-md text-sm font-medium hover:bg-[#1E429F] disabled:opacity-50 transition-colors"
            >
              {loading ? "Asignando..." : "Confirmar Asignación"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
