import { Modal } from "react-bootstrap";
import { FormLogin } from "./FormLogin/FormLogin";
import { useLoginViewModel } from "./useLoginViewModel";
import "./Login.css";

const Login = ({ onClose, onAbrirRegistro }) => {
  const { iniciarSesion } = useLoginViewModel({ onClose });

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-login-personalizado"
    >
      <Modal.Header closeButton className="encabezado-modal-personalizado">
        <Modal.Title>Bienvenido de vuelta a Rolling Motors</Modal.Title>
      </Modal.Header>

      <Modal.Body className="cuerpo-modal-personalizado p-0">
        <FormLogin
          onSubmit={iniciarSesion}
          onClose={onClose}
          onAbrirRegistro={onAbrirRegistro}
        />
      </Modal.Body>
    </Modal>
  );
};

export default Login;
