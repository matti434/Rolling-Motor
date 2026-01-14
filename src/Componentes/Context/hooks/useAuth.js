import { useCallback } from "react";
import toast from "react-hot-toast";
import * as servicios from "../../../Servicios/serviciosGenerales";

export const useAuthActions = (setUsuarioActual, setUsuarios) => {
  const login = useCallback((credenciales) => {
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
  }, [setUsuarioActual]);

  const logout = useCallback(() => {
    setUsuarioActual(null);
    localStorage.removeItem("ultimoUsuario");
    toast.success("Sesión cerrada");
  }, [setUsuarioActual]);

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
  }, [setUsuarioActual, setUsuarios]);

  return { login, logout, registrarUsuario };
};
