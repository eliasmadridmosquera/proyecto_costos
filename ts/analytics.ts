/** El SDK de Mixpanel se carga como script global (ver snippet en <head> de
 * cada página) — TypeScript no lo conoce sin esta declaración ambiental. */
interface MixpanelGlobal {
  track(evento: string, propiedades?: Record<string, unknown>): void;
  identify(id: string): void;
}

declare const mixpanel: MixpanelGlobal;

/** occurred_at se agrega acá una sola vez — antes cada evento inventaba su
 * propio nombre de timestamp (created_at, started_at, event_at...). */
function trackEvento(evento: string, propiedades: Record<string, unknown>): void {
  mixpanel.track(evento, { ...propiedades, occurred_at: new Date().toISOString() });
}
