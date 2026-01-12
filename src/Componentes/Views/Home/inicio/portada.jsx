import "./Portada.css";

const Portada = () => {
  return (
    <div className="portada-container mt-5 py-5">
      <div className="portada-imagen-wrapper">
        <img
          className="portada-imagen"
          src="Portada/Royal-Enfield-Classic-500-Pegasus-Edition-1.jpg"
          alt="Royal Enfield Moto"
        />
      </div>
      <h2 className="portada-titulo">
        UNA MOTOR QUE REALMENTE ESTÁ CONSTRUIDA COMO UN ARMA <br />Y VA COMO UNA
        BALA
      </h2>

      <p className="portada-descripcion">
        Al subirse a una moto de Rolling Motors, diseñado para reemplazar a la
        competencia, con un motor imparable, tanto que el acelerador a fondo te
        empuja hacia atrás con fuerza.
      </p>
    </div>
  );
};

export default Portada;
