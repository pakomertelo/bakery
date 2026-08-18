# Arquitectura — Fase 1

## Alcance

El frontend de Fase 0 continúa como interfaz provisional. Esta fase añade un backend Supabase local reproducible (PostgreSQL, Auth, RLS y Storage), sin catálogo visual, creación pública de pedidos, panel funcional ni servicios remotos.

## Flujo local y fuentes de verdad

`supabase/config.toml` configura servicios, bloquea signup y declara los buckets locales. Las migraciones SQL versionadas son la única definición del esquema y las políticas. `npm run supabase:reset` ejecuta `supabase db reset` (migraciones y `supabase/seed.sql`) y después `supabase seed buckets`, sin pasos en Studio. Los tipos del cliente se regeneran de forma multiplataforma con `npm run supabase:types`.

## Modelo de datos

```mermaid
erDiagram
  CATEGORIES ||--o{ PRODUCTS : clasifica
  PRODUCTS ||--o{ PRODUCT_IMAGES : contiene
  PRODUCTS ||--o{ PRODUCT_VARIANTS : ofrece
  PRODUCTS }o--o{ FLAVOURS : product_flavours
  PRODUCTS }o--o{ ALLERGENS : product_allergens
  ORDERS ||--o{ ORDER_ITEMS : conserva_snapshots
  ORDERS ||--o| CUSTOM_ORDER_DETAILS : personaliza
  ORDERS ||--o{ ORDER_REFERENCE_IMAGES : referencia
  ORDERS ||--o{ ORDER_STATUS_HISTORY : audita
  ORDERS ||--o{ EMAIL_EVENTS : registra
  AUTH_USERS ||--o| ADMIN_PROFILES : autoriza
```

Las entidades principales usan UUID, timestamps técnicos son `timestamptz`, fechas solicitadas son `date` y dinero son céntimos enteros. Los enums cierran modos de precio, tipo/estado de pedido, fulfilment y rol admin. Constraints validan precios, moneda, cantidades, raciones, rangos, slugs, referencias y singleton de settings. FKs destructivas sobre histórico usan `restrict` o `set null`; productos y categorías no conceden DELETE al cliente administrativo y utilizan archivado/despublicación.

El seed crea el singleton DEMO en local. En entornos donde no se aplica ese seed, un admin activo puede insertar la única fila `site_settings`; la PK booleana restringida a `true` impide una segunda configuración y no se concede DELETE normal.

Un trigger reutilizable mantiene `updated_at`. Otro registra automáticamente el estado inicial y cada cambio de `orders.status`, usando `auth.uid()` cuando existe. Índices cubren navegación de catálogo y búsquedas habituales de pedidos/disponibilidad.

## Auth, autorización y RLS

Auth permanece habilitado para login, pero todo signup público está deshabilitado. `admin_profiles` separa autenticación de autorización. `is_admin()` comprueba el perfil activo y rol `admin`; usuarios autenticados normales e inactivos no adquieren permisos.

Todas las tablas públicas tienen RLS, complementada con grants mínimos. Anon solo lee settings, catálogo público y el resultado limitado de `get_public_availability()`. Esa función omite `reason_internal`; pedidos, clientes, notas, referencias, historial y email son privados. Admin activo administra el dominio, salvo que el historial y los eventos sean de solo lectura desde cliente.

## Storage

La configuración declarativa de la CLI crea `catalog-public` (público para lectura) y `order-references-private` (privado) mediante `supabase seed buckets`. Ambos restringen MIME y tamaño; las políticas SQL versionadas sobre `storage.objects` exigen `is_admin()` para escritura/gestión. La Fase 1 no abre uploads públicos ni URLs permanentes privadas.

## Frontend

`src/lib/supabase.ts` solo consume URL y clave `sb_publishable_...` públicas y utiliza `Database` desde `src/types/database.types.ts`. Las claves `sb_secret_...`/service role nunca entran en el bundle. Las rutas y layouts continúan siendo placeholders de Fase 0; la UI funcional corresponde a fases posteriores.
