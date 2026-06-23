# Odonto-luanm-frontend

Proyecto frontend estatico de ORAL LUANM.

## Estructura actual

```text
Odontologia/
├── componentes/
│   ├── footer.html
│   └── header.html
├── contactanos/
│   └── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── index.html
└── README.md
```

## Secciones conservadas

- Header reutilizable: `componentes/header.html`.
- Footer reutilizable: `componentes/footer.html`.
- Index global: `index.html`.
- Pagina de contacto: `contactanos/index.html`.

## Librerias usadas

- Bootstrap 5.3.3.
- Bootstrap Icons 1.11.3.
- Google Fonts: `Inter` y `Outfit`.
- Google Maps Embed para el mapa de contacto.

## Componentes dinamicos

La pagina de contacto carga header y footer con:

```html
<div data-component="header"></div>
<div data-component="footer"></div>
```

La logica esta en `js/app.js`. El archivo carga los componentes con `fetch`, ajusta rutas relativas, activa el navbar al hacer scroll, ejecuta animaciones y valida formularios.

## Como ejecutar

Como los componentes usan `fetch`, abrir con servidor local:

Luego visitar:

```text
http://127.0.0.1:5500/contactanos/
```

## Mantenimiento

- Cambios del menu: `componentes/header.html`.
- Cambios del footer o modal de agenda: `componentes/footer.html`.
- Cambios visuales: `css/style.css`.
- Cambios de carga dinamica y validaciones: `js/app.js`.
