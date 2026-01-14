import Categorias from '../Productos/ComponenteProducto/Categorias/Categorias';
import Galeria from './galeria/Galeria';
import Portada from './inicio/portada';
const Home = () => {
  return (
    <div>
      <Portada/>
      <Galeria/>
      <div className="mt-5 py-5">
        <Categorias/>
      </div>
    </div>
  )
}
export default Home