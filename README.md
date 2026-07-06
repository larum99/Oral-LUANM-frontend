# Odonto-luanm-frontend

Proyecto frontend estatico de ORAL LUANM. Usa paginas HTML por seccion, componentes reutilizables para header/footer, Bootstrap y persistencia en `localStorage` para los flujos mockeados.

## Como Ejecutar

Los componentes se cargan con `fetch`, por eso se debe abrir con servidor local y no como archivo `file://`.

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Luego visitar:

```text
http://127.0.0.1:5500/
```

## Accesos Mock

Admin:

```text
usuario: juan@correo.com
clave: 123456
```

Secretario:

```text
usuario: secre@correo.com
clave: 654321
```

Cliente:

```text
usuario: sara@correo.com
clave: 7654321
```

## Rutas Principales

```text
Inicio:                /
Contacto:              /contactanos/
Servicios:             /servicios/
Registro:              /registro/
Recuperar contrasena:  /registro/olvide-contrasena/
Panel admin:           /registro/admin/
Portal cliente:        /registro/cliente/
Panel secretario:      /registro/secretario/
```

## Mapa de Navegacion

```text
Publico
+-- /
|   +-- header reutilizable
|   |   +-- Inicio
|   |   +-- Contacto
|   |   +-- Servicios
|   |   +-- Iniciar Sesion / Cerrar Sesion
|   |   +-- Sesion activa -> acceso al panel interno segun rol
|   +-- Home
|   +-- Footer
|       +-- Login modal
|       +-- Registro modal
|       +-- Solicitud de cita modal
+-- /contactanos/
+-- /servicios/
+-- /registro/
|   +-- formulario de registro
+-- /registro/olvide-contrasena/

Interno
+-- /registro/admin/
|   +-- usuarios
|   +-- citas
|   +-- especialistas
|   +-- permisos
+-- /registro/secretario/
|   +-- crear / editar / cancelar citas
|   +-- agenda compartida
+-- /registro/cliente/
    +-- agendar cita
    +-- ver mis citas
```

## Estructura Actual

```text
Odontologia/
+-- assets/
|   +-- img/
+-- componentes/
|   +-- footer.html
|   +-- header.html
+-- contactanos/
|   +-- index.html
+-- css/
|   +-- servicios.css
|   +-- style.css
+-- database/
+-- docs/
+-- img/
+-- js/
|   +-- app.js
|   +-- datos.json
|   +-- servicios-data.js
+-- registro/
|   +-- admin/
|   |   +-- index.html
|   +-- cliente/
|   |   +-- index.html
|   +-- olvide-contrasena/
|   |   +-- index.html
|   +-- secretario/
|   |   +-- index.html
|   +-- index.html
+-- servicios/
|   +-- index.html
+-- index.html
+-- README.md
```

## Funcionalidades Relevantes

- Header y footer reutilizables con `data-component`.
- Login mockeado con redireccion por rol.
- Estado de sesion visible en el header.
- Boton de login que cambia a `Cerrar Sesion` cuando hay usuario activo.
- Panel admin dentro de `registro/admin/`.
- Portal cliente dentro de `registro/cliente/`.
- Panel secretario dentro de `registro/secretario/`.
- Recuperacion de contrasena dentro de `registro/olvide-contrasena/`.
- Agenda de citas con crear, editar, cancelar y persistir.
- Validacion de citas para impedir fecha/hora anterior a la actual + 15 minutos.
- Validacion de citas para impedir domingos, festivos de Colombia y choques de horario por especialista.
- Creacion de pacientes nuevos desde el formulario de citas.
- Panel admin con vistas internas para usuarios, citas, especialistas y permisos.
- Creacion de especialistas desde admin y disponibilidad posterior en la agenda del secretario.
- Portal cliente conectado a la misma agenda local para que admin y secretario vean las mismas citas.
- Textos genericos centralizados en `js/datos.json`.

## Datos Centralizados

El archivo `js/datos.json` contiene textos cambiables del proyecto, como:

- Marca.
- Navegacion.
- Botones repetidos.
- Datos de contacto.
- Textos de footer.
- Titulos de secciones.
- Labels y placeholders comunes.

Para usar un texto del JSON en HTML:

```html
<span data-text="buttons.appointment">Agendar Cita</span>
```

Para insertar HTML controlado desde el JSON:

```html
<p data-html="brand.copyright"></p>
```

Para placeholders:

```html
<input data-placeholder="forms.emailPlaceholder">
```

## Persistencia Local

La persistencia usa `localStorage`:

```text
oralLuanmUser             usuario con sesion activa
oralLuanmAppointments     citas creadas o editadas
oralLuanmAdminUsers       usuarios creados desde admin
oralLuanmSpecialists      especialistas creados desde admin
oralLuanmTeamPermissions  permisos por usuario interno
oralLuanmSyncQueue        cola local lista para futura sincronizacion con backend
```

## Librerias Usadas

- Bootstrap 5.3.3.
- Bootstrap Icons 1.11.3.
- Google Fonts: `Inter` y `Outfit`.
- Google Maps Embed para el mapa de contacto.

## Archivos Clave

- `componentes/header.html`: navegacion, estado de sesion y botones principales.
- `componentes/footer.html`: footer, login, registro y modal de agendar cita.
- `js/app.js`: carga de componentes, datos JSON, login, sesiones, paneles, agenda y validaciones.
- `js/datos.json`: textos configurables del sitio.
- `css/style.css`: estilos globales, registro, paneles internos y estados visuales.
