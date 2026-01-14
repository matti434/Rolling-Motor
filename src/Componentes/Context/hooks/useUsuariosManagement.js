import { useCallback } from "react";
import toast from "react-hot-toast";
import * as servicios from "../../../Servicios/serviciosGenerales";

export const useUsuariosManagement = (
  usuarios,
  usuariosSuspendidos,
  usuarioActual,
  setUsuarios,
  setUsuariosSuspendidos,
  setUsuarioActual
) => {
  const suspenderUsuario = useCallback((id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return toast.error("Usuario no encontrado");
    if (usuario.role === "admin") return toast.error("El administrador no puede ser suspendido");

    const respuesta = servicios.suspenderUsuario(id);
    if (respuesta.exito) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setUsuariosSuspendidos(prev => [...prev, respuesta.usuario]);
      toast.success(`Usuario ${usuario.nombreDeUsuario} suspendido`);
    } else {
      toast.error("Error al suspender usuario");
    }
  }, [usuarios, setUsuarios, setUsuariosSuspendidos]);

  const reactivarUsuario = useCallback((id) => {
    const usuario = usuariosSuspendidos.find(u => u.id === id);
    if (!usuario) return toast.error("Usuario no encontrado");

    const respuesta = servicios.reactivarUsuario(id);
    if (respuesta.exito) {
      setUsuariosSuspendidos(prev => prev.filter(u => u.id !== id));
      setUsuarios(prev => [...prev, respuesta.usuario]);
      toast.success(`Usuario ${usuario.nombreDeUsuario} reactivado`);
    } else {
      toast.error("Error al reactivar usuario");
    }
  }, [usuariosSuspendidos, setUsuarios, setUsuariosSuspendidos]);

  const eliminarUsuarioSuspendido = useCallback((id) => {
    const usuario = usuariosSuspendidos.find(u => u.id === id);
    if (!usuario) return;

    if (usuario.role === "admin") return toast.error("El administrador no puede ser eliminado");

    const confirmar = window.confirm(`¿Eliminar permanentemente a "${usuario.nombreDeUsuario}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return toast.info("Eliminación cancelada");

    const respuesta = servicios.eliminarUsuarioSuspendido(id);
    if (respuesta.exito) {
      setUsuariosSuspendidos(prev => prev.filter(u => u.id !== id));
      toast.success(`Usuario ${usuario.nombreDeUsuario} eliminado permanentemente`);
    } else {
      toast.error("Error al eliminar usuario");
    }
  }, [usuariosSuspendidos, setUsuariosSuspendidos]);

  const editarUsuario = useCallback((id, nuevosDatos) => {
    const respuesta = servicios.editarUsuario(id, nuevosDatos);
    if (respuesta.exito) {
      setUsuarios(prev => prev.map(u => u.id === id ? respuesta.usuario : u));
      if (usuarioActual && usuarioActual.id === id) {
        setUsuarioActual(respuesta.usuario);
        localStorage.setItem("ultimoUsuario", JSON.stringify(respuesta.usuario));
      }
      toast.success("Usuario actualizado");
    } else {
      toast.error("Error al actualizar usuario");
    }
  }, [usuarioActual, setUsuarios, setUsuarioActual]);

  const actualizarUsuarioActual = useCallback((nuevosDatos) => {
    if (!usuarioActual) return;
    const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioActualizado));
    setUsuarios(prev => prev.map(u => u.id === usuarioActual.id ? usuarioActualizado : u));
    toast.success("Perfil actualizado");
  }, [usuarioActual, setUsuarioActual, setUsuarios]);

  return {
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    actualizarUsuarioActual
  };
};
