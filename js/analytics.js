"use strict";
/** occurred_at se agrega acá una sola vez — antes cada evento inventaba su
 * propio nombre de timestamp (created_at, started_at, event_at...). */
function trackEvento(evento, propiedades) {
    mixpanel.track(evento, { ...propiedades, occurred_at: new Date().toISOString() });
}
//# sourceMappingURL=analytics.js.map