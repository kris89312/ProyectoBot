import { EstadoBadge } from "@/components/dashboard/estado-badge";
import { formatDate } from "@/lib/utils";
import type { EstadoLog } from "@/types";

interface TimelineEstadosProps {
  logs: EstadoLog[];
}

export function TimelineEstados({ logs }: TimelineEstadosProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
      <h3 className="font-semibold text-[#111827] mb-4">Historial de Estados</h3>
      {logs.length === 0 ? (
        <p className="text-sm text-[#6B7280]">Sin cambios de estado aún</p>
      ) : (
        <ol className="relative border-l border-[#E5E7EB] space-y-4 ml-2">
          {logs.map((log) => (
            <li key={log.id} className="ml-4">
              <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#1A56DB] border-2 border-white" />
              <EstadoBadge estado={log.estado_nuevo} />
              <p className="text-xs text-[#6B7280] mt-1">{formatDate(log.created_at)}</p>
              <p className="text-xs text-[#6B7280]">via {log.origen}</p>
              {log.nota && <p className="text-xs mt-0.5 italic">{log.nota}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
