import { db } from "@/lib/db";
import { StatsCard } from "@/components/dashboard/stats-card";

async function getOverviewMetrics() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [total, entregados, fallidos, en_proceso] = await Promise.all([
    db.guia.count({ where: { created_at: { gte: hoy } } }),
    db.guia.count({ where: { estado: "ENTREGADO", created_at: { gte: hoy } } }),
    db.guia.count({ where: { estado: "FALLIDO", created_at: { gte: hoy } } }),
    db.guia.count({
      where: {
        estado: { in: ["PENDIENTE", "ASIGNADO", "RECIBIDO", "EN_CAMINO"] },
      },
    }),
  ]);

  return { total, entregados, fallidos, en_proceso };
}

export default async function OverviewPage() {
  const { total, entregados, fallidos, en_proceso } = await getOverviewMetrics();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Resumen del Día</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Guías Creadas Hoy" value={total} />
        <StatsCard label="Entregadas" value={entregados} variant="success" />
        <StatsCard label="En Proceso" value={en_proceso} variant="info" />
        <StatsCard label="Fallidas" value={fallidos} variant="destructive" />
      </div>
    </div>
  );
}
