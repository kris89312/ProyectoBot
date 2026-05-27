import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generarNumeroGuia } from "@/lib/guia-numero";

function verificarApiKey(request: NextRequest): boolean {
  const key = request.headers.get("x-api-key");
  return key === process.env.BOT_API_SECRET;
}

const crearGuiaSchema = z.object({
  remitente_nombre: z.string().min(1),
  remitente_tel: z.string().min(1),
  recoleccion_direccion: z.string().min(1),
  recoleccion_zona: z.string().min(1),
  recoleccion_referencia: z.string().optional(),
  destinatario_nombre: z.string().min(1),
  destinatario_tel: z.string().min(1),
  entrega_direccion: z.string().min(1),
  entrega_zona: z.string().min(1),
  entrega_referencia: z.string().optional(),
  peso_kg: z.number().positive(),
  dimensiones: z.string().optional(),
  tipo_paquete: z.enum(["SOBRE", "CAJA_PEQUENA", "CAJA_GRANDE", "OTRO"]),
  valor_declarado: z.number().optional(),
  instrucciones: z.string().optional(),
  whatsapp_session_id: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const estado = searchParams.get("estado");
  const zona = searchParams.get("zona");
  const fecha_inicio = searchParams.get("fecha_inicio");
  const fecha_fin = searchParams.get("fecha_fin");

  const guias = await db.guia.findMany({
    where: {
      ...(estado ? { estado: estado as never } : {}),
      ...(zona ? { entrega_zona: { contains: zona, mode: "insensitive" } } : {}),
      ...(fecha_inicio || fecha_fin
        ? {
            created_at: {
              ...(fecha_inicio ? { gte: new Date(fecha_inicio) } : {}),
              ...(fecha_fin ? { lte: new Date(fecha_fin) } : {}),
            },
          }
        : {}),
    },
    include: { piloto: { select: { nombre: true } } },
    orderBy: { created_at: "desc" },
    take: 200,
  });

  return NextResponse.json({ ok: true, data: guias });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const esApiKey = verificarApiKey(request);

  if (!userId && !esApiKey) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = crearGuiaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.message },
      { status: 400 }
    );
  }

  const numero_guia = await generarNumeroGuia();

  const guia = await db.guia.create({
    data: { ...parsed.data, numero_guia },
    select: { id: true, numero_guia: true, estado: true, created_at: true },
  });

  return NextResponse.json({ ok: true, data: { guia } }, { status: 201 });
}
