# GuiaExpress GT

Sistema SaaS de gestión de envíos con bot WhatsApp + dashboard operativo para Guatemala.

## Commands

- `pnpm dev` — Servidor de desarrollo
- `pnpm build` — Build producción
- `pnpm lint` — Linting
- `pnpm test` — Tests con Vitest
- `pnpm prisma:migrate` — Nueva migración
- `pnpm prisma:generate` — Regenerar tipos
- `pnpm prisma:studio` — UI para explorar DB

## Tech Stack

Next.js 15 App Router + TypeScript + Tailwind CSS v4 + shadcn/ui + PostgreSQL (Prisma) + Clerk + Railway

## Integraciones Externas

- **Evolution API**: Enviar/recibir mensajes WhatsApp — cliente en `src/lib/evolution.ts`
- **n8n**: Orquesta el flujo conversacional del bot — llama a nuestra API via HTTP
- **Clerk**: Auth para operadores del dashboard

## Architecture

### Directorio clave
- `src/app/(dashboard)/` — Rutas protegidas del dashboard (Clerk)
- `src/app/api/` — API routes (bot usa API Key, dashboard usa Clerk)
- `src/app/api/bot/` — Endpoints para n8n y Evolution API
- `src/lib/estados.ts` — Máquina de estados + transiciones válidas
- `src/lib/guia-numero.ts` — Generador de números GTM-YYYY-NNNNN
- `src/lib/evolution.ts` — Cliente Evolution API

### Data Flow
- Bot WhatsApp → n8n → `POST /api/guias` → DB (guía creada)
- Dashboard → `POST /api/asignaciones` → DB + Evolution API (notifica piloto)
- Piloto WhatsApp → n8n → `PATCH /api/guias/[id]/estado` → DB

### Auth Pattern
- Rutas dashboard: `auth()` de Clerk en Server Components, `useAuth()` en Client
- Rutas bot: verificar header `x-api-key: ${BOT_API_SECRET}`
- Middleware en `src/middleware.ts` protege todo `/(dashboard)/*`

## Estados de Guía y Transiciones Válidas

```
PENDIENTE → ASIGNADO (solo desde DASHBOARD al asignar piloto)
ASIGNADO → RECIBIDO (PILOTO o DASHBOARD)
RECIBIDO → EN_CAMINO (PILOTO o DASHBOARD)
EN_CAMINO → ENTREGADO (PILOTO o DASHBOARD)
EN_CAMINO → FALLIDO (PILOTO o DASHBOARD)
```
Nunca permitir transiciones fuera de estas. Validar en `lib/estados.ts` antes de cualquier PATCH.

## Code Organization Rules

1. **Un componente por archivo.** Máximo 300 líneas. Si es más largo, extraer subcomponentes.
2. **Path alias `@/`** para imports desde `src/`.
3. **Server Components por defecto.** Agregar `"use client"` solo cuando hay interactividad.
4. **Todas las queries a DB** pasan por `lib/db.ts` (singleton Prisma).
5. **Validar con Zod** todos los request bodies en API routes antes de tocar la DB.
6. **Nunca** hacer transiciones de estado sin pasar por `lib/estados.ts`.

## Design System

### Colores principales
- Primary: `#1A56DB` (botones, links)
- Background: `#F9FAFB`
- Surface: `#FFFFFF`
- Sidebar: `#1F2937`
- Text: `#111827`
- Muted: `#6B7280`

### Badges de Estado
- PENDIENTE: bg-gray-100 text-gray-600
- ASIGNADO: bg-blue-100 text-blue-700
- RECIBIDO: bg-purple-100 text-purple-700
- EN_CAMINO: bg-amber-100 text-amber-700
- ENTREGADO: bg-green-100 text-green-700
- FALLIDO: bg-red-100 text-red-600

### Tipografía
- Todo: Inter (Google Fonts)
- Números de guía: JetBrains Mono

## Environment Variables

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL Railway |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk secret |
| `BOT_API_SECRET` | API Key compartida con n8n |
| `EVOLUTION_API_URL` | URL del servicio Evolution API |
| `EVOLUTION_API_KEY` | Key de Evolution API |
| `EVOLUTION_INSTANCE` | Nombre de instancia WhatsApp |

## Reglas No Negociables

1. TypeScript strict — nunca usar `any`
2. Todas las API routes retornan `{ ok: boolean, data?: ..., error?: string }`
3. Nunca commitear `.env.local`
4. Siempre validar transiciones de estado con `lib/estados.ts` — nunca hardcodear
5. Polling en `/tracking` cada 30s — no WebSockets (mantener costo bajo)
6. Números de guía son inmutables — nunca permitir edición del `numero_guia`
