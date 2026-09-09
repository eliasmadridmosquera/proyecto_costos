/** El SDK de Mixpanel se carga como script global (ver snippet en <head> de
 * cada página) — TypeScript no lo conoce sin esta declaración ambiental. */
interface MixpanelGlobal {
  track(evento: string, propiedades?: Record<string, unknown>): void;
}

declare const mixpanel: MixpanelGlobal;

function trackEvento(evento: string, propiedades: Record<string, unknown>): void {
  mixpanel.track(evento, propiedades);
}
