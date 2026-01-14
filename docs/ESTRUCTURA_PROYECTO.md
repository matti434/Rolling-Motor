# Estructura Completa del Proyecto - Rolling Motor

## 📁 Visión General

Este documento explica la estructura completa de carpetas del proyecto, el orden de los componentes, cómo funcionan y para qué sirve cada uno.

---

## 🗂️ Estructura de Carpetas Principal

```
src/
├── Componentes/          # Todos los componentes React
│   ├── Admin/           # Panel de administración
│   ├── Context/         # Contextos de React (Estado Global)
│   ├── Shared/          # Componentes compartidos
│   ├── Utils/           # Utilidades y helpers
│   └── Views/           # Vistas/Páginas principales
├── estilos/             # Variables CSS centralizadas
└── Servicios/           # Lógica de negocio y servicios
```

---

## 📂 Componentes/Admin/

**Propósito:** Funcionalidad exclusiva para administradores del sistema.

### Archivos:

#### `AdminPanel.jsx` + `AdminPanel.css`
**Función:** Panel principal de administración con múltiples vistas.

**Características:**
- Gestión de usuarios (ver, editar, suspender, reactivar, eliminar)
- Gestión de productos (CRUD completo)
- Estadísticas del sistema
- Vista de mapa de usuarios
- Formularios para agregar/editar productos
- Sistema de notas y recomendaciones

**Dependencias:**
- `ContextoUsuario` - Para gestión de usuarios
- `ContextoProducto` - Para gestión de productos
- `MapaUsuarios` - Componente de mapa

**Ruta:** `/admin` (protegida con `RutaProtegida`)

#### `MapaUsuarios.jsx`
**Función:** Mapa interactivo que muestra la ubicación geográfica de usuarios registrados.

**Características:**
- Usa React Leaflet para renderizar el mapa
- Muestra marcadores según el país de cada usuario
- Popups con información del usuario
- Coordenadas obtenidas de `CoordenadasPaises.js`

**Dependencias:**
- `react-leaflet` - Librería de mapas
- `CoordenadasPaises.js` - Coordenadas geográficas

**Uso:** Renderizado dentro de `AdminPanel` en la vista de usuarios.

---

## 📂 Componentes/Context/

**Propósito:** Gestión del estado global de la aplicación usando React Context API.

### Estructura:

```
Context/
├── ContextoUsuario.jsx          # Estado y funciones de usuarios
├── ContextoProducto.jsx          # Estado y funciones de productos
├── ContextoCarrito.jsx          # Estado y funciones del carrito
└── hooks/                       # Hooks modulares para ContextoUsuario
    ├── useAuth.js               # Autenticación
    ├── useUsuariosManagement.js # Gestión de usuarios
    └── useUsuarioData.js        # Consultas de usuarios
```

### `ContextoUsuario.jsx`

**Función:** Proveedor de contexto para gestión de usuarios y autenticación.

**Estado que gestiona:**
- `usuarios` - Lista de usuarios activos
- `usuariosSuspendidos` - Lista de usuarios suspendidos
- `usuarioActual` - Usuario logueado actualmente
- `cargando` - Estado de carga

**Funciones principales:**
- `login()` - Iniciar sesión
- `logout()` - Cerrar sesión
- `registrarUsuario()` - Registrar nuevo usuario
- `suspenderUsuario()` - Suspender usuario
- `reactivarUsuario()` - Reactivar usuario suspendido
- `editarUsuario()` - Editar datos de usuario
- `actualizarUsuarioActual()` - Actualizar perfil del usuario actual
- `buscarUsuarios()` - Buscar usuarios por término
- `cargarDatos()` - Cargar datos desde localStorage

**Hooks modulares:**
- `useAuthActions` - Autenticación (login, logout, registro)
- `useUsuariosManagement` - Gestión (suspender, reactivar, editar)
- `useUsuarioDataActions` - Consultas (obtenerPorId, buscar)

**Hook exportado:** `useUser()` - Para acceder al contexto

**Uso:**
```jsx
const { usuarioActual, login, logout } = useUser();
```

### `ContextoProducto.jsx`

**Función:** Proveedor de contexto para gestión de productos y filtrado.

**Estado que gestiona:**
- `productos` - Lista completa de productos
- `productosFiltrados` - Lista filtrada según criterios
- `filtros` - Estado de filtros activos
- `cargando` - Estado de carga
- `error` - Errores de carga

**Funciones principales:**
- `cargarProductos()` - Cargar productos desde localStorage
- `agregarProducto()` - Agregar nuevo producto
- `editarProducto()` - Editar producto existente
- `eliminarProducto()` - Eliminar producto
- `actualizarFiltros()` - Actualizar filtros de búsqueda
- `filtrarPorCategoria()` - Filtrar por categoría específica
- `obtenerCategoriasUnicas()` - Obtener lista de categorías
- `obtenerProductoPorId()` - Buscar producto por ID
- `obtenerEstadisticas()` - Estadísticas de productos

**Hook exportado:** `useProductos()` - Para acceder al contexto

**Uso:**
```jsx
const { productos, productosFiltrados, agregarProducto } = useProductos();
```

### `ContextoCarrito.jsx`

**Función:** Proveedor de contexto para el carrito de compras.

**Estado que gestiona:**
- `itemsCarrito` - Array de productos en el carrito

**Funciones principales:**
- `agregarAlCarrito()` - Agregar producto al carrito
- `eliminarDelCarrito()` - Eliminar producto del carrito
- `actualizarCantidad()` - Actualizar cantidad de un producto
- `vaciarCarrito()` - Vaciar todo el carrito
- `calcularSubtotal()` - Calcular subtotal
- `calcularTotalProductos()` - Calcular total de items
- `estaEnCarrito()` - Verificar si producto está en carrito
- `obtenerCantidadProducto()` - Obtener cantidad de un producto

**Persistencia:** Los datos se guardan automáticamente en localStorage (`carritoMotos`)

**Hook exportado:** `useCarrito()` - Para acceder al contexto

**Uso:**
```jsx
const { itemsCarrito, agregarAlCarrito } = useCarrito();
```

---

## 📂 Componentes/Shared/

**Propósito:** Componentes compartidos que se usan en múltiples partes de la aplicación.

### Estructura:

```
Shared/
├── Footer/
│   ├── Footer.jsx
│   └── Footer.css
└── Menu/
    ├── Menu.jsx
    └── NavBarPrincipal/
        ├── NavBarPrincipal.jsx
        ├── NavBarPrincipal.css
        └── menuUsuario/
            ├── MenuUsuario.jsx
            ├── MenuUsuario.css
            └── Perfil/
                ├── ModalPerfil.jsx
                └── ModalPerfil.css
```

### `Footer/Footer.jsx`

**Función:** Footer de la aplicación que se muestra en todas las páginas.

**Características:**
- Enlaces a secciones principales
- Información de contacto
- Redes sociales
- Información de la empresa

**Uso:** Renderizado en `App.jsx` fuera de las rutas.

### `Menu/Menu.jsx`

**Función:** Contenedor principal que gestiona la navegación y modales.

**Características:**
- Renderiza `NavBarPrincipal`
- Gestiona modales de login y registro
- Controla estado de modales según URL params (`?modal=login` o `?modal=registro`)
- Cierra modales al cambiar de ruta

**Uso:** Renderizado en `App.jsx` fuera de las rutas.

### `Menu/NavBarPrincipal/NavBarPrincipal.jsx`

**Función:** Barra de navegación principal.

**Características:**
- Enlaces a todas las secciones
- Selector de idioma (ES/EN) usando i18next
- Icono de carrito con contador de items
- Menú de usuario (si está logueado)
- Botones de login/registro (si no está logueado)
- Responsive con menú hamburguesa

**Dependencias:**
- `ContextoUsuario` - Para estado de usuario
- `ContextoCarrito` - Para contador del carrito
- `i18next` - Para internacionalización
- `MenuUsuario` - Menú desplegable de usuario

### `Menu/NavBarPrincipal/menuUsuario/MenuUsuario.jsx`

**Función:** Menú desplegable que aparece cuando el usuario está logueado.

**Características:**
- Opciones de perfil
- Opción de cerrar sesión
- Acceso al panel admin (si es admin)

### `Menu/NavBarPrincipal/menuUsuario/Perfil/ModalPerfil.jsx`

**Función:** Modal para editar perfil de usuario.

**Características:**
- Ver información del usuario
- Editar datos personales
- Cambiar contraseña
- Ver rol (admin/usuario)

---

## 📂 Componentes/Utils/

**Propósito:** Utilidades, helpers y funciones auxiliares.

### Archivos:

#### `RutaProtegida.jsx`
**Función:** Componente HOC (Higher Order Component) que protege rutas.

**Características:**
- Verifica si el usuario está autenticado
- Verifica si el usuario es administrador
- Muestra spinner mientras carga
- Redirige a home si no cumple condiciones

**Uso:**
```jsx
<RutaProtegida>
  <AdminPanel />
</RutaProtegida>
```

#### `inicializarLocalStorage.js`
**Función:** Inicializa localStorage con datos por defecto.

**Características:**
- Se ejecuta al iniciar la aplicación (en `main.jsx`)
- Carga datos desde `db.json` si localStorage está vacío
- Inicializa: usuarios, usuariosSuspendidos, productos

**Uso:** Llamado en `main.jsx` antes de renderizar la app.

#### `I18next.js`
**Función:** Configuración de internacionalización (i18next).

**Características:**
- Soporte para español e inglés
- Traducciones de textos de la aplicación
- Cambio dinámico de idioma

**Uso:** Importado en `main.jsx` para configuración global.

#### `ValidacionesForm.js`
**Función:** Funciones de validación para formularios.

**Características:**
- Validaciones de email
- Validaciones de contraseña
- Validaciones de campos requeridos
- Validaciones de formato

**Uso:** Usado en formularios de login, registro y contacto.

#### `ValidacionesBuscador.js`
**Función:** Funciones de validación para el buscador de productos.

**Características:**
- Validación de términos de búsqueda
- Sanitización de inputs
- Validación de rangos de precio

**Uso:** Usado en `BuscadorProducto.jsx`.

#### `CoordenadasPaises.js`
**Función:** Objeto con coordenadas geográficas de países.

**Características:**
- Mapeo de nombres de países a coordenadas [lat, lng]
- Usado para el mapa de usuarios en AdminPanel

**Uso:** Importado en `MapaUsuarios.jsx`.

---

## 📂 Componentes/Views/

**Propósito:** Vistas/Páginas principales de la aplicación. Cada carpeta representa una ruta.

### Estructura:

```
Views/
├── Contacto/              # Página de contacto
├── Home/                  # Página de inicio
├── Login/                 # Sistema de login
├── Nosotros/              # Página "Acerca de nosotros" (no en rutas)
├── Pagina404/            # Página de error 404
├── Productos/             # Sistema de productos
└── Registro/              # Sistema de registro
```

### `Home/Home.jsx`

**Función:** Página de inicio de la aplicación.

**Componentes que renderiza:**
- `Portada` - Banner/hero section
- `Galeria` - Galería de imágenes
- `Categorias` - Grid de categorías de productos

**Ruta:** `/`

**Subcomponentes:**
- `inicio/portada.jsx` - Banner principal
- `galeria/Galeria.jsx` - Galería de imágenes

### `Contacto/Contacto.jsx`

**Función:** Página de contacto con formulario.

**Características:**
- Formulario de contacto (EmailJS)
- Mapa de ubicación (Google Maps)
- Información de contacto
- Horarios de atención

**Ruta:** `/contacto`

### `Login/Login.jsx` + `FormLogin/FormLogin.jsx`

**Función:** Sistema de login.

**Características:**
- Modal de login (Bootstrap)
- Formulario con validaciones
- Integración con `ContextoUsuario`
- Redirección después de login
- Notificación especial para admins

**Ruta:** Modal (no es ruta directa, se abre con `?modal=login`)

### `Registro/Registro.jsx` + `FormRegistro/FormRegistro.jsx`

**Función:** Sistema de registro de usuarios.

**Características:**
- Modal de registro (Bootstrap)
- Formulario con validaciones
- Creación de nuevo usuario
- Auto-login después de registro

**Ruta:** Modal (no es ruta directa, se abre con `?modal=registro`)

### `Pagina404/Pagina404.jsx`

**Función:** Página de error 404 para rutas no encontradas.

**Ruta:** `*` (catch-all)

### `Productos/`

**Estructura compleja de productos:**

```
Productos/
├── componenteCarrito/
│   ├── Carrito.jsx          # Vista del carrito
│   └── Carrito.css
├── ComponenteProducto/
│   ├── Categorias/
│   │   ├── Categorias.jsx   # Grid de categorías
│   │   └── Categorias.css
│   └── PaginaProductos/
│       ├── PaginaProductos.jsx      # Página principal de catálogo
│       ├── card-Producto/
│       │   ├── CardProducto.jsx     # Tarjeta individual de producto
│       │   └── CardProducto.css
│       ├── componenteBuscarProducto/
│       │   ├── BuscadorProducto.jsx # Buscador y filtros
│       │   └── BuscadorProductos.css
│       ├── Detalle-Producto/
│       │   ├── DetalleProducto.jsx  # Vista detallada de producto
│       │   └── DetalleProducto.css
│       └── Lista-Productos/
│           ├── ListaProductos.jsx   # Lista de productos filtrados
│           └── ListaProducto.css
└── Ofertas/
    ├── Ofertas.jsx          # Página de ofertas
    ├── Ofertas.css
    └── OfertaItem.jsx        # Item individual de oferta
```

#### `componenteCarrito/Carrito.jsx`
**Ruta:** `/carrito`  
**Función:** Vista completa del carrito de compras con lista de productos, cantidades editables, totales y proceso de compra.

#### `ComponenteProducto/Categorias/Categorias.jsx`
**Ruta:** `/productos-todos` (también usado en Home)  
**Función:** Grid animado de categorías (Motocicletas, Cascos, Indumentaria, Taller) con navegación a productos.

#### `ComponenteProducto/PaginaProductos/PaginaProductos.jsx`
**Ruta:** `/productos`  
**Función:** Página principal del catálogo que combina buscador y lista de productos.

#### `ComponenteProducto/PaginaProductos/card-Producto/CardProducto.jsx`
**Función:** Tarjeta individual de producto con imagen, información y botones de acción.

#### `ComponenteProducto/PaginaProductos/componenteBuscarProducto/BuscadorProducto.jsx`
**Función:** Buscador y sistema de filtros (categoría, precio, marca, modelo, stock).

#### `ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto.jsx`
**Ruta:** `/detalle-producto`  
**Función:** Vista detallada de un producto individual con toda su información.

#### `ComponenteProducto/PaginaProductos/Lista-Productos/ListaProductos.jsx`
**Función:** Renderiza lista de productos filtrados usando `CardProducto`.

#### `Ofertas/Ofertas.jsx`
**Ruta:** `/ofertas`  
**Función:** Página de productos en oferta con countdown timer.

### `Nosotros/Nosotros.jsx`

**Estado:** ⚠️ NO está en rutas (no se usa actualmente)  
**Función:** Página "Acerca de nosotros" con información del equipo.

---

## 📂 estilos/

**Propósito:** Variables CSS centralizadas para todo el proyecto.

### `variables.css`

**Función:** Define todas las variables CSS (colores, sombras, opacidades) usadas en el proyecto.

**Variables principales:**
- Colores base: `--color-crema`, `--color-dorado`, `--color-oscuro`, etc.
- Colores de texto: `--color-texto-primario`, `--color-texto-dorado`, etc.
- Colores de fondo: `--color-fondo-primario`, `--color-fondo-card`, etc.
- Sombras: `--sombra-suave`, `--sombra-dorada`, etc.

**Uso:** Importado en `main.jsx` y en componentes que lo necesiten.

---

## 📂 Servicios/

**Propósito:** Lógica de negocio y servicios que interactúan con datos.

### `serviciosGenerales.js`

**Función:** Servicio principal que maneja todas las operaciones CRUD para usuarios y productos usando localStorage.

**Funciones de Usuarios:**
- `obtenerUsuarios()` - Obtener todos los usuarios
- `agregarUsuario()` - Agregar nuevo usuario
- `editarUsuario()` - Editar usuario existente
- `eliminarUsuario()` - Eliminar usuario
- `loginUsuario()` - Autenticar usuario
- `suspenderUsuario()` - Suspender usuario
- `reactivarUsuario()` - Reactivar usuario
- `buscarUsuarios()` - Buscar usuarios por término

**Funciones de Productos:**
- `obtenerProductos()` - Obtener todos los productos
- `agregarProducto()` - Agregar nuevo producto
- `editarProducto()` - Editar producto existente
- `eliminarProducto()` - Eliminar producto
- `obtenerProductoPorId()` - Buscar producto por ID
- `obtenerProductosDestacados()` - Obtener productos destacados
- `obtenerProductosConStock()` - Obtener productos con stock
- `obtenerProductosRecientes()` - Obtener productos recientes

**Uso:** Importado en los contextos para todas las operaciones de datos.

---

## 🔄 Flujo de la Aplicación

### 1. Inicialización (`main.jsx`)
1. Importa variables CSS globales
2. Llama a `inicializarLocalStorage()` para cargar datos por defecto
3. Configura i18next para idiomas
4. Configura toast notifications
5. Renderiza `App`

### 2. App Principal (`App.jsx`)
1. Envuelve la app con providers (orden importante):
   - `CarritoProvider` (más externo)
   - `ProveedorProductos`
   - `UserProvider` (más interno)
2. Configura React Router con todas las rutas
3. Renderiza `Menu` y `Footer` fuera de las rutas (siempre visibles)

### 3. Rutas Principales
- `/` → `Home` (Portada + Galería + Categorías)
- `/productos` → `PaginaProductos` (Catálogo con filtros)
- `/productos-todos` → `Categorias` (Grid de categorías)
- `/detalle-producto` → `DetalleProducto` (Detalle individual)
- `/ofertas` → `Ofertas` (Productos en oferta)
- `/carrito` → `Carrito` (Carrito de compras)
- `/contacto` → `Contacto` (Formulario de contacto)
- `/admin` → `AdminPanel` (protegido, solo admins)
- `*` → `Pagina404` (Ruta no encontrada)

---

## 📊 Orden de Importancia y Dependencias

### Nivel 1: Fundamentos
- `estilos/variables.css` - Variables globales
- `Servicios/serviciosGenerales.js` - Lógica de datos

### Nivel 2: Contextos (Estado Global)
- `Context/ContextoUsuario.jsx`
- `Context/ContextoProducto.jsx`
- `Context/ContextoCarrito.jsx`

### Nivel 3: Utilidades
- `Utils/inicializarLocalStorage.js`
- `Utils/I18next.js`
- `Utils/RutaProtegida.jsx`
- `Utils/Validaciones*.js`

### Nivel 4: Componentes Compartidos
- `Shared/Menu/`
- `Shared/Footer/`

### Nivel 5: Vistas/Páginas
- `Views/Home/`
- `Views/Productos/`
- `Views/Contacto/`
- etc.

### Nivel 6: Admin
- `Admin/AdminPanel.jsx`

---

## 🎯 Convenciones de Nombres

- **Componentes:** PascalCase (ej: `NavBarPrincipal.jsx`)
- **Archivos CSS:** Mismo nombre que el componente
- **Utilidades:** camelCase (ej: `inicializarLocalStorage.js`)
- **Rutas:** kebab-case (ej: `/detalle-producto`)
- **Variables CSS:** `--color-*` para colores, `--sombra-*` para sombras
- **Hooks:** `use*` (ej: `useUser`, `useProductos`)

---

## 📝 Notas Importantes

1. **Persistencia:** Todos los datos se guardan en localStorage (no hay backend real)
2. **Estado Global:** Se usa React Context API (no Redux)
3. **Routing:** React Router DOM para navegación
4. **Estilos:** Bootstrap React + CSS personalizado con variables
5. **Internacionalización:** i18next para ES/EN
6. **Notificaciones:** react-hot-toast para toasts
7. **Mapas:** React Leaflet para mapas interactivos
8. **Animaciones:** Framer Motion para animaciones

---

## 🔗 Dependencias Principales

- **React Router DOM** - Navegación
- **React Bootstrap** - Componentes UI
- **React Context API** - Estado global
- **React Hot Toast** - Notificaciones
- **React Leaflet** - Mapas
- **Framer Motion** - Animaciones
- **EmailJS** - Formulario de contacto
- **i18next** - Internacionalización
- **LocalStorage** - Persistencia de datos
