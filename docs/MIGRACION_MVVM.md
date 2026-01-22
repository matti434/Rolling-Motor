# Migración a Arquitectura MVVM - Rolling Motor

## 📋 Índice

1. [¿Qué es MVVM?](#qué-es-mvvm)
2. [Estructura Actual del Proyecto](#estructura-actual-del-proyecto)
3. [Problemas de la Arquitectura Actual](#problemas-de-la-arquitectura-actual)
4. [Arquitectura MVVM Propuesta](#arquitectura-mvvm-propuesta)
5. [Cambios Detallados por Módulo](#cambios-detallados-por-módulo)
6. [Plan de Migración](#plan-de-migración)
7. [Ejemplos de Código](#ejemplos-de-código)
8. [Beneficios de la Migración](#beneficios-de-la-migración)
9. [Consideraciones y Mejores Prácticas](#consideraciones-y-mejores-prácticas)

---

## ¿Qué es MVVM?

**MVVM (Model-View-ViewModel)** es un patrón arquitectónico que separa la interfaz de usuario (View) de la lógica de negocio (Model) mediante una capa intermedia (ViewModel).

### Componentes de MVVM:

#### **Model (Modelo)**
- Representa los datos y la lógica de negocio
- No conoce la existencia de la View
- Contiene validaciones, transformaciones de datos y reglas de negocio
- En nuestro caso: Servicios, Modelos de datos, Repositorios

#### **View (Vista)**
- Componente de presentación puro
- Solo se encarga de renderizar UI
- No contiene lógica de negocio
- Recibe datos y callbacks como props
- En React: Componentes funcionales que solo renderizan JSX

#### **ViewModel (Modelo de Vista)**
- Conecta Model con View
- Contiene la lógica de presentación
- Transforma datos del Model para la View
- Maneja eventos de usuario y estado local de la vista
- En React: Custom Hooks que encapsulan lógica

### Diagrama de Flujo:

```
┌─────────────────────────────────────────┐
│              VIEW (UI Pura)            │
│  • Componentes de presentación         │
│  • Solo reciben props                  │
│  • Sin lógica de negocio               │
│  • Fáciles de testear                  │
└──────────────┬──────────────────────────┘
               │ usa props y callbacks
┌──────────────▼──────────────────────────┐
│          VIEWMODEL (Hooks)              │
│  • Lógica de presentación               │
│  • Estado local de la vista            │
│  • Transforma datos                    │
│  • Maneja eventos                      │
│  • Conecta con Model                   │
└──────────────┬──────────────────────────┘
               │ usa
┌──────────────▼──────────────────────────┐
│            MODEL (Servicios)             │
│  • Lógica de negocio                   │
│  • Acceso a datos                      │
│  • Validaciones                        │
│  • Reglas de negocio                   │
└─────────────────────────────────────────┘
```

---

## Estructura Actual del Proyecto

### Organización Actual:

```
src/
├── Componentes/
│   ├── Admin/              # Panel de administración
│   ├── Context/           # Contextos de React (estado global)
│   ├── Shared/            # Componentes compartidos
│   ├── Utils/             # Utilidades
│   └── Views/             # Vistas/Páginas
├── Servicios/             # Servicios de datos
└── estilos/              # Estilos CSS
```

### Problemas Identificados:

1. **Mezcla de Responsabilidades:**
   - Los componentes Views contienen lógica de negocio
   - Los Context contienen tanto estado como lógica
   - Difícil de testear componentes individuales

2. **Acoplamiento Fuerte:**
   - Los componentes dependen directamente de Context
   - Cambios en Context afectan múltiples componentes
   - Difícil reutilizar lógica entre componentes

3. **Falta de Separación:**
   - No hay modelos de datos claros
   - La lógica de presentación está mezclada con la UI
   - No hay capa intermedia entre datos y vista

4. **Ejemplo de Problema Actual:**

```jsx
// ❌ ANTES: Carrito.jsx - Todo mezclado
const Carrito = () => {
  // Lógica de negocio mezclada con UI
  const { itemsCarrito, calcularSubtotal } = useCarrito();
  const [codigo, setCodigo] = useState("");
  const total = calcularSubtotal() + 1500; // Cálculo en el componente
  
  const handleAplicarCodigo = () => {
    // Lógica compleja en el componente
    const porcentajes = [10, 20, 30];
    const porcentaje = porcentajes[Math.floor(Math.random() * porcentajes.length)];
    // ...
  };
  
  return <div>{/* JSX con lógica mezclada */}</div>;
};
```

---

## Problemas de la Arquitectura Actual

### 1. **Violación del Principio de Responsabilidad Única**

Los componentes actuales hacen demasiadas cosas:
- Renderizan UI
- Manejan estado
- Contienen lógica de negocio
- Gestionan efectos secundarios

### 2. **Dificultad para Testear**

```jsx
// ❌ Difícil de testear porque está todo mezclado
const ListaProductos = () => {
  const { productosFiltrados, cargando } = useProductos(); // Depende de Context
  // Lógica mezclada con presentación
  if (cargando) return <Spinner />;
  return <div>{productosFiltrados.map(...)}</div>;
};
```

### 3. **Reutilización Limitada**

La lógica está acoplada a componentes específicos, dificultando su reutilización.

### 4. **Mantenimiento Complejo**

Cambios en la lógica requieren modificar componentes que también contienen UI.

---

## Arquitectura MVVM Propuesta

### Nueva Estructura de Carpetas:

```
src/
├── Models/                    # ✨ NUEVO - Modelos de datos
│   ├── Usuario.js            # Modelo de Usuario
│   ├── Producto.js          # Modelo de Producto
│   ├── CarritoItem.js        # Modelo de Item de Carrito
│   └── index.js              # Exportaciones centralizadas
│
├── Services/                  # 🔄 RENOMBRADO (de Servicios/)
│   ├── serviciosGenerales.js # Servicios de datos
│   ├── usuarioService.js     # Servicios específicos de usuario
│   ├── productoService.js    # Servicios específicos de producto
│   └── carritoService.js     # Servicios específicos de carrito
│
├── ViewModels/                # ✨ NUEVO - ViewModels (Hooks)
│   ├── useHomeViewModel.js
│   ├── useProductosViewModel.js
│   ├── useCarritoViewModel.js
│   ├── useLoginViewModel.js
│   ├── useAdminViewModel.js
│   └── index.js
│
├── Views/                     # 🔄 REFACTORIZADO - Views puras
│   ├── Home/
│   │   ├── Home.jsx           # View pura
│   │   └── HomeContainer.jsx  # Container que conecta ViewModel
│   ├── Productos/
│   │   ├── ListaProductos.jsx      # View pura
│   │   ├── ListaProductosContainer.jsx
│   │   ├── CardProducto.jsx        # View pura
│   │   └── BuscadorProducto.jsx    # View pura
│   └── ...
│
├── Components/               # 🔄 RENOMBRADO (de Componentes/)
│   ├── Shared/               # Componentes reutilizables
│   └── Context/              # Contextos (se mantienen)
│
└── Utils/                     # Utilidades (sin cambios)
```

---

## Cambios Detallados por Módulo

### 1. **Models/** - Modelos de Datos

#### Propósito:
Definir la estructura y validación de los datos del dominio.

#### Archivos a Crear:

**`Models/Usuario.js`**
```javascript
export class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nombreDeUsuario = data.nombreDeUsuario;
    this.email = data.email;
    this.pais = data.pais;
    this.fechaNacimiento = data.fechaNacimiento;
    this.role = data.role || 'usuario';
  }

  static fromJSON(json) {
    return new Usuario(json);
  }

  toJSON() {
    return {
      id: this.id,
      nombreDeUsuario: this.nombreDeUsuario,
      email: this.email,
      pais: this.pais,
      fechaNacimiento: this.fechaNacimiento,
      role: this.role
    };
  }

  isValid() {
    return this.email && this.nombreDeUsuario;
  }
}
```

**`Models/Producto.js`**
```javascript
export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.precio = parseFloat(data.precio) || 0;
    this.categoria = data.categoria;
    this.marca = data.marca;
    this.modelo = data.modelo;
    this.stock = data.stock !== undefined ? data.stock : true;
    this.destacado = data.destacado || false;
  }

  static fromJSON(json) {
    return new Producto(json);
  }

  get precioFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.precio);
  }

  tieneStock() {
    return this.stock === true;
  }
}
```

**`Models/CarritoItem.js`**
```javascript
export class CarritoItem {
  constructor(producto, cantidad = 1) {
    this.id = producto.id;
    this.producto = producto;
    this.cantidad = cantidad;
  }

  get subtotal() {
    return this.producto.precio * this.cantidad;
  }

  incrementarCantidad() {
    this.cantidad += 1;
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad -= 1;
    }
  }
}
```

#### Cambios:
- ✅ Crear clases/modelos para cada entidad
- ✅ Agregar métodos de validación
- ✅ Agregar métodos de transformación
- ✅ Centralizar lógica de datos

---

### 2. **Services/** - Servicios de Datos

#### Propósito:
Mantener la lógica de acceso a datos y operaciones CRUD.

#### Cambios:

**ANTES:**
```
src/Servicios/serviciosGenerales.js  # Todo en un archivo
```

**DESPUÉS:**
```
src/Services/
├── serviciosGenerales.js      # Mantener para compatibilidad
├── usuarioService.js          # Servicios específicos de usuario
├── productoService.js         # Servicios específicos de producto
└── carritoService.js          # Servicios específicos de carrito
```

#### Ejemplo de Refactorización:

**`Services/productoService.js`**
```javascript
import * as servicios from './serviciosGenerales';
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
    return resultado.exito 
      ? Producto.fromJSON(resultado.producto)
      : null;
  },

  actualizar: (id, datos) => {
    const resultado = servicios.editarProducto(id, datos);
    return resultado.exito
      ? Producto.fromJSON(resultado.producto)
      : null;
  },

  eliminar: (id) => {
    return servicios.eliminarProducto(id);
  }
};
```

#### Cambios:
- ✅ Separar servicios por dominio
- ✅ Usar modelos en lugar de objetos planos
- ✅ Mantener compatibilidad con código existente
- ✅ Agregar métodos específicos por entidad

---

### 3. **ViewModels/** - Lógica de Presentación

#### Propósito:
Encapsular la lógica de presentación y conectar Model con View.

#### Archivos a Crear:

**`ViewModels/useCarritoViewModel.js`**
```javascript
import { useState, useMemo } from 'react';
import { useCarrito } from '../Components/Context/ContextoCarrito';
import { CarritoItem } from '../Models/CarritoItem';

export const useCarritoViewModel = () => {
  const {
    itemsCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularSubtotal
  } = useCarrito();

  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);

  // Transformar items a modelos
  const items = useMemo(() => {
    return itemsCarrito.map(item => new CarritoItem(item.productoOriginal, item.cantidad));
  }, [itemsCarrito]);

  // Cálculos
  const subtotal = useMemo(() => calcularSubtotal(), [calcularSubtotal, itemsCarrito]);
  const envio = useMemo(() => itemsCarrito.length > 0 ? 1500 : 0, [itemsCarrito.length]);
  const descuento = useMemo(() => {
    if (!descuentoAplicado) return 0;
    return subtotal * (descuentoAplicado / 100);
  }, [subtotal, descuentoAplicado]);
  const total = useMemo(() => subtotal + envio - descuento, [subtotal, envio, descuento]);

  // Funciones
  const aplicarCodigoDescuento = () => {
    if (!codigoDescuento.trim()) {
      return { exito: false, mensaje: 'Ingresa un código' };
    }
    
    const porcentajes = [10, 20, 30, 40, 50];
    const porcentaje = porcentajes[Math.floor(Math.random() * porcentajes.length)];
    setDescuentoAplicado(porcentaje);
    
    return { exito: true, porcentaje };
  };

  const limpiarDescuento = () => {
    setDescuentoDescuento('');
    setDescuentoAplicado(null);
  };

  return {
    // Estado
    items,
    codigoDescuento,
    descuentoAplicado,
    
    // Cálculos
    subtotal,
    envio,
    descuento,
    total,
    
    // Funciones
    setCodigoDescuento,
    aplicarCodigoDescuento,
    limpiarDescuento,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito
  };
};
```

**`ViewModels/useProductosViewModel.js`**
```javascript
import { useState, useMemo, useCallback } from 'react';
import { useProductos } from '../Components/Context/ContextoProducto';
import { useLocation } from 'react-router-dom';

export const useProductosViewModel = () => {
  const location = useLocation();
  const {
    productosFiltrados,
    cargando,
    filtros,
    actualizarFiltros,
    filtrarPorCategoria,
    obtenerCategoriasUnicas
  } = useProductos();

  const [busquedaLocal, setBusquedaLocal] = useState('');

  // Aplicar filtro de categoría desde navegación
  const aplicarCategoriaDesdeNavegacion = useCallback(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  // Transformar datos para la vista
  const productos = useMemo(() => productosFiltrados, [productosFiltrados]);
  const categorias = useMemo(() => obtenerCategoriasUnicas(), [obtenerCategoriasUnicas]);
  const tieneResultados = useMemo(() => productos.length > 0, [productos.length]);

  // Funciones de búsqueda
  const buscar = useCallback((termino) => {
    setBusquedaLocal(termino);
    actualizarFiltros({ terminoBusqueda: termino });
  }, [actualizarFiltros]);

  const limpiarBusqueda = useCallback(() => {
    setBusquedaLocal('');
    actualizarFiltros({ terminoBusqueda: '' });
  }, [actualizarFiltros]);

  return {
    // Estado
    productos,
    categorias,
    cargando,
    filtros,
    busquedaLocal,
    tieneResultados,
    
    // Funciones
    buscar,
    limpiarBusqueda,
    actualizarFiltros,
    filtrarPorCategoria,
    aplicarCategoriaDesdeNavegacion
  };
};
```

#### Cambios:
- ✅ Extraer toda la lógica de los componentes
- ✅ Transformar datos del Model para la View
- ✅ Manejar estado local de la vista
- ✅ Encapsular cálculos y transformaciones

---

### 4. **Views/** - Componentes de Presentación Puros

#### Propósito:
Renderizar UI sin lógica de negocio.

#### Ejemplo de Refactorización:

**ANTES: `Carrito.jsx`**
```jsx
// ❌ Mezcla lógica y presentación
const Carrito = () => {
  const { itemsCarrito, calcularSubtotal } = useCarrito();
  const [codigo, setCodigo] = useState("");
  const total = calcularSubtotal() + 1500;
  
  const handleAplicarCodigo = () => {
    // Lógica compleja aquí
  };
  
  return <div>{/* JSX */}</div>;
};
```

**DESPUÉS: `Carrito.jsx` (View Pura)**
```jsx
// ✅ Solo presentación
const Carrito = ({
  items,
  subtotal,
  envio,
  descuento,
  total,
  codigoDescuento,
  setCodigoDescuento,
  aplicarCodigoDescuento,
  eliminarDelCarrito,
  actualizarCantidad,
  vaciarCarrito
}) => {
  return (
    <Container>
      <h2>Carrito de Compras</h2>
      
      {items.map(item => (
        <CarritoItem
          key={item.id}
          item={item}
          onEliminar={() => eliminarDelCarrito(item.id)}
          onActualizarCantidad={(cantidad) => 
            actualizarCantidad(item.id, cantidad)
          }
        />
      ))}
      
      <div className="resumen">
        <p>Subtotal: ${subtotal}</p>
        <p>Envío: ${envio}</p>
        <p>Descuento: ${descuento}</p>
        <p>Total: ${total}</p>
      </div>
      
      <Form>
        <Form.Control
          value={codigoDescuento}
          onChange={(e) => setCodigoDescuento(e.target.value)}
          placeholder="Código de descuento"
        />
        <Button onClick={aplicarCodigoDescuento}>
          Aplicar
        </Button>
      </Form>
    </Container>
  );
};
```

**`CarritoContainer.jsx` (Container)**
```jsx
// ✅ Conecta ViewModel con View
import { useCarritoViewModel } from '../../ViewModels/useCarritoViewModel';
import Carrito from './Carrito';

const CarritoContainer = () => {
  const viewModel = useCarritoViewModel();
  return <Carrito {...viewModel} />;
};

export default CarritoContainer;
```

#### Cambios:
- ✅ Separar componentes en View pura y Container
- ✅ View solo recibe props
- ✅ Container conecta ViewModel con View
- ✅ Eliminar hooks de negocio de las Views

---

## Plan de Migración

### Fase 1: Preparación (Sin cambios en código)

1. ✅ Crear estructura de carpetas
2. ✅ Documentar cambios (este README)
3. ✅ Identificar todos los componentes a migrar

### Fase 2: Models y Services

1. Crear `Models/` con clases de datos
2. Refactorizar `Services/` separando por dominio
3. Mantener compatibilidad con código existente

### Fase 3: ViewModels

1. Crear ViewModels para cada módulo:
   - `useCarritoViewModel.js`
   - `useProductosViewModel.js`
   - `useLoginViewModel.js`
   - `useAdminViewModel.js`
   - `useHomeViewModel.js`

### Fase 4: Views Puras

1. Refactorizar cada componente:
   - Extraer lógica a ViewModel
   - Crear View pura
   - Crear Container

### Fase 5: Actualizar Rutas

1. Actualizar `App.jsx` para usar Containers
2. Verificar que todas las rutas funcionen

### Fase 6: Testing y Validación

1. Probar cada módulo migrado
2. Verificar que no se rompió funcionalidad
3. Optimizar si es necesario

---

## Ejemplos de Código

### Ejemplo Completo: Módulo de Productos

#### 1. Model (`Models/Producto.js`)
```javascript
export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.precio = parseFloat(data.precio) || 0;
    this.categoria = data.categoria;
    this.marca = data.marca;
    this.modelo = data.modelo;
    this.stock = data.stock !== undefined ? data.stock : true;
  }

  get precioFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.precio);
  }

  tieneStock() {
    return this.stock === true;
  }
}
```

#### 2. Service (`Services/productoService.js`)
```javascript
import * as servicios from './serviciosGenerales';
import { Producto } from '../Models/Producto';

export const productoService = {
  obtenerTodos: () => {
    return servicios.obtenerProductos()
      .map(d => Producto.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = servicios.obtenerProductoPorId(id);
    return dato ? Producto.fromJSON(dato) : null;
  }
};
```

#### 3. ViewModel (`ViewModels/useProductosViewModel.js`)
```javascript
import { useMemo, useCallback } from 'react';
import { useProductos } from '../Components/Context/ContextoProducto';

export const useProductosViewModel = () => {
  const {
    productosFiltrados,
    cargando,
    filtros,
    actualizarFiltros
  } = useProductos();

  const productos = useMemo(() => productosFiltrados, [productosFiltrados]);
  const tieneResultados = useMemo(() => productos.length > 0, [productos.length]);

  const buscar = useCallback((termino) => {
    actualizarFiltros({ terminoBusqueda: termino });
  }, [actualizarFiltros]);

  return {
    productos,
    cargando,
    filtros,
    tieneResultados,
    buscar
  };
};
```

#### 4. View (`Views/Productos/ListaProductos.jsx`)
```jsx
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import CardProducto from './CardProducto';

const ListaProductos = ({ productos, cargando, tieneResultados, filtros }) => {
  if (cargando) {
    return (
      <div className="contenedor-cargando">
        <Spinner animation="border" variant="primary" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (!tieneResultados) {
    return (
      <Alert variant="info">
        <Alert.Heading>
          {filtros.categoria 
            ? `No hay productos en la categoría "${filtros.categoria}"`
            : 'No se encontraron productos'
          }
        </Alert.Heading>
      </Alert>
    );
  }

  return (
    <Row className="g-4">
      {productos.map(producto => (
        <Col key={producto.id} xs={12} sm={6} lg={4}>
          <CardProducto producto={producto} />
        </Col>
      ))}
    </Row>
  );
};

export default ListaProductos;
```

#### 5. Container (`Views/Productos/ListaProductosContainer.jsx`)
```jsx
import { useProductosViewModel } from '../../../ViewModels/useProductosViewModel';
import ListaProductos from './ListaProductos';

const ListaProductosContainer = () => {
  const viewModel = useProductosViewModel();
  return <ListaProductos {...viewModel} />;
};

export default ListaProductosContainer;
```

---

## Beneficios de la Migración

### 1. **Separación de Responsabilidades**
- ✅ Cada capa tiene una responsabilidad clara
- ✅ Fácil identificar dónde hacer cambios
- ✅ Código más organizado

### 2. **Testabilidad Mejorada**
```javascript
// ✅ Fácil testear ViewModel independientemente
test('useCarritoViewModel calcula total correctamente', () => {
  const { total } = useCarritoViewModel();
  expect(total).toBe(1500);
});

// ✅ Fácil testear View con props mock
test('ListaProductos muestra productos', () => {
  const productos = [{ id: 1, nombre: 'Test' }];
  render(<ListaProductos productos={productos} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 3. **Reutilización**
- ✅ ViewModels pueden usarse en múltiples Views
- ✅ Views pueden reutilizarse con diferentes ViewModels
- ✅ Lógica centralizada y reutilizable

### 4. **Mantenibilidad**
- ✅ Cambios en lógica no afectan UI
- ✅ Cambios en UI no afectan lógica
- ✅ Fácil agregar nuevas features

### 5. **Escalabilidad**
- ✅ Fácil agregar nuevos módulos siguiendo el patrón
- ✅ Estructura consistente en todo el proyecto
- ✅ Onboarding más fácil para nuevos desarrolladores

---

## Consideraciones y Mejores Prácticas

### 1. **Mantener Context para Estado Global**

Los Context de React pueden seguir existiendo, pero se usan desde ViewModels:

```javascript
// ✅ ViewModel usa Context
const useCarritoViewModel = () => {
  const { itemsCarrito } = useCarrito(); // Context
  // Lógica adicional
  return { items: itemsCarrito, ... };
};
```

### 2. **No Duplicar Lógica**

Si hay lógica compartida entre ViewModels, crear hooks compartidos:

```javascript
// ✅ Hook compartido
const useCalculosCarrito = (items) => {
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [items]
  );
  return { subtotal };
};
```

### 3. **Views Deben Ser "Tontas"**

Las Views solo deben renderizar, no deben:
- ❌ Hacer llamadas a APIs
- ❌ Contener lógica de negocio
- ❌ Usar hooks de negocio directamente
- ✅ Solo usar hooks de UI (useState para estado local de UI)

### 4. **ViewModels Deben Ser "Inteligentes"**

Los ViewModels deben:
- ✅ Contener toda la lógica de presentación
- ✅ Transformar datos del Model
- ✅ Manejar estado local de la vista
- ✅ Proporcionar funciones y datos a la View

### 5. **Naming Conventions**

- **Models**: PascalCase (`Usuario`, `Producto`)
- **Services**: camelCase (`usuarioService`, `productoService`)
- **ViewModels**: camelCase con prefijo `use` (`useCarritoViewModel`)
- **Views**: PascalCase (`Carrito`, `ListaProductos`)
- **Containers**: PascalCase con sufijo `Container` (`CarritoContainer`)

### 6. **Estructura de Archivos**

```
Views/Productos/
├── ListaProductos.jsx           # View pura
├── ListaProductosContainer.jsx # Container
├── CardProducto.jsx            # View pura (componente pequeño)
└── CardProducto.css            # Estilos
```

### 7. **Migración Gradual**

No es necesario migrar todo de una vez:
- ✅ Empezar con un módulo
- ✅ Migrar gradualmente
- ✅ Mantener compatibilidad durante la transición

---

## Checklist de Migración

### Para cada módulo:

- [ ] Crear Model correspondiente
- [ ] Crear/actualizar Service
- [ ] Crear ViewModel
- [ ] Separar View en componente puro
- [ ] Crear Container
- [ ] Actualizar imports en rutas
- [ ] Probar funcionalidad
- [ ] Verificar que no se rompió nada

---

## Resumen de Cambios

### Archivos Nuevos a Crear:

1. **Models/**
   - `Usuario.js`
   - `Producto.js`
   - `CarritoItem.js`
   - `index.js`

2. **ViewModels/**
   - `useCarritoViewModel.js`
   - `useProductosViewModel.js`
   - `useLoginViewModel.js`
   - `useAdminViewModel.js`
   - `useHomeViewModel.js`
   - `index.js`

3. **Containers** (uno por cada View)
   - `CarritoContainer.jsx`
   - `ListaProductosContainer.jsx`
   - `HomeContainer.jsx`
   - etc.

### Archivos a Modificar:

1. **Views/** - Refactorizar a componentes puros
2. **Services/** - Separar y usar Models
3. **App.jsx** - Actualizar imports a Containers

### Archivos a Mantener:

1. **Context/** - Se mantienen, se usan desde ViewModels
2. **Utils/** - Sin cambios
3. **estilos/** - Sin cambios

---

## Próximos Pasos

1. ✅ Revisar este documento
2. ⏳ Aprobar plan de migración
3. ⏳ Crear estructura de carpetas
4. ⏳ Implementar Models
5. ⏳ Refactorizar Services
6. ⏳ Crear ViewModels
7. ⏳ Refactorizar Views
8. ⏳ Crear Containers
9. ⏳ Actualizar rutas
10. ⏳ Testing y validación

---

## Referencias

- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)

---

**Última actualización:** 2024
**Versión del documento:** 1.0
