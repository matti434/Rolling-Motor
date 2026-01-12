import db from "../../../db.json";

export const inicializarLocalStorage = () => {
  try {
    if (!localStorage.getItem("usuarios")) {
      localStorage.setItem("usuarios", JSON.stringify(db.usuarios || []));
    }

    if (!localStorage.getItem("usuariosSuspendidos")) {
      localStorage.setItem("usuariosSuspendidos", JSON.stringify(db.usuariosSuspendidos || []));
    }

    if (!localStorage.getItem("productos")) {
      localStorage.setItem("productos", JSON.stringify(db.productos || []));
    }
  } catch (error) {
    console.error("Error al inicializar LocalStorage:", error);
  }
};
