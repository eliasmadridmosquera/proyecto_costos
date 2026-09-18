"use strict";
/** Asistente flotante: reemplaza el viejo tab fijo "Asistente IA" (antes
 * atado siempre a Docencia, sin importar el tab activo). Ahora es un botón
 * pulsante en todas las páginas de unidad, consciente de la vista que el
 * usuario tiene abierta en ese momento (ver contextoAsistente en
 * unidad-dashboard.ts), y solo aparece si ya hay datos importados. */
(function initAsistenteFlotante() {
    if (!hayDatosImportados())
        return;
    const sesion = leerSesionDemo();
    const mensajes = [];
    let abierto = false;
    let yaDescubierto = false;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'asistente-fab';
    boton.setAttribute('aria-label', 'Preguntarle a tus datos');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'asistentePanel');
    boton.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>';
    const panel = document.createElement('div');
    panel.className = 'asistente-panel';
    panel.id = 'asistentePanel';
    panel.hidden = true;
    panel.innerHTML = `
    <p class="asistente-hint">Pregúntale a tus datos de la vista que tienes abierta.</p>
    <div class="chat-box">
      <div class="chat-messages" id="asistenteMensajes" aria-live="polite"></div>
      <form class="chat-input-row" id="asistenteForm">
        <label class="sr-only" for="asistenteInput">Escribe tu pregunta</label>
        <input type="text" id="asistenteInput" placeholder="Ej: ¿qué facultades están en déficit?" autocomplete="off">
        <button type="submit" class="btn-primary">Enviar</button>
      </form>
    </div>
  `;
    document.body.appendChild(panel);
    document.body.appendChild(boton);
    function pintarMensajes() {
        const contenedor = document.getElementById('asistenteMensajes');
        if (!(contenedor instanceof HTMLElement))
            return;
        contenedor.innerHTML = mensajes.map((m) => `<div class="chat-message chat-message-${m.autor}">${m.texto}</div>`).join('');
        contenedor.scrollTop = contenedor.scrollHeight;
    }
    function temaPregunta(pregunta) {
        const q = pregunta.toLowerCase();
        if (q.includes('déficit') || q.includes('deficit'))
            return 'deficit';
        if (q.includes('superávit') || q.includes('superavit'))
            return 'superavit';
        if (q.includes('tendencia'))
            return 'tendencia';
        if (q.includes('costo') || q.includes('total'))
            return 'costo';
        return 'sin_match';
    }
    function responderPregunta(pregunta) {
        if (!contextoAsistente)
            return 'Todavía no hay una vista activa para consultar.';
        const { unidad, vista } = contextoAsistente;
        const etiqueta = `${unidad} — ${vista.titulo}`;
        const q = pregunta.toLowerCase();
        if (q.includes('déficit') || q.includes('deficit')) {
            const enDeficit = vista.filas.filter((f) => f.balance < 0).map((f) => f.facultad);
            return enDeficit.length
                ? `En ${etiqueta}, las facultades en déficit son: ${enDeficit.join(', ')}.`
                : `Ninguna facultad está en déficit en ${etiqueta} este período.`;
        }
        if (q.includes('superávit') || q.includes('superavit')) {
            const enSuperavit = vista.filas.filter((f) => f.balance >= 0).map((f) => f.facultad);
            return `Facultades en superávit (${etiqueta}): ${enSuperavit.join(', ')}.`;
        }
        if (q.includes('tendencia')) {
            const enAlza = vista.filas.filter((f) => f.tendencia === 'alza').map((f) => f.facultad);
            return `Con tendencia al alza en ${etiqueta}: ${enAlza.join(', ') || 'ninguna facultad'}.`;
        }
        if (q.includes('costo') || q.includes('total')) {
            const total = vista.filas.reduce((acc, f) => acc + f.costoTotal, 0);
            return `El costo total de ${etiqueta} en el período es de $${total.toLocaleString('es-EC')}.`;
        }
        return 'Esta es una demo con respuestas precargadas. Prueba preguntar por "déficit", "superávit", "tendencia" o "costo total".';
    }
    function abrirPanel() {
        abierto = true;
        panel.hidden = false;
        boton.setAttribute('aria-expanded', 'true');
        if (!yaDescubierto) {
            yaDescubierto = true;
            boton.classList.add('is-descubierto');
        }
        if (mensajes.length === 0 && contextoAsistente) {
            mensajes.push({
                autor: 'bot',
                texto: `Demo — respuestas precargadas sobre ${contextoAsistente.unidad} — ${contextoAsistente.vista.titulo}. El asistente real se conecta a la API del backend (ver plan.md).`,
            });
        }
        pintarMensajes();
        const input = document.getElementById('asistenteInput');
        if (input instanceof HTMLInputElement)
            input.focus();
    }
    function cerrarPanel() {
        abierto = false;
        panel.hidden = true;
        boton.setAttribute('aria-expanded', 'false');
        boton.focus();
    }
    boton.addEventListener('click', () => {
        if (abierto)
            cerrarPanel();
        else
            abrirPanel();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && abierto)
            cerrarPanel();
    });
    const form = document.getElementById('asistenteForm');
    const input = document.getElementById('asistenteInput');
    if (form instanceof HTMLFormElement && input instanceof HTMLInputElement) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const pregunta = input.value.trim();
            if (!pregunta)
                return;
            mensajes.push({ autor: 'user', texto: pregunta });
            mensajes.push({ autor: 'bot', texto: responderPregunta(pregunta) });
            trackEvento('ai_assistant_question_asked', {
                user_role: sesion?.rol ?? null,
                question_length: pregunta.length,
                matched_topic: temaPregunta(pregunta),
                unit: contextoAsistente?.unidad ?? null,
            });
            pintarMensajes();
            input.value = '';
            input.focus();
        });
    }
})();
//# sourceMappingURL=asistente-flotante.js.map