# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Landing page + internal-page prototype for **Panel Académico**, a bootcamp integrator project (Full Stack Developer, Web Foundations & Agentic Coding module). It simulates a future full-stack system (`plan.md` — gitignored, not in the public repo — has the complete roadmap) for institutional cost dashboards at a fictional university ("Universidad Meridiano", `@umeridiano.edu.ec`). The real system this is modeled on is a separate, private ASP.NET Core project; this repo is a public, from-scratch rebuild with 100% synthetic data.

**Current stage: 100% static frontend, no backend, no network calls.** Every "backend" interaction (login, form submission, file import, AI assistant) is simulated client-side. Don't add a fetch/XHR call or wire up a real API unless explicitly asked — the project is deliberately staying mock-only until a backend phase is requested.

## Commands

```bash
npm run build   # compiles ts/**/*.ts -> js/ via tsc (the only script)
```

There is no test runner, linter, or dev server configured. `js/` is generated output — never hand-edit it, always edit the matching file in `ts/` and rebuild. Pages are opened directly as static files (`index.html`) or served with any static file server (e.g. `npx serve .`); no build step is required to view HTML/CSS changes, only for `.ts` changes.

## Architecture

### No bundler, no modules — plain global scripts

`tsconfig.json` has no `module` output tied to ESM in the runtime sense: every `.ts` file is a self-invoking IIFE with **no `import`/`export` statements**, so TypeScript treats them as global scripts. Symbols declared in one file (types, `const`, `function`) are visible to every other file loaded after it, purely through `<script src="js/X.js" defer>` tag order in each HTML page's `<body>`. There is no dependency graph beyond that tag order — get it wrong and a page breaks silently at runtime with no build error.

Concretely: `validators.ts` and `session.ts` define shared helpers/types with no import; any page that needs them must list `js/validators.js` or `js/session.js` *before* the page-specific script in its own `<script>` tags.

**Known TS-strict gotcha** (`strict: true`, `noUnusedLocals`, `noUnusedParameters`): a `document.getElementById(...)` narrowed via `instanceof` in an outer function does **not** stay narrowed inside a nested function/closure defined later in the same file. The fix used throughout the codebase is to re-bind to a new, explicitly-typed `const` right after the guard clause (see the comment in `ts/importar.ts`, `ts/paneles.ts`, `ts/usuarios.ts`). Follow this pattern rather than reaching for non-null assertions.

### Demo "auth" via localStorage, not a backend

`ts/session.ts` is the shared identity layer: it defines the 5 roles (`webmaster`, `admin`, `rectorado`, `decanato`, `visitante`), a fixed list of demo faculties, and reads/writes the active role to `localStorage` under `panelacademico-demo-rol`. `ts/login.ts` maps 5 fixed demo emails (`webmaster@umeridiano.edu.ec`, etc.) to roles and redirects post-"login". Any other syntactically-valid `@umeridiano.edu.ec` email just shows a "demo, requires backend" message — it never actually authenticates.

`session.ts` also self-initializes on every page load: if it finds `#userChipName` in the DOM (i.e., this is an internal/authenticated page), it paints the role chip + nav from `localStorage`, and redirects to `iniciar-sesion.html` if no demo session exists. Pages needing a *stronger* per-page role gate (e.g. `usuarios.html` is Webmaster-only) do an additional explicit check in their own script and redirect if the role doesn't match — `session.ts`'s auto-redirect only checks "is anyone logged in", not "is the right role logged in".

Theme (light/dark) follows the same localStorage pattern independently, under `panelacademico-theme`, via `ts/theme.ts`. Every HTML `<head>` has an inline anti-FOUC snippet that reads this key and sets `data-theme` before first paint — copy it verbatim into any new page.

### Page inventory and roles

- **Public marketing/auth flow**: `index.html`, `iniciar-sesion.html`, `registro.html`, `recuperar-clave.html`, plus legal/support stubs (`privacidad.html`, `terminos.html`, `cookies.html`, `contacto.html`, `centro-ayuda.html`, `404.html`).
- **Internal/authenticated pages** (all require a demo session, all share the header pattern with `#internalNav`/`#userChipName`/`#userChipLogout`): `paneles.html` (the 4 cost dashboards — Docencia, Investigación, Nombramientos, Calidad×Costo — as tabs, plus a 5th "Asistente IA" tab with keyword-matched canned chat responses over the mock data), `usuarios.html` (Webmaster-only user management table with inline edit), `importar.html` (Admin/Webmaster CSV import simulation with client-side parsing/preview).

Role-based data scoping (e.g. Decanato only sees its own faculty + an aggregated institutional benchmark row, Visitante gets Exportar/Calculadora disabled) is enforced **only in the rendering logic** (`ts/paneles.ts`), not by hiding data at a real trust boundary — there is no backend yet to enforce it server-side. Don't treat this as real access control.

### CSS: modular, but every page still links one file

`css/styles.css` is a thin `@import` aggregator — **no HTML file links anything under `css/` except `css/styles.css` directly**, so never add a new `<link>` for a CSS module in an HTML page. To change styles, edit the right module:

- `variables.css` — design tokens (`:root` custom properties) + dark-mode overrides. Dark mode is `prefers-color-scheme` by default, overridable per-user via `data-theme="light|dark"` on `<html>` (set by `theme.ts`).
- `base.css` — reset, `.wrap`, `.sr-only`, skip-link, the `.prose` typography utility (used by all legal/help pages), reduced-motion-gated animations.
- `layout.css` — header/nav (both the public `.primary-nav` and the internal `.internal-nav`/`.user-chip`), generic `.section`/`.section-head`, `.cta-section`, footer.
- `components.css` — reusable widgets with their own visual identity: buttons, form fields, auth panel, cards, data tables (`.data-table`, shared by paneles/usuarios/importar's CSV preview), tabs, chat bubbles, status pills.
- `pages.css` — page-specific *composition only* (grid containers with no visual identity of their own: `.hero-inner`, `.roles-list`, `.features-list`, `.importer-fields`, `.stat-grid`, `.panel-actions`), one section per page.
- `responsive.css` — both breakpoints (`768px`, `1024px`), imported last so its rules win the cascade. Also holds one deliberate `max-width:359px` exception (hides `.user-chip-name` on the internal header) — the only non-mobile-first query in the codebase, added to fix a real overflow bug on the narrowest supported phones; don't treat it as a pattern to copy, the rest of the site is min-width-only.

Import order in `styles.css` is load-bearing: `responsive.css` must stay last since its selectors rely on source-order to override the base rules from `components.css`/`pages.css`/`layout.css` at equal specificity.

### Adding a new page

Every HTML page duplicates the same skeleton: the anti-FOUC theme script, the Google Fonts `<link>`s, the inline SVG favicon (identical `data:` URI on every page), header, footer, and the same `<script src="js/theme.js" defer>` first. There's no templating — copy an existing page of the same kind (public vs. internal) as your starting point rather than building the shell from scratch.
