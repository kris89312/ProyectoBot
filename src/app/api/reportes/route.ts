import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

function getRangoFechas(periodo: string, fecha_inicio?: string, fecha_fin?: string) {
  const hoy = new Date();
  if (periodo === "dia") return { gte: startOfDay(hoy), lte: endOfDay(hoy) };
  if (periodo === "semana") return { gte: startOfWeek(hoy, { weekStartsOn: 1 }), lte: endOfWeek(hoy, { weekStartsOn: 1 }) };
  if (periodo === "mes") return { gte: startOfMonth(hoy), lte: endOfMonth(hoy) };
  if (fecha_inicio && fecha_fin) return { gte: new Date(fecha_inicio), lte: new Date(fecha_fin) };
  return { gte: startOfDay(hoy), lte: endOfDay(hoy) };
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const periodo = searchParams.get("periodo") ?? "dia";
  const fecha_inicio = searchParams.get("fecha_inicio") ?? undefined;
  const fecha_fin = searchParams.get("fecha_fin") ?? undefined;

  const rango = getRangoFechas(periodo, fecha_inicio, fecha_fin);

  const guias = await db.guia.findMany({
    where: { created_at: rango },
    include: { piloto: { select: { nombre: true } } },
  });

  const total = guias.length;
  const entregados = guias.filter((g) => g.estado === "ENTREGADO").length;
  const fallidos = guias.filter((g) => g.estado === "FALLIDO").length;
  const en_proceso = guias.filter((g) => !["ENTREGADO", "FALLIDO"].includes(g.estado)).length;
  const tasa_exito = total > 0 ? `${Math.round((entregados / total) * 100)}%` : "0%";

  const zonaMap = new Map<string, { total: number; entregados: number }>();
  const pilotoMap = new Map<string, { total: number; entregados: number }>();

  for (const g of guias) {
    const zona = g.entrega_zona;
    const pz = zonaMap.get(zona) ?? { total: 0, entregados: 0 };
    pz.total++;
    if (g.estado === "ENTREGADO") pz.entregados++;
    zonaMap.set(zona, pz);

    if (g.piloto) {
      const pp = pilotoMap.get(g.piloto.nombre) ?? { total: 0, entregados: 0 };
      pp.total++;
      if (g.estado === "ENTREGADO") pp.entregados++;
      pilotoMap.set(g.piloto.nombre, pp);
    }
  }

  const por_zona = Array.from(zonaMap.entries()).map(([zona, v]) => ({ zona, ...v }));
  const por_piloto = Array.from(pilotoMap.entries()).map(([piloto, v]) => ({ piloto, ...v }));

  return NextResponse.json({
    ok: true,
    data: {
      resumen: { total, entregados, fallidos, en_proceso, tasa_exito },
      por_zona,
      por_piloto,
    },
  });
}
