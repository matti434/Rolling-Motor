import * as servicios from '../Servicios/serviciosGenerales';
import { Producto } from '../Models/Producto';

export const productoService = {
  obtenerTodos: () => {
    const datos = servicios.obtenerProductos();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = servicios.obtenerProductoPorId(id);
    return dato ? Producto.fromJSON(dato) : null;
  },

  crear: (datos) => {
    const resultado = servicios.agregarProducto(datos);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  },

  actualizar: (id, datos) => {
    const resultado = servicios.editarProducto(id, datos);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  },

  eliminar: (id) => {
    return servicios.eliminarProducto(id);
  },

  obtenerDestacados: () => {
    const datos = servicios.obtenerProductosDestacados();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerConStock: () => {
    const datos = servicios.obtenerProductosConStock();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerRecientes: (limite = 5) => {
    const datos = servicios.obtenerProductosRecientes(limite);
    return datos.map(d => Producto.fromJSON(d));
  },

  actualizarStock: (id, tieneStock) => {
    const resultado = servicios.actualizarStockProducto(id, tieneStock);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  }
};
