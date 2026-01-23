import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import FormRegistro from "./FormRegistro/FormRegistro";
import { useUser } from "../../Context/ContextoUsuario";
import { usuarioService } from "../../../Services/usuarioService";
import "./Registro.css";

export const Registro = ({ onClose, onAbrirLogin }) => {
  const { setUsuarioActual } = useUser();

  const onSubmit = async (data) => {
    try {
      const resultado = usuarioService.registrar(data); // Usa Service (convierte a Model)

      if (resultado.exito) {
        toast.success("¡Registro exitoso! Bienvenido a Rolling Motors");
        
        // resultado.usuario es una instancia de Usuario (Model)
        setUsuarioActual(resultado.usuario.toJSON ? resultado.usuario.toJSON() : resultado.usuario); // Actualizar estado global
        onClose(); // Cerrar modal
      } else {
        toast.error(resultado.mensaje || "No se pudo registrar el usuario");
      }
    } catch (error) {
      console.error("Registro.jsx - Error:", error);
      toast.error("Error inesperado: " + error.message);
    }
  };

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-registro-personalizado"
    >
      <Modal.Header closeButton className="encabezado-modal-personalizado">
        <Modal.Title className="ms-auto">
          ¿Qué esperas para ser amante de Rolling Motors?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="cuerpo-modal-personalizado p-0">
        <FormRegistro 
          onSubmit={onSubmit} 
          onClose={onClose} 
          onAbrirLogin={onAbrirLogin}
        />
      </Modal.Body>
    </Modal>
  );
};
