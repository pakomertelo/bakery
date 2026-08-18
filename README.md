# Bakery

Base local de una aplicación de repostería. La Fase 1 implementa el dominio PostgreSQL, Auth administrativa, RLS y Storage; la interfaz sigue siendo provisional y todavía no permite enviar solicitudes ni administrar contenido.

## Stack y requisitos

React, TypeScript estricto, Vite, Supabase/PostgreSQL local, React Router, TanStack Query, React Hook Form, Zod, Tailwind, Vitest y pgTAP.

- Node.js 22+ y npm 10+.
- Docker compatible en ejecución.
- No se necesita Supabase global: la CLI es dependencia de desarrollo.

## Entorno local reproducible

```bash
npm ci
npm run supabase:start
npm run supabase:status
cp .env.example .env.local
```

Copia de `supabase:status` a `.env.local` la API URL, anon key y, solo para el script local, service role. Nunca uses la service role como `VITE_*`.

Reconstruye desde migraciones y carga automáticamente `supabase/seed.sql`:

```bash
npm run supabase:reset
npm run supabase:types
npm run supabase:test
npm run supabase:lint
```

Regenera `src/types/database.types.ts` después de cualquier cambio de esquema. Para arrancar Vite:

```bash
npm run dev
```

Frontend y API se sirven normalmente en `http://localhost:5173` y `http://127.0.0.1:54321`. Detén Supabase con `npm run supabase:stop`.

## Auth y administrador local

El signup general y por email están deshabilitados. Crea un administrador real solo contra Supabase local:

```bash
npm run admin:create-local -- admin@example.invalid 'contraseña-local-elegida'
```

El comando lee `.env.local`, requiere `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_URL` (o `VITE_SUPABASE_URL`), confirma el email y crea/activa `admin_profiles`. Abortará ante una URL que no sea localhost/127.0.0.1. No se versiona ninguna contraseña.

## Base de datos y Storage

Las migraciones versionadas en `supabase/migrations` son la única fuente de verdad. El seed contiene settings, catálogo, 14 alérgenos, disponibilidad y un pedido completamente ficticios. La generación concurrente definitiva de referencias humanas queda para la Edge Function de la Fase 3; no se usa `count(*) + 1`.

`catalog-public` sirve imágenes públicas, pero solo admins escriben. `order-references-private` es privado y durante esta fase solo admins acceden. Ambos limitan JPEG/PNG/WebP a 8 MiB. Consulta [la arquitectura](docs/ARCHITECTURE.md) y [el modelo de seguridad](docs/SECURITY.md).

## Variables

| Variable                                    | Exposición                  | Uso                                  |
| ------------------------------------------- | --------------------------- | ------------------------------------ |
| `VITE_SUPABASE_URL`                         | Pública                     | API de Supabase local.               |
| `VITE_SUPABASE_ANON_KEY`                    | Pública                     | Anon key protegida por RLS.          |
| `VITE_SITE_URL`                             | Pública                     | URL del frontend.                    |
| `SUPABASE_URL`                              | Privada local               | URL alternativa para crear admin.    |
| `SUPABASE_SERVICE_ROLE_KEY`                 | Secreto local/backend       | Solo script Admin API local.         |
| `LOCAL_ADMIN_EMAIL`, `LOCAL_ADMIN_PASSWORD` | Secretos locales opcionales | Alternativa a argumentos del script. |

Las demás variables privadas de `.env.example` están reservadas para fases posteriores y aún no se usan.

## Scripts y checks

| Comando                                                        | Acción                              |
| -------------------------------------------------------------- | ----------------------------------- |
| `npm run dev`                                                  | Vite local.                         |
| `npm run build`                                                | Typecheck y build.                  |
| `npm run lint` / `npm run typecheck`                           | Calidad estática.                   |
| `npm test`                                                     | Tests frontend.                     |
| `npm run format:check`                                         | Comprueba Prettier.                 |
| `npm run supabase:start` / `supabase:stop` / `supabase:status` | Ciclo de servicios local.           |
| `npm run supabase:reset`                                       | Reconstruye migraciones y seed.     |
| `npm run supabase:types`                                       | Regenera tipos desde la base local. |
| `npm run supabase:test`                                        | Ejecuta pgTAP.                      |
| `npm run supabase:lint`                                        | Lint de PostgreSQL local.           |
| `npm run admin:create-local -- <email> <password>`             | Crea/actualiza admin local.         |

No hay proyecto remoto, staging, producción, Edge Functions públicas ni UI administrativa funcional en esta fase.
