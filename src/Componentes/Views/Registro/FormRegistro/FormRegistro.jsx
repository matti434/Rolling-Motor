import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import {
  registroSchema,
  PAISES_VALIDOS,
} from "../../../Utils/ValidacionesForm";
import "./FormRegistro.css";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const FormRegistro = ({ onSubmit, onClose }) => {
  const { t } = useTranslation();

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [estaEnviando, setEstaEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registroSchema),
    mode: "onChange",
    defaultValues: {
      nombreDeUsuario: "",
      email: "",
      pais: "",
      fechaNacimiento: "",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const nombreDeUsuario = watch("nombreDeUsuario");
  const email = watch("email");
  const contrasena = watch("contrasena");
  const confirmarContrasena = watch("confirmarContrasena");

  useEffect(() => {
    if (errorGeneral) {
      setErrorGeneral(null);
    }
  }, [nombreDeUsuario, email, contrasena, confirmarContrasena]);

  const procesarEnvio = async (data) => {
    setEstaEnviando(true);
    setErrorGeneral(null);

    try {
      const esValido = await trigger();
      if (esValido) {
        await onSubmit?.(data);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrorGeneral(error.message || t("registerErrorMessage"));
    } finally {
      setEstaEnviando(false);
    }
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const toggleMostrarConfirmar = () => {
    setMostrarConfirmar(!mostrarConfirmar);
  };

  const limitarCaracteres = (e, maxLength) => {
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.slice(0, maxLength);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center py-4 py-md-5"
    >
      <Row className="w-100 justify-content-center mx-0">
        <Col xs={12} sm={11} md={10} lg={9} xl={8} className="px-3 px-md-4">
          <Form
            onSubmit={handleSubmit(procesarEnvio)}
            className="contenedor-formulario p-4 p-md-5 rounded"
            noValidate
          >
            <div className="text-center mb-4">
              <h4 className="texto-dorado mb-0">{t("registerTitle")}</h4>
              <p
                className="texto-blanco mt-2 mb-0"
                style={{ fontSize: "0.9rem" }}
              >
                {t("registerSubtitle")}
              </p>
            </div>

            {errorGeneral && (
              <div
                className="alert alert-danger alert-dismissible fade show mb-4"
                role="alert"
              >
                {errorGeneral}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorGeneral(null)}
                  aria-label={t("close")}
                ></button>
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="form-label mb-2 texto-dorado">
                {t("username")}
              </Form.Label>
              <Form.Control
                type="text"
                {...register("nombreDeUsuario")}
                maxLength={20}
                onInput={(e) => limitarCaracteres(e, 20)}
                isInvalid={!!errors.nombreDeUsuario}
                placeholder={t("usernamePlaceholder")}
                className="entrada-personalizada"
              />
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.nombreDeUsuario?.message}
              </Form.Control.Feedback>
              <div className="d-flex justify-content-end mt-1">
                <small className="texto-blanco">
                  {nombreDeUsuario?.length || 0}/20
                </small>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label mb-2 texto-dorado">
                {t("email")}
              </Form.Label>
              <Form.Control
                type="email"
                {...register("email")}
                maxLength={100}
                onInput={(e) => limitarCaracteres(e, 100)}
                isInvalid={!!errors.email}
                placeholder={t("emailPlaceholder")}
                className="entrada-personalizada"
              />
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label mb-2 texto-dorado">
                {t("country")}
              </Form.Label>
              <Form.Select
                {...register("pais")}
                isInvalid={!!errors.pais}
                className="entrada-personalizada"
              >
                <option value="">{t("selectCountry")}</option>
                {PAISES_VALIDOS.map((pais) => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.pais?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label mb-2 texto-dorado">
                {t("birthDate")}
              </Form.Label>
              <Form.Control
                type="date"
                {...register("fechaNacimiento")}
                isInvalid={!!errors.fechaNacimiento}
                className="entrada-personalizada"
                min="1955-01-01"
                max="2007-12-31"
              />
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.fechaNacimiento?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="form-label mb-0 texto-dorado">
                  {t("password")}
                </Form.Label>
                <small className="texto-blanco">
                  {contrasena?.length || 0}/50
                </small>
              </div>

              <div className="input-group">
                <Form.Control
                  type={mostrarContrasena ? "text" : "password"}
                  {...register("contrasena")}
                  maxLength={50}
                  onInput={(e) => limitarCaracteres(e, 50)}
                  isInvalid={!!errors.contrasena}
                  placeholder={t("passwordPlaceholder")}
                  className="entrada-personalizada"
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={toggleMostrarContrasena}
                  aria-label={
                    mostrarContrasena ? t("hidePassword") : t("showPassword")
                  }
                >
                  {mostrarContrasena ? (
                    <FaEyeSlash className="texto-dorado" />
                  ) : (
                    <FaEye className="texto-dorado" />
                  )}
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.contrasena?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="form-label mb-0 texto-dorado">
                  {t("confirmPassword")}
                </Form.Label>
                <small className="texto-blanco">
                  {confirmarContrasena?.length || 0}/50
                </small>
              </div>

              <div className="input-group">
                <Form.Control
                  type={mostrarConfirmar ? "text" : "password"}
                  {...register("confirmarContrasena")}
                  maxLength={50}
                  onInput={(e) => limitarCaracteres(e, 50)}
                  isInvalid={!!errors.confirmarContrasena}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="entrada-personalizada"
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={toggleMostrarConfirmar}
                  aria-label={
                    mostrarConfirmar ? t("hidePassword") : t("showPassword")
                  }
                >
                  {mostrarConfirmar ? (
                    <FaEyeSlash className="texto-dorado" />
                  ) : (
                    <FaEye className="texto-dorado" />
                  )}
                </button>
              </div>
              <Form.Control.Feedback type="invalid" className="d-block mt-1">
                {errors.confirmarContrasena?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="g-3 mt-4">
              <Col xs={12} sm={6}>
                <Button
                  variant="outline-light"
                  onClick={onClose}
                  type="button"
                  className="w-100 py-3 boton-personalizado boton-cancelar"
                  disabled={estaEnviando}
                >
                  {t("cancel")}
                </Button>
              </Col>

              <Col xs={12} sm={6}>
                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 py-3 boton-personalizado boton-enviar"
                  disabled={estaEnviando || !isValid || !isDirty}
                >
                  {estaEnviando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {t("registering")}
                    </>
                  ) : (
                    t("register")
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FormRegistro;
