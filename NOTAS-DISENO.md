# Notas de diseño — componentes del playground

Justificación de los estilos aplicados en `css/alerts.css`, `botones.css`, `checkboxes-radios.css`, `dialogs.css`, `menus.css` y `toasts.css`, y cómo se conectan con el backoffice real del proyecto.

## Principio general

Ningún componente inventa su propio lenguaje visual: todos reutilizan los tokens ya definidos en `css/variables.css` (`--space-*`, `--radius*`, `--text-*`, `--surface*`, `--border-strong`, `--focus-ring`, y los colores semánticos `--success`/`--error`/`--alert`/`--info` con sus fondos `*-bg`). Es la misma paleta "azul pizarra + ámbar" que ya usan `paneles.html`, `usuarios.html` e `importar.html`. Cuando estos componentes se trasladen al backoffice real, no van a desentonar con el resto del sitio ni van a necesitar un segundo set de variables.

## Alerts

Antes solo tenían un borde de color; ahora cada variante lleva también un fondo tenue (`--success-bg`, `--error-bg`, y los nuevos `--alert-bg`/`--info-bg` agregados a `variables.css` siguiendo el mismo patrón) — el color dejó de depender solo del borde, que es fácil de pasar por alto.

El punto que pedía el enunciado explícitamente: `.c-alert-close` llevaba el botón "×" sin ningún reset, así que el navegador le aplicaba su propio borde/fondo por defecto. Se le quitó `appearance` nativo, se le dio un tamaño de blanco fijo (24×24px, suficiente para tocar en móvil) y estados `:hover`/`:focus-visible` explícitos con el mismo anillo de foco que usa el resto del sitio (`--focus-ring`, `outline:3px solid`).

**Backoffice real:** estas cuatro variantes son exactamente lo que necesita la validación de formularios de `importar.html` (error al parsear un CSV, aviso de que un período no tiene datos) y los mensajes de confirmación al guardar en `usuarios.html` — se reutilizan las mismas clases `c-alert*` tal cual, sin adaptarlas.

## Botones

Se construyó `.c-btn` como sistema completo con reset de apariencia nativa en la base, y encima cuatro variantes (`--primary`, `--secondary`, `--destructive`, `--icon`) con sus tres estados interactivos como pseudo-clases reales — no clases simuladas en HTML:

- `:hover` — opacidad reducida en primario/destructivo, fondo `--surface-2` en secundario/icon.
- `:active` (pressed) — un `translateY(1px)` sutil además del cambio de color, para que el clic se sienta físico.
- `:disabled` — opacidad 0.5, cursor `not-allowed`, y los `:hover`/`:active` quedan anulados con `:not(:disabled)` para que un botón deshabilitado no reaccione al mouse.

Se agregó un ejemplo `disabled` junto a cada variante en el playground para poder comparar los cuatro estados uno al lado del otro, en vez de tener que inspeccionar el CSS para verificar que existen.

**Backoffice real:** la jerarquía primario/secundario/destructivo es la misma que ya pide la Clase 01 (jerarquía visual) y la Clase 02 (botones): "Guardar" en `usuarios.html` es `--primary`, "Cancelar" es `--secondary`, "Eliminar usuario" es `--destructive`. El icon button reutiliza el mismo ícono de tres puntos que dispara los menús de cuenta.

## Checkboxes / Radios

Se usó `accent-color` sobre los inputs nativos en vez de reconstruir el control con `::before`/`::after` — el navegador ya resuelve el check/radio con buen contraste y soporte de teclado, y así se evita reinventar la rueda (el tema central de la Clase 02). El `fieldset`/`legend` de cada grupo se estilizó como una tarjeta con borde, para que el agrupamiento se vea, no solo se anuncie por accesibilidad.

**Backoffice real:** este es el patrón de "filtrar tabla por estado" / "ordenar por" que va a aparecer en los data-tables de `paneles.html`.

## Dialogs

Se usa el `<dialog>` nativo tal como lo abre `ts/playground.ts` (`.showModal()`), sin ninguna clase de estado adicional — el CSS solo estiliza el elemento y su `::backdrop`. Sombra pronunciada y radio grande (`--radius-lg`) para que se lea claramente como una capa flotante sobre el resto de la página, con las acciones alineadas a la derecha y la destructiva últimma en el orden visual (coincide con el ejemplo "Preferir" de dialogs en la Clase 02: una pregunta clara, dos salidas).

**Backoffice real:** confirmación de eliminar un usuario o un recurso importado, sin usar nunca `confirm()` nativo.

## Menús

El único ajuste de HTML autorizado en esta sección fue envolver cada trigger+lista en `<div class="c-menu">` para tener un contenedor con `position:relative` — sin eso, posicionar el desplegable (`position:absolute`) hubiera requerido un selector `:has()` acoplado a la estructura del playground, menos reutilizable. El estado abierto se refleja tanto en el propio menú (aparece/desaparece vía el atributo nativo `hidden`, ya manejado por `ts/playground.ts`) como en el botón que lo abre (`[aria-expanded="true"]` cambia su fondo), así el trigger también comunica su propio estado.

**Backoffice real:** es el menú de cuenta (`Cuenta ▾`) que va a vivir en el header interno junto al `user-chip`, y el trigger de ícono es el mismo patrón para "más opciones" en una fila de tabla.

## Toasts

Contenedor fijo en la esquina inferior derecha, con un `max-width` calculado contra el viewport para no generar overflow horizontal en pantallas angostas (se movió a un layout de ancho completo por debajo de 480px). Cada toast entra con una animación corta (`@keyframes`, deshabilitada bajo `prefers-reduced-motion`) que se dispara sola al insertarse en el DOM — no requirió tocar `ts/playground.ts`, que ya inserta y remueve los toasts sin clases de estado intermedias.

**Backoffice real:** feedback de "cambios guardados" / "no se pudo completar la solicitud" tras cualquier acción de guardar o eliminar en el backoffice.
