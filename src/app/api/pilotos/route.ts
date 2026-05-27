import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";

const crearPilotoSchema = z.object({
  nombre: z.string().min(1),
  tel_whatsapp: z.string().min(1),
});

export async function GET(_request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(_request.url);
  const tel = searchParams.get("tel");

  const pilotos = await db.piloto.findMany({
    where: {
      activo: true,
      ...(tel ? { tel_whatsapp: tel } : {}),
    },
    orderBy: { nombre: "asc" },
  });

  return NextResponse.json({ ok: true, data: pilotos });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = crearPilotoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const piloto = await db.piloto.create({ data: parsed.data });

  return NextResponse.json({ ok: true, data: piloto }, { status: 201 });
}
