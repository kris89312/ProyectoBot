import { db } from "@/lib/db";
import { TablaPilotos } from "@/components/pilotos/tabla-pilotos";

async function getPilotos() {
  return db.piloto.findMany({
    orderBy: { created_at: "desc" },
    include: {
      _count: { select: { guias: { where: { estado: { in: ["ASIGNADO", "RECIBIDO", "EN_CAMINO"] } } } } },
    },
  });
}

export default async function PilotosPage() {
  const pilotos = await getPilotos();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Pilotos</h1>
      <TablaPilotos pilotos={pilotos} />
    </div>
  );
}
