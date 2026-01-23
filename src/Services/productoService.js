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
    // Transformaciones y validaciones en Service (no en persistencia)
    const nuevoProducto = {
      ...datos,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
      stock: datos.stock !== undefined ? datos.stock : true,
      destacado: datos.destacado !== undefined ? datos.destacado : false,
      precio: datos.precio?.toString() || "0",
    };

    const resultado = servicios.agregarProducto(nuevoProducto);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  },

  actualizar: (id, datos) => {
    // Transformaciones en Service
    const datosActualizados = {
      ...datos,
      fechaModificacion: new Date().toISOString(),
      precio: datos.precio?.toString() || datos.precio,
    };

    const resultado = servicios.editarProducto(id, datosActualizados);
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
    // Usar editarProducto directamente (actualizarStockProducto fue eliminado)
    const producto = productoService.obtenerPorId(id);
    if (!producto) {
      return { exito: false, mensaje: "Producto no encontrado" };
    }
    
    const datosActualizados = { ...producto.toJSON(), stock: tieneStock };
    return productoService.actualizar(id, datosActualizados);
  }
};
