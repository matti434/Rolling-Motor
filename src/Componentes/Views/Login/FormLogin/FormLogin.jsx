import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { loginSchema } from "../../../Utils/ValidacionesForm";
import "./FormLogin.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const FormLogin = ({ onSubmit, onClose, onAbrirRegistro }) => {
  const { t } = useTranslation();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
    reset
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { credencial: "", contrasena: "" }
  });

  const credencial = watch("credencial");
  const contrasena = watch("contrasena");

  useEffect(() => {
    if (errorGeneral) setErrorGeneral(null);
  }, [credencial, contrasena]);

  const procesarEnvio = async (data) => {
    setEstaEnviando(true);
    setErrorGeneral(null);

    const esValido = await trigger();
    if (!esValido) {
      setEstaEnviando(false);
      return;
    }

    // Pasamos solo credencial y contraseña al onSubmit
    try {
      await onSubmit?.({
        credencial: data.credencial,
        contrasena: data.contrasena
      });
    } catch (error) {
      console.error("Error en login:", error);
      setErrorGeneral("Error inesperado. Intente nuevamente.");
    } finally {
      setEstaEnviando(false);
    }
  };

  const toggleMostrarContrasena = () => setMostrarContrasena(!mostrarContrasena);

  const limitarCaracteres = (e, maxLength) => {
    if (e.target.value.length > maxLength) e.target.value = e.target.value.slice(0, maxLength);
  };

  const manejarClickRegistro = (e) => {
    e.preventDefault();
    reset();
    onAbrirRegistro?.();
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center py-4 py-md-5">
      <Row className="w-100 justify-content-center mx-0">
        <Col xs={12} sm={11} md={10} lg={9} xl={8} className="px-3 px-md-4">
          <Form onSubmit={handleSubmit(procesarEnvio)} className="contenedor-formulario p-4 p-md-5 rounded" noValidate>
            <div className="text-center mb-4">
              <h4 className="texto-dorado mb-0">{t("loginTitle")}</h4>
              <p className="texto-blanco mt-2 mb-0" style={{ fontSize: "0.9rem" }}>{t("loginSubtitle")}</p>
            </div>

            {errorGeneral && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                {errorGeneral}
                <button type="button" className="btn-close" onClick={() => setErrorGeneral(null)} aria-label={t("close")}></button>
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="form-label mb-2 texto-dorado">{t("usernameOrEmail")}</Form.Label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-transparent border-end-0"><FaUser className="texto-dorado" /></span>
                <Form.Control
                  type="text"
                  {...register("credencial")}
                  maxLength={100}
                  onInput={(e) => limitarCaracteres(e, 100)}
                  isInvalid={!!errors.credencial}
                  placeholder={t("usernameOrEmailPlaceholder")}
                  className="entrada-personalizada border-start-0"
                />
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">{errors.credencial?.message}</Form.Control.Feedback>
              <div className="d-flex justify-content-end mt-1"><small className="texto-blanco">{credencial?.length || 0}/100</small></div>
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="form-label mb-0 texto-dorado">{t("password")}</Form.Label>
                <small className="texto-blanco">{contrasena?.length || 0}/50</small>
              </div>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-transparent border-end-0"><FaLock className="texto-dorado" /></span>
                <Form.Control
                  type={mostrarContrasena ? "text" : "password"}
                  {...register("contrasena")}
                  maxLength={50}
                  onInput={(e) => limitarCaracteres(e, 50)}
                  isInvalid={!!errors.contrasena}
                  placeholder={t("passwordPlaceholder")}
                  className="entrada-personalizada border-start-0"
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent border-start-0"
                  onClick={toggleMostrarContrasena}
                  aria-label={mostrarContrasena ? t("hidePassword") : t("showPassword")}
                >
                  {mostrarContrasena ? <FaEyeSlash className="texto-dorado" /> : <FaEye className="texto-dorado" />}
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">{errors.contrasena?.message}</Form.Control.Feedback>
            </Form.Group>

            <div className="text-end mb-4">
              <a href="#" className="enlace-dorado text-decoration-none" onClick={(e) => e.preventDefault()}>{t("forgotPassword")}</a>
            </div>

            <Row className="g-3 mt-4">
              <Col xs={12} sm={6}>
                <Button variant="outline-light" onClick={onClose} type="button" className="w-100 py-3 boton-personalizado boton-cancelar" disabled={estaEnviando}>{t("cancel")}</Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button variant="warning" type="submit" className="w-100 py-3 boton-personalizado boton-enviar" disabled={estaEnviando || !isValid || !isDirty}>
                  {estaEnviando ? <><span className="spinner-border spinner-border-sm me-2"></span>{t("loggingIn")}</> : t("login")}
                </Button>
              </Col>
            </Row>

            <div className="text-center mt-4 pt-3 border-top border-secondary">
              <Button variant="outline-warning" onClick={manejarClickRegistro} className="w-100 py-2 boton-registro" disabled={estaEnviando}>{t("createAccount")}</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FormLogin;
