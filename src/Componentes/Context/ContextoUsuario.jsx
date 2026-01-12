import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import * as servicios from "../../Servicios/serviciosGenerales";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSuspendidos, setUsuariosSuspendidos] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  /** ---------- CARGA DE DATOS ---------- */
  const cargarDatos = useCallback(() => {
    try {
      setCargando(true);

      const dataUsuarios = servicios.obtenerUsuarios();
      const dataSuspendidos = servicios.obtenerUsuariosSuspendidos();

      setUsuarios(dataUsuarios);
      setUsuariosSuspendidos(dataSuspendidos);

      const ultimo = JSON.parse(localStorage.getItem("ultimoUsuario") || "null");
      if (ultimo) {
        const usuarioValido = dataUsuarios.find(u => u.id === ultimo.id);
        if (usuarioValido) {
          setUsuarioActual(usuarioValido);
        } else {
          localStorage.removeItem("ultimoUsuario");
        }
      }
    } catch {
      toast.error("Error al cargar usuarios desde LocalStorage");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  /** ---------- LOGIN ---------- */
  const login = useCallback((credenciales) => {
    // Usamos directamente el servicio que ya valida correctamente
    const resultado = servicios.loginUsuario(credenciales.credencial, credenciales.contrasena);

    if (resultado.exito) {
      const usuario = resultado.usuario;
      setUsuarioActual(usuario);
      localStorage.setItem("ultimoUsuario", JSON.stringify(usuario));
      toast.success(`Bienvenido ${usuario.nombreDeUsuario}`);

      return {
        login: true,
        usuario,
        esAdmin: usuario.role === "admin"
      };
    } else {
      toast.error(resultado.mensaje || "Credenciales incorrectas");
      return { login: false, mensaje: resultado.mensaje || "Credenciales incorrectas" };
    }
  }, []);

  /** ---------- LOGOUT ---------- */
  const logout = useCallback(() => {
    setUsuarioActual(null);
    localStorage.removeItem("ultimoUsuario");
    toast.success("Sesión cerrada");
  }, []);

  /** ---------- REGISTRO ---------- */
  const registrarUsuario = useCallback((datos) => {
    const nuevoUsuario = {
      id: crypto.randomUUID(),
      nombreDeUsuario: datos.nombreDeUsuario,
      email: datos.email,
      pais: datos.pais,
      fechaNacimiento: datos.fechaNacimiento,
      contrasena: datos.contrasena,
      role: "usuario"
    };

    const respuesta = servicios.agregarUsuario(nuevoUsuario);
    if (respuesta.exito) {
      setUsuarios(prev => [...prev, respuesta.usuario]);
      setUsuarioActual(respuesta.usuario);
      localStorage.setItem("ultimoUsuario", JSON.stringify(respuesta.usuario));
      toast.success("Usuario registrado exitosamente");
      return { registrado: true, usuario: respuesta.usuario, mensaje: "Registro exitoso" };
    } else {
      toast.error("Error al registrar usuario");
      return { registrado: false, mensaje: "Error al registrar usuario" };
    }
  }, []);

  /** ---------- SUSPENDER / REACTIVAR / ELIMINAR ---------- */
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
  }, [usuarios]);

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
  }, [usuariosSuspendidos]);

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
  }, [usuariosSuspendidos]);

  /** ---------- EDITAR USUARIO ---------- */
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
  }, [usuarioActual]);

  /** ---------- UTILES ---------- */
  const obtenerUsuarioPorId = useCallback((id) => servicios.obtenerUsuarioPorId(id), []);
  const buscarUsuarios = useCallback((termino) => servicios.buscarUsuarios(termino), [usuarios]);
  const actualizarUsuarioActual = useCallback((nuevosDatos) => {
    if (!usuarioActual) return;
    const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioActualizado));
    setUsuarios(prev => prev.map(u => u.id === usuarioActual.id ? usuarioActualizado : u));
    toast.success("Perfil actualizado");
  }, [usuarioActual]);

  const sincronizarConAPI = useCallback(() => {
    cargarDatos();
    return { exito: true, mensaje: "Datos sincronizados correctamente" };
  }, [cargarDatos]);

  return (
    <UserContext.Provider
      value={{
        usuarios,
        usuariosSuspendidos,
        usuarioActual,
        cargando,
        esAdministrador: usuarioActual?.role === "admin",
        estaAutenticado: !!usuarioActual,

        login,
        logout,
        registrarUsuario,
        suspenderUsuario,
        reactivarUsuario,
        eliminarUsuarioSuspendido,
        editarUsuario,
        obtenerUsuarioPorId,
        buscarUsuarios,
        sincronizarConAPI,
        cargarDatos,
        setUsuarioActual,
        actualizarUsuarioActual
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
