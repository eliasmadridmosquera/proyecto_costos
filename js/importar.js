"use strict";
const MAX_BYTES = 10 * 1024 * 1024;
const FILAS_VISTA_PREVIA = 5;
/** Parser CSV simple: separa por comas, no maneja comillas con comas internas.
 * Suficiente para la vista previa de esta simulación en frontend. */
function parsearCsv(texto) {
    const lineas = texto.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lineas.length === 0)
        return { columnas: [], filas: [], totalFilas: 0 };
    const columnas = lineas[0].split(',').map((c) => c.trim());
    const filasDeDatos = lineas.slice(1);
    const filas = filasDeDatos.slice(0, FILAS_VISTA_PREVIA).map((l) => l.split(',').map((c) => c.trim()));
    return { columnas, filas, totalFilas: filasDeDatos.length };
}
(function initImportador() {
    const form = document.getElementById('importer-form');
    if (!(form instanceof HTMLFormElement))
        return;
    const elDropzone = document.getElementById('dropzone');
    const elFileInput = document.getElementById('fileInput');
    const elAnio = document.getElementById('anio');
    const elCategoria = document.getElementById('categoria');
    const elSubmit = document.getElementById('submitBtn');
    const elPreviewBox = document.getElementById('previewBox');
    const elPreviewFilename = document.getElementById('previewFilename');
    const elPreviewRowcount = document.getElementById('previewRowcount');
    const elPreviewTable = document.getElementById('previewTable');
    if (!(elDropzone instanceof HTMLElement) ||
        !(elFileInput instanceof HTMLInputElement) ||
        !(elAnio instanceof HTMLSelectElement) ||
        !(elCategoria instanceof HTMLSelectElement) ||
        !(elSubmit instanceof HTMLButtonElement) ||
        !(elPreviewBox instanceof HTMLElement) ||
        !(elPreviewFilename instanceof HTMLElement) ||
        !(elPreviewRowcount instanceof HTMLElement) ||
        !(elPreviewTable instanceof HTMLTableElement)) {
        return;
    }
    // Re-vinculados con tipo explícito: los nested functions de más abajo no
    // heredan el angostamiento de tipo (narrowing) de las verificaciones de
    // arriba, así que se necesitan constantes nuevas ya tipadas.
    const dropzone = elDropzone;
    const fileInput = elFileInput;
    const anioSelect = elAnio;
    const categoriaSelect = elCategoria;
    const submitBtn = elSubmit;
    const previewBox = elPreviewBox;
    const previewFilename = elPreviewFilename;
    const previewRowcount = elPreviewRowcount;
    const previewTable = elPreviewTable;
    const status = document.getElementById('form-status');
    let archivoActual = null;
    function mostrarError(campo, mensaje) {
        const errorEl = document.getElementById(`${campo}-error`);
        if (errorEl)
            errorEl.textContent = mensaje ?? '';
        if (campo !== 'archivo') {
            const input = campo === 'anio' ? anioSelect : categoriaSelect;
            input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
        }
    }
    function mostrarEstado(mensaje, tipo) {
        if (!status)
            return;
        status.textContent = mensaje;
        status.classList.remove('is-success', 'is-error', 'anim-in');
        void status.offsetWidth;
        status.classList.add(tipo === 'success' ? 'is-success' : 'is-error', 'anim-in');
    }
    function actualizarBotonEnvio() {
        submitBtn.disabled = archivoActual === null;
    }
    function renderizarVistaPrevia(archivo) {
        previewFilename.textContent = archivo.nombre;
        previewRowcount.textContent = `${archivo.totalFilas} fila${archivo.totalFilas === 1 ? '' : 's'} detectada${archivo.totalFilas === 1 ? '' : 's'}`;
        const thead = previewTable.querySelector('thead');
        const tbody = previewTable.querySelector('tbody');
        if (thead)
            thead.innerHTML = `<tr>${archivo.columnas.map((c) => `<th>${c}</th>`).join('')}</tr>`;
        if (tbody) {
            tbody.innerHTML = archivo.filas
                .map((fila) => `<tr>${fila.map((celda) => `<td>${celda}</td>`).join('')}</tr>`)
                .join('');
        }
        previewBox.hidden = false;
    }
    function procesarArchivo(file) {
        dropzone.classList.remove('has-file');
        archivoActual = null;
        actualizarBotonEnvio();
        if (!file.name.toLowerCase().endsWith('.csv')) {
            mostrarError('archivo', 'Solo se aceptan archivos .csv en esta versión.');
            previewBox.hidden = true;
            return;
        }
        if (file.size > MAX_BYTES) {
            mostrarError('archivo', 'El archivo supera el máximo de 10 MB.');
            previewBox.hidden = true;
            return;
        }
        const lector = new FileReader();
        lector.onload = () => {
            const texto = typeof lector.result === 'string' ? lector.result : '';
            const { columnas, filas, totalFilas } = parsearCsv(texto);
            if (columnas.length === 0 || totalFilas === 0) {
                mostrarError('archivo', 'No se encontraron filas de datos en el archivo.');
                previewBox.hidden = true;
                return;
            }
            mostrarError('archivo', null);
            archivoActual = { nombre: file.name, columnas, filas, totalFilas };
            dropzone.classList.add('has-file');
            renderizarVistaPrevia(archivoActual);
            actualizarBotonEnvio();
        };
        lector.onerror = () => {
            mostrarError('archivo', 'No se pudo leer el archivo. Inténtalo de nuevo.');
            previewBox.hidden = true;
        };
        lector.readAsText(file);
    }
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
        }
    });
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file)
            procesarArchivo(file);
    });
    ['dragenter', 'dragover'].forEach((evento) => {
        dropzone.addEventListener(evento, (e) => {
            e.preventDefault();
            dropzone.classList.add('is-dragover');
        });
    });
    ['dragleave', 'dragend'].forEach((evento) => {
        dropzone.addEventListener(evento, () => dropzone.classList.remove('is-dragover'));
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file)
            procesarArchivo(file);
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const anioValido = anioSelect.value.trim().length > 0;
        const categoriaValida = categoriaSelect.value.trim().length > 0;
        mostrarError('anio', anioValido ? null : 'Selecciona un año.');
        mostrarError('categoria', categoriaValida ? null : 'Selecciona una categoría.');
        if (!anioValido || !categoriaValida) {
            mostrarEstado('Revisa los campos marcados antes de continuar.', 'error');
            return;
        }
        if (!archivoActual) {
            mostrarError('archivo', 'Selecciona un archivo antes de continuar.');
            mostrarEstado('Falta el archivo a importar.', 'error');
            return;
        }
        const categoriaLabel = categoriaSelect.options[categoriaSelect.selectedIndex]?.text ?? categoriaSelect.value;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando…';
        mostrarEstado('Procesando archivo…', 'success');
        // No hay backend real: se simula el tiempo de procesamiento antes de
        // confirmar. El número de filas y la categoría sí vienen del archivo
        // y de los campos reales, no son inventados.
        window.setTimeout(() => {
            submitBtn.textContent = 'Confirmar y procesar';
            actualizarBotonEnvio();
            mostrarEstado(`Se importaron ${archivoActual.totalFilas} filas. Métricas recalculadas para ${categoriaLabel} — ${anioSelect.value}.`, 'success');
        }, 700);
    });
})();
//# sourceMappingURL=importar.js.map