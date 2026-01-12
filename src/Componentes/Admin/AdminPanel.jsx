import { useState, useEffect, useCallback } from "react";
import { useUser } from "../Context/ContextoUsuario";
import { useProductos } from "../Context/ContextoProducto";
import MapaUsuarios from "./MapaUsuarios";
import "../../estilos/variables.css"; // Importar variables CSS
import "./AdminPanel.css";

const AdminPanel = () => {
  const {
    usuarios,
    usuariosSuspendidos,
    esAdministrador,
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    sincronizarConAPI,
  } = useUser();

  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    cargarProductos,
    obtenerEstadisticas,
  } = useProductos();

  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [modoFormularioProducto, setModoFormularioProducto] =
    useState("agregar");
    
  const estadisticas = obtenerEstadisticas();

  const manejarSincronizacion = useCallback(async () => {
    const resultado = await sincronizarConAPI();
    alert(resultado.mensaje);
  }, [sincronizarConAPI]);

  useEffect(() => {
    if (vistaActiva === "productos") {
      cargarProductos();
    }
  }, [vistaActiva, cargarProductos]);

  const manejarEditarProducto = useCallback((producto) => {
    setProductoEditando(producto);
    setModoFormularioProducto("editar");
    setMostrarFormProducto(true);
  }, []);

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActual, setPedidoActual] = useState({
    id: null,
    titulo: "",
    descripcion: "",
  });
  const [modoPedido, setModoPedido] = useState("agregar");

  const manejarEliminarProducto = useCallback(
    async (id) => {
      if (
        window.confirm(
          "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        )
      ) {
        const resultado = await eliminarProducto(id);
        if (resultado.exito) {
          alert("✅ Producto eliminado correctamente");
        } else {
          alert("❌ Error: " + resultado.mensaje);
        }
      }
    },
    [eliminarProducto]
  );

  const ImagenProducto = ({ imagen, nombre }) => {
    const [error, setError] = useState(false);

    if (!imagen) {
      return <span className="sin-imagen">📷 Sin imagen</span>;
    }

    return (
      <div className="contenedor-imagen-tabla">
        {error ? (
          <div className="imagen-error">❌ Error</div>
        ) : (
          <img
            src={imagen}
            alt={nombre}
            onError={() => setError(true)}
            onClick={() => window.open(imagen, "_blank")}
            title="Click para ver imagen completa"
          />
        )}
      </div>
    );
  };

  if (!esAdministrador) {
    return (
      <div className="panel-administracion">
        <div className="acceso-denegado">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  const FormularioProducto = () => {
    const esEdicion = modoFormularioProducto === "editar";
    const producto = esEdicion ? productoEditando : null;

    const [datosFormulario, setDatosFormulario] = useState({
      nombre: producto?.nombre || "",
      precio: producto?.precio || "",
      descripcion: producto?.descripcion || "",
      categoria: producto?.categoria || "",
      marca: producto?.marca || "",
      modelo: producto?.modelo || "",
      año: producto?.año || "",
      kilometros: producto?.kilometros || "",
      ubicacion: producto?.ubicacion || "",
      imagen: producto?.imagen || "",
      destacado: producto?.destacado || false,
      stock: producto?.stock !== undefined ? producto.stock : true,
    });

    const [errorImagen, setErrorImagen] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const manejarEnvio = async (e) => {
      e.preventDefault();
      setEnviando(true);

      try {
        if (esEdicion) {
          const resultado = await editarProducto(
            productoEditando.id,
            datosFormulario
          );
          if (resultado.exito) {
            alert("✅ Producto actualizado correctamente");
          } else {
            alert("❌ Error: " + resultado.mensaje);
          }
        } else {
          const resultado = await agregarProducto(datosFormulario);
          if (resultado.exito) {
            alert("✅ Producto agregado correctamente");
          } else {
            alert("❌ Error: " + resultado.mensaje);
          }
        }

        cerrarFormulario();
      } catch (error) {
        alert("❌ Error inesperado: " + error.message);
      } finally {
        setEnviando(false);
      }
    };

    const cerrarFormulario = () => {
      setMostrarFormProducto(false);
      setProductoEditando(null);
      setModoFormularioProducto("agregar");
      setDatosFormulario({
        nombre: "",
        precio: "",
        descripcion: "",
        categoria: "",
        marca: "",
        modelo: "",
        año: "",
        kilometros: "",
        ubicacion: "",
        imagen: "",
        destacado: false,
        stock: true,
      });
      setErrorImagen(false);
    };

    return (
      <div className="superposicion-formulario">
        <div className="contenedor-formulario">
          <h3>{esEdicion ? "Editar Producto" : "Agregar Producto"}</h3>
          <form onSubmit={manejarEnvio}>
            <div className="campo-formulario">
              <label htmlFor="nombre">Nombre del producto *</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ejm: Motocicleta Yamaha MT-07"
                value={datosFormulario.nombre}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    nombre: e.target.value,
                  })
                }
                required
                disabled={enviando}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="precio">Precio (USD) *</label>
              <input
                id="precio"
                type="number"
                placeholder="Ejm: 999.99"
                value={datosFormulario.precio}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    precio: e.target.value,
                  })
                }
                required
                min="0"
                step="0.01"
                disabled={enviando}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                value={datosFormulario.categoria}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    categoria: e.target.value,
                  })
                }
                required
                disabled={enviando}
              >
                <option value="">Seleccione una categoría</option>
                <option value="motocicletas">Motocicletas</option>
                <option value="protecciones">Protecciones</option>
                <option value="indumentaria">Indumentaria</option>
                <option value="accesorios">Accesorios</option>
                <option value="repuestos">Repuestos</option>
              </select>
            </div>

            <div className="campo-formulario">
              <label htmlFor="imagen">URL de la imagen *</label>
              <input
                id="imagen"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={datosFormulario.imagen}
                onChange={(e) => {
                  setDatosFormulario({
                    ...datosFormulario,
                    imagen: e.target.value,
                  });
                  setErrorImagen(false);
                }}
                required
                disabled={enviando}
              />
              {datosFormulario.imagen && (
                <div className="vista-previa-imagen">
                  {errorImagen ? (
                    <div className="fallback-imagen">
                      ❌ Error al cargar la imagen
                    </div>
                  ) : (
                    <img
                      src={datosFormulario.imagen}
                      alt="Vista previa"
                      onError={() => setErrorImagen(true)}
                      onLoad={() => setErrorImagen(false)}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="grid-campos">
              <div className="campo-formulario">
                <label htmlFor="marca">Marca *</label>
                <input
                  id="marca"
                  type="text"
                  placeholder="Ejm: Yamaha, Honda, Kawasaki"
                  value={datosFormulario.marca}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      marca: e.target.value,
                    })
                  }
                  required
                  disabled={enviando}
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="modelo">Modelo *</label>
                <input
                  id="modelo"
                  type="text"
                  placeholder="Ejm: MT-07, CBR 600RR, Ninja 400"
                  value={datosFormulario.modelo}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      modelo: e.target.value,
                    })
                  }
                  required
                  disabled={enviando}
                />
              </div>
            </div>

            <div className="grid-campos">
              <div className="campo-formulario">
                <label htmlFor="año">Año</label>
                <input
                  id="año"
                  type="text"
                  placeholder="Ejm: 2023"
                  value={datosFormulario.año}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      año: e.target.value,
                    })
                  }
                  disabled={enviando}
                />
              </div>

              <div className="campo-formulario">
                <label htmlFor="kilometros">Kilómetros</label>
                <input
                  id="kilometros"
                  type="text"
                  placeholder="Ejm: 15,000 km"
                  value={datosFormulario.kilometros}
                  onChange={(e) =>
                    setDatosFormulario({
                      ...datosFormulario,
                      kilometros: e.target.value,
                    })
                  }
                  disabled={enviando}
                />
              </div>
            </div>

            <div className="campo-formulario">
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                type="text"
                placeholder="Ejm: Buenos Aires, Argentina"
                value={datosFormulario.ubicacion}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    ubicacion: e.target.value,
                  })
                }
                disabled={enviando}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                placeholder="Descripción detallada del producto, características, especificaciones técnicas..."
                value={datosFormulario.descripcion}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    descripcion: e.target.value,
                  })
                }
                required
                rows="4"
                disabled={enviando}
              />
            </div>

            <div className="grid-campos">
              <div className="campo-formulario">
                <label htmlFor="destacado" className="checkbox-label">
                  <input
                    id="destacado"
                    type="checkbox"
                    checked={datosFormulario.destacado}
                    onChange={(e) =>
                      setDatosFormulario({
                        ...datosFormulario,
                        destacado: e.target.checked,
                      })
                    }
                    disabled={enviando}
                  />
                  <span>Producto destacado</span>
                </label>
              </div>

              <div className="campo-formulario">
                <label htmlFor="stock" className="checkbox-label">
                  <input
                    id="stock"
                    type="checkbox"
                    checked={datosFormulario.stock}
                    onChange={(e) =>
                      setDatosFormulario({
                        ...datosFormulario,
                        stock: e.target.checked,
                      })
                    }
                    disabled={enviando}
                  />
                  <span>En stock</span>
                </label>
              </div>
            </div>

            <div className="botones-formulario">
              <button
                type="submit"
                className="boton-guardar"
                disabled={enviando}
              >
                {enviando
                  ? "⏳ Procesando..."
                  : esEdicion
                  ? "💾 Guardar Cambios"
                  : "➕ Agregar Producto"}
              </button>
              <button
                type="button"
                onClick={cerrarFormulario}
                className="boton-cancelar"
                disabled={enviando}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ModalEditarUsuario = () => {
    const [datosFormulario, setDatosFormulario] = useState({
      nombreDeUsuario: usuarioEditando.nombreDeUsuario,
      email: usuarioEditando.email,
      pais: usuarioEditando.pais,
      fechaNacimiento: usuarioEditando.fechaNacimiento,
    });

    const manejarEnvio = (e) => {
      e.preventDefault();
      editarUsuario(usuarioEditando.id, datosFormulario);
      setUsuarioEditando(null);
    };

    return (
      <div className="superposicion-formulario">
        <div className="contenedor-formulario">
          <h3>Editar Usuario</h3>
          <form onSubmit={manejarEnvio}>
            <div className="campo-formulario">
              <label htmlFor="nombreUsuario">Nombre de usuario *</label>
              <input
                id="nombreUsuario"
                type="text"
                value={datosFormulario.nombreDeUsuario}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    nombreDeUsuario: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="emailUsuario">Email *</label>
              <input
                id="emailUsuario"
                type="email"
                value={datosFormulario.email}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="paisUsuario">País *</label>
              <input
                id="paisUsuario"
                type="text"
                value={datosFormulario.pais}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    pais: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento *</label>
              <input
                id="fechaNacimiento"
                type="date"
                value={datosFormulario.fechaNacimiento}
                onChange={(e) =>
                  setDatosFormulario({
                    ...datosFormulario,
                    fechaNacimiento: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="botones-formulario">
              <button type="submit" className="boton-guardar">
                💾 Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setUsuarioEditando(null)}
                className="boton-cancelar"
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (cargando && vistaActiva === "productos") {
    return (
      <div className="panel-administracion">
        <div className="cargando">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-administracion">
      <header className="encabezado-administracion">
        <h1>Panel de Administración</h1>
        <nav className="navegacion-administracion">
          <button
            className={vistaActiva === "usuarios" ? "btn-activo" : ""}
            onClick={() => setVistaActiva("usuarios")}
          >
            👤 Usuarios ({usuarios.length})
          </button>

          <button
            className={vistaActiva === "suspendidos" ? "btn-activo" : ""}
            onClick={() => setVistaActiva("suspendidos")}
          >
            ⚠️ Suspendidos ({usuariosSuspendidos.length})
          </button>

          <button
            className={vistaActiva === "productos" ? "btn-activo" : ""}
            onClick={() => setVistaActiva("productos")}
          >
            📦 Productos ({productos.length})
          </button>

          <button
            className={vistaActiva === "mapa" ? "btn-activo" : ""}
            onClick={() => setVistaActiva("mapa")}
          >
            🌍 Mapa
          </button>
          <button onClick={() => setVistaActiva("recomendaciones")}>
            💬 Recomendaciones
          </button>
          <button onClick={() => setVistaActiva("pedidos")}>📦 Pedidos</button>
        </nav>

        <div className="controles-encabezado">
          <button className="boton-sincronizar" onClick={manejarSincronizacion}>
            🔄 Sincronizar con API
          </button>
        </div>
      </header>
      {vistaActiva === "usuarios" && (
        <div className="contenedor-tabla">
          <h2>👥 Usuarios Activos</h2>
          <div className="tabla-resumen">
            <div className="tarjeta-resumen">
              <span className="numero-resumen">
                {usuarios.filter((u) => u.role === "admin").length}
              </span>
              <span className="texto-resumen">Administradores</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">
                {usuarios.filter((u) => u.role === "user").length}
              </span>
              <span className="texto-resumen">Usuarios Normales</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">{usuarios.length}</span>
              <span className="texto-resumen">Total Activos</span>
            </div>
          </div>

          <div className="tabla-responsive">
            <table className="tabla-administracion">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>País</th>
                  <th>Fecha Nac</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td data-label="Usuario">
                      <div className="info-usuario">
                        <span className="nombre-usuario">
                          {u.nombreDeUsuario}
                        </span>
                      </div>
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Rol">
                      <span
                        className={`badge-rol ${
                          u.role === "admin" ? "badge-admin" : "badge-user"
                        }`}
                      >
                        {u.role === "admin" ? "👑 Admin" : "👤 Usuario"}
                      </span>
                    </td>
                    <td data-label="País">{u.pais || "No especificado"}</td>
                    <td data-label="Fecha Nac">
                      {new Date(u.fechaNacimiento).toLocaleDateString()}
                    </td>
                    <td data-label="Acciones">
                      <div className="acciones">
                        <button
                          className="boton-editar"
                          onClick={() => setUsuarioEditando(u)}
                          title="Editar usuario"
                        >
                          ✏️ Editar
                        </button>
                        {u.role !== "admin" && (
                          <button
                            className="boton-suspender"
                            onClick={() => suspenderUsuario(u.id)}
                            title="Suspender usuario"
                          >
                            ⚠️ Suspender
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuarios.length === 0 && (
              <div className="sin-datos">
                📭 No hay usuarios activos en el sistema
              </div>
            )}
          </div>
        </div>
      )}
      {vistaActiva === "suspendidos" && (
        <div className="contenedor-tabla">
          <h2>⚠️ Usuarios Suspendidos</h2>
          <div className="tabla-resumen">
            <div className="tarjeta-resumen">
              <span className="numero-resumen">
                {usuariosSuspendidos.length}
              </span>
              <span className="texto-resumen">Total Suspendidos</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">
                {
                  usuariosSuspendidos.filter((u) => {
                    const fechaSuspension = new Date(u.fechaSuspension);
                    const hoy = new Date();
                    const diffDias = Math.floor(
                      (hoy - fechaSuspension) / (1000 * 60 * 60 * 24)
                    );
                    return diffDias > 30;
                  }).length
                }
              </span>
              <span className="texto-resumen">Más de 30 días</span>
            </div>
          </div>

          <div className="tabla-responsive">
            <table className="tabla-administracion">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Fecha Suspensión</th>
                  <th>Días Suspendido</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosSuspendidos.map((u) => {
                  const fechaSuspension = new Date(u.fechaSuspension);
                  const hoy = new Date();
                  const diffDias = Math.floor(
                    (hoy - fechaSuspension) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={u.id}>
                      <td data-label="Usuario">
                        <div className="info-usuario">
                          <span className="nombre-usuario">
                            {u.nombreDeUsuario}
                          </span>
                          <span className="rol-usuario">{u.role}</span>
                        </div>
                      </td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Fecha Suspensión">
                        {fechaSuspension.toLocaleDateString()}
                      </td>
                      <td data-label="Días Suspendido">
                        <span
                          className={`badge-dias ${
                            diffDias > 30
                              ? "badge-peligro"
                              : "badge-advertencia"
                          }`}
                        >
                          {diffDias} días
                        </span>
                      </td>
                      <td data-label="Acciones">
                        <div className="acciones">
                          <button
                            className="boton-reactivar"
                            onClick={() => reactivarUsuario(u.id)}
                            title="Reactivar usuario"
                          >
                            ✅ Reactivar
                          </button>
                          <button
                            className="boton-eliminar"
                            onClick={() => eliminarUsuarioSuspendido(u.id)}
                            title="Eliminar permanentemente"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {usuariosSuspendidos.length === 0 && (
              <div className="sin-datos">✅ No hay usuarios suspendidos</div>
            )}
          </div>
        </div>
      )}
      {vistaActiva === "productos" && (
        <div className="contenedor-tabla">
          <div className="encabezado-productos">
            <h2>📦 Gestión de Productos</h2>
            <button
              className="boton-agregar"
              onClick={() => {
                setModoFormularioProducto("agregar");
                setMostrarFormProducto(true);
              }}
            >
              ➕ Agregar Producto
            </button>
          </div>

          <div className="tabla-resumen">
            <div className="tarjeta-resumen">
              <span className="numero-resumen">{estadisticas.total}</span>
              <span className="texto-resumen">Total Productos</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">
                $
                {productos
                  .reduce((total, p) => total + (parseFloat(p.precio) || 0), 0)
                  .toFixed(2)}
              </span>
              <span className="texto-resumen">Valor Total</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">{estadisticas.destacados}</span>
              <span className="texto-resumen">Destacados</span>
            </div>
            <div className="tarjeta-resumen">
              <span className="numero-resumen">{estadisticas.disponibles}</span>
              <span className="texto-resumen">En Stock</span>
            </div>
          </div>

          <div className="tabla-responsive">
            <table className="tabla-administracion">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Marca/Modelo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Imagen">
                      <ImagenProducto imagen={p.imagen} nombre={p.nombre} />
                    </td>
                    <td data-label="Nombre">
                      <div className="info-producto">
                        <strong className="nombre-producto">{p.nombre}</strong>
                        <div className="detalles-adicionales">
                          {p.año && <span className="detalle">📅 {p.año}</span>}
                          {p.kilometros && (
                            <span className="detalle">📏 {p.kilometros}</span>
                          )}
                          {p.ubicacion && (
                            <span className="detalle">📍 {p.ubicacion}</span>
                          )}
                        </div>
                        {p.descripcion && (
                          <div
                            className="descripcion-corta"
                            title={p.descripcion}
                          >
                            {p.descripcion.length > 60
                              ? `${p.descripcion.substring(0, 60)}...`
                              : p.descripcion}
                          </div>
                        )}
                      </div>
                    </td>
                    <td data-label="Precio">
                      <span className="precio-producto">
                        ${parseFloat(p.precio).toFixed(2)}
                      </span>
                    </td>
                    <td data-label="Categoría">
                      <span className="badge-categoria">{p.categoria}</span>
                    </td>
                    <td data-label="Marca/Modelo">
                      <div className="marca-modelo">
                        <span className="marca">{p.marca}</span>
                        <span className="modelo">{p.modelo}</span>
                      </div>
                    </td>
                    <td data-label="Estado">
                      <div className="estados-producto">
                        {p.destacado && (
                          <span
                            className="badge-destacado"
                            title="Producto destacado"
                          >
                            ⭐ Destacado
                          </span>
                        )}
                        {!p.stock && (
                          <span className="badge-sin-stock" title="Sin stock">
                            ⛔ Sin stock
                          </span>
                        )}
                        {p.stock && !p.destacado && (
                          <span className="badge-normal" title="Disponible">
                            ✅ Disponible
                          </span>
                        )}
                      </div>
                    </td>
                    <td data-label="Acciones">
                      <div className="acciones">
                        <button
                          className="boton-editar"
                          onClick={() => manejarEditarProducto(p)}
                          title="Editar producto"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="boton-eliminar"
                          onClick={() => manejarEliminarProducto(p.id)}
                          title="Eliminar producto"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productos.length === 0 && (
              <div className="sin-datos">
                📦 No hay productos registrados. ¡Agrega el primero!
              </div>
            )}
          </div>
        </div>
      )}
      ,
      {vistaActiva === "recomendaciones" && (
        <div className="contenedor-tabla">
          <h2>💬 Recomendaciones de Usuarios</h2>
          <h2>Notas</h2>


          <form
            className="form-comentario"
            onSubmit={(e) => {
              e.preventDefault();

              if (!nuevoComentario.trim()) return;

              setRecomendaciones([
                ...recomendaciones,
                { id: Date.now(), texto: nuevoComentario },
              ]);
              if (!nuevoComentario.trim()) return;
             if (modoEdicion) {
                setRecomendaciones(
                  recomendaciones.map((nota) =>
                    nota.id === notaEditando.id
                      ? { ...nota, texto: nuevoComentario }
                      : nota
                  )
                );

                setModoEdicion(false);
                setNotaEditando(null);
              } else {
                setRecomendaciones([
                  ...recomendaciones,
                  { id: Date.now(), texto: nuevoComentario },
                ]);
              }

              setNuevoComentario("");
            }}
          >
            <textarea
              className="input-textarea"
              placeholder="Escribe una nota..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
            />

            <button className="boton-agregar" type="submit">
              {modoEdicion ? "💾 Guardar Nota" : "➕ Añadir Nota"}
            </button>

            {modoEdicion && (
              <button
                className="boton-cancelar"
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setNotaEditando(null);
                  setNuevoComentario("");
                }}
              >
                ❌ Cancelar
              </button>
            )}
          </form>

          <div className="tabla-responsive">
            <table className="tabla-administracion">
              <thead>
                <tr>
                  <th>Comentario</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {recomendaciones.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Comentario">{r.texto}</td>

                    <td data-label="Acciones">
                      <button
                        className="boton-editar"
                        onClick={() => {
                          setModoEdicion(true);
                          setNotaEditando(r);
                          setNuevoComentario(r.texto);
                        }}
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="boton-eliminar"
                        onClick={() =>
                          setRecomendaciones(
                            recomendaciones.filter((x) => x.id !== r.id)
                          )
                        }
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {recomendaciones.length === 0 && (
              <div className="sin-datos">📭 No hay notas aún</div>
            )}
          </div>
        </div>
      )}
      ,
      {vistaActiva === "pedidos" && (
        <div className="contenedor-tabla">
          <h2>📦 Gestión de Pedidos del Administrador</h2>
          <form
            className="form-comentario"
            onSubmit={(e) => {
              e.preventDefault();
              if (modoPedido === "agregar") {
                setPedidos([
                  ...pedidos,
                  {
                    id: Date.now(),
                    titulo: pedidoActual.titulo,
                    descripcion: pedidoActual.descripcion,
                  },
                ]);
              } else {
                setPedidos(
                  pedidos.map((p) =>
                    p.id === pedidoActual.id ? pedidoActual : p
                  )
                );
              }
              setPedidoActual({ id: null, titulo: "", descripcion: "" });
              setModoPedido("agregar");
            }}
          >
            <input
              type="text"
              placeholder="Título del pedido"
              className="input-textarea"
              value={pedidoActual.titulo}
              onChange={(e) =>
                setPedidoActual({ ...pedidoActual, titulo: e.target.value })
              }
            />
            <textarea
              placeholder="Descripción del pedido"
              className="input-textarea"
              value={pedidoActual.descripcion}
              onChange={(e) =>
                setPedidoActual({
                  ...pedidoActual,
                  descripcion: e.target.value,
                })
              }
            />

            <button className="boton-agregar" type="submit">
              {modoPedido === "agregar"
                ? "➕ Crear pedido"
                : "✏️ Guardar cambios"}
            </button>
          </form>
          <div className="tabla-responsive">
            <table className="tabla-administracion">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Titulo">{p.titulo}</td>
                    <td data-label="Descripción">{p.descripcion}</td>
                    <td data-label="Acciones">
                      <button
                        className="boton-editar"
                        onClick={() => {
                          setPedidoActual(p);
                          setModoPedido("editar");
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="boton-eliminar"
                        onClick={() =>
                          setPedidos(pedidos.filter((x) => x.id !== p.id))
                        }
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pedidos.length === 0 && (
              <div className="sin-datos">No hay pedidos creados</div>
            )}
          </div>
        </div>
      )}
      {usuarioEditando && <ModalEditarUsuario />}
      {mostrarFormProducto && <FormularioProducto />}
      {vistaActiva === "mapa" && <MapaUsuarios />}
    </div>
  );
};

export default AdminPanel;
