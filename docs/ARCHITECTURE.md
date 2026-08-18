# Arquitectura — Fase 0

## Alcance actual

La implementación contiene únicamente la base técnica y páginas temporales. No existe esquema funcional, autenticación administrativa, catálogo, pedidos, emails ni despliegue remoto.

## Frontend

`src/main.tsx` monta `App`. La capa `src/app` contiene la composición global:

- `App.tsx`: proveedores compartidos;
- `router.tsx`: árbol de rutas;
- `queryClient.ts`: caché de estado servidor.

`src/pages` contiene componentes de nivel de ruta. `src/components` contiene UI reutilizable y los layouts. `src/lib` concentra integraciones externas, actualmente el cliente Supabase. `src/test` contiene configuración transversal de tests.

Cuando exista una necesidad real, las nuevas unidades se separarán en:

- `features`: funcionalidad cohesionada por dominio;
- `data`: acceso a datos y queries;
- `hooks`: hooks React reutilizables;
- `validations`: esquemas Zod;
- `utils`: funciones puras generales;
- `types`: tipos compartidos.

No se crean directorios vacíos: se incorporarán con su primer caso de uso.

## Routing y layouts

React Router usa `createBrowserRouter`. Las páginas públicas comparten `PublicLayout`, con header y footer provisionales. `/admin` y sus descendientes comparten `AdminLayout`. El 404 público y el administrativo conservan el contexto de su layout.

Las rutas administrativas no están protegidas todavía: son placeholders explícitos. Auth y autorización pertenecen a la Fase 1.

## Estado servidor

TanStack Query se configura en un único `QueryClient`. No existe estado remoto todavía. No se ha añadido un gestor de estado global adicional.

## Supabase

`src/lib/supabase.ts` lee exclusivamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Si faltan, exporta un cliente nulo y un mensaje diagnóstico en desarrollo. Nunca usa service role.

`supabase/config.toml` habilita localmente API/PostgreSQL, Auth, Storage, Realtime, Studio, Inbucket y Edge Runtime. No contiene esquema, migraciones, buckets o seed funcionales; se añadirán en la Fase 1.

## Formularios y validación

React Hook Form, su adaptador oficial para resolvers y Zod están instalados, pero no se ha creado ningún formulario ficticio solo para ejercitarlos. Los futuros esquemas se ubicarán fuera de componentes visuales cuando aparezca el primer caso real.

## Decisiones

- TypeScript usa `strict`, comprobación de elementos no usados y módulos aislados.
- Vitest es el único framework unitario y usa jsdom/Testing Library para React.
- ESLint usa flat config; Prettier se limita al formato.
- Tailwind 4 se integra directamente con Vite, evitando configuración PostCSS adicional.
- Se favorece crecimiento bajo demanda para evitar carpetas y abstracciones vacías.
