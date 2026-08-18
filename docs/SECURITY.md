# Seguridad — Fase 1

## Modelo de acceso

Supabase distingue `anon`, `authenticated` y `service_role`. Una sesión `authenticated` no es administrativa: `public.is_admin()` solo devuelve verdadero cuando `auth.uid()` corresponde a un `admin_profiles` activo con rol `admin`. La función es `SECURITY DEFINER`, no acepta parámetros, fija un `search_path` vacío y solo concede ejecución a `authenticated`.

La service role omite RLS y queda reservada para procesos backend. En esta fase solo la utiliza `scripts/create-local-admin.mjs`, que aborta si la URL no apunta a `localhost` o `127.0.0.1`. Nunca debe utilizarse en `src`, una variable `VITE_*`, logs o Git.

## Base de datos y RLS

Todas las tablas de negocio de `public` tienen RLS. Los grants y políticas aplican defensa en profundidad:

- `anon` solo lee settings, catálogo activo/publicado y la función de disponibilidad segura;
- `authenticated` no-admin conserva el acceso público, pero no ve pedidos ni obtiene escrituras administrativas;
- admin activo gestiona catálogo, configuración, disponibilidad, pedidos y metadata de imágenes;
- historial de estados y eventos de email son auditoría de solo lectura para admin;
- `admin_profiles` no admite escrituras desde clientes; un usuario solo puede consultar su propio perfil;
- anon no tiene ningún privilegio sobre pedidos ni sus tablas relacionadas.

`public.get_public_availability()` es una función deliberadamente limitada a id, fechas y mensaje público. Es `SECURITY DEFINER`, no acepta parámetros, fija un `search_path` vacío y tiene ejecución limitada a roles cliente. La tabla base queda bajo política admin, de modo que `reason_internal` no se concede a anon.

## Storage

- `catalog-public` es público para servir imágenes, acepta JPEG/PNG/WebP hasta 8 MiB y solo un admin puede escribir o borrar.
- `order-references-private` es privado, tiene los mismos MIME y límite de 8 MiB, y solo un admin activo puede listar o gestionar objetos durante esta fase.

No existe upload público de referencias; se añadirá mediante backend controlado en la Fase 4.

## Administrador local y secretos

Tras `supabase start`, copia la URL y service role mostradas por `supabase status` a `.env.local`. Ejecuta:

```bash
npm run admin:create-local -- admin@example.invalid 'elige-una-contraseña-local'
```

El script crea/confirma el usuario mediante la Admin API oficial y hace upsert del perfil activo. No insertes usuarios directamente en `auth`, no publiques `.env.local` y no uses el script contra servicios remotos.

## Verificación

```bash
npm run supabase:reset
npm run supabase:test
npm run supabase:lint
```

Los tests pgTAP verifican estructura, RLS, separación entre usuario normal/admin/inactivo, indisponibilidad de datos personales, ocultación de `reason_internal` y privacidad/escrituras de Storage.
