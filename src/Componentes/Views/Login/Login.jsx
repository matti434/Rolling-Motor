import { Modal } from "react-bootstrap";
import FormLogin from "./FormLogin/FormLogin";
import { useLoginViewModel } from "./useLoginViewModel";
import { useTranslation } from "react-i18next";
import "./Login.css";

const Login = ({ onClose, onAbrirRegistro }) => {
  const { iniciarSesion } = useLoginViewModel({ onClose });
  const { t } = useTranslation();

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
       <Modal.Title>{t('loginTitle')}</Modal.Title>
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
