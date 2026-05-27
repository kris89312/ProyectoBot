import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enviarMensaje } from "@/lib/evolution";

function verificarApiKey(request: NextRequest): boolean {
  const key = request.headers.get("x-api-key");
  return key === process.env.BOT_API_SECRET;
}

const schema = z.object({
  tel: z.string().min(1),
  texto: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!verificarApiKey(request)) {
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

  await enviarMensaje(parsed.data.tel, parsed.data.texto);

  return NextResponse.json({ ok: true });
}
