import { NextRequest, NextResponse } from "next/server";

function verificarApiKey(request: NextRequest): boolean {
  const key = request.headers.get("x-api-key");
  return key === process.env.BOT_API_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verificarApiKey(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();

  // n8n envía eventos de Evolution API aquí para procesamiento
  // La lógica del flujo conversacional vive en n8n
  console.log("Webhook bot recibido:", JSON.stringify(body, null, 2));

  return NextResponse.json({ ok: true });
}
