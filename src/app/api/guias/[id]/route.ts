import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";

const actualizarGuiaSchema = z.object({
  recoleccion_referencia: z.string().optional(),
  entrega_referencia: z.string().optional(),
  instrucciones: z.string().optional(),
  dimensiones: z.string().optional(),
  valor_declarado: z.number().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const guia = await db.guia.findUnique({
    where: { id },
    include: {
      piloto: true,
      estado_logs: { orderBy: { created_at: "asc" } },
    },
  });

  if (!guia) {
    return NextResponse.json({ ok: false, error: "Guía no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: guia });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = actualizarGuiaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const guia = await db.guia.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, data: guia });
}
