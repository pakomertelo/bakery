# Bakery

Aplicación para un negocio de repostería. Las Fases 0 y 1 establecen la arquitectura, PostgreSQL, Auth administrativa, RLS y Storage. La Fase 2 incorpora la web pública y un catálogo conectado a Supabase; todavía no permite enviar solicitudes ni administrar contenido.

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

Copia de `supabase:status` a `.env.local` la API URL y la clave pública `sb_publishable_...`. Usa `sb_publishable_...` exclusivamente como `VITE_SUPABASE_ANON_KEY`: nunca coloques una clave `sb_secret_...` ni una service role en ninguna variable `VITE_*`. La clave `sb_secret_...`/service role local solo pertenece a `SUPABASE_SERVICE_ROLE_KEY`, consumida por scripts locales o backend.

Reconstruye la base desde migraciones, carga automáticamente `supabase/seed.sql` y aplica después la configuración declarativa de buckets:

```bash
npm run supabase:reset
npm run supabase:types
npm run supabase:test
npm run supabase:lint
```

`npm run supabase:reset` encadena `supabase db reset` y `supabase seed buckets`. Este último materializa los buckets definidos en `supabase/config.toml`; no hace falta crearlos desde Studio. También puede ejecutarse aisladamente con `npm run supabase:buckets`.

Regenera `src/types/database.types.ts` después de cualquier cambio de esquema. Para arrancar Vite:

```bash
npm run dev
```

Frontend y API se sirven normalmente en `http://localhost:5173` y `http://127.0.0.1:54321`. Detén Supabase con `npm run supabase:stop`.

## Auth y administrador local

El signup general y por email están deshabilitados. La opción recomendada evita escribir la contraseña en el historial del shell: completa `LOCAL_ADMIN_EMAIL` y `LOCAL_ADMIN_PASSWORD` en el `.env.local` ignorado y ejecuta:

```bash
npm run admin:create-local
```

El comando lee `.env.local`, requiere `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_URL` (o `VITE_SUPABASE_URL`), confirma el email y crea/activa `admin_profiles`. Abortará ante una URL que no sea localhost/127.0.0.1. Los argumentos `-- <email> <password>` siguen disponibles como alternativa local, pero pueden quedar en el historial y no son la vía recomendada.

## Base de datos y Storage

Las migraciones versionadas en `supabase/migrations` son la única fuente de verdad del esquema y las políticas; la configuración declarativa de Storage vive en `supabase/config.toml`. El seed contiene settings, catálogo, 14 alérgenos, disponibilidad y un pedido completamente ficticios. La generación concurrente definitiva de referencias humanas queda para la Edge Function de la Fase 3; no se usa `count(*) + 1`.

En un entorno sin seed DEMO, un admin activo puede insertar la única fila de `site_settings`; la PK booleana con `CHECK (id)` mantiene el singleton. Después solo se actualiza: no existe DELETE de cliente. Productos y categorías tampoco conceden DELETE físico; la administración futura usará `active`, `published` y `archived_at`.

`catalog-public` sirve imágenes públicas, pero solo admins escriben. `order-references-private` es privado y durante esta fase solo admins acceden. Ambos limitan JPEG/PNG/WebP a 8 MiB. Consulta [la arquitectura](docs/ARCHITECTURE.md) y [el modelo de seguridad](docs/SECURITY.md).

## Variables

| Variable                                    | Exposición            | Uso                                                |
| ------------------------------------------- | --------------------- | -------------------------------------------------- |
| `VITE_SUPABASE_URL`                         | Pública               | API de Supabase local.                             |
| `VITE_SUPABASE_ANON_KEY`                    | Pública               | Clave `sb_publishable_...`; nunca `sb_secret_...`. |
| `VITE_SITE_URL`                             | Pública               | URL del frontend.                                  |
| `SUPABASE_URL`                              | Privada local         | URL alternativa para crear admin.                  |
| `SUPABASE_SERVICE_ROLE_KEY`                 | Secreto local/backend | `sb_secret_...`/service role; nunca `VITE_*`.      |
| `LOCAL_ADMIN_EMAIL`, `LOCAL_ADMIN_PASSWORD` | Secretos locales      | Vía recomendada para crear el admin.               |

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
| `npm run supabase:buckets`                                     | Aplica buckets declarativos.        |
| `npm run supabase:types`                                       | Regenera tipos desde la base local. |
| `npm run supabase:test`                                        | Ejecuta pgTAP.                      |
| `npm run supabase:lint`                                        | Lint de PostgreSQL local.           |
| `npm run admin:create-local`                                   | Crea/actualiza admin local.         |

No hay proyecto remoto, staging, producción, Edge Functions públicas ni UI administrativa funcional en esta fase.

## Web pública

La web consulta mediante TanStack Query la configuración, categorías y catálogo protegidos por RLS. Incluye inicio, filtros de catálogo en la URL, ficha de producto, personalizados informativo, sobre nosotros, contacto y estados 404. Las imágenes se resuelven exclusivamente desde el bucket público `catalog-public`; `/solicitud` sigue siendo informativa y no escribe pedidos.
