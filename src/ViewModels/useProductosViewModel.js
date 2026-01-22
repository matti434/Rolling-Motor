import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductos } from '../Componentes/Context/ContextoProducto';

export const useProductosViewModel = () => {
  const location = useLocation();
  const {
    productosFiltrados,
    cargando,
    filtros,
    actualizarFiltros,
    filtrarPorCategoria,
    obtenerCategoriasUnicas,
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria
  } = useProductos();

  const [busquedaLocal, setBusquedaLocal] = useState('');

  useEffect(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  const productos = useMemo(() => productosFiltrados, [productosFiltrados]);
  
  const categorias = useMemo(() => obtenerCategoriasUnicas(), [obtenerCategoriasUnicas]);
  
  const tieneResultados = useMemo(() => productos.length > 0, [productos.length]);

  const buscar = useCallback((termino) => {
    setBusquedaLocal(termino);
    actualizarFiltros({ terminoBusqueda: termino });
  }, [actualizarFiltros]);

  const limpiarBusqueda = useCallback(() => {
    setBusquedaLocal('');
    actualizarFiltros({ terminoBusqueda: '' });
  }, [actualizarFiltros]);

  const aplicarCategoriaDesdeNavegacion = useCallback(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  return {
    productos,
    categorias,
    cargando,
    filtros,
    busquedaLocal,
    tieneResultados,
    buscar,
    limpiarBusqueda,
    actualizarFiltros,
    filtrarPorCategoria,
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria,
    aplicarCategoriaDesdeNavegacion
  };
};
