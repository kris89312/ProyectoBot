import { db } from "@/lib/db";
import { PanelAsignacion } from "@/components/asignaciones/panel-asignacion";

async function getGuiasPendientes() {
  return db.guia.findMany({
    where: { estado: "PENDIENTE" },
    orderBy: { created_at: "asc" },
  });
}

async function getPilotosActivos() {
  return db.piloto.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
  });
}

export default async function AsignacionesPage() {
  const [guias, pilotos] = await Promise.all([
    getGuiasPendientes(),
    getPilotosActivos(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">
        Asignaciones{" "}
        <span className="text-base font-normal text-[#6B7280]">
          ({guias.length} pendientes)
        </span>
      </h1>
      <PanelAsignacion guias={guias} pilotos={pilotos} />
    </div>
  );
}
