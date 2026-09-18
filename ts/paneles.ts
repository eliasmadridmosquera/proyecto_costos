/** Hub de unidades sustantivas: punto de entrada tras iniciar sesión. Las
 * dashboards reales por unidad viven en docencia.html/investigacion.html/
 * vinculacion.html — esta página solo orienta hacia la unidad correcta. */
(function initHub(): void {
  const sesionActual = leerSesionDemo();
  if (!sesionActual) return; // session.ts ya redirige a iniciar-sesion.html

  const sesion: SesionDemo = sesionActual;
  const roleBanner = document.getElementById('roleBanner');
  if (!(roleBanner instanceof HTMLElement)) return;

  roleBanner.innerHTML =
    sesion.rol === 'decanato'
      ? `Estás viendo la facultad de <strong>${sesion.facultad}</strong>. Cada unidad muestra tu facultad + el benchmark institucional agregado.`
      : 'Estás viendo el panorama institucional completo en cada unidad.';
})();
