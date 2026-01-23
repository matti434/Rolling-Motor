
export const obtenerUsuarios = () => {
  const usuarios = localStorage.getItem("usuarios");
  return usuarios ? JSON.parse(usuarios) : [];
};

export const guardarUsuarios = (usuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

export const obtenerUsuarioPorId = (id) => {
  return obtenerUsuarios().find((u) => u.id === id);
};

// Persistencia pura - sin validaciones ni transformaciones
// Las validaciones y transformaciones están en usuarioService.js
export const agregarUsuario = (usuario) => {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  return { exito: true, usuario };
};

// Persistencia pura - sin validaciones
export const editarUsuario = (id, datosActualizados) => {
  const usuarios = obtenerUsuarios();
  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return { exito: false, mensaje: "Usuario no encontrado" };

  usuarios[index] = { ...usuarios[index], ...datosActualizados };
  guardarUsuarios(usuarios);
  return { exito: true, usuario: usuarios[index] };
};

export const eliminarUsuario = (id) => {
  const usuarios = obtenerUsuarios();
  const originalLength = usuarios.length;
  const nuevosUsuarios = usuarios.filter((u) => u.id !== id);
  guardarUsuarios(nuevosUsuarios);
  if (originalLength === nuevosUsuarios.length)
    return { exito: false, mensaje: "Usuario no encontrado" };
  return { exito: true };
};

export const obtenerUsuariosSuspendidos = () => {
  const suspendidos = localStorage.getItem("usuariosSuspendidos");
  return suspendidos ? JSON.parse(suspendidos) : [];
};

export const guardarUsuariosSuspendidos = (usuariosSuspendidos) => {
  localStorage.setItem("usuariosSuspendidos", JSON.stringify(usuariosSuspendidos));
};

export const suspenderUsuario = (id, fechaSuspension = new Date().toISOString()) => {
  const usuarios = obtenerUsuarios();
  const suspendidos = obtenerUsuariosSuspendidos();

  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return { exito: false, mensaje: "Usuario no encontrado" };

  const usuario = { ...usuarios[index], fechaSuspension };
  suspendidos.push(usuario);
  usuarios.splice(index, 1);

  guardarUsuarios(usuarios);
  guardarUsuariosSuspendidos(suspendidos);

  return { exito: true, usuario };
};

export const reactivarUsuario = (id) => {
  const usuarios = obtenerUsuarios();
  const suspendidos = obtenerUsuariosSuspendidos();

  const index = suspendidos.findIndex((u) => u.id === id);
  if (index === -1)
    return { exito: false, mensaje: "Usuario suspendido no encontrado" };

  const usuario = { ...suspendidos[index] };
  delete usuario.fechaSuspension;

  usuarios.push(usuario);
  suspendidos.splice(index, 1);

  guardarUsuarios(usuarios);
  guardarUsuariosSuspendidos(suspendidos);

  return { exito: true, usuario };
};

export const eliminarUsuarioSuspendido = (id) => {
  const suspendidos = obtenerUsuariosSuspendidos();
  const index = suspendidos.findIndex((u) => u.id === id);
  if (index === -1) return { exito: false, mensaje: "Usuario suspendido no encontrado" };

  suspendidos.splice(index, 1);
  guardarUsuariosSuspendidos(suspendidos);
  return { exito: true };
};


// Persistencia pura - la lógica de login está en usuarioService.js
export const loginUsuario = (credencial, contrasena) => {
  const usuarios = obtenerUsuarios();

  const usuario = usuarios.find((u) => {
    if (!u.email || !u.nombreDeUsuario) return false;

    const emailMatch = u.email.toLowerCase() === (credencial || "").toLowerCase();
    const nombreMatch = u.nombreDeUsuario.toLowerCase() === (credencial || "").toLowerCase();
    const passMatch = u.contrasena === contrasena;

    return (emailMatch || nombreMatch) && passMatch;
  });

  if (!usuario) {
    return { exito: false, mensaje: "Credenciales incorrectas" };
  }

  return { exito: true, usuario };
};

// Función eliminada - usar agregarUsuario directamente desde usuarioService

export const buscarUsuarios = (termino) => {
  const usuarios = obtenerUsuarios();
  if (!termino || termino.trim() === '') return usuarios;
  
  const busqueda = termino.toLowerCase();
  return usuarios.filter(u => 
    u.nombreDeUsuario?.toLowerCase().includes(busqueda) ||
    u.email?.toLowerCase().includes(busqueda) ||
    u.pais?.toLowerCase().includes(busqueda)
  );
};


export const obtenerProductos = () => {
  const productos = localStorage.getItem("productos");
  return productos ? JSON.parse(productos) : [];
};

export const guardarProductos = (productos) => {
  localStorage.setItem("productos", JSON.stringify(productos));
};

export const obtenerProductoPorId = (id) => {
  return obtenerProductos().find((p) => p.id === id);
};

// Persistencia pura - sin transformaciones
// Las transformaciones están en productoService.js
export const agregarProducto = (producto) => {
  const productos = obtenerProductos();
  productos.push(producto);
  guardarProductos(productos);
  return { exito: true, producto };
};

// Persistencia pura - sin transformaciones
export const editarProducto = (id, datosActualizados) => {
  const productos = obtenerProductos();
  const index = productos.findIndex((p) => p.id === id);
  if (index === -1) return { exito: false, mensaje: "Producto no encontrado" };

  productos[index] = {
    ...productos[index],
    ...datosActualizados,
  };
  guardarProductos(productos);
  return { exito: true, producto: productos[index] };
};

export const eliminarProducto = (id) => {
  const productos = obtenerProductos();
  const originalLength = productos.length;
  const nuevosProductos = productos.filter((p) => p.id !== id);
  guardarProductos(nuevosProductos);
  if (originalLength === nuevosProductos.length)
    return { exito: false, mensaje: "Producto no encontrado" };
  return { exito: true };
};

export const obtenerProductosDestacados = () => {
  return obtenerProductos().filter((p) => p.destacado);
};

export const obtenerProductosConStock = () => {
  return obtenerProductos().filter((p) => p.stock);
};

export const obtenerProductosRecientes = (limite = 5) => {
  return [...obtenerProductos()]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, limite);
};

// Función eliminada - usar editarProducto directamente desde productoService
