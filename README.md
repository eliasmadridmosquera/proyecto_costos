# Panel Académico

Prototipo frontend del proyecto integrador **Panel Académico** (Bootcamp Full Stack Developer, Módulo 1). Sistema de dashboards de costos institucionales para una universidad ficticia (Universidad Meridiano), con acceso diferenciado por rol: Webmaster, Administrador, Rectorado, Decanato y Visitante.

**Etapa actual: 100% frontend estático, sin backend ni llamadas de red reales.** Login, formularios e importación de archivos están simulados del lado del cliente — cualquier "guardado" o "autenticación" es una demo, no una operación real.

## Estructura

```
Páginas públicas    index.html, registro.html, iniciar-sesion.html, recuperar-clave.html,
                     privacidad.html, terminos.html, cookies.html, contacto.html,
                     centro-ayuda.html, 404.html
Páginas internas     paneles.html   (4 dashboards de costos + asistente IA, por pestañas)
(requieren sesión    usuarios.html  (gestión de usuarios, solo Webmaster)
 demo iniciada)       importar.html  (importación de CSV, Admin/Webmaster)

css/                 Módulos: variables, base, layout, components, pages, responsive.
                     styles.css es solo un agregador @import — nunca se edita
                     directamente, y ninguna página HTML enlaza otro archivo de css/.
ts/                  Código fuente TypeScript (un archivo IIFE por página o capa
                     compartida: session.ts, validators.ts, theme.ts, nav.ts, etc.)
js/                  JavaScript compilado (generado con `npm run build`, no editar a mano)
robots.txt           Indexación para buscadores
tsconfig.json        Configuración del compilador TypeScript (strict, sin `any`)
CLAUDE.md            Guía de arquitectura del proyecto para sesiones de Claude Code
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

3. Abre `index.html` directamente en el navegador, o sírvelo con cualquier servidor estático (por ejemplo `npx serve .`).

Si editas algo en `ts/`, vuelve a correr `npm run build` antes de recargar la página — `js/` se regenera automáticamente y no debe editarse a mano.

## Funcionalidad

- **Navegación**: menú hamburguesa accesible por teclado en mobile, con `aria-expanded` (`ts/nav.ts`).
- **Tema claro/oscuro**: sigue `prefers-color-scheme` por defecto, con override manual persistido en `localStorage` (`ts/theme.ts`).
- **Formularios validados**: registro, inicio de sesión y recuperar clave, con validación en tiempo real y mensajes de error asociados vía `aria-describedby` (`ts/validators.ts`, `ts/form.ts`, `ts/login.ts`, `ts/recuperar.ts`).
- **Sesión demo**: `ts/session.ts` guarda el rol activo en `localStorage` tras un login con uno de los 5 correos institucionales fijos (uno por rol). Cualquier otro correo válido muestra un mensaje de "demo, requiere backend" sin autenticar de verdad.
- **Paneles de costos** (`paneles.html`): 4 categorías —Docencia, Investigación, Nombramientos, Calidad×Costo— por pestañas, más un asistente de IA con respuestas simuladas sobre los datos mock. El contenido visible se ajusta según el rol (por ejemplo, Decanato solo ve su propia facultad + un benchmark institucional).
- **Gestión de usuarios** (`usuarios.html`, solo Webmaster): tabla editable en línea sobre datos mock.
- **Importación de archivos** (`importar.html`, Admin/Webmaster): parseo real de CSV vía `FileReader` (encabezados, conteo de filas, vista previa) — solo el guardado final está simulado.

## Nota sobre TypeScript

El proyecto no usa bundler ni módulos ES (`import`/`export`): cada archivo `.ts` se compila a una IIFE autoinvocada, y las páginas cargan los `.js` compilados en un orden específico con `<script defer>`. Los símbolos compartidos (tipos, funciones) quedan visibles globalmente para cualquier script cargado después en esa misma página — el orden de las etiquetas `<script>` en cada HTML es, en la práctica, el grafo de dependencias del proyecto.
