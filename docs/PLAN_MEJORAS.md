# Plan de Mejoras - Rolling Motor

Este documento contiene el análisis completo del proyecto y las mejoras identificadas organizadas por categoría y prioridad.

---

## Resumen Ejecutivo

Se identificaron **27 áreas de mejora** distribuidas en 6 categorías principales:
- Arquitectura y Organización
- Componentes React
- Manejo de Estado
- Validaciones
- Estilos CSS
- Manejo de Errores

---

## 1. Arquitectura y Organización

### 1.1 Duplicación de carpetas de servicios
**Prioridad:** Alta

**Problema:** Existen dos carpetas con funciones similares:
- `src/Services/`: `productoService.js`, `usuarioService.js` (usan Models)
- `src/Servicios/`: `serviciosGenerales.js` (persistencia pura)

**Impacto:** Genera confusión y dificulta el mantenimiento.

**Solución propuesta:**
1. Mantener solo `src/Services/`
2. Mover funciones de persistencia de `serviciosGenerales.js` a módulos específicos
3. `productoService` y `usuarioService` deben ser la única interfaz pública

---

### 1.2 Migración MVVM incompleta
**Prioridad:** Media

**Problema:** Algunos componentes tienen duplicados sin resolver:
- `ListaProductos.jsx` vs `ListaProductosView.jsx`
- `Carrito.jsx` aún tiene lógica de negocio mezclada

**Archivos afectados:**
- `src/Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Lista-Productos/`
- `src/Componentes/Views/Productos/componenteCarrito/`

**Solución propuesta:**
1. Completar migración de `Carrito` a MVVM
2. Eliminar componentes duplicados
3. Asegurar que todas las Views sean puras (sin useState/useEffect de lógica)

---

### 1.3 ViewModel demasiado extenso
**Prioridad:** Media

**Problema:** `useAdminViewModel.js` tiene 412 líneas manejando:
- Usuarios activos y suspendidos
- Productos
- Recomendaciones
- Pedidos

**Archivo:** `src/ViewModels/useAdminViewModel.js`

**Solución propuesta:**
Dividir en hooks más pequeños:
```
useAdminViewModel.js (orquestador)
├── useAdminUsuarios.js
├── useAdminProductos.js
├── useAdminRecomendaciones.js
└── useAdminPedidos.js
```

---

### 1.4 View con lógica de estado
**Prioridad:** Alta

**Problema:** `ModalEditarUsuarioView.jsx` usa `useState` y `useEffect` cuando debería ser una View pura.

**Archivo:** `src/Componentes/Admin/ModalEditarUsuarioView.jsx` (líneas 12-28)

**Solución propuesta:**
1. Mover toda la lógica de estado al ViewModel
2. El componente debe recibir solo props y callbacks

---

## 2. Componentes React

### 2.1 Componentes muy largos
**Prioridad:** Media

**Problema:** Componentes monolíticos que mezclan validación, lógica y renderizado.

**Archivos afectados:**
| Archivo | Líneas | Problemas |
|---------|--------|-----------|
| `Contacto.jsx` | 410 | Validación inline, estilos inline masivos |
| `BuscadorProducto.jsx` | 450 | Múltiples handlers, lógica de notificaciones |
| `Carrito.jsx` | 317 | Lógica de descuentos en componente |

**Solución propuesta:**
Para cada componente crear:
- `[Nombre]Container.jsx` - Conexión
- `[Nombre]View.jsx` - Solo UI
- `use[Nombre]ViewModel.js` - Lógica

---

### 2.2 Código duplicado en productos
**Prioridad:** Alta

**Problema:** La construcción del objeto `productoData` se repite 5 veces.

**Ubicaciones:**
- `CardProducto.jsx`: líneas 26-38, 51-63, 73-85
- `DetalleProducto.jsx`: líneas 32-35, 48-51

**Solución propuesta:**
Crear función helper en `src/Componentes/Utils/`:
```javascript
// productoUtils.js
export const crearProductoData = (producto) => ({
  id: producto.id || Date.now().toString(),
  nombre: producto.nombre,
  precio: producto.precio,
  imagen: producto.imagen,
  // ...
});
```

---

### 2.3 Uso de alert() en lugar de toasts
**Prioridad:** Alta

**Problema:** Se usa `alert()` nativo en 8 lugares, afectando la UX.

**Ubicaciones:**
- `Carrito.jsx`: líneas 60, 63, 68
- `CardProducto.jsx`: líneas 47, 68
- `DetalleProducto.jsx`: líneas 28, 44, 55
- `useAdminViewModel.js`: líneas 160-167, 220-225

**Solución propuesta:**
Reemplazar todos los `alert()` por `toast` de `react-hot-toast`:
```javascript
// Antes
alert("Producto agregado");

// Después
import toast from 'react-hot-toast';
toast.success("Producto agregado");
```

---

### 2.4 Props excesivas en AdminPanelView
**Prioridad:** Baja

**Problema:** El componente recibe 77 props individuales.

**Archivo:** `src/Componentes/Admin/AdminPanelView.jsx` (líneas 18-77)

**Solución propuesta:**
Agrupar props en objetos:
```javascript
// Antes
<AdminPanelView 
  usuarios={...}
  usuarioEditando={...}
  onEditarUsuario={...}
  productos={...}
  // ... 74 props más
/>

// Después
<AdminPanelView 
  usuarioProps={{ usuarios, usuarioEditando, onEditarUsuario }}
  productoProps={{ productos, onAgregarProducto }}
  // ...
/>
```

---

### 2.5 Falta de PropTypes/TypeScript
**Prioridad:** Baja

**Problema:** Ningún componente valida tipos de props.

**Solución propuesta:**
Opción A - Agregar PropTypes:
```javascript
import PropTypes from 'prop-types';

CardProducto.propTypes = {
  producto: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
  }).isRequired,
};
```

Opción B - Migrar gradualmente a TypeScript.

---

## 3. Manejo de Estado

### 3.1 Estado duplicado
**Prioridad:** Media

**Problema:** `useProductosViewModel` mantiene `busquedaLocal` que duplica `filtros.terminoBusqueda`.

**Archivo:** `src/ViewModels/useProductosViewModel.js` (línea 18)

**Solución propuesta:**
Eliminar estado local y usar solo el del contexto:
```javascript
// Eliminar
const [busquedaLocal, setBusquedaLocal] = useState('');

// Usar directamente
const { filtros, actualizarFiltros } = useProductos();
```

---

### 3.2 Lógica de filtrado en contexto
**Prioridad:** Media

**Problema:** `ContextoProducto` tiene 50+ líneas de lógica de filtrado.

**Archivo:** `src/Componentes/Context/ContextoProducto.jsx` (líneas 56-109)

**Solución propuesta:**
1. Mover lógica de filtrado a `useProductosViewModel`
2. El contexto solo debe manejar estado global y acciones CRUD

---

### 3.3 Persistencia en múltiples capas
**Prioridad:** Media

**Problema:** LocalStorage se manipula en:
- `ContextoCarrito.jsx` (líneas 17-31)
- `ContextoUsuario.jsx` (línea 28)
- `serviciosGenerales.js`

**Solución propuesta:**
Centralizar persistencia en una sola capa (`Services/`):
```
Contexto → Service → Persistencia (localStorage/API)
```

---

### 3.4 Conversión inconsistente de Models
**Prioridad:** Media

**Problema:** A veces se usa `toJSON()`, otras veces objetos planos.

**Ejemplos:**
```javascript
// productoService.js - Devuelve Models
return datos.map(d => Producto.fromJSON(d));

// ContextoProducto.js - Guarda JSON plano
const datos = servicios.obtenerProductos();
setProductos(datos);
```

**Solución propuesta:**
Estandarizar: Services siempre devuelven Models, contextos trabajan con Models.

---

## 4. Validaciones

### 4.1 Validaciones solo en HTML
**Prioridad:** Alta

**Problema:** Los formularios de Admin solo usan `required` del HTML.

**Archivos afectados:**
- `AdminFormularioView.jsx`: líneas 33, 46, 59, 82
- `ModalEditarUsuarioView.jsx`: líneas 42-101

**Solución propuesta:**
Usar Zod (ya existe en `ValidacionesForm.js`):
```javascript
import { productoSchema } from '../../Utils/ValidacionesForm';

const validarProducto = (datos) => {
  const resultado = productoSchema.safeParse(datos);
  if (!resultado.success) {
    return resultado.error.errors;
  }
  return null;
};
```

---

### 4.2 Falta validación de datos de navegación
**Prioridad:** Alta

**Problema:** Se usa `location.state?.producto` sin validación robusta.

**Archivo:** `src/Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto.jsx` (línea 11)

**Solución propuesta:**
```javascript
const producto = location.state?.producto;

if (!producto || !producto.id) {
  navigate('/productos');
  return null;
}
```

---

### 4.3 Inconsistencia en modelo Producto
**Prioridad:** Media

**Problema:** El constructor espera número, pero `toJSON()` devuelve string.

**Archivo:** `src/Models/Producto.js` (línea 28)

```javascript
// Constructor
this.precio = parseFloat(precio) || 0; // Número

// toJSON()
precio: this.precio.toString(), // String ❌
```

**Solución propuesta:**
```javascript
toJSON() {
  return {
    // ...
    precio: this.precio, // Mantener como número
  };
}
```

---

## 5. Estilos CSS

### 5.1 Colores hardcodeados
**Prioridad:** Alta

**Problema:** 164 valores de color directos en lugar de variables CSS.

**Ejemplos:**
```css
/* ❌ AdminPanel.css */
border: 1px solid #c2a13e;  /* Debería ser var(--color-dorado) */
background: #ffffff;         /* Debería ser var(--color-crema) */

/* ❌ Footer.css */
background-color: #111;      /* Debería ser var(--color-oscuro) */
```

**Archivos más afectados:**
- `AdminPanel.css`
- `Contacto.css`
- `Footer.css`
- `NavBarPrincipal.css`

**Solución propuesta:**
Buscar y reemplazar colores por variables existentes en `src/estilos/variables.css`.

---

### 5.2 Formularios CSS duplicados
**Prioridad:** Media

**Problema:** `FormLogin.css` y `FormRegistro.css` comparten ~90% del código.

**Archivos:**
- `src/Componentes/Views/Login/FormLogin/FormLogin.css`
- `src/Componentes/Views/Registro/FormRegistro/FormRegistro.css`

**Solución propuesta:**
Crear archivo compartido:
```
src/estilos/
├── variables.css
├── forms.css        ← Nuevo: estilos compartidos de formularios
└── components.css   ← Nuevo: botones, inputs, etc.
```

---

### 5.3 AdminPanel.css muy extenso
**Prioridad:** Baja

**Problema:** 1165 líneas en un solo archivo.

**Archivo:** `src/Componentes/Admin/AdminPanel.css`

**Solución propuesta:**
Dividir en módulos:
```
src/Componentes/Admin/styles/
├── admin-base.css
├── admin-tablas.css
├── admin-formularios.css
├── admin-modal.css
└── admin-responsive.css
```

---

### 5.4 Breakpoints inconsistentes
**Prioridad:** Media

**Problema:** Se usan múltiples valores sin estándar:
- `768px`, `767.98px`
- `480px`, `400px`, `360px`
- `576px`, `575.98px`

**Solución propuesta:**
Definir breakpoints estándar en `variables.css`:
```css
:root {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

---

### 5.5 Nomenclatura CSS mixta
**Prioridad:** Baja

**Problema:** Se mezclan convenciones:
- BEM: `.footer__container`
- kebab-case: `.barra-navegacion`
- camelCase: `.menuUsuario`

**Solución propuesta:**
Estandarizar en kebab-case o BEM para todo el proyecto.

---

## 6. Manejo de Errores

### 6.1 Errores silenciosos
**Prioridad:** Alta

**Problema:** Algunos errores solo se loguean sin informar al usuario.

**Archivo:** `src/Componentes/Views/Contacto/Contacto.jsx` (línea 100)
```javascript
.catch((error) => console.error(error)) // Solo loguea
```

**Solución propuesta:**
```javascript
.catch((error) => {
  console.error(error);
  toast.error("Error al enviar el mensaje. Intenta nuevamente.");
});
```

---

### 6.2 Falta manejo de errores de red
**Prioridad:** Media

**Problema:** `BuscadorProducto.jsx` no maneja excepciones de red.

**Solución propuesta:**
Agregar try-catch y feedback visual:
```javascript
try {
  const resultados = await buscarProductos(termino);
  setResultados(resultados);
} catch (error) {
  toast.error("Error de conexión. Verifica tu internet.");
}
```

---

### 6.3 Sin códigos de error estándar
**Prioridad:** Baja

**Problema:** Los servicios devuelven `{ exito, mensaje }` sin estructura consistente.

**Solución propuesta:**
Crear enum de errores:
```javascript
// src/Utils/ErrorCodes.js
export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

// Uso en servicios
return { 
  exito: false, 
  codigo: ErrorCodes.NOT_FOUND,
  mensaje: "Usuario no encontrado" 
};
```

---

## Priorización de Implementación

### Alta Prioridad (Implementar primero)
1. Consolidar `Services/` y `Servicios/`
2. Reemplazar `alert()` por toasts (8 lugares)
3. Agregar validaciones con Zod en formularios de Admin
4. Reemplazar colores hardcodeados por variables CSS
5. Mover lógica de `ModalEditarUsuarioView` al ViewModel
6. Agregar validación de navegación en `DetalleProducto`
7. Mejorar manejo de errores en `Contacto.jsx`

### Media Prioridad
8. Completar migración MVVM (Carrito, ListaProductos)
9. Dividir `useAdminViewModel` en hooks más pequeños
10. Extraer código duplicado a funciones helper
11. Unificar estilos de formularios Login/Registro
12. Eliminar estado duplicado en ViewModels
13. Mover lógica de filtrado del contexto al ViewModel
14. Estandarizar breakpoints CSS

### Baja Prioridad
15. Agregar PropTypes o migrar a TypeScript
16. Agrupar props en AdminPanelView
17. Estandarizar nomenclatura CSS
18. Dividir `AdminPanel.css` en módulos
19. Crear códigos de error estándar

---

## Métricas de Éxito

- [ ] 0 usos de `alert()` en el código
- [ ] 0 colores hardcodeados (usar solo variables)
- [ ] Todas las Views son puras (sin lógica de estado)
- [ ] Cobertura de validación del 100% en formularios
- [ ] Una sola carpeta de servicios (`Services/`)
- [ ] Breakpoints estandarizados en todo el proyecto

---

## Notas Adicionales

- Este plan puede ejecutarse de forma incremental
- Cada mejora es independiente y puede implementarse por separado
- Se recomienda crear una rama por cada categoría de mejoras
- Hacer pruebas después de cada cambio significativo

---

**Fecha de análisis:** Enero 2026  
**Estado:** Pendiente de implementación
