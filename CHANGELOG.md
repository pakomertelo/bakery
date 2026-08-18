# Changelog

Todos los cambios relevantes del proyecto se documentarán en este archivo, siguiendo [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]

### Added

- Web pública mobile-first con inicio, navegación compartida, footer, sobre nosotros, contacto, personalizados informativo y 404 coherente.
- Catálogo Supabase con filtro persistente en URL, tarjetas reutilizables, ficha por slug, galería accesible, variantes, raciones, sabores y alérgenos.
- Capa pública de queries TanStack Query, helper central de Storage, estados de carga/error/vacío y tests de precio y producto.

- Esquema PostgreSQL inicial versionado con dominio de catálogo, configuración, disponibilidad, pedidos, auditoría y eventos de email.
- Autorización administrativa explícita, RLS/grants de mínimo privilegio y signup público deshabilitado.
- Buckets reproducibles de catálogo público y referencias privadas con políticas admin y límites de archivo.
- Seed DEMO determinista, script protegido de creación de admin local y suite pgTAP estructural/de seguridad.
- Tipos TypeScript del esquema y cliente Supabase tipado, además de documentación operativa y de seguridad.
- Cierre verificado de la Fase 0 con `package-lock.json` versionado.
- Cierre formal de la Fase 1 tras verificar reconstrucción local, tipos, pgTAP, lint, tests y build.

### Changed

- Buckets locales declarados mediante Supabase CLI, generación de tipos multiplataforma y endurecimiento del catálogo/settings sin DELETE físico normal.
- Tests pgTAP y frontend deterministas, salida de tipos normalizada, exclusión ESLint del archivo generado y configuración `local_smtp` moderna.
- Grants SQL backend explícitos para `service_role`, cubiertos por pgTAP, sin ampliar permisos de anon o authenticated.

- Base React, TypeScript estricto, Vite y Tailwind CSS.
- Routing público y administrativo provisional con manejo de páginas no encontradas.
- Integración base de TanStack Query y cliente público de Supabase.
- Configuración local de Supabase para PostgreSQL, Auth, Storage y Edge Functions.
- Herramientas de lint, formato, typecheck, tests unitarios y build.
- Documentación operativa, arquitectura y seguimiento de fases.
