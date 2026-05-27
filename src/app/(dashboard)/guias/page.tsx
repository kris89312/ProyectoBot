import { db } from "@/lib/db";
import { TablaGuias } from "@/components/guias/tabla-guias";

async function getGuias() {
  return db.guia.findMany({
    include: { piloto: { select: { nombre: true } } },
    orderBy: { created_at: "desc" },
    take: 100,
  });
}

export default async function GuiasPage() {
  const guias = await getGuias();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Guías</h1>
      <TablaGuias guias={guias} />
    </div>
  );
}
