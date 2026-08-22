/** Usuarios sintéticos para la demo de Gestión de usuarios (rol Webmaster). */

type RolAsignado = 'Webmaster' | 'Administrador' | 'Rectorado' | 'Decanato' | 'Visitante';

interface UsuarioSistema {
  id: number;
  nombre: string;
  correo: string;
  rol: RolAsignado;
  facultad: string | null;
  activo: boolean;
}

const ROLES_ASIGNABLES: RolAsignado[] = ['Webmaster', 'Administrador', 'Rectorado', 'Decanato', 'Visitante'];

const USUARIOS_INICIALES: UsuarioSistema[] = [
  { id: 1, nombre: 'Marina Del Valle', correo: 'webmaster@umeridiano.edu.ec', rol: 'Webmaster', facultad: null, activo: true },
  { id: 2, nombre: 'Renzo Cabezas', correo: 'admin@umeridiano.edu.ec', rol: 'Administrador', facultad: null, activo: true },
  { id: 3, nombre: 'Ivonne Salazar', correo: 'rectorado@umeridiano.edu.ec', rol: 'Rectorado', facultad: null, activo: true },
  { id: 4, nombre: 'Teodoro Nazareno', correo: 'decanato@umeridiano.edu.ec', rol: 'Decanato', facultad: 'Ciencias Sociales', activo: true },
  { id: 5, nombre: 'Cielo Andrade', correo: 'visitante@umeridiano.edu.ec', rol: 'Visitante', facultad: null, activo: true },
  { id: 6, nombre: 'Pablo Izurieta', correo: 'pablo.izurieta@umeridiano.edu.ec', rol: 'Decanato', facultad: 'Ingeniería', activo: false },
  { id: 7, nombre: 'Aracely Montenegro', correo: 'aracely.montenegro@umeridiano.edu.ec', rol: 'Decanato', facultad: 'Negocios', activo: true },
];
