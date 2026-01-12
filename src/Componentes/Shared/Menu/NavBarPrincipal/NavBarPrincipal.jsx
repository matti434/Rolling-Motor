import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaGlobe,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaEnvelope,
  FaHeadset,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUser } from "../../../Context/ContextoUsuario";
import MenuUsuario from "./menuUsuario/MenuUsuario";
import { useTranslation } from "react-i18next";
import "../../../../estilos/variables.css";
import "./NavBarPrincipal.css";

export const NavBarPrincipal = ({ onAbrirRegistro, onAbrirLogin }) => {
  const { usuarioActual, logout } = useUser();
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
  };

  const obtenerTextoIdiomaActual = () => {
    return i18n.language === "es" ? "ES-EN" : "EN-ES";
  };

  const manejarCerrarSesion = () => {
    logout();
  };

  const manejarPerfil = () => {
    // Funcionalidad pendiente
  };

  const manejarContacto = () => {
    // Funcionalidad pendiente
  };

  const manejarSoporte = () => {
    // Funcionalidad pendiente
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      fixed="top"
      className="barra-navegacion-royal"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="marca-royal">
          <img
            src="Logo/logo_convertido.png"
            alt="Rolling Motors"
            height="40"
          />
        </Navbar.Brand>

        <Navbar.Collapse className="d-none d-md-flex">
          <Nav className="ms-auto align-items-center gap-3">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="dark"
                className="enlace-navegacion d-flex align-items-center border-0"
              >
                <FaGlobe className="me-1" /> {obtenerTextoIdiomaActual()}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => cambiarIdioma("es")}
                  className={i18n.language === "es" ? "active" : ""}
                >
                  🇪🇸 Español
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => cambiarIdioma("en")}
                  className={i18n.language === "en" ? "active" : ""}
                >
                  🇺🇸 English
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {usuarioActual ? (
              <MenuUsuario />
            ) : (
              <>
                <Nav.Link
                  onClick={onAbrirLogin}
                  className="enlace-navegacion d-flex align-items-center puntero-mano"
                >
                  <FaUser className="me-1" /> {t("login")}
                </Nav.Link>
                <button
                  onClick={onAbrirRegistro}
                  className="boton-registro rounded-pill px-3"
                >
                  {t("register")}
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex d-md-none align-items-center gap-2">
          <Nav.Link className="carrito-movil text-white">
            <FaShoppingCart size={18} />
          </Nav.Link>

          <Dropdown align="end">
            <Dropdown.Toggle variant="dark" className="boton-desplegable-movil">
              <FaBars size={18} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="menu-desplegable-movil">
              {usuarioActual ? (
                <>
                  <Dropdown.Item
                    className="item-desplegable"
                    onClick={manejarPerfil}
                  >
                    <FaUser className="me-2" /> {usuarioActual.nombreDeUsuario}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item-desplegable"
                    onClick={manejarPerfil}
                  >
                    <FaUser className="me-2" /> {t("profile")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item-desplegable"
                    onClick={manejarContacto}
                  >
                    <FaEnvelope className="me-2" /> {t("contact")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="item-desplegable"
                    onClick={manejarSoporte}
                  >
                    <FaHeadset className="me-2" /> {t("support")}
                  </Dropdown.Item>

                  {/* Selector de idioma - Móvil */}
                  <Dropdown.Divider />
                  <Dropdown.Item className="item-desplegable dropdown-submenu">
                    <FaGlobe className="me-2" /> {t("changeLanguage")}
                    <div className="mt-2">
                      <button
                        onClick={() => cambiarIdioma("es")}
                        className={`btn btn-sm me-1 ${
                          i18n.language === "es"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        ES
                      </button>
                      <button
                        onClick={() => cambiarIdioma("en")}
                        className={`btn btn-sm ${
                          i18n.language === "en"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Divider className="separador-desplegable" />
                  <Dropdown.Item
                    className="item-desplegable text-danger"
                    onClick={manejarCerrarSesion}
                  >
                    <FaSignOutAlt className="me-2" /> {t("logout")}
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item
                    className="item-desplegable"
                    onClick={onAbrirLogin}
                  >
                    <FaUser className="me-2" /> {t("login")}
                  </Dropdown.Item>
                  <Dropdown.Item className="item-desplegable dropdown-submenu">
                    <FaGlobe className="me-2" /> {t("changeLanguage")}
                    <div className="mt-2">
                      <button
                        onClick={() => cambiarIdioma("es")}
                        className={`btn btn-sm me-1 ${
                          i18n.language === "es"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        ES
                      </button>
                      <button
                        onClick={() => cambiarIdioma("en")}
                        className={`btn btn-sm ${
                          i18n.language === "en"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Divider className="separador-desplegable" />
                  <Dropdown.Item className="text-center">
                    <button
                      onClick={onAbrirRegistro}
                      className="boton-registro rounded-pill w-100"
                    >
                      {t("register")}
                    </button>
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};
