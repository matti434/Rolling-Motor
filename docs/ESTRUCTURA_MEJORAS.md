# Análisis de Estructura de Carpetas - Rolling Motor

## Problemas Identificados

### 1. Archivos No Utilizados
- ❌ `src/Componentes/Utils/UsuarioStorage.js` - No se usa en ningún lugar (duplica funcionalidad de serviciosGenerales.js)
- ❌ `src/assets/` - Carpeta vacía

### 2. Nombres Problemáticos
- ❌ `NavBarPrincipal_FIX.jsx` - El "_FIX" sugiere archivo temporal
- ❌ `componenteCarrito` - Inconsistente con otros nombres
- ❌ `ComponenteProducto` - Nombre redundante
- ❌ `card-Producto` - Mezcla de mayúsculas/minúsculas y guiones
- ❌ `componenteBuscarProducto` - Nombre demasiado largo
- ❌ `Detalle-Producto` - Guiones en lugar de PascalCase
- ❌ `Lista-Productos` - Guiones en lugar de PascalCase

### 3. Estructura Inconsistente
- ❌ `Admin/css/AdminPanel.css` - CSS separado del componente
- ❌ Mezcla de español e inglés en nombres
- ❌ Inconsistencia en mayúsculas/minúsculas

## Estructura Propuesta

```
src/
├── components/          # Renombrar de "Componentes"
│   ├── admin/          # Minúsculas para carpetas
│   │   ├── AdminPanel.jsx
│   │   ├── AdminPanel.css
│   │   └── MapaUsuarios.jsx
│   ├── context/        # Contextos
│   ├── shared/         # Componentes compartidos
│   │   ├── Footer/
│   │   └── Menu/
│   │       └── NavBar/
│   │           ├── NavBar.jsx      # Renombrar de NavBarPrincipal_FIX
│   │           ├── NavBar.css
│   │           └── MenuUsuario/
│   ├── utils/          # Utilidades
│   └── views/          # Vistas/páginas
│       └── productos/
│           ├── Carrito/             # Renombrar de componenteCarrito
│           ├── Categorias/          # Mover desde ComponenteProducto
│           ├── PaginaProductos/     # Simplificar estructura
│           │   ├── CardProducto/    # Renombrar de card-Producto
│           │   ├── BuscadorProducto/ # Renombrar de componenteBuscarProducto
│           │   ├── DetalleProducto/  # Renombrar de Detalle-Producto
│           │   └── ListaProductos/   # Renombrar de Lista-Productos
│           └── Ofertas/
├── services/           # Renombrar de "Servicios"
└── assets/             # Eliminar si está vacío
```

## Mejoras Implementadas ✅

1. ✅ **Eliminado** `UsuarioStorage.js` - No se usaba en ningún lugar
2. ✅ **Renombrado** `NavBarPrincipal_FIX.jsx` → `NavBarPrincipal.jsx` y actualizadas todas las importaciones
3. ✅ **Movido** `AdminPanel.css` de `Admin/css/` a `Admin/` (junto al componente)
4. ✅ **Eliminada** carpeta `Admin/css/` vacía

## Mejoras Pendientes (Opcionales)

### Cambios que requieren más trabajo:
1. ⚠️ Renombrar carpetas de productos para consistencia:
   - `componenteCarrito` → `Carrito`
   - `ComponenteProducto` → simplificar estructura
   - `card-Producto` → `CardProducto`
   - `componenteBuscarProducto` → `BuscadorProducto`
   - `Detalle-Producto` → `DetalleProducto`
   - `Lista-Productos` → `ListaProductos`

2. ⚠️ Considerar renombrar "Componentes" a "components" (requiere actualizar muchas importaciones)

3. ⚠️ Eliminar carpeta `assets/` si está vacía

## Nota
Los cambios grandes de estructura (como renombrar toda la carpeta "Componentes") requieren actualizar muchas importaciones. 
Se implementarán primero los cambios más seguros y que no rompan funcionalidad.
