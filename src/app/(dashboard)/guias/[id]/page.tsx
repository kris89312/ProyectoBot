import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetalleGuia } from "@/components/guias/detalle-guia";

async function getGuia(id: string) {
  return db.guia.findUnique({
    where: { id },
    include: {
      piloto: true,
      estado_logs: { orderBy: { created_at: "asc" } },
    },
  });
}

export default async function DetalleGuiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guia = await getGuia(id);
  if (!guia) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">
        Guía{" "}
        <span className="font-mono text-[#1A56DB]">{guia.numero_guia}</span>
      </h1>
      <DetalleGuia guia={guia} />
    </div>
  );
}
