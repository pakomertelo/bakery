# Especificación funcional y técnica

## 0. Propósito de este documento

Este documento constituye la especificación maestra del proyecto.

Su objetivo es definir con suficiente precisión:

- qué debe hacer la aplicación;
- qué no debe hacer;
- cómo debe estructurarse;
- qué reglas de negocio existen;
- qué datos se almacenan;
- qué permisos existen;
- cómo deben funcionar desarrollo, preproducción y producción;
- qué requisitos de seguridad deben respetarse;
- qué experiencia debe recibir el cliente;
- qué herramientas debe tener la administradora;
- cómo debe desplegarse y mantenerse el proyecto.

`SPEC.md` debe considerarse la fuente de verdad funcional del proyecto.

Antes de implementar cualquier funcionalidad, el desarrollador o agente debe leer este documento.

Si una instrucción posterior contradice expresamente este documento, prevalecerá la instrucción posterior únicamente para aquello que modifique de forma explícita.

No reinterpretar requisitos silenciosamente.

Cuando haya una decisión técnica menor no especificada aquí, escoger la opción:

1. más sencilla;
2. más mantenible;
3. más segura;
4. con menos dependencias;
5. adecuada para un pequeño negocio;
6. compatible con desarrollo local, staging y producción.

No sobrearquitecturar.

---

# 1. Resumen del producto

Se desarrollará una aplicación web para un pequeño negocio de repostería.

La aplicación tendrá dos áreas claramente diferenciadas:

1. web pública para clientes;
2. panel privado de administración.

La web pública permitirá:

- conocer el negocio;
- consultar productos;
- navegar por categorías;
- consultar fotografías;
- consultar precios orientativos o exactos;
- consultar características;
- consultar alérgenos;
- seleccionar productos;
- solicitar un pedido basado en el catálogo;
- solicitar un producto personalizado;
- adjuntar fotografías de referencia en pedidos personalizados;
- seleccionar una fecha deseada;
- facilitar los datos necesarios para poder contactar con el cliente;
- aceptar las condiciones necesarias antes del envío;
- enviar una solicitud.

La aplicación NO realizará cobros online.

La aplicación NO confirmará automáticamente pedidos.

Una solicitud enviada por un cliente deberá ser posteriormente revisada por la propietaria.

La propietaria contactará con el cliente para confirmar:

- disponibilidad;
- fecha;
- características;
- cantidades;
- personalización;
- precio;
- forma de pago;
- recogida o entrega cuando proceda.

Por tanto, conceptualmente el sistema gestiona:

**solicitudes de pedido**, no compras online automáticas.

---

# 2. Principios generales

El proyecto debe priorizar, por este orden:

1. fiabilidad;
2. seguridad;
3. facilidad de uso;
4. claridad;
5. simplicidad;
6. mantenibilidad;
7. buen diseño;
8. rendimiento;
9. extensibilidad razonable.

Es una aplicación para un pequeño negocio.

No debe convertirse innecesariamente en:

- un ERP;
- un CRM complejo;
- un marketplace;
- un CMS generalista;
- un sistema de facturación;
- una plataforma ecommerce completa;
- un sistema de reservas extremadamente complejo.

Debe resolver muy bien las necesidades concretas descritas en este documento.

---

# 3. Conceptos y terminología

A lo largo de todo el código y la interfaz deben distinguirse los siguientes conceptos.

## Solicitud

Petición enviada por un cliente.

Todavía no existe confirmación por parte del negocio.

## Pedido confirmado

Solicitud que la propietaria ha revisado y confirmado posteriormente con el cliente.

## Catálogo

Conjunto público de productos que el negocio desea mostrar.

## Producto personalizado

Solicitud cuyo contenido no depende exclusivamente de un producto ya definido en catálogo.

## Administradora

Persona autorizada a acceder al panel `/admin`.

## Cliente

Visitante público que consulta la web o envía una solicitud.

## Staging

Entorno remoto de prueba/preproducción separado completamente de producción.

## Producción

Entorno real utilizado por clientes y con datos reales.

---

# 4. Funcionalidades expresamente fuera de alcance

Salvo que una especificación futura las añada, NO implementar:

- pago online;
- Stripe;
- PayPal;
- carrito ecommerce tradicional;
- cuentas de clientes;
- login de clientes;
- registro público;
- programa de fidelización;
- puntos;
- cupones;
- facturación electrónica;
- emisión de facturas;
- contabilidad;
- integración con TPV;
- chat en tiempo real;
- WhatsApp automatizado;
- notificaciones push;
- aplicación móvil nativa;
- panel multiempresa;
- múltiples establecimientos;
- múltiples administradores con roles complejos;
- sistema de reparto avanzado;
- tracking del pedido por parte del cliente;
- comentarios/reseñas públicas;
- marketplace;
- Analytics de terceros;
- Meta Pixel;
- Hotjar;
- publicidad;
- trackers comerciales.

Estas funcionalidades pueden añadirse posteriormente, pero no forman parte de la versión inicial.

---

# 5. Stack tecnológico

## Frontend

Utilizar:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- TanStack Query;
- React Hook Form;
- Zod.

Utilizar TypeScript en modo estricto.

Evitar `any` salvo casos excepcionalmente justificados.

## Backend y datos

Utilizar Supabase para:

- PostgreSQL;
- autenticación;
- almacenamiento de imágenes;
- Row Level Security;
- funciones PostgreSQL cuando resulte conveniente;
- Edge Functions para operaciones backend;
- Realtime cuando aporte valor.

## Email

Utilizar Resend para emails transaccionales.

## Protección antispam

Utilizar Cloudflare Turnstile.

## Hosting frontend

Cloudflare Pages.

## Repositorio

Git + GitHub.

---

# 6. Arquitectura general

La arquitectura conceptual será:

```text
Cliente
   │
   ▼
React / Cloudflare Pages
   │
   ├──────────────► Supabase Auth
   │
   ├──────────────► Supabase Database
   │
   ├──────────────► Supabase Storage
   │
   └──────────────► Supabase Edge Functions
                           │
                           ├── Validaciones sensibles
                           ├── Creación de solicitudes
                           ├── Turnstile
                           ├── Rate limiting
                           └── Resend
```

El frontend público no debe tener privilegios administrativos.

Las operaciones críticas no deberán confiar exclusivamente en validaciones de React.

---

# 7. Entornos

Existirán tres entornos conceptuales.

## 7.1 Local

Entorno principal de desarrollo.

Todo el desarrollo debe poder realizarse localmente.

Utilizar:

- frontend local;
- Supabase local;
- PostgreSQL local;
- Auth local;
- Storage local;
- Edge Functions locales;
- datos ficticios.

Ejemplo:

```text
http://localhost:5173
```

El proyecto debe poder levantarse siguiendo únicamente la documentación del repositorio.

No depender de configuraciones ocultas realizadas manualmente por el desarrollador.

## 7.2 Staging

Entorno remoto de pruebas.

Debe tener:

- despliegue independiente;
- variables de entorno independientes;
- proyecto Supabase independiente;
- base de datos independiente;
- Storage independiente;
- usuarios ficticios;
- pedidos ficticios.

Staging nunca utilizará la base de datos de producción.

El objetivo de staging es probar:

- navegación real por Internet;
- dispositivos móviles;
- autenticación;
- Storage;
- Edge Functions;
- emails;
- Turnstile;
- configuración;
- flujo completo de solicitud;
- panel administrativo;
- migraciones.

## 7.3 Producción

Entorno real.

Debe tener:

- frontend de producción;
- dominio real;
- Supabase de producción;
- Storage de producción;
- configuración de producción;
- Resend de producción;
- administrador real;
- datos reales.

Nunca desarrollar directamente contra producción.

---

# 8. Regla fundamental de entornos

El mismo código debe funcionar en:

```text
LOCAL
STAGING
PRODUCTION
```

Las diferencias deben resolverse mediante:

- variables de entorno;
- configuración;
- credenciales;
- URLs;
- proyectos Supabase diferentes.

No mantener tres versiones diferentes del código.

---

# 9. Flujo de cambios

El flujo esperado será:

```text
desarrollo local
      ↓
tests
      ↓
lint
      ↓
typecheck
      ↓
build
      ↓
commit
      ↓
staging
      ↓
pruebas reales
      ↓
producción
```

No modificar manualmente la estructura de producción como método habitual de desarrollo.

Los cambios de base de datos deben representarse mediante migraciones versionadas.

---

# 10. Organización Git

Modelo recomendado:

```text
main
develop
feature/*
fix/*
```

`main` representa código listo para producción.

`develop` representa la integración previa/staging.

Las funcionalidades importantes pueden realizarse en:

```text
feature/nombre-funcionalidad
```

Los arreglos:

```text
fix/nombre-error
```

No es obligatorio crear una rama por cada cambio minúsculo.

---

# 11. Rutas públicas

Como mínimo:

```text
/
 /catalogo
 /catalogo/:slug
 /solicitud
 /personalizado
 /sobre-nosotros
 /contacto
 /aviso-legal
 /privacidad
 /cookies
 /condiciones
```

Las rutas podrán adaptarse ligeramente si existe una razón UX clara.

---

# 12. Rutas administrativas

Como mínimo:

```text
/admin/login
/admin
/admin/pedidos
/admin/pedidos/:id
/admin/catalogo
/admin/catalogo/nuevo
/admin/catalogo/:id
/admin/categorias
/admin/disponibilidad
/admin/configuracion
```

Podrán añadirse rutas auxiliares.

---

# 13. Página de inicio

La página de inicio deberá permitir entender en pocos segundos:

- qué negocio es;
- qué vende;
- cómo realizar una solicitud;
- que existen productos personalizados;
- dónde está/contactar;
- si actualmente acepta pedidos.

Debe incluir como mínimo:

## Hero

Configurable:

- título;
- subtítulo;
- imagen;
- CTA principal;
- CTA secundario opcional.

## Productos destacados

Productos marcados como destacados.

## Categorías

Acceso visual al catálogo.

## Cómo funciona

Explicar en aproximadamente tres pasos:

1. elige o describe lo que quieres;
2. envía tu solicitud;
3. el negocio contactará contigo para confirmarla.

## Productos personalizados

Bloque específico con CTA.

## Información básica del negocio

Según configuración:

- ubicación;
- teléfono;
- horario;
- redes sociales.

---

# 14. Gestión de contenido general

La administradora debe poder modificar sin editar código:

- nombre comercial;
- descripción;
- textos principales del hero;
- llamada a la acción;
- imagen principal;
- texto introductorio;
- texto de personalizados;
- información de contacto;
- dirección;
- teléfono;
- horario;
- redes sociales;
- información general mostrada en Sobre nosotros;
- determinados avisos.

No se pretende crear un page builder.

No implementar edición visual de bloques mediante drag-and-drop.

Utilizar campos estructurados.

---

# 15. Catálogo

El catálogo debe poder consultarse públicamente.

Debe permitir:

- mostrar productos;
- filtrar por categoría;
- ocultar productos;
- marcar productos no disponibles;
- destacar productos;
- ordenar productos;
- acceder a la ficha individual;
- buscar si posteriormente aporta valor.

No añadir búsqueda únicamente por cumplir una checklist si existen pocos productos.

---

# 16. Modelo de producto

Cada producto debe poder contener:

- UUID interno;
- slug;
- nombre;
- descripción corta;
- descripción completa;
- categoría;
- modo de precio;
- precio base cuando corresponda;
- moneda;
- activo;
- publicado;
- disponible;
- destacado;
- orden;
- imágenes;
- imagen principal;
- texto alternativo de imágenes;
- sabores compatibles;
- variantes/tamaños;
- raciones;
- alérgenos;
- opciones adicionales cuando corresponda;
- fecha de creación;
- fecha de actualización.

---

# 17. Modos de precio

Un producto podrá utilizar:

## Precio fijo

Ejemplo:

```text
18,00 €
```

## Desde

Ejemplo:

```text
Desde 25,00 €
```

## Consultar

Ejemplo:

```text
Precio bajo consulta
```

Internamente:

```text
fixed
from
quote
```

Los precios monetarios deben almacenarse preferentemente como unidades mínimas:

```text
2500 = 25,00 €
```

No utilizar `float` para dinero.

Moneda inicial:

```text
EUR
```

---

# 18. Categorías

Cada categoría tendrá:

- id;
- nombre;
- slug;
- descripción opcional;
- imagen opcional;
- activa;
- orden;
- created_at;
- updated_at.

No eliminar automáticamente productos al eliminar/desactivar una categoría.

Preferir desactivar frente a destruir datos históricos.

---

# 19. Imágenes de catálogo

Cada producto podrá tener múltiples imágenes.

Cada imagen tendrá:

- id;
- product_id;
- path;
- alt_text;
- sort_order;
- is_primary;
- created_at.

Debe existir como máximo una imagen principal por producto.

La administradora podrá:

- subir;
- eliminar;
- establecer imagen principal;
- reordenar.

Evitar imágenes enormes.

Comprimir/redimensionar cuando sea razonable.

Aceptar principalmente:

- JPEG;
- PNG;
- WebP.

Valorar AVIF únicamente si no complica el flujo.

---

# 20. Alérgenos

Los alérgenos deben tratarse como datos estructurados.

Incluir los 14 alérgenos de declaración obligatoria correspondientes a la normativa aplicable en la UE.

Crear catálogo de alérgenos.

Cada producto puede relacionarse con cero o varios alérgenos.

La ficha debe mostrar esta información claramente.

No ocultarla únicamente:

- tras hover;
- dentro de tooltip;
- tras interacción difícil.

Debe poder leerse correctamente desde móvil.

---

# 21. Aviso de trazas

Además de los alérgenos declarados del producto, permitir un texto general configurable.

Ejemplo conceptual:

```text
Los productos se elaboran en un espacio donde pueden manipularse otros alérgenos.
```

No fijar ese texto como afirmación real hasta que el negocio confirme que corresponde.

El sistema debe permitir editarlo.

---

# 22. Variantes de producto

Los productos podrán tener variantes cuando resulte necesario.

Ejemplos:

```text
Pequeña
Mediana
Grande
```

o:

```text
6 raciones
10 raciones
15 raciones
```

Una variante puede contener:

- id;
- product_id;
- nombre;
- descripción opcional;
- precio opcional;
- raciones mínimas;
- raciones máximas;
- activa;
- orden.

No obligar a todos los productos a tener variantes.

---

# 23. Sabores

Los sabores deben poder administrarse.

Podrá existir un catálogo global:

```text
Chocolate
Vainilla
Red Velvet
Limón
...
```

y una relación entre productos y sabores disponibles.

La administradora podrá activar/desactivar sabores.

Los pedidos históricos deben conservar el texto seleccionado aunque posteriormente cambie el catálogo.

---

# 24. Solicitud basada en catálogo

Un cliente podrá seleccionar uno o varios productos.

No utilizar la palabra:

```text
Carrito
```

como concepto principal.

Utilizar:

```text
Tu solicitud
```

El usuario podrá:

- añadir producto;
- cambiar cantidad;
- seleccionar variante;
- seleccionar sabor;
- añadir observación;
- eliminar producto;
- revisar la solicitud.

---

# 25. Flujo recomendado de solicitud

Dividir el proceso cuando sea necesario para mejorar la UX.

Flujo conceptual:

```text
1. Tu solicitud
2. Fecha y opciones
3. Tus datos
4. Revisar
5. Enviar solicitud
```

No convertir obligatoriamente cada paso en una URL diferente.

Mantener datos al retroceder.

No perder el formulario accidentalmente.

---

# 26. Datos del cliente

Solicitar únicamente información necesaria.

Obligatorio:

- nombre;
- teléfono.

También:

- fecha solicitada.

Opcional:

- observaciones.

No solicitar email obligatoriamente.

No solicitar dirección salvo que se habilite entrega.

---

# 27. Teléfono

El teléfono es un dato importante porque será el canal utilizado para confirmar.

La interfaz deberá validar razonablemente el formato.

Aceptar teléfonos españoles e internacionales razonables.

Cuando sea posible:

- conservar presentación original;
- almacenar también versión normalizada.

No rechazar números válidos únicamente por una expresión regular excesivamente estricta.

---

# 28. Fecha deseada

Todo pedido debe incluir una fecha solicitada.

La interfaz debe impedir seleccionar:

- fechas pasadas;
- fechas bloqueadas;
- fechas que incumplen la antelación mínima.

El backend debe repetir todas estas validaciones.

La validación del frontend NO es suficiente.

---

# 29. Antelación mínima

Configuración:

```text
minimum_notice_days
```

Ejemplo:

```text
3
```

Si hoy no es posible pedir para mañana, debe quedar claro antes de terminar el formulario.

El cálculo debe realizarse utilizando la zona horaria configurada del negocio.

---

# 30. Disponibilidad

La administradora podrá bloquear:

- una fecha concreta;
- un intervalo de fechas.

Cada bloqueo podrá tener:

- id;
- start_date;
- end_date;
- reason_internal;
- public_message;
- created_at;
- updated_at.

Ejemplos de motivo interno:

```text
Agenda completa
Vacaciones
Evento
Cerrado
```

El motivo interno no debe mostrarse públicamente salvo que exista un `public_message`.

---

# 31. Cierre global de solicitudes

Debe existir:

```text
accepting_orders: boolean
```

Desde administración se mostrará como switch.

Etiqueta:

```text
Aceptar nuevas solicitudes
```

Cuando esté desactivado:

- la web sigue funcionando;
- el catálogo sigue visible;
- las fichas siguen visibles;
- las páginas informativas siguen visibles;
- no se permiten nuevas solicitudes;
- el CTA debe quedar deshabilitado o redirigir a explicación;
- el backend debe rechazar igualmente cualquier intento.

Nunca confiar únicamente en deshabilitar un botón.

---

# 32. Mensaje de solicitudes cerradas

Debe ser editable.

Valor inicial sugerido:

```text
Actualmente tenemos nuestra agenda completa y no podemos aceptar nuevas solicitudes. Disculpa las molestias. Volveremos a abrir los pedidos en cuanto tengamos disponibilidad.
```

La administradora podrá indicar algo más concreto:

```text
Agenda completa hasta el 4 de septiembre.
```

El aviso deberá mostrarse en lugares relevantes.

---

# 33. Pedido personalizado

Debe existir un flujo específico.

Campos:

- nombre;
- teléfono;
- fecha deseada;
- número aproximado de personas/raciones;
- descripción de lo deseado;
- sabores/preferencias;
- observaciones;
- imágenes de referencia.

Las fotografías serán opcionales.

---

# 34. Imágenes de referencia de clientes

Estas imágenes son privadas.

No deben almacenarse en el bucket público del catálogo.

Crear bucket independiente:

```text
order-references-private
```

No permitir listado público.

No exponer URLs permanentes públicas.

La administradora las visualizará mediante mecanismos privados o URLs firmadas temporales.

---

# 35. Validación de imágenes de cliente

Definir límites razonables.

Configuración inicial sugerida:

- máximo 5 imágenes;
- máximo 8 MB por archivo;
- JPEG;
- PNG;
- WebP.

Validar:

- MIME;
- extensión;
- tamaño;
- cantidad.

No confiar únicamente en el atributo HTML `accept`.

---

# 36. Naturaleza jurídica/funcional de la solicitud

La interfaz debe dejar claro que:

**enviar el formulario no implica que el pedido esté confirmado.**

CTA:

```text
Solicitar pedido
```

Evitar:

```text
Comprar
Pagar
Finalizar compra
Confirmar compra
```

Tras envío:

```text
Solicitud enviada correctamente.

Nos pondremos en contacto contigo para confirmar disponibilidad, fecha, precio y detalles del pedido. La solicitud no se considerará confirmada hasta que contactemos contigo.
```

El texto podrá pulirse posteriormente sin cambiar el significado.

---

# 37. Ausencia de respuesta

Antes del envío debe mostrarse una condición equivalente a:

```text
El envío de este formulario constituye una solicitud y no garantiza su aceptación. Nos pondremos en contacto contigo para confirmar disponibilidad, características, fecha y precio. Si no conseguimos contactar contigo para confirmar la solicitud, esta podrá ser cancelada.
```

No mezclar esta condición con la aceptación de privacidad.

---

# 38. Pagos

No existe pago online.

Informar:

```text
Los pagos no se realizan a través de esta web.
```

Formas de pago potenciales:

- Bizum;
- efectivo presencial;
- tarjeta presencial.

La configuración deberá permitir activar/desactivar formas de pago mostradas.

No guardar datos de tarjetas.

No integrar pasarelas.

---

# 39. Recogida y entrega

Inicialmente debe existir soporte para:

```text
pickup_enabled
delivery_enabled
```

Si únicamente existe recogida:

no preguntar al cliente algo innecesario.

Si se activa entrega:

podrán aparecer campos adicionales.

No desarrollar un sistema avanzado de cálculo logístico inicialmente.

---

# 40. Estado de las solicitudes/pedidos

Estados internos:

```text
new
pending_confirmation
confirmed
in_preparation
ready
completed
cancelled
no_response
```

Representación al usuario administrador:

```text
Nuevo
Pendiente de confirmación
Confirmado
En preparación
Listo
Completado
Cancelado
Sin respuesta
```

---

# 41. Semántica de estados

## new

Acaba de entrar.

Todavía no ha sido revisado.

## pending_confirmation

La administradora está intentando contactar o revisar detalles.

## confirmed

Pedido acordado con el cliente.

## in_preparation

Producción iniciada.

## ready

Preparado para entrega/recogida.

## completed

Finalizado y entregado.

## cancelled

Cancelado.

## no_response

No fue posible confirmar porque el cliente no respondió.

---

# 42. Transiciones

La aplicación debe permitir cambios de estado manuales razonables.

No es necesario implementar una máquina de estados extremadamente restrictiva.

Sin embargo, acciones claramente accidentales deberían requerir confirmación.

Ejemplo:

```text
completed → cancelled
```

debería advertir al administrador.

---

# 43. Identificador del pedido

Cada pedido tendrá:

- UUID interno;
- referencia humana.

Ejemplo:

```text
PED-2026-0001
```

La referencia humana:

- será única;
- será legible;
- no sustituirá al UUID;
- no se utilizará como mecanismo de autorización.

---

# 44. Datos principales del pedido

Guardar como mínimo:

- id;
- human_reference;
- type;
- customer_name;
- phone;
- phone_normalized;
- requested_date;
- status;
- customer_notes;
- admin_notes;
- fulfilment_type;
- estimated_price_cents;
- final_price_cents;
- currency;
- privacy_notice_version;
- privacy_acknowledged_at;
- created_at;
- updated_at;
- admin_seen_at.

---

# 45. Tipos de pedido

Enum:

```text
catalog
custom
```

---

# 46. Items de pedido

Pedidos de catálogo deben tener una tabla relacional de items.

No guardar toda la estructura exclusivamente como JSON.

Cada item almacenará como mínimo:

- id;
- order_id;
- product_id nullable;
- product_name_snapshot;
- quantity;
- variant_name_snapshot;
- flavour_name_snapshot;
- unit_price_snapshot;
- notes;
- created_at.

Los snapshots son necesarios para conservar el histórico.

Ejemplo:

si posteriormente:

```text
Tarta Chocolate → Tarta Chocolate Premium
```

un pedido antiguo debe continuar mostrando lo solicitado originalmente.

---

# 47. Datos personalizados

Para `custom` guardar información adicional estructurada:

- servings;
- description;
- flavour_preferences;
- custom_notes.

Podrá ser una tabla `custom_order_details` relacionada uno a uno.

---

# 48. Historial de estados

Crear:

```text
order_status_history
```

Campos:

- id;
- order_id;
- previous_status;
- new_status;
- changed_by;
- created_at.

Registrar cada cambio significativo.

---

# 49. Notas administrativas

`admin_notes`:

- únicamente visible desde admin;
- jamás devuelta en endpoints públicos;
- no incluida en emails del cliente;
- no accesible mediante RLS público.

---

# 50. Dashboard administrativo

La ruta `/admin` mostrará un resumen.

Como mínimo:

- nuevos;
- pendientes de confirmación;
- confirmados;
- en preparación;
- listos;
- pedidos para los próximos días.

También puede mostrar:

```text
Solicitudes recibidas hoy
Solicitudes esta semana
```

si aporta claridad.

Evitar dashboards con gráficos innecesarios.

---

# 51. Listado administrativo de pedidos

Debe ser cómodo tanto en escritorio como móvil.

Permitir:

- ordenar;
- filtrar;
- buscar;
- abrir pedido.

Filtros principales:

- estado;
- tipo;
- fecha solicitada.

Búsqueda:

- referencia;
- nombre;
- teléfono.

---

# 52. Vista de pedido

Mostrar claramente:

- referencia;
- estado;
- fecha solicitada;
- fecha de creación;
- nombre;
- teléfono;
- tipo;
- productos;
- cantidades;
- variantes;
- sabores;
- observaciones;
- fotos;
- precio estimado;
- precio final;
- notas internas;
- historial.

El teléfono debe ser fácilmente utilizable desde móvil.

---

# 53. Cambios de estado

La administradora deberá poder cambiar el estado con pocos clics.

Algunos cambios podrán disponer de botones rápidos:

```text
Confirmar
En preparación
Marcar como listo
Completar
```

No llenar la interfaz de acciones duplicadas.

---

# 54. Nuevas solicitudes

Una solicitud nueva deberá ser visualmente reconocible.

Utilizar:

```text
admin_seen_at
```

Una solicitud sin revisar podrá mostrar un indicador.

Al abrirla, podrá marcarse como vista.

---

# 55. Realtime

El panel podrá suscribirse mediante Supabase Realtime a nuevas solicitudes.

Si entra una solicitud mientras `/admin` está abierto:

- actualizar contador;
- actualizar listado;
- mostrar toast discreto.

No implementar notificaciones push inicialmente.

---

# 56. Email de nueva solicitud

Después de guardar correctamente una solicitud, intentar enviar email a la propietaria.

Asunto conceptual:

```text
Nueva solicitud PED-2026-0001
```

Contenido:

- referencia;
- cliente;
- teléfono;
- fecha;
- tipo;
- resumen del pedido;
- observaciones;
- enlace al admin.

---

# 57. Regla crítica del email

El pedido debe guardarse ANTES de enviar el email.

Nunca:

```text
email falla → pedido desaparece
```

El comportamiento correcto:

```text
pedido guardado
      ↓
intentar email
      ↓
si funciona → registrar éxito
si falla → registrar error
```

El cliente seguirá recibiendo confirmación de que su solicitud fue registrada aunque el email administrativo falle.

---

# 58. Registro de email

Crear una forma sencilla de registrar intentos.

Posible tabla:

```text
email_events
```

Campos:

- id;
- order_id;
- type;
- status;
- provider_message_id;
- error_message;
- created_at.

Estados:

```text
sent
failed
```

No guardar secretos ni payloads sensibles innecesariamente.

---

# 59. Panel y fallo de email

Si un email falló, el admin podrá mostrar:

```text
Aviso por email no enviado
```

sin impedir gestionar la solicitud.

---

# 60. Autenticación administrativa

Utilizar Supabase Auth.

No existe registro público.

No debe existir:

```text
/admin/register
```

La creación del usuario administrador se hará de forma controlada.

---

# 61. Autorización

No asumir que:

```text
usuario autenticado = administrador
```

Crear mecanismo explícito.

Ejemplo:

```text
admin_profiles
```

Campos:

- user_id;
- role;
- active;
- created_at.

Role inicial:

```text
admin
```

Las políticas RLS deberán consultar una fuente de autorización que el usuario no pueda modificar libremente.

---

# 62. Sesión

El admin deberá:

- iniciar sesión;
- cerrar sesión;
- mantener sesión de forma razonable;
- ser redirigido a login si no está autenticado/autorizado.

No guardar contraseñas manualmente.

---

# 63. Recuperación de acceso

Puede utilizarse el flujo seguro proporcionado por Supabase Auth.

No implementar un sistema casero de recuperación.

---

# 64. Supabase RLS

Todas las tablas con información sensible deberán utilizar Row Level Security.

RLS no es opcional.

---

# 65. Acceso público

El público podrá obtener únicamente información necesaria para:

- catálogo;
- categorías activas;
- datos públicos del negocio;
- disponibilidad pública;
- configuración estrictamente pública.

---

# 66. Datos que jamás serán públicos

El cliente anónimo NO podrá consultar:

- listado de pedidos;
- pedidos individuales;
- nombres de otros clientes;
- teléfonos;
- fotografías privadas;
- notas administrativas;
- precios internos;
- historial;
- eventos de email;
- información privada de configuración;
- usuarios admin.

---

# 67. Creación de pedidos

No conceder simplemente:

```text
anon INSERT orders
```

como solución principal.

La creación pública deberá realizarse mediante backend controlado.

Preferencia:

```text
Supabase Edge Function
```

Ejemplo:

```text
create-order
```

Esta función será responsable de:

1. validar payload;
2. validar Turnstile;
3. aplicar rate limit;
4. comprobar accepting_orders;
5. comprobar fecha;
6. comprobar antelación;
7. comprobar bloqueos;
8. comprobar productos;
9. comprobar opciones;
10. generar referencia;
11. guardar pedido;
12. guardar items;
13. registrar aceptación de privacidad;
14. intentar enviar email;
15. responder de forma segura.

---

# 68. Manipulación del cliente

El frontend NO puede decidir:

- estado;
- referencia;
- precio final;
- admin_notes;
- timestamps internos;
- rol;
- identidad admin;
- campos de auditoría.

Ignorar o rechazar esos campos si un atacante los envía.

---

# 69. Idempotencia

Evitar pedidos duplicados por doble clic o reintentos.

Implementar una estrategia razonable de idempotencia.

Por ejemplo:

- identificador generado en el cliente;
- clave idempotente enviada a backend;
- constraint única.

Una misma solicitud no debe crearse dos veces por pulsar rápidamente el botón.

---

# 70. Rate limiting

Las funciones públicas sensibles deberán limitar abuso.

Especialmente:

```text
create-order
upload-order-reference
```

No crear una infraestructura distribuida desproporcionada.

Debe existir al menos protección razonable combinada con Turnstile.

Si se utiliza IP:

- evitar almacenar IP completa permanentemente;
- utilizar hashing o retención temporal cuando sea posible;
- documentar el tratamiento.

---

# 71. Turnstile

Utilizar Cloudflare Turnstile en envío de solicitudes.

Validar token server-side.

Nunca confiar en validación del navegador.

En local deberá existir una forma documentada de utilizar credenciales de prueba/bypass controlado.

Ese bypass:

- solo desarrollo;
- nunca habilitado accidentalmente en producción.

---

# 72. Honeypot

Añadir campo invisible de honeypot.

Si un bot lo rellena:

rechazar silenciosamente de forma segura.

No utilizar honeypot como única defensa.

---

# 73. Validación

Usar Zod o esquema equivalente compartido cuando sea viable.

Validar:

Frontend:

para UX.

Backend:

para seguridad/integridad.

Nunca asumir que una petición proviene realmente del frontend.

---

# 74. Límites de entrada

Todos los textos deberán tener longitudes máximas razonables.

Ejemplos orientativos:

```text
nombre: 120
observaciones: 2000
descripción personalizada: 4000
```

Definir límites concretos en schemas.

Evitar campos de longitud ilimitada sin razón.

---

# 75. Seguridad XSS

No renderizar HTML arbitrario proveniente del admin o cliente.

Para contenidos editables:

preferir texto plano o Markdown controlado.

Si se permite Markdown:

sanitizar salida.

No utilizar `dangerouslySetInnerHTML` con contenido no confiable sin sanitización explícita.

---

# 76. Storage público

Bucket:

```text
catalog-public
```

Puede contener:

- productos;
- categorías;
- imágenes públicas del sitio.

---

# 77. Storage privado

Bucket:

```text
order-references-private
```

Debe ser privado.

No permitir acceso anónimo directo.

---

# 78. Rutas de archivos

Utilizar estructura clara.

Ejemplo:

```text
products/{productId}/{uuid}.webp
orders/{orderId}/{uuid}.jpg
site/{uuid}.webp
```

No utilizar el nombre original del cliente como identificador público principal.

---

# 79. Eliminación de archivos

Al sustituir/eliminar imágenes:

evitar dejar archivos huérfanos permanentemente.

Implementar limpieza razonable.

Nunca eliminar una fotografía asociada a un pedido histórico sin una decisión explícita.

---

# 80. Política de conservación

La aplicación debe estar preparada para definir tiempos de conservación de datos.

No implementar borrado automático agresivo sin conocer las necesidades legales/comerciales reales.

Documentar en configuración/legal qué decisiones deben tomarse antes de producción.

---

# 81. Privacidad

Antes de enviar una solicitud:

casilla obligatoria, desmarcada:

```text
He leído la Política de Privacidad y la información sobre el tratamiento de mis datos personales.
```

`Política de Privacidad` será enlace.

---

# 82. Consentimiento de marketing

No mezclar marketing con gestión del pedido.

No incluir marketing en la versión inicial.

Si se añadiera posteriormente:

deberá existir checkbox independiente, opcional y desmarcado.

---

# 83. Primera capa de privacidad

Mostrar de forma clara información estructurada que pueda completarse antes de producción.

Debe contemplar:

- responsable;
- finalidad;
- base jurídica;
- destinatarios;
- ejercicio de derechos;
- enlace a política completa.

No inventar:

- NIF;
- domicilio;
- razón social;
- emails;
- responsables.

Utilizar placeholders claros mientras falten.

---

# 84. Versionado de información legal

Guardar en la solicitud una referencia a la versión del aviso mostrado.

Campos:

```text
privacy_notice_version
privacy_acknowledged_at
```

Esto permite saber qué versión vio el cliente.

No es necesario almacenar copia íntegra de cada página por pedido.

---

# 85. Páginas legales

Crear:

```text
/aviso-legal
/privacidad
/cookies
/condiciones
```

Los textos iniciales serán plantillas.

Deben contener placeholders visibles para completar.

Nunca inventar información jurídica específica del negocio.

---

# 86. Condiciones

Debe existir una página que contemple estructuralmente:

- naturaleza de la solicitud;
- confirmación;
- disponibilidad;
- precios;
- pagos;
- recogida;
- entrega;
- cambios;
- cancelaciones;
- falta de respuesta;
- personalización;
- productos perecederos;
- alérgenos;
- contacto.

Las partes que requieran validación jurídica/comercial deberán señalarse claramente en documentación.

---

# 87. Cookies

La versión inicial evitará trackers no esenciales.

No introducir:

- Google Analytics;
- Meta Pixel;
- publicidad;
- Hotjar;
- scripts de marketing.

Si únicamente se emplean tecnologías estrictamente necesarias, no implementar un banner intrusivo innecesario.

Mantener página de información sobre cookies/tecnologías.

---

# 88. Configuración general

Crear una configuración administrable.

Campos orientativos:

```text
business_name
business_description
public_phone
public_email
address
opening_hours
instagram_url
facebook_url
tiktok_url
accepting_orders
closed_orders_message
minimum_notice_days
pickup_enabled
delivery_enabled
payment_bizum_enabled
payment_cash_enabled
payment_card_in_store_enabled
payment_information_text
order_confirmation_text
allergen_general_notice
hero_title
hero_subtitle
hero_image
custom_orders_title
custom_orders_description
business_timezone
```

No todos los campos deben estar en una única tabla físicamente si una alternativa es más limpia.

---

# 89. Configuración sensible

Separar conceptualmente configuración pública de secretos.

Nunca almacenar como contenido editable normal:

- service role key;
- Resend API key;
- Turnstile secret;
- claves privadas.

Los secretos deben vivir en variables de entorno/secret manager.

---

# 90. Base de datos

Utilizar UUID para entidades principales.

Utilizar:

```text
timestamptz
```

para timestamps.

Utilizar:

```text
date
```

para fecha solicitada cuando no se necesita hora.

---

# 91. Tablas mínimas previstas

Como orientación arquitectónica:

```text
admin_profiles
site_settings
categories
products
product_images
product_variants
flavours
product_flavours
allergens
product_allergens
availability_blocks
orders
order_items
custom_order_details
order_reference_images
order_status_history
email_events
```

Pueden realizarse ajustes justificados.

No eliminar entidades fundamentales sin documentarlo.

---

# 92. Soft delete

Preferir:

```text
active
published
archived_at
```

frente a eliminar información que pueda estar referenciada históricamente.

Especialmente:

- productos;
- categorías.

Un pedido nunca debe romperse porque se elimine un producto.

---

# 93. Constraints

Utilizar constraints reales de base de datos.

Ejemplos:

- quantity > 0;
- precios >= 0;
- sort_order >= 0;
- slugs únicos;
- human_reference única;
- fechas válidas;
- enum válido.

No confiar únicamente en TypeScript.

---

# 94. Índices

Añadir índices según consultas habituales.

Como mínimo estudiar:

- products.slug;
- products.category_id;
- products.published;
- orders.status;
- orders.requested_date;
- orders.created_at;
- orders.human_reference;
- order_items.order_id.

No crear índices sin sentido.

---

# 95. Migraciones

Todas las modificaciones de esquema deben guardarse en:

```text
supabase/migrations/
```

Nunca depender exclusivamente de cambios manuales realizados desde el Dashboard.

Ejemplo:

```text
20260818100000_initial_schema.sql
20260818103000_rls.sql
```

---

# 96. Supabase local

El repositorio debe permitir:

```bash
supabase start
```

Debe existir configuración local versionada apropiadamente.

Un nuevo desarrollador debe poder:

```text
clonar
instalar
levantar Supabase
aplicar migraciones
cargar seed
arrancar frontend
```

sin reconstruir manualmente la base de datos.

---

# 97. Seed

Crear datos ficticios únicamente para desarrollo.

Incluir por ejemplo:

- categorías demo;
- productos demo;
- alérgenos;
- sabores;
- configuración ficticia.

Los datos deben estar claramente identificados como DEMO.

Nunca insertar automáticamente datos ficticios en producción.

---

# 98. Usuario administrador local

Documentar cómo crear el usuario administrador local.

Debe poder reproducirse.

No hardcodear credenciales reales.

Puede existir credencial demo documentada únicamente para entorno local si está claramente aislada.

---

# 99. Variables de entorno del frontend

Como mínimo:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_TURNSTILE_SITE_KEY
VITE_SITE_URL
```

Recordar:

toda variable `VITE_*` puede terminar disponible en navegador.

Nunca colocar secretos en una variable `VITE_*`.

---

# 100. Secretos backend

Como mínimo:

```text
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
ORDER_NOTIFICATION_EMAIL
ORDER_FROM_EMAIL
TURNSTILE_SECRET_KEY
```

Configurar según el entorno de las Edge Functions.

Nunca commitear estos valores.

---

# 101. `.env.example`

Crear y mantener actualizado.

Debe contener nombres de variables pero valores vacíos o ficticios.

Ejemplo:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_TURNSTILE_SITE_KEY=
VITE_SITE_URL=
```

Documentar secretos de Edge Functions separadamente cuando corresponda.

---

# 102. `.gitignore`

Ignorar correctamente:

```text
.env
.env.local
.env.*.local
node_modules
dist
coverage
credenciales
tokens
archivos temporales
dumps sensibles
```

No ignorar `.env.example`.

---

# 103. Diseño visual

Estética:

- elegante;
- limpia;
- moderna;
- cálida;
- relacionada con repostería;
- visualmente atractiva;
- profesional.

Evitar:

- apariencia infantil excesiva;
- abuso de rosa;
- iconos innecesarios;
- sombras enormes;
- exceso de degradados;
- animaciones molestas;
- interfaces saturadas.

La identidad concreta se definirá durante desarrollo.

---

# 104. Mobile first

Diseñar pensando primero en móvil.

El flujo de solicitud probablemente será utilizado principalmente desde teléfono.

Todo botón importante deberá poder pulsarse cómodamente.

Evitar inputs minúsculos.

---

# 105. Breakpoints de prueba

Comprobar como mínimo aproximadamente:

```text
320
375
390
430
768
1024
1440 px
```

No significa crear diseños específicos para cada ancho.

---

# 106. Admin móvil

El panel administrativo también debe funcionar correctamente desde móvil.

La propietaria debe poder:

- abrir pedidos;
- llamar;
- cambiar estado;
- leer notas;
- comprobar fechas;
- cerrar solicitudes;

desde un teléfono sin necesidad de escritorio.

---

# 107. Accesibilidad

Como mínimo:

- HTML semántico;
- navegación por teclado;
- focus visible;
- labels;
- contraste correcto;
- mensajes de error comprensibles;
- alt text;
- botones reales para acciones;
- enlaces reales para navegación;
- aria únicamente cuando sea necesario.

No utilizar `div` clicable como sustituto de botón.

---

# 108. Formularios

Los formularios deben:

- mostrar label;
- indicar campos obligatorios;
- preservar datos si falla una petición;
- mostrar errores junto al campo;
- hacer scroll/focus al error cuando ayude;
- impedir doble envío;
- indicar estado loading;
- mostrar éxito inequívoco.

---

# 109. Errores públicos

Nunca mostrar al cliente:

- stack traces;
- SQL;
- claves;
- errores internos;
- mensajes de Supabase sin filtrar.

Mostrar mensajes humanos.

Ejemplo:

```text
No hemos podido enviar tu solicitud. Comprueba los datos e inténtalo de nuevo.
```

---

# 110. Errores administrativos

El admin puede recibir mensajes algo más concretos.

No exponer secretos.

Registrar detalles técnicos por consola/log apropiado.

---

# 111. Estados vacíos

Diseñar estados específicos.

Ejemplos:

```text
Todavía no hay solicitudes.
No hay productos en esta categoría.
No hay pedidos que coincidan con estos filtros.
```

No dejar tablas vacías sin explicación.

---

# 112. Loading

Utilizar:

- skeleton;
- spinner;
- estado de botón;

según corresponda.

No bloquear toda la aplicación innecesariamente.

---

# 113. Optimistic updates

Utilizarlas únicamente en operaciones donde sea seguro y mejore claramente la UX.

No mostrar un pedido como confirmado si el backend todavía no confirmó la operación.

---

# 114. Caché

TanStack Query gestionará estado servidor.

Evitar:

- fetch repetitivo;
- duplicación de cachés;
- almacenar todos los datos remotos manualmente en Context.

---

# 115. Estado global

No añadir Redux por defecto.

Utilizar:

- estado local;
- React Context para casos concretos;
- TanStack Query para datos servidor.

Solo introducir otra librería si existe necesidad real.

---

# 116. SEO

Implementar para páginas públicas:

- `<title>`;
- meta description;
- canonical;
- Open Graph;
- favicon;
- robots;
- sitemap;
- HTML semántico.

---

# 117. Datos estructurados

Preparar Schema.org cuando exista información real suficiente.

No inventar:

- dirección;
- puntuaciones;
- horarios;
- precios;
- identidad.

---

# 118. Indexación del admin

Todas las rutas `/admin` deben quedar fuera de indexación.

No confiar únicamente en robots para seguridad.

---

# 119. Rendimiento

Priorizar:

- imágenes optimizadas;
- lazy loading;
- tamaños adecuados;
- división razonable de bundle;
- evitar JavaScript innecesario;
- consultas eficientes.

No perseguir microoptimizaciones prematuras.

---

# 120. Imagen responsive

Utilizar dimensiones y estrategias adecuadas.

Evitar descargar una fotografía de varios megabytes para una miniatura de 300px.

---

# 121. README

`README.md` será documentación operativa.

Debe explicar:

## Proyecto

Qué hace.

## Stack

Tecnologías utilizadas.

## Requisitos

Versiones necesarias.

## Instalación

Paso a paso.

## Desarrollo local

Cómo arrancar:

- frontend;
- Supabase;
- migraciones;
- seed;
- funciones.

## Variables

Todas las variables.

## Base de datos

Migraciones y generación de tipos.

## Auth

Creación del administrador.

## Storage

Buckets y permisos.

## Resend

Configuración.

## Turnstile

Configuración.

## Testing

Comandos.

## Build

Comando.

## Staging

Proceso completo.

## Producción

Proceso completo.

## Dominio

Configuración.

## Backups

Procedimiento.

## Troubleshooting

Problemas habituales.

Una persona distinta al creador debe poder mantener la aplicación siguiendo el README.

---

# 122. CHANGELOG

Mantener:

```text
CHANGELOG.md
```

Formato inspirado en Keep a Changelog.

Inicial:

```text
# Changelog

## [Unreleased]

### Added
```

Actualizar únicamente con cambios relevantes.

No registrar cada ajuste de padding.

---

# 123. Documentación técnica

Crear:

```text
docs/ARCHITECTURE.md
docs/DEPLOYMENT.md
docs/SECURITY.md
```

cuando se llegue a las fases correspondientes.

---

# 124. ARCHITECTURE

Debe explicar:

- frontend;
- Supabase;
- esquema;
- Edge Functions;
- Auth;
- Storage;
- flujo de solicitud;
- entornos.

---

# 125. SECURITY

Debe explicar:

- modelo de amenazas básico;
- permisos;
- RLS;
- admin;
- Storage;
- secretos;
- validaciones;
- Turnstile;
- rate limiting;
- información personal;
- actuación ante exposición accidental.

---

# 126. DEPLOYMENT

Debe explicar paso por paso:

```text
local
→ staging
→ production
```

Incluyendo comandos reales.

---

# 127. Tests unitarios

Cubrir al menos lógica de:

- validación de pedidos;
- fechas;
- antelación mínima;
- estado global cerrado;
- referencias;
- schemas;
- transformación monetaria;
- normalización relevante.

---

# 128. Tests de integración

Cuando sea viable:

- creación válida de solicitud;
- rechazo si cerrado;
- rechazo por fecha bloqueada;
- rechazo por antelación;
- rechazo por producto inexistente;
- RLS.

---

# 129. E2E

Añadir E2E para los flujos críticos cuando la aplicación esté suficientemente estable.

Como mínimo:

## Cliente

```text
abrir catálogo
→ seleccionar producto
→ completar solicitud
→ enviar
→ ver confirmación
```

## Admin

```text
login
→ visualizar pedido
→ cambiar estado
→ comprobar cambio
```

## Pedidos cerrados

```text
desactivar accepting_orders
→ cliente intenta pedir
→ interfaz bloquea
→ backend también bloquea
```

---

# 130. Herramienta E2E

Puede utilizarse Playwright.

No añadir múltiples frameworks E2E.

---

# 131. Calidad antes de considerar una fase terminada

Ejecutar:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Si existe suite E2E:

```bash
npm run test:e2e
```

No declarar una fase completada con errores conocidos sin documentarlos.

---

# 132. CI

Configurar GitHub Actions cuando el proyecto alcance suficiente madurez.

En pull requests ejecutar:

- instalación limpia;
- lint;
- typecheck;
- tests;
- build.

No desplegar producción si falla CI.

---

# 133. Cloudflare Pages

La aplicación frontend será desplegable en Cloudflare Pages.

Configurar correctamente SPA routing.

El refresco directo de:

```text
/admin/pedidos/123
```

no puede devolver un 404 de infraestructura.

---

# 134. Staging en Cloudflare

Preferencia:

crear un proyecto Cloudflare Pages separado para staging.

Ejemplo conceptual:

```text
reposteria-staging
```

conectado a:

```text
develop
```

y variables de staging.

---

# 135. Producción en Cloudflare

Proyecto:

```text
reposteria-production
```

o nombre real del negocio.

Conectado a:

```text
main
```

Nunca reutilizar variables de staging.

---

# 136. Supabase staging

Proyecto independiente.

Debe contener únicamente datos de prueba.

Aplicar las mismas migraciones que producción.

---

# 137. Supabase production

Proyecto independiente.

Utilizar región adecuada para el negocio.

No copiar service role keys entre entornos.

---

# 138. Promoción de cambios

El esquema de producción debe actualizarse mediante migraciones previamente probadas.

Nunca:

```text
abrir SQL editor en producción
→ improvisar cambios
```

salvo emergencia documentada.

---

# 139. Backups

Antes del lanzamiento documentar estrategia de backup.

Como mínimo conocer:

- qué copia Supabase automáticamente según el plan contratado;
- cómo realizar export manual;
- cómo restaurar.

Hacer una prueba de procedimiento antes de considerar producción terminada.

---

# 140. Propiedad de cuentas

Las cuentas de producción deben quedar bajo control del negocio.

Especialmente:

- dominio;
- Cloudflare;
- Supabase;
- Resend;
- GitHub/repository o acceso correspondiente.

No mantener el negocio cautivo de una cuenta personal del desarrollador.

---

# 141. Dominio

El dominio definitivo se decidirá posteriormente.

La aplicación no debe hardcodear el dominio.

Utilizar variable:

```text
VITE_SITE_URL
```

o equivalente.

---

# 142. HTTPS

Producción debe funcionar únicamente sobre HTTPS.

No crear excepciones inseguras.

---

# 143. Email de dominio

Cuando se configure producción, utilizar un remitente profesional.

Ejemplo conceptual:

```text
pedidos@dominio.es
```

No hardcodear.

---

# 144. DNS email

Documentar:

- verificación de dominio;
- SPF;
- DKIM;
- otros registros requeridos por el proveedor.

---

# 145. Secretos

Nunca deben aparecer en:

- repositorio;
- screenshots;
- README;
- CHANGELOG;
- frontend;
- logs públicos.

---

# 146. Logs

Registrar errores suficientes para diagnóstico.

No registrar innecesariamente:

- fotografías;
- cuerpo completo de formularios;
- teléfono en todos los logs;
- secretos;
- tokens.

---

# 147. Información personal

Aplicar minimización.

Solo recopilar información realmente útil para la gestión.

No solicitar:

- DNI;
- fecha de nacimiento;
- dirección;

salvo necesidad real posterior.

---

# 148. Home y contenido editable

La propietaria debe poder cambiar el contenido habitual sin contactar con el desarrollador.

Eso incluye principalmente:

- productos;
- precios;
- fotografías;
- disponibilidad;
- textos comerciales;
- contacto;
- horarios;
- redes;
- avisos.

No significa que deba editar cualquier elemento estructural de la aplicación.

---

# 149. Panel de catálogo

Permitir:

- crear;
- editar;
- publicar;
- despublicar;
- marcar disponible/no disponible;
- destacar;
- archivar;
- gestionar imágenes;
- gestionar alérgenos;
- gestionar variantes;
- gestionar sabores.

---

# 150. Confirmaciones administrativas

Antes de acciones destructivas:

mostrar confirmación.

Ejemplos:

- archivar producto;
- eliminar imagen;
- cancelar pedido;
- desactivar todas las solicitudes.

---

# 151. No borrar pedidos desde interfaz normal

Los pedidos no deberían disponer de un botón de eliminación habitual.

Utilizar estados:

```text
cancelled
no_response
completed
```

Preservar historial.

---

# 152. Auditoría básica

Registrar:

- creación;
- cambios de estado;
- timestamps.

No implementar una plataforma completa de auditoría de cada carácter editado.

---

# 153. Configuración inicial

Antes de producción debe existir onboarding/checklist manual para completar:

- identidad;
- teléfono;
- dirección;
- horario;
- redes;
- contenido;
- alérgenos;
- métodos de pago;
- textos legales;
- privacidad;
- emails;
- dominio.

---

# 154. Contenido demo

Nunca mostrar datos como:

```text
Lorem ipsum
John Doe
123 Main Street
12345678X
```

en producción.

El checklist debe obligar a revisar placeholders.

---

# 155. Error si faltan datos críticos

Producción no debe romper si falta información opcional.

Si falta dato legal obligatorio pendiente de completar, el README/checklist debe advertirlo claramente.

No inventarlo automáticamente.

---

# 156. UX de pedidos cerrados

Si `accepting_orders=false`:

mostrar aviso antes de que el cliente pierda tiempo rellenando un formulario.

No esperar hasta el último botón.

---

# 157. UX de fechas bloqueadas

El selector de fecha debe indicar visualmente fechas no disponibles.

No permitir seleccionar y descubrir al final que no era válida.

El backend continuará siendo autoridad definitiva.

---

# 158. UX de antelación

Mostrar cerca del selector:

```text
Los pedidos necesitan al menos X días de antelación.
```

si `minimum_notice_days > 0`.

---

# 159. UX de productos no disponibles

Un producto no disponible podrá continuar visible si está publicado.

Mostrar:

```text
No disponible actualmente
```

No permitir añadirlo a solicitud.

---

# 160. Producto no publicado

Un producto no publicado no debe aparecer en catálogo público.

El administrador sí debe visualizarlo.

---

# 161. Producto archivado

No aparece en catálogo.

Se conserva para históricos.

---

# 162. Precio histórico

Los pedidos conservarán snapshot.

No recalcular pedidos antiguos con precios actuales.

---

# 163. Cálculos

Cuando un precio sea conocido, el frontend puede mostrar estimación.

Nunca presentar automáticamente esa estimación como precio contractual final si la solicitud todavía necesita confirmación.

Utilizar terminología adecuada.

---

# 164. Precio administrativo

La propietaria podrá introducir:

```text
estimated_price
final_price
```

cuando proceda.

No son obligatorios al entrar una solicitud.

---

# 165. Personalizados y precio

Los personalizados probablemente empezarán:

```text
Precio por confirmar
```

La administradora podrá anotar posteriormente importe.

---

# 166. Seguridad de rutas admin

Ocultar componentes no basta.

Todo dato administrativo debe estar protegido en backend/RLS.

Un usuario que conozca `/admin` no debe poder consultar datos sin autorización.

---

# 167. CORS

Configurar funciones únicamente con los orígenes necesarios cuando corresponda.

Local deberá estar contemplado.

No utilizar `*` indiscriminadamente en operaciones sensibles si puede evitarse.

---

# 168. CSRF

Evaluar según mecanismo concreto de Auth/Functions.

No implementar mitigaciones simbólicas sin comprender el riesgo real.

Documentar decisiones en SECURITY.

---

# 169. Dependencias

No instalar una dependencia para resolver cinco líneas de código sin motivo.

Revisar mantenimiento y necesidad.

Evitar librerías abandonadas.

---

# 170. Componentes

Separar correctamente:

```text
components/
features/
pages/
lib/
hooks/
types/
```

La estructura exacta puede evolucionar.

Evitar un único directorio con decenas de componentes sin organización.

---

# 171. Lógica de negocio

No esconder lógica crítica dentro de componentes visuales.

Separar:

- validación;
- API;
- queries;
- transformación;
- reglas de fechas;
- lógica monetaria.

---

# 172. Tipos Supabase

Generar tipos TypeScript desde el esquema cuando sea posible.

No duplicar manualmente definiciones que puedan derivarse.

---

# 173. Fechas y timezone

Los timestamps técnicos se almacenan en UTC.

Las fechas del pedido se interpretan según timezone del negocio.

No depender implícitamente del timezone del navegador para reglas comerciales.

---

# 174. Internacionalización

La versión inicial será en español.

No implementar sistema i18n complejo salvo nueva especificación.

Sin embargo, evitar concatenaciones absurdas que hagan imposible internacionalizar posteriormente.

---

# 175. Formato monetario

Mostrar mediante `Intl.NumberFormat`.

No concatenar manualmente:

```text
precio + "€"
```

si puede utilizarse formateador adecuado.

---

# 176. Formato fecha

Mostrar fechas en formato comprensible para el usuario español.

No mostrar timestamps técnicos salvo necesidad administrativa.

---

# 177. Navegadores

Soportar versiones modernas razonables de:

- Chrome;
- Safari;
- Firefox;
- Edge;
- navegadores móviles principales.

No soportar Internet Explorer.

---

# 178. PWA

No implementar PWA inicialmente.

Puede considerarse posteriormente.

---

# 179. Notificaciones push

Fuera de alcance inicial.

Email + Realtime admin son suficientes.

---

# 180. Contacto

La página Contacto podrá mostrar:

- teléfono;
- ubicación;
- horario;
- redes.

Si se implementa formulario de contacto separado, deberá recibir protección equivalente contra spam.

No es obligatorio si el sistema de solicitudes cubre la necesidad.

---

# 181. Redes sociales

Los enlaces externos deben:

- ser configurables;
- utilizar URLs válidas;
- abrir de forma apropiada;
- no mostrar iconos de redes no configuradas.

---

# 182. Sobre nosotros

Contenido administrable:

- título;
- texto;
- imagen.

No crear un editor WYSIWYG complejo.

---

# 183. Datos de negocio

No mezclar configuración sensible con contenido público.

La interfaz administrativa debe separar secciones lógicas:

```text
General
Pedidos
Contacto
Contenido
Legal
```

si ayuda.

---

# 184. Seguridad del admin

No almacenar token de autenticación manualmente en mecanismos inventados.

Seguir prácticas recomendadas del SDK oficial.

---

# 185. Refresh

Una recarga del navegador estando autenticado no debería causar errores visibles innecesarios.

Gestionar correctamente carga inicial de sesión.

---

# 186. Logout

Debe invalidar sesión y redirigir a `/admin/login`.

---

# 187. Manejo de 404

Crear página 404 pública.

En admin, rutas inexistentes deben mantener contexto adecuado.

---

# 188. Error boundaries

Añadir manejo razonable de errores de renderizado si aporta robustez.

No sobrecomplicar.

---

# 189. Seguridad de Markdown

Si algún campo utiliza Markdown:

sanitizar el HTML resultante.

Nunca permitir scripts.

---

# 190. SQL

Todas las funciones `SECURITY DEFINER` deberán utilizarse con especial cuidado.

Fijar `search_path` cuando corresponda.

Revisar privilegios.

No conceder EXECUTE indiscriminadamente.

---

# 191. Service role

La service role key:

- solo backend;
- nunca navegador;
- nunca Git;
- nunca `VITE_*`.

Cualquier aparición de esta clave en bundle frontend constituye error crítico.

---

# 192. Anon key

La anon key de Supabase puede utilizarse en frontend siempre que RLS sea correcta.

No tratar su ocultación como mecanismo de seguridad.

---

# 193. RLS tests

Crear pruebas o verificaciones explícitas de que:

anon:

```text
puede leer catálogo público
NO puede leer pedidos
NO puede modificar catálogo
NO puede acceder a fotos privadas
```

admin:

```text
sí puede administrar recursos autorizados
```

---

# 194. Seguridad antes de producción

Realizar revisión específica:

- secrets;
- RLS;
- Storage;
- Auth;
- funciones;
- CORS;
- variables;
- logs;
- archivos privados;
- placeholders.

---

# 195. README y cambios

Después de cada fase relevante:

actualizar:

```text
README.md
CHANGELOG.md
```

si esa fase cambia funcionamiento o instalación.

---

# 196. Estado del proyecto

Puede crearse:

```text
docs/IMPLEMENTATION_STATUS.md
```

para marcar qué partes de esta SPEC están:

```text
pending
in_progress
done
```

Esto es especialmente útil trabajando por fases con agentes.

No utilizar este archivo como sustituto de Git.

---

# 197. Desarrollo mediante agentes/Codex

Codex debe trabajar de forma incremental.

Nunca recibir esta SPEC con la orden:

```text
implementa absolutamente todo de golpe
```

La SPEC proporciona contexto global.

Cada prompt de ejecución deberá definir una fase concreta.

Antes de modificar código, Codex deberá:

1. leer `SPEC.md`;
2. inspeccionar el repositorio;
3. entender el estado existente;
4. identificar la fase solicitada;
5. respetar decisiones anteriores.

---

# 198. Comportamiento de Codex al finalizar una fase

Debe:

1. ejecutar lint;
2. ejecutar typecheck;
3. ejecutar tests;
4. ejecutar build;
5. corregir errores;
6. actualizar CHANGELOG cuando proceda;
7. actualizar documentación si procede;
8. resumir archivos/cambios principales;
9. indicar acciones manuales necesarias.

No debe afirmar que algo funciona si no pudo verificarlo.

---

# 199. No realizar refactors no solicitados

Durante una fase concreta:

no reescribir partes estables del proyecto sin razón.

Puede realizar pequeños refactors necesarios.

Cambios arquitectónicos significativos deberán justificarse.

---

# 200. Criterios de aceptación globales

La versión inicial podrá considerarse funcional cuando sea posible:

## Cliente

1. abrir la web;
2. navegar catálogo;
3. consultar producto;
4. consultar precio;
5. consultar alérgenos;
6. seleccionar productos;
7. elegir fecha válida;
8. rellenar nombre/teléfono;
9. aceptar información de privacidad;
10. enviar;
11. recibir confirmación visual.

## Personalizado

1. abrir formulario;
2. describir producto;
3. indicar fecha;
4. indicar raciones;
5. adjuntar fotografía;
6. enviar.

## Admin

1. iniciar sesión;
2. ver nueva solicitud;
3. abrirla;
4. ver datos;
5. ver imagen privada;
6. cambiar estado;
7. añadir notas;
8. añadir precio;
9. gestionar catálogo;
10. gestionar imágenes;
11. cambiar precio;
12. cerrar solicitudes;
13. bloquear fechas;
14. cambiar textos básicos.

## Sistema

1. guardar solicitud;
2. generar referencia;
3. enviar email;
4. mantener pedido si falla email;
5. aplicar RLS;
6. rechazar envío si está cerrado;
7. rechazar fechas bloqueadas;
8. rechazar antelación insuficiente;
9. impedir acceso público a pedidos;
10. funcionar en local;
11. funcionar en staging;
12. funcionar en producción.

---

# 201. Fases de implementación

La implementación debe dividirse.

## Fase 0 — Inicialización y arquitectura

Objetivo:

crear una base limpia y reproducible.

Incluye:

- estructura inicial;
- Vite;
- React;
- TypeScript strict;
- Tailwind;
- Router;
- Query;
- formularios;
- Zod;
- scripts;
- lint;
- format;
- tests;
- `.env.example`;
- Supabase CLI;
- configuración local;
- documentación inicial.

No implementar todavía funcionalidades completas.

## Fase 1 — Base de datos, Auth y seguridad

Implementar:

- schema inicial;
- migraciones;
- enums;
- admin_profiles;
- categorías;
- productos;
- variantes;
- sabores;
- alérgenos;
- configuración;
- pedidos;
- items;
- personalizados;
- disponibilidad;
- historial;
- RLS;
- buckets;
- usuario admin local;
- seed.

Priorizar seguridad antes de UI.

## Fase 2 — Web pública y catálogo

Implementar:

- layout;
- navegación;
- inicio;
- catálogo;
- categorías;
- ficha;
- precios;
- imágenes;
- disponibilidad;
- alérgenos;
- responsive.

Todavía puede no existir envío completo de pedidos.

## Fase 3 — Solicitudes de catálogo

Implementar:

- Tu solicitud;
- items;
- formulario;
- fecha;
- datos;
- privacidad;
- revisión;
- Edge Function;
- validaciones;
- idempotencia;
- persistencia.

## Fase 4 — Personalizados

Implementar:

- formulario;
- raciones;
- descripción;
- sabores;
- referencias;
- bucket privado;
- uploads;
- URLs firmadas;
- seguridad.

## Fase 5 — Admin

Implementar:

- login;
- dashboard;
- pedidos;
- filtros;
- búsqueda;
- detalle;
- cambio de estados;
- historial;
- notas;
- precios;
- gestión catálogo;
- categorías;
- disponibilidad;
- settings.

## Fase 6 — Notificaciones y protección

Implementar:

- Resend;
- email;
- registro de errores;
- Realtime;
- badge;
- toast;
- Turnstile;
- honeypot;
- rate limiting.

Algunas protecciones pueden adelantarse si son necesarias en fases anteriores.

## Fase 7 — Contenido, legal, SEO, accesibilidad y UX

Implementar/pulir:

- Sobre nosotros;
- Contacto;
- legales;
- placeholders;
- SEO;
- sitemap;
- metadata;
- accesibilidad;
- estados vacíos;
- loaders;
- mobile;
- textos.

## Fase 8 — Testing y endurecimiento

Realizar:

- tests;
- E2E;
- revisión RLS;
- revisión Storage;
- revisión de errores;
- revisión inputs;
- responsive;
- performance;
- security review;
- build limpio.

## Fase 9 — Staging

Crear/configurar:

- Supabase staging;
- Cloudflare staging;
- variables;
- migraciones;
- admin test;
- Resend test;
- Turnstile;
- prueba end-to-end.

## Fase 10 — Producción

Configurar:

- cuentas definitivas;
- dominio;
- Cloudflare;
- Supabase;
- Storage;
- Resend;
- SPF/DKIM;
- variables;
- migraciones;
- admin;
- datos reales;
- textos legales;
- pruebas;
- entrega.

---

# 202. Checklist de lanzamiento

Antes de producción:

- [ ] Build sin errores.
- [ ] TypeScript sin errores.
- [ ] Lint sin errores relevantes.
- [ ] Tests correctos.
- [ ] E2E críticos correctos.
- [ ] RLS revisada.
- [ ] Anon no puede leer pedidos.
- [ ] Bucket privado comprobado.
- [ ] Service role no aparece en frontend.
- [ ] Registro público deshabilitado.
- [ ] Admin real creado.
- [ ] Datos demo eliminados.
- [ ] Dominio correcto.
- [ ] HTTPS.
- [ ] Emails reales funcionando.
- [ ] SPF configurado.
- [ ] DKIM configurado.
- [ ] Turnstile funcionando.
- [ ] Rate limit funcionando.
- [ ] Pedido de catálogo probado.
- [ ] Pedido personalizado probado.
- [ ] Fotografías privadas probadas.
- [ ] Email probado.
- [ ] Fallo de email probado.
- [ ] Cierre de solicitudes probado.
- [ ] Bloqueo de fechas probado.
- [ ] Antelación mínima probada.
- [ ] Catálogo probado.
- [ ] Admin móvil probado.
- [ ] Web móvil probada.
- [ ] Safari móvil probado cuando sea posible.
- [ ] Chrome probado.
- [ ] Accesibilidad básica.
- [ ] Datos reales del negocio completados.
- [ ] Información de alérgenos revisada.
- [ ] Textos legales revisados.
- [ ] Política de privacidad completada.
- [ ] Condiciones completadas.
- [ ] Cookie policy revisada.
- [ ] README actualizado.
- [ ] CHANGELOG actualizado.
- [ ] DEPLOYMENT actualizado.
- [ ] SECURITY actualizado.
- [ ] Procedimiento de backup conocido.
- [ ] Credenciales entregadas al propietario.
- [ ] Propiedad del dominio confirmada.
- [ ] Propiedad de Supabase confirmada.
- [ ] Propiedad de Cloudflare confirmada.
- [ ] Propiedad de Resend confirmada.

---

# 203. Definition of Done

Una funcionalidad no se considera terminada simplemente porque visualmente aparezca en pantalla.

Se considera terminada cuando:

- cumple requisitos;
- funciona;
- está validada;
- respeta permisos;
- tiene estados de error;
- funciona en móvil;
- no rompe build;
- no rompe tests;
- no introduce secretos;
- está documentada cuando procede.

---

# 204. Regla final

El objetivo no es crear la aplicación técnicamente más compleja posible.

El objetivo es construir una aplicación de repostería que:

- la propietaria entienda;
- el cliente entienda;
- sea cómoda;
- sea fiable;
- proteja los datos;
- pueda mantenerse;
- pueda probarse localmente;
- pueda promocionarse a staging;
- pueda desplegarse a producción sin reescribirla.

Cuando exista conflicto entre una solución muy sofisticada y una solución sencilla que cumple correctamente los requisitos, preferir la solución sencilla.

La seguridad, integridad de datos y separación entre entornos nunca deben sacrificarse en nombre de la simplicidad.