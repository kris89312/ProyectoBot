import type { Estado, Origen } from "@/types";

type Transicion = {
  desde: Estado;
  hacia: Estado[];
  origenesPermitidos: Origen[];
};

const TRANSICIONES: Transicion[] = [
  {
    desde: "PENDIENTE",
    hacia: ["ASIGNADO"],
    origenesPermitidos: ["DASHBOARD"],
  },
  {
    desde: "ASIGNADO",
    hacia: ["RECIBIDO"],
    origenesPermitidos: ["PILOTO", "DASHBOARD"],
  },
  {
    desde: "RECIBIDO",
    hacia: ["EN_CAMINO"],
    origenesPermitidos: ["PILOTO", "DASHBOARD"],
  },
  {
    desde: "EN_CAMINO",
    hacia: ["ENTREGADO", "FALLIDO"],
    origenesPermitidos: ["PILOTO", "DASHBOARD"],
  },
];

export function esTransicionValida(
  estadoActual: Estado,
  estadoNuevo: Estado,
  origen: Origen
): boolean {
  const regla = TRANSICIONES.find((t) => t.desde === estadoActual);
  if (!regla) return false;
  return regla.hacia.includes(estadoNuevo) && regla.origenesPermitidos.includes(origen);
}

export function estadosSiguientes(estadoActual: Estado): Estado[] {
  const regla = TRANSICIONES.find((t) => t.desde === estadoActual);
  return regla?.hacia ?? [];
}
