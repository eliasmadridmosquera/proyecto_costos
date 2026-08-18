# Panel Académico — Landing page

Landing page del proyecto integrador **Panel Académico** (Bootcamp Full Stack Developer, Avance 2). Sistema de dashboards de costos institucionales con acceso diferenciado por rol.

## Estructura

```
index.html        Página principal (HTML semántico + ARIA)
css/styles.css     Estilos: design tokens (:root) + layout Flexbox/Grid + mobile-first
ts/                Código fuente TypeScript (nav.ts, form.ts)
js/                JavaScript compilado (generado con `npm run build`, no editar a mano)
robots.txt         Indexación para buscadores
tsconfig.json      Configuración del compilador TypeScript
```

## Requisitos

- [Node.js](https://nodejs.org/) (para tener `npm`)
- TypeScript instalado globalmente: `npm install -g typescript`

## Uso

1. Clona el repositorio.
2. Compila el TypeScript a JavaScript:

   ```bash
   npm run build
   ```

3. Abre `index.html` directamente en el navegador (no requiere servidor).

Si editas algo en `ts/`, vuelve a correr `npm run build` antes de recargar la página — `js/` se regenera automáticamente y no debe editarse a mano.

## Funcionalidad

- **Navegación**: menú hamburguesa accesible por teclado en mobile (`ts/nav.ts`).
- **Formulario "Solicitar acceso"**: validación en tiempo real de nombre, correo institucional y rol solicitado, con mensajes de error asociados vía `aria-describedby` (`ts/form.ts`).
