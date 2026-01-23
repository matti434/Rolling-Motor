import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as servicios from "../../Servicios/serviciosGenerales";
import { productoService } from "../../Services/productoService";

const ContextoProducto = createContext();

export const useProductos = () => {
  const context = useContext(ContextoProducto);
  if (!context) {
    throw new Error(
      "useProductos debe ser usado dentro de un ProveedorProductos"
    );
  }
  return context;
};

export const ProveedorProductos = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: "",
    terminoBusqueda: "",
    precioMin: "",
    precioMax: "",
    marca: "",
    modelo: "",
    destacado: "",
    stock: "",
  });

  const cargarProductos = useCallback(() => {
    try {
      setCargando(true);
      setError(null);

      const datos = servicios.obtenerProductos();
      setProductos(datos);
    } catch {
      setError("Error al cargar los productos desde LocalStorage");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const productosFiltrados = productos.filter((producto) => {
    if (filtros.categoria && producto.categoria) {
      if (producto.categoria.toLowerCase() !== filtros.categoria.toLowerCase())
        return false;
    }

    if (filtros.terminoBusqueda) {
      const termino = filtros.terminoBusqueda.toLowerCase();
      const coincideNombre = producto.nombre?.toLowerCase().includes(termino);
      const coincideMarca = producto.marca?.toLowerCase().includes(termino);
      const coincideModelo = producto.modelo?.toLowerCase().includes(termino);
      const coincideDescripcion = producto.descripcion
        ?.toLowerCase()
        .includes(termino);
      if (
        !(
          coincideNombre ||
          coincideMarca ||
          coincideModelo ||
          coincideDescripcion
        )
      )
        return false;
    }

    const precioProducto = parseFloat(producto.precio) || 0;
    if (filtros.precioMin && precioProducto < parseFloat(filtros.precioMin))
      return false;
    if (filtros.precioMax && precioProducto > parseFloat(filtros.precioMax))
      return false;

    if (
      filtros.marca &&
      producto.marca?.toLowerCase() !== filtros.marca.toLowerCase()
    )
      return false;
    if (
      filtros.modelo &&
      producto.modelo?.toLowerCase() !== filtros.modelo.toLowerCase()
    )
      return false;

    if (filtros.destacado !== "") {
      if ((producto.destacado?.toString() || "false") !== filtros.destacado)
        return false;
    }

    if (filtros.stock !== "") {
      if ((producto.stock?.toString() || "true") !== filtros.stock)
        return false;
    }

    return true;
  });

  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      categoria: "",
      terminoBusqueda: "",
      precioMin: "",
      precioMax: "",
      marca: "",
      modelo: "",
      destacado: "",
      stock: "",
    });
  }, []);

  const filtrarPorCategoria = useCallback((categoria) => {
    setFiltros((prev) => ({ ...prev, categoria }));
  }, []);

  const obtenerCategoriasUnicas = useCallback(() => {
    const categorias = productos
      .map((p) => p.categoria)
      .filter((c) => c && c.trim() !== "");
    return [...new Set(categorias)];
  }, [productos]);

  const obtenerMarcasPorCategoria = useCallback(
    (categoria) => {
      const productosCategoria = categoria
        ? productos.filter((p) => p.categoria === categoria)
        : productos;
      const marcas = productosCategoria
        .map((p) => p.marca)
        .filter((m) => m && m.trim() !== "");
      return [...new Set(marcas)];
    },
    [productos]
  );

  const obtenerProductosPorCategoria = useCallback(
    (categoria) => {
      if (!categoria) return productos;
      return productos.filter(
        (p) => p.categoria?.toLowerCase() === categoria.toLowerCase()
      );
    },
    [productos]
  );

  const obtenerEstadisticas = useCallback(() => {
    const productosPorCategoria = {};
    const productosPorMarca = {};

    productos.forEach((p) => {
      const categoria = p.categoria || "Sin categoría";
      productosPorCategoria[categoria] =
        (productosPorCategoria[categoria] || 0) + 1;

      const marca = p.marca || "Sin marca";
      productosPorMarca[marca] = (productosPorMarca[marca] || 0) + 1;
    });

    return {
      total: productos.length,
      porCategoria: productosPorCategoria,
      porMarca: productosPorMarca,
      disponibles: productos.filter((p) => p.stock).length,
      sinStock: productos.filter((p) => !p.stock).length,
      destacados: productos.filter((p) => p.destacado).length,
      categoriasUnicas: Object.keys(productosPorCategoria).length,
      marcasUnicas: Object.keys(productosPorMarca).length,
    };
  }, [productos]);

  const obtenerRangoPrecios = useCallback(() => {
    if (!productos.length) return { min: 0, max: 0, promedio: 0 };
    const precios = productos.map((p) => parseFloat(p.precio) || 0);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios),
      promedio: precios.reduce((a, b) => a + b, 0) / precios.length,
    };
  }, [productos]);

  const buscarSugerencias = useCallback(
    (termino) => {
      if (!termino || termino.length < 2) return [];
      const busqueda = termino.toLowerCase();
      return productos
        .filter(
          (p) =>
            p.nombre?.toLowerCase().includes(busqueda) ||
            p.marca?.toLowerCase().includes(busqueda) ||
            p.modelo?.toLowerCase().includes(busqueda)
        )
        .slice(0, 5);
    },
    [productos]
  );

  const agregarProducto = useCallback((producto) => {
    const respuesta = servicios.agregarProducto(producto);
    if (respuesta.exito) {
      setProductos((prev) => [...prev, respuesta.producto]);
    }
    return respuesta;
  }, []);

  const editarProducto = useCallback((id, datosActualizados) => {
    const respuesta = servicios.editarProducto(id, datosActualizados);
    if (respuesta.exito) {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? respuesta.producto : p))
      );
    }
    return respuesta;
  }, []);

  const eliminarProducto = useCallback((id) => {
    const respuesta = servicios.eliminarProducto(id);
    if (respuesta.exito) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
    return respuesta;
  }, []);

  const obtenerProductoPorId = useCallback((id) => {
    return servicios.obtenerProductoPorId(id);
  }, []);

  const obtenerProductosDestacados = useCallback(() => {
    return servicios.obtenerProductosDestacados();
  }, []);

  const obtenerProductosConStock = useCallback(() => {
    return servicios.obtenerProductosConStock();
  }, []);

  const obtenerProductosRecientes = useCallback((limite = 5) => {
    return servicios.obtenerProductosRecientes(limite);
  }, []);

  const actualizarStockProducto = useCallback((id, tieneStock) => {
    // Usa productoService que tiene la lógica
    const respuesta = productoService.actualizarStock(id, tieneStock);
    if (respuesta.exito) {
      const productoJSON = respuesta.producto.toJSON ? respuesta.producto.toJSON() : respuesta.producto;
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? productoJSON : p))
      );
    }
    return respuesta;
  }, []);

  const valorContexto = {
    productos,
    productosFiltrados,
    cargando,
    error,
    filtros,

    actualizarFiltros,
    limpiarFiltros,
    filtrarPorCategoria,

    obtenerCategoriasUnicas,
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria,
    obtenerEstadisticas,
    obtenerRangoPrecios,
    buscarSugerencias,
    obtenerProductoPorId,
    obtenerProductosDestacados,
    obtenerProductosConStock,
    obtenerProductosRecientes,

    cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    actualizarStockProducto,
  };

  return (
    <ContextoProducto.Provider value={valorContexto}>
      {children}
    </ContextoProducto.Provider>
  );
};
