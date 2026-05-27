import { db } from "@/lib/db";

export async function generarNumeroGuia(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `GTM-${year}-`;

  const ultima = await db.guia.findFirst({
    where: { numero_guia: { startsWith: prefix } },
    orderBy: { numero_guia: "desc" },
    select: { numero_guia: true },
  });

  let siguiente = 1;
  if (ultima) {
    const partes = ultima.numero_guia.split("-");
    siguiente = parseInt(partes[2], 10) + 1;
  }

  return `${prefix}${String(siguiente).padStart(5, "0")}`;
}
