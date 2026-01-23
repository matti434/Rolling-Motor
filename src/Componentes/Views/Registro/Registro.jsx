import { Modal } from "react-bootstrap";
import FormRegistro from "./FormRegistro/FormRegistro";
import { useRegistroViewModel } from "./useRegistroViewModel";
import "./Registro.css";

export const Registro = ({ onClose, onAbrirLogin }) => {
  const { registrarUsuario } = useRegistroViewModel({ onClose });

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
          onSubmit={registrarUsuario} 
          onClose={onClose} 
          onAbrirLogin={onAbrirLogin}
        />
      </Modal.Body>
    </Modal>
  );
};
