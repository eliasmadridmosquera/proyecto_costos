"use strict";
(function initUsuarios() {
    const sesionActual = leerSesionDemo();
    if (!sesionActual)
        return; // session.ts ya redirige a iniciar-sesion.html
    if (sesionActual.rol !== 'webmaster') {
        window.location.href = 'index.html';
        return;
    }
    const elTbody = document.getElementById('usersTableBody');
    const status = document.getElementById('users-status');
    if (!(elTbody instanceof HTMLTableSectionElement))
        return;
    // Re-vinculado con tipo explícito: los nested functions de más abajo no
    // heredan el angostamiento de tipo (narrowing) de la verificación de arriba.
    const tbody = elTbody;
    const usuarios = USUARIOS_INICIALES.map((u) => ({ ...u }));
    let editandoId = null;
    function mostrarEstado(mensaje) {
        if (!status)
            return;
        status.textContent = mensaje;
        status.classList.remove('anim-in');
        void status.offsetWidth;
        status.classList.add('is-success', 'anim-in');
    }
    function esRolAsignable(valor) {
        return ROLES_ASIGNABLES.includes(valor);
    }
    function opcionesRol(rolActual) {
        return ROLES_ASIGNABLES.map((r) => `<option value="${r}"${r === rolActual ? ' selected' : ''}>${r}</option>`).join('');
    }
    function opcionesFacultad(facultadActual) {
        const vacia = `<option value=""${facultadActual ? '' : ' selected'}>—</option>`;
        const resto = FACULTADES_DEMO.map((f) => `<option value="${f}"${f === facultadActual ? ' selected' : ''}>${f}</option>`).join('');
        return vacia + resto;
    }
    function filaEdicion(u) {
        return `
      <tr class="is-editing" data-id="${u.id}">
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td><select class="edit-rol" aria-label="Rol de ${u.nombre}">${opcionesRol(u.rol)}</select></td>
        <td>
          <select class="edit-facultad" aria-label="Facultad de ${u.nombre}"${u.rol === 'Decanato' ? '' : ' disabled'}>
            ${opcionesFacultad(u.facultad)}
          </select>
        </td>
        <td><span class="status-pill ${u.activo ? 'is-active' : 'is-inactive'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td class="table-actions">
          <button type="button" class="btn-link btn-guardar">Guardar</button>
          <button type="button" class="btn-link btn-cancelar">Cancelar</button>
        </td>
      </tr>
    `;
    }
    function filaNormal(u) {
        return `
      <tr data-id="${u.id}">
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${u.rol}</td>
        <td>${u.facultad ?? '—'}</td>
        <td><span class="status-pill ${u.activo ? 'is-active' : 'is-inactive'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td class="table-actions">
          <button type="button" class="btn-link btn-editar">Editar</button>
          <button type="button" class="btn-link btn-toggle">${u.activo ? 'Desactivar' : 'Activar'}</button>
        </td>
      </tr>
    `;
    }
    function vincularFilas() {
        tbody.querySelectorAll('tr').forEach((tr) => {
            const idAttr = tr.getAttribute('data-id');
            const id = idAttr ? Number(idAttr) : NaN;
            if (Number.isNaN(id))
                return;
            tr.querySelector('.btn-editar')?.addEventListener('click', () => {
                editandoId = id;
                renderizarTabla();
            });
            tr.querySelector('.btn-cancelar')?.addEventListener('click', () => {
                editandoId = null;
                renderizarTabla();
            });
            tr.querySelector('.btn-toggle')?.addEventListener('click', () => {
                const usuario = usuarios.find((u) => u.id === id);
                if (!usuario)
                    return;
                usuario.activo = !usuario.activo;
                mostrarEstado(`${usuario.nombre} ahora está ${usuario.activo ? 'activo' : 'inactivo'}.`);
                renderizarTabla();
            });
            const selectRol = tr.querySelector('.edit-rol');
            const selectFacultad = tr.querySelector('.edit-facultad');
            if (selectRol instanceof HTMLSelectElement && selectFacultad instanceof HTMLSelectElement) {
                selectRol.addEventListener('change', () => {
                    const esDecanato = selectRol.value === 'Decanato';
                    selectFacultad.disabled = !esDecanato;
                    if (!esDecanato)
                        selectFacultad.value = '';
                });
            }
            tr.querySelector('.btn-guardar')?.addEventListener('click', () => {
                const usuario = usuarios.find((u) => u.id === id);
                if (!usuario || !(selectRol instanceof HTMLSelectElement) || !(selectFacultad instanceof HTMLSelectElement)) {
                    return;
                }
                if (!esRolAsignable(selectRol.value))
                    return;
                usuario.rol = selectRol.value;
                usuario.facultad = usuario.rol === 'Decanato' ? selectFacultad.value || null : null;
                editandoId = null;
                mostrarEstado(`Se actualizó a ${usuario.nombre}: ${usuario.rol}${usuario.facultad ? ` — ${usuario.facultad}` : ''}.`);
                renderizarTabla();
            });
        });
    }
    function renderizarTabla() {
        tbody.innerHTML = usuarios.map((u) => (u.id === editandoId ? filaEdicion(u) : filaNormal(u))).join('');
        vincularFilas();
    }
    renderizarTabla();
})();
//# sourceMappingURL=usuarios.js.map