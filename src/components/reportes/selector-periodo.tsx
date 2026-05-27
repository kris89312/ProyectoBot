"use client";

import { useState } from "react";
import axios from "axios";
import { TablaReporte } from "@/components/reportes/tabla-reporte";
import type { Reporte } from "@/types";

type Periodo = "dia" | "semana" | "mes";

const TABS: { value: Periodo; label: string }[] = [
  { value: "dia", label: "Hoy" },
  { value: "semana", label: "Esta Semana" },
  { value: "mes", label: "Este Mes" },
];

export function SelectorPeriodo() {
  const [periodo, setPeriodo] = useState<Periodo>("dia");
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(false);

  async function cargarReporte(p: Periodo) {
    setPeriodo(p);
    setLoading(true);
    const { data } = await axios.get(`/api/reportes?periodo=${p}`);
    if (data.ok) setReporte(data.data);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => cargarReporte(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              periodo === tab.value
                ? "bg-[#1A56DB] text-white"
                : "bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading && <p className="text-sm text-[#6B7280]">Cargando reporte...</p>}
      {reporte && !loading && <TablaReporte reporte={reporte} />}
      {!reporte && !loading && (
        <p className="text-sm text-[#6B7280]">Selecciona un período para ver el reporte</p>
      )}
    </div>
  );
}
