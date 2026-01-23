import * as servicios from '../Servicios/serviciosGenerales';
import { Usuario } from '../Models/Usuario';

export const usuarioService = {
  obtenerTodos: () => {
    const datos = servicios.obtenerUsuarios();
    return datos.map(d => Usuario.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = servicios.obtenerUsuarioPorId(id);
    return dato ? Usuario.fromJSON(dato) : null;
  },

  crear: (datos) => {
    // Validaciones en Service (no en persistencia)
    const usuarios = usuarioService.obtenerTodos();
    
    if (usuarios.some(u => u.email.toLowerCase() === datos.email?.toLowerCase())) {
      return { exito: false, mensaje: "El email ya está registrado" };
    }
    if (usuarios.some(u => u.nombreDeUsuario.toLowerCase() === datos.nombreDeUsuario?.toLowerCase())) {
      return { exito: false, mensaje: "El nombre de usuario ya existe" };
    }

    // Transformaciones en Service
    const nuevoUsuario = {
      ...datos,
      id: crypto.randomUUID(),
    };

    const resultado = servicios.agregarUsuario(nuevoUsuario);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  actualizar: (id, datos) => {
    const resultado = servicios.editarUsuario(id, datos);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  eliminar: (id) => {
    return servicios.eliminarUsuario(id);
  },

  login: (credencial, contrasena) => {
    const resultado = servicios.loginUsuario(credencial, contrasena);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  registrar: (datos) => {
    // Usar crear() que ya tiene validaciones y convierte a Model
    return usuarioService.crear(datos);
  },

  buscar: (termino) => {
    const datos = servicios.buscarUsuarios(termino);
    return datos.map(d => Usuario.fromJSON(d));
  },

  obtenerSuspendidos: () => {
    const datos = servicios.obtenerUsuariosSuspendidos();
    return datos.map(d => Usuario.fromJSON(d));
  },

  suspender: (id, fechaSuspension) => {
    const resultado = servicios.suspenderUsuario(id, fechaSuspension);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  reactivar: (id) => {
    const resultado = servicios.reactivarUsuario(id);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  eliminarSuspendido: (id) => {
    return servicios.eliminarUsuarioSuspendido(id);
  }
};
