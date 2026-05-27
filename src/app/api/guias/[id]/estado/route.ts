import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { esTransicionValida } from "@/lib/estados";
import type { Estado, Origen } from "@/types";

function verificarApiKey(request: NextRequest): boolean {
  const key = request.headers.get("x-api-key");
  return key === process.env.BOT_API_SECRET;
}

const schema = z.object({
  estado_nuevo: z.enum(["PENDIENTE", "ASIGNADO", "RECIBIDO", "EN_CAMINO", "ENTREGADO", "FALLIDO"]),
  origen: z.enum(["BOT", "DASHBOARD", "PILOTO"]),
  nota: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const esApiKey = verificarApiKey(request);

  if (!userId && !esApiKey) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const guia = await db.guia.findUnique({
    where: { id },
    select: { id: true, estado: true },
  });

  if (!guia) {
    return NextResponse.json({ ok: false, error: "Guía no encontrada" }, { status: 404 });
  }

  const { estado_nuevo, origen, nota } = parsed.data;

  if (!esTransicionValida(guia.estado as Estado, estado_nuevo as Estado, origen as Origen)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Transición inválida: ${guia.estado} → ${estado_nuevo} (origen: ${origen})`,
      },
      { status: 422 }
    );
  }

  const [guiaActualizada] = await db.$transaction([
    db.guia.update({
      where: { id: id },
      data: { estado: estado_nuevo as Estado },
      select: { id: true, estado: true, updated_at: true },
    }),
    db.estadoLog.create({
      data: {
        guia_id: id,
        estado_anterior: guia.estado,
        estado_nuevo: estado_nuevo as Estado,
        origen: origen as Origen,
        nota: nota ?? null,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, data: { guia: guiaActualizada } });
}
