import { useCallback } from "react";
import * as servicios from "../../../Servicios/serviciosGenerales";

export const useUsuarioDataActions = () => {
  const obtenerUsuarioPorId = useCallback((id) => servicios.obtenerUsuarioPorId(id), []);
  const buscarUsuarios = useCallback((termino) => servicios.buscarUsuarios(termino), []);

  return { obtenerUsuarioPorId, buscarUsuarios };
};
