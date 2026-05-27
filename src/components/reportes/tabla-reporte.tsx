"use client";

import type { Reporte } from "@/types";

interface TablaReporteProps {
  reporte: Reporte;
}

export function TablaReporte({ reporte }: TablaReporteProps) {
  function exportarCSV() {
    const filas = [
      ["Piloto", "Total", "Entregados"],
      ...reporte.por_piloto.map((p) => [p.piloto, p.total, p.entregados]),
    ];
    const csv = filas.map((f) => f.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: reporte.resumen.total },
          { label: "Entregados", value: reporte.resumen.entregados },
          { label: "Fallidos", value: reporte.resumen.fallidos },
          { label: "Tasa de Éxito", value: reporte.resumen.tasa_exito },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs text-[#6B7280]">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-4 py-3 border-b border-[#E5E7EB] flex justify-between items-center">
            <h3 className="font-semibold text-sm">Por Piloto</h3>
            <button onClick={exportarCSV} className="text-xs text-[#1A56DB] hover:underline">
              Exportar CSV
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-[#6B7280]">Piloto</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-[#6B7280]">Total</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-[#6B7280]">Entregados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {reporte.por_piloto.map((p) => (
                <tr key={p.piloto} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-2">{p.piloto}</td>
                  <td className="px-4 py-2 text-right">{p.total}</td>
                  <td className="px-4 py-2 text-right text-[#16A34A]">{p.entregados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <h3 className="font-semibold text-sm">Por Zona</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-[#6B7280]">Zona</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-[#6B7280]">Total</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-[#6B7280]">Entregados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {reporte.por_zona.map((z) => (
                <tr key={z.zona} className="hover:bg-[#F9FAFB]">
                  <td className="px-4 py-2">{z.zona}</td>
                  <td className="px-4 py-2 text-right">{z.total}</td>
                  <td className="px-4 py-2 text-right text-[#16A34A]">{z.entregados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
