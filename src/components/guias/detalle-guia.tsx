import { EstadoBadge } from "@/components/dashboard/estado-badge";
import { TimelineEstados } from "@/components/guias/timeline-estados";
import { formatDate } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

type GuiaConRelaciones = Prisma.GuiaGetPayload<{
  include: { piloto: true; estado_logs: true };
}>;

interface DetalleGuiaProps {
  guia: GuiaConRelaciones;
}

export function DetalleGuia({ guia }: DetalleGuiaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111827]">Información del Envío</h2>
            <EstadoBadge estado={guia.estado} />
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[#6B7280]">Remitente</dt>
              <dd className="font-medium mt-0.5">{guia.remitente_nombre}</dd>
              <dd className="text-[#6B7280]">{guia.remitente_tel}</dd>
            </div>
            <div>
              <dt className="text-[#6B7280]">Recolección</dt>
              <dd className="font-medium mt-0.5">{guia.recoleccion_direccion}</dd>
              <dd className="text-[#6B7280]">{guia.recoleccion_zona}</dd>
              {guia.recoleccion_referencia && (
                <dd className="text-[#6B7280] italic">{guia.recoleccion_referencia}</dd>
              )}
            </div>
            <div>
              <dt className="text-[#6B7280]">Destinatario</dt>
              <dd className="font-medium mt-0.5">{guia.destinatario_nombre}</dd>
              <dd className="text-[#6B7280]">{guia.destinatario_tel}</dd>
            </div>
            <div>
              <dt className="text-[#6B7280]">Entrega</dt>
              <dd className="font-medium mt-0.5">{guia.entrega_direccion}</dd>
              <dd className="text-[#6B7280]">{guia.entrega_zona}</dd>
              {guia.entrega_referencia && (
                <dd className="text-[#6B7280] italic">{guia.entrega_referencia}</dd>
              )}
            </div>
            <div>
              <dt className="text-[#6B7280]">Paquete</dt>
              <dd className="font-medium mt-0.5">{guia.tipo_paquete}</dd>
              <dd className="text-[#6B7280]">{guia.peso_kg.toString()} kg{guia.dimensiones ? ` · ${guia.dimensiones}` : ""}</dd>
            </div>
            <div>
              <dt className="text-[#6B7280]">Piloto asignado</dt>
              <dd className="font-medium mt-0.5">{guia.piloto?.nombre ?? "Sin asignar"}</dd>
            </div>
          </dl>
          {guia.instrucciones && (
            <div className="mt-4 p-3 bg-amber-50 rounded-md text-sm text-amber-800">
              <span className="font-medium">Instrucciones: </span>{guia.instrucciones}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-5">
          <p className="text-xs text-[#6B7280]">
            Creada: {formatDate(guia.created_at)} · Actualizada: {formatDate(guia.updated_at)}
          </p>
        </div>
      </div>
      <div>
        <TimelineEstados logs={guia.estado_logs} />
      </div>
    </div>
  );
}
