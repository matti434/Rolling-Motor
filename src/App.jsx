import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Componentes/Shared/Menu/Menu";
import Home from "./Componentes/Views/Home/Home";
import Pagina404 from "./Componentes/Views/Pagina404/Pagina404";
import Ofertas from "./Componentes/Views/Productos/Ofertas/Ofertas";
import PaginaProductos from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/PaginaProductos";
import Contacto from "./Componentes/Views/Contacto/Contacto";
import AdminPanel from "./Componentes/Admin/AdminPanel";
import RutaProtegida from "./Componentes/Utils/RutaProtegida";
import Productos from "./Componentes/Views/Productos/Productos";
import DetalleProducto from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto";
import Carrito from "./Componentes/Views/Productos/componenteCarrito/Carrito";
import Footer from "./Componentes/Shared/Footer/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { UserProvider } from "./Componentes/Context/ContextoUsuario";
import { ProveedorProductos } from "./Componentes/Context/ContextoProducto";
import { CarritoProvider } from "./Componentes/Context/ContextoCarrito";

function App() {

  return (
    <CarritoProvider>
      <ProveedorProductos>
        <UserProvider>
          <BrowserRouter>
            <Menu />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/productos" element={<PaginaProductos />} />
              <Route path="/productos-todos" element={<Productos />} />
              <Route path="/detalle-producto" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="*" element={<Pagina404 />} />
              <Route
                path="/admin"
                element={
                  <RutaProtegida>
                    <AdminPanel />
                  </RutaProtegida>
                }
              />
            </Routes>
            <Footer />
          </BrowserRouter>
        </UserProvider>
      </ProveedorProductos>
    </CarritoProvider>
  );
}

export default App;
