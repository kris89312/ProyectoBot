import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { esTransicionValida } from "@/lib/estados";
import { enviarMensaje } from "@/lib/evolution";

const schema = z.object({
  guia_id: z.string().min(1),
  piloto_id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const { guia_id, piloto_id } = parsed.data;

  const [guia, piloto] = await Promise.all([
    db.guia.findUnique({ where: { id: guia_id }, select: { id: true, estado: true, numero_guia: true, entrega_zona: true, entrega_direccion: true } }),
    db.piloto.findUnique({ where: { id: piloto_id }, select: { id: true, nombre: true, tel_whatsapp: true, activo: true } }),
  ]);

  if (!guia) return NextResponse.json({ ok: false, error: "Guía no encontrada" }, { status: 404 });
  if (!piloto) return NextResponse.json({ ok: false, error: "Piloto no encontrado" }, { status: 404 });
  if (!piloto.activo) return NextResponse.json({ ok: false, error: "Piloto inactivo" }, { status: 422 });

  if (!esTransicionValida(guia.estado, "ASIGNADO", "DASHBOARD")) {
    return NextResponse.json(
      { ok: false, error: `No se puede asignar una guía en estado ${guia.estado}` },
      { status: 422 }
    );
  }

  await db.$transaction([
    db.guia.update({
      where: { id: guia_id },
      data: { piloto_id, estado: "ASIGNADO" },
    }),
    db.estadoLog.create({
      data: {
        guia_id,
        estado_anterior: guia.estado,
        estado_nuevo: "ASIGNADO",
        origen: "DASHBOARD",
        nota: `Asignado a ${piloto.nombre}`,
      },
    }),
  ]);

  // Notificar al piloto via WhatsApp
  try {
    const mensaje = `*Nueva guía asignada* ✅\n\nGuía: *${guia.numero_guia}*\nDestino: ${guia.entrega_direccion} (${guia.entrega_zona})\n\nResponde con:\n1️⃣ Recibido\n2️⃣ En Camino\n3️⃣ Entregado\n4️⃣ Fallido`;
    await enviarMensaje(piloto.tel_whatsapp, mensaje);
  } catch {
    // La asignación fue exitosa aunque falle la notificación
  }

  return NextResponse.json({ ok: true, data: { guia_id, piloto_id } }, { status: 201 });
}
