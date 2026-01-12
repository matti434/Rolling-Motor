import { FaGithub } from "react-icons/fa";
import "./Nosotros.css";

const integrantes = [
  {
    id: 1,
    nombre: "Integrante 1",
    rol: "Frontend Developer",
    descripcion:
      "Encargado del diseño visual, maquetación y experiencia de usuario.",
    foto: "/imagenes/integrante1.jpg",
    github: "https://github.com/usuario1",
  },
  {
    id: 2,
    nombre: "Integrante 2",
    rol: "Backend Developer",
    descripcion:
      "Responsable de la estructura del servidor, base de datos y lógica interna.",
    foto: "/imagenes/integrante2.jpg",
    github: "https://github.com/usuario2",
  },
  {
    id: 3,
    nombre: "Integrante 3",
    rol: "Fullstack Developer",
    descripcion:
      "Aporta en todas las áreas del proyecto, trabajando tanto en frontend como backend.",
    foto: "/imagenes/integrante3.jpg",
    github: "https://github.com/usuario3",
  },
  {
    id: 4,
    nombre: "Integrante 4",
    rol: "QA / Tester",
    descripcion:
      "Se encarga de pruebas, control de calidad y asegurar el funcionamiento óptimo.",
    foto: "/imagenes/integrante4.jpg",
    github: "https://github.com/usuario4",
  },
];

 const Nosotros = () => {
  return (
    <div className="nosotros-contenedor mt-5">
      <h1 className="titulo-nosotros">Nuestro Equipo</h1>

      <div className="grid-integrantes">
        {integrantes.map((persona) => (
          <div className="tarjeta-integrante" key={persona.id}>
            <img
              src={persona.foto}
              alt={persona.nombre}
              className="foto-integrante"
            />

            <h3>{persona.nombre}</h3>
            <p className="rol-integrante">{persona.rol}</p>
            <p className="descripcion-integrante">{persona.descripcion}</p>

            <a
              href={persona.github}
              target="_blank"
              className="link-github"
              rel="noopener noreferrer"
            >
              <FaGithub size={25} /> GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros