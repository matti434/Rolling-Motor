import { useNavigate } from 'react-router-dom';
import './Categorias.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Row, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const imgCard = new URL('/Productos/imgCard.jpg', import.meta.url).href;
const ImgCascos = new URL('/Productos/ImgCascos.jpg', import.meta.url).href;
const ImgIndumentaria = new URL('/Productos/ImgIndumentaria.jpg', import.meta.url).href;
const ImgTaller = new URL('/Productos/ImgTaller.jpg', import.meta.url).href;

const Categorias = () => {
  const navigate = useNavigate();

  const animacionScroll = {
    initial: { opacity: 0, y: 80 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: "easeOut" },
    viewport: { once: false, amount: 0.3 }
  };

  const animacionHover = (direccion) => ({
    whileHover: { 
      x: direccion === "izquierda" ? -20 : 20,
      scale: 1.02,
      transition: { type: "spring", stiffness: 150, damping: 12 }
    }
  });

  const manejarClickCategoria = (categoria) => {
    navigate('/productos', { state: { categoriaSeleccionada: categoria } });
  };

  const manejarClickTaller = () => {
    navigate('/productos', { state: { categoriaSeleccionada: 'taller' } });
  };

  return (
    <div className="d-flex justify-content-center contenedor-principal">
      <div className="contenedor-tarjeta">
      <p className='fs-4 fw-semibold '>Nuestros servicios</p><hr />

        <motion.div 
          {...animacionScroll} 
          {...animacionHover("izquierda")}
          onClick={() => manejarClickCategoria('motocicletas')}
          className="cursor-pointer"
        >
          <Card className="p-0 border-0 shadow-sm overflow-hidden mb-4 tarjeta-hover altura-tarjeta">
            <div className="superposicion-hover"></div>
            <Row className="g-0 h-100 contenido-tarjeta">
              <Col md={6}>
                <div
                  className="w-100 h-100 imagen-tarjeta"
                  style={{ backgroundImage: `url(${imgCard})` }}
                ></div>
              </Col>
              <Col md={6}>
                <Card.Body className="cuerpo-tarjeta">
                  <Card.Title className="titulo-categoria">Motocicletas</Card.Title>
                  <Card.Text className="texto-descripcion">
                    Descubre nuestra amplia gama de motocicletas de alta calidad.
                  </Card.Text>
                  <div className="text-center">
                    <span className="boton-categoria">Ver productos</span>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <motion.div 
          {...animacionScroll} 
          {...animacionHover("derecha")}
          onClick={() => manejarClickCategoria('protecciones')}
          className="cursor-pointer"
        >
          <Card className="p-0 border-0 shadow-sm overflow-hidden mb-4 tarjeta-hover altura-tarjeta">
            <div className="superposicion-hover"></div>
            <Row className="g-0 h-100 contenido-tarjeta">
              <Col md={6} className="order-2 order-md-1">
                <Card.Body className="cuerpo-tarjeta">
                  <Card.Title className="titulo-categoria">Protecciones</Card.Title>
                  <Card.Text className="texto-descripcion">
                    Seguridad garantizada con productos certificados.
                  </Card.Text>
                  <div className="text-center">
                    <span className="boton-categoria">Ver productos</span>
                  </div>
                </Card.Body>
              </Col>
              <Col md={6} className="order-1 order-md-2">
                <div
                  className="w-100 h-100 imagen-tarjeta"
                  style={{ backgroundImage: `url(${ImgCascos})` }}
                ></div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <motion.div 
          {...animacionScroll} 
          {...animacionHover("izquierda")}
          onClick={() => manejarClickCategoria('indumentaria')}
          className="cursor-pointer"
        >
          <Card className="p-0 border-0 shadow-sm overflow-hidden mb-4 tarjeta-hover altura-tarjeta">
            <div className="superposicion-hover"></div>
            <Row className="g-0 h-100 contenido-tarjeta">
              <Col md={6}>
                <div
                  className="w-100 h-100 imagen-tarjeta"
                  style={{ backgroundImage: `url(${ImgIndumentaria})` }}
                ></div>
              </Col>
              <Col md={6}>
                <Card.Body className="cuerpo-tarjeta">
                  <Card.Title className="titulo-categoria">Indumentaria</Card.Title>
                  <Card.Text className="texto-descripcion">
                    Guantes, camperas, pantalones y más.
                  </Card.Text>
                  <div className="text-center">
                    <span className="boton-categoria">Ver productos</span>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>


        <motion.div 
          {...animacionScroll} 
          {...animacionHover("derecha")}
          onClick={manejarClickTaller}
          className="cursor-pointer"
        >
          <Card className="p-0 border-0 shadow-sm overflow-hidden mb-4 tarjeta-hover altura-tarjeta">
            <div className="superposicion-hover"></div>
            <Row className="g-0 h-100 contenido-tarjeta">
              <Col md={6} className="order-2 order-md-1">
                <Card.Body className="cuerpo-tarjeta">
                  <Card.Title className="titulo-categoria">Sección de Taller</Card.Title>
                  <Card.Text className="texto-descripcion">
                    Servicios completos con herramientas de última generación.
                  </Card.Text>
                  <div className="text-center">
                    <span className="boton-categoria">Ver servicios</span>
                  </div>
                </Card.Body>
              </Col>
              <Col md={6} className="order-1 order-md-2">
                <div
                  className="w-100 h-100 imagen-tarjeta"
                  style={{ backgroundImage: `url(${ImgTaller})` }}
                ></div>
              </Col>
            </Row>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Categorias;
