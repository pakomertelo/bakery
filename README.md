# Bakery

Base técnica de una aplicación web para un pequeño negocio de repostería. En la Fase 0 solo ofrece navegación y layouts provisionales; todavía no incluye catálogo funcional, solicitudes ni administración.

## Stack

- React, TypeScript estricto y Vite.
- Tailwind CSS.
- React Router y TanStack Query.
- React Hook Form y Zod, preparados para formularios posteriores.
- Supabase local (PostgreSQL, Auth, Storage y Edge Functions).
- ESLint, Prettier y Vitest con Testing Library.

## Requisitos

- Node.js 22 o superior (se ha verificado con Node.js 24).
- npm 10 o superior.
- Docker compatible con Docker Compose, en ejecución, para Supabase local.

La CLI de Supabase se instala como dependencia de desarrollo; no hace falta instalarla globalmente.

## Instalación

```bash
npm install
cp .env.example .env.local
```

Arranca el frontend:

```bash
npm run dev
```

Vite lo sirve normalmente en `http://localhost:5173`.

## Supabase local

Con Docker iniciado:

```bash
npm run supabase:start
npm run supabase:status
```

`supabase:status` muestra la URL local y la anon key. Copia ambas a `.env.local`. Para detener los servicios:

```bash
npm run supabase:stop
```

La configuración versionada está en `supabase/config.toml`. Aún no hay migraciones, seed, buckets ni funciones de negocio: pertenecen a fases posteriores. El primer arranque descarga imágenes Docker y puede tardar.

## Variables de entorno

El punto de partida es `.env.example`:

| Variable | Exposición | Uso actual |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Pública | URL del API local de Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Pública | Clave anónima; nunca una service role. |
| `VITE_SITE_URL` | Pública | URL base del frontend. |

**Todas las variables `VITE_*` se incorporan al bundle y son visibles en el navegador.** Nunca deben contener secretos. `.env.example` también enumera variables privadas reservadas para futuras Edge Functions, sin valores reales; no se usan en esta fase.

Si faltan la URL o la anon key, el cliente no se crea y durante desarrollo se muestra un aviso claro en consola. Esto permite ejecutar los placeholders sin ocultar una configuración incompleta.

## Scripts

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Vite. |
| `npm run build` | Typecheck y build de producción. |
| `npm run lint` | ESLint sin warnings permitidos. |
| `npm run typecheck` | Comprobación TypeScript estricta. |
| `npm test` | Tests unitarios una vez. |
| `npm run test:watch` | Tests en modo interactivo. |
| `npm run format` | Formatea archivos con Prettier. |
| `npm run format:check` | Comprueba el formato. |
| `npm run supabase:start` | Levanta Supabase local. |
| `npm run supabase:stop` | Detiene Supabase local. |
| `npm run supabase:status` | Muestra servicios y credenciales locales. |

## Estado

Consulta [`docs/IMPLEMENTATION_STATUS.md`](docs/IMPLEMENTATION_STATUS.md). La arquitectura se documenta en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

No se documentan staging ni producción porque todavía no se han implementado.
