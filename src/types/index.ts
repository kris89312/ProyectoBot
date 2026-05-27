export type Estado = "PENDIENTE" | "ASIGNADO" | "RECIBIDO" | "EN_CAMINO" | "ENTREGADO" | "FALLIDO";
export type TipoPaquete = "SOBRE" | "CAJA_PEQUENA" | "CAJA_GRANDE" | "OTRO";
export type Origen = "BOT" | "DASHBOARD" | "PILOTO";

export interface Piloto {
  id: string;
  nombre: string;
  tel_whatsapp: string;
  activo: boolean;
  created_at: Date;
}

export interface EstadoLog {
  id: string;
  guia_id: string;
  estado_anterior: Estado;
  estado_nuevo: Estado;
  origen: Origen;
  nota: string | null;
  created_at: Date;
}

export interface Guia {
  id: string;
  numero_guia: string;
  estado: Estado;
  remitente_nombre: string;
  remitente_tel: string;
  recoleccion_direccion: string;
  recoleccion_zona: string;
  recoleccion_referencia: string | null;
  destinatario_nombre: string;
  destinatario_tel: string;
  entrega_direccion: string;
  entrega_zona: string;
  entrega_referencia: string | null;
  peso_kg: number;
  dimensiones: string | null;
  tipo_paquete: TipoPaquete;
  valor_declarado: number | null;
  instrucciones: string | null;
  piloto_id: string | null;
  piloto?: Piloto | null;
  estado_logs?: EstadoLog[];
  whatsapp_session_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface BotSesion {
  id: string;
  tel_whatsapp: string;
  paso_actual: string;
  datos_parciales: Record<string, unknown>;
  guia_id: string | null;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface ReporteResumen {
  total: number;
  entregados: number;
  fallidos: number;
  en_proceso: number;
  tasa_exito: string;
}

export interface ReportePorZona {
  zona: string;
  total: number;
  entregados: number;
}

export interface ReportePorPiloto {
  piloto: string;
  total: number;
  entregados: number;
}

export interface ReportePorDia {
  fecha: string;
  total: number;
}

export interface Reporte {
  resumen: ReporteResumen;
  por_zona: ReportePorZona[];
  por_piloto: ReportePorPiloto[];
  por_dia: ReportePorDia[];
}
