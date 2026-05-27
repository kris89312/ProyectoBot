import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";

const actualizarPilotoSchema = z.object({
  nombre: z.string().min(1).optional(),
  tel_whatsapp: z.string().min(1).optional(),
  activo: z.boolean().optional(),
});

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
  const parsed = actualizarPilotoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const piloto = await db.piloto.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, data: piloto });
}
