# Componentes Reutilizables - Rolling Motor

Esta carpeta contiene componentes UI reutilizables que se pueden usar en todo el proyecto.

## Estructura

```
UI/
├── Boton/          # Componente de botón reutilizable
├── Input/          # Componente de input reutilizable
├── Card/           # Componente de tarjeta reutilizable
├── Badge/          # Componente de badge/etiqueta reutilizable
├── index.js        # Exportación centralizada
└── README.md       # Este archivo
```

## Uso

### Importación

```jsx
// Importar componentes individuales
import { Boton, Input, Card, Badge } from '../Shared/UI';

// O importar directamente
import Boton from '../Shared/UI/Boton/Boton';
```

## Componentes Disponibles

### Boton

Botón reutilizable con múltiples variantes y tamaños.

```jsx
<Boton 
  variant="primario" 
  size="mediano"
  onClick={() => console.log('Click')}
>
  Enviar
</Boton>
```

**Props:**
- `variant`: 'primario' | 'secundario' | 'peligro' | 'exito' | 'outline'
- `size`: 'pequeno' | 'mediano' | 'grande'
- `disabled`: boolean
- `fullWidth`: boolean
- `onClick`: function
- `type`: 'button' | 'submit' | 'reset'

### Input

Input reutilizable con soporte para labels, errores e iconos.

```jsx
<Input
  type="text"
  label="Nombre"
  placeholder="Ingresa tu nombre"
  error={errors.nombre}
  required
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
/>
```

**Props:**
- `type`: string (text, email, password, etc.)
- `label`: string
- `placeholder`: string
- `error`: string (mensaje de error)
- `required`: boolean
- `icon`: ReactNode (icono opcional)
- `value`: string
- `onChange`: function

### Card

Tarjeta reutilizable con header y footer opcionales.

```jsx
<Card variant="hover" onClick={() => navigate('/producto')}>
  <Card header={<h3>Título</h3>}>
    Contenido de la tarjeta
  </Card>
  <Card footer={<Boton>Acción</Boton>}>
    Más contenido
  </Card>
</Card>
```

**Props:**
- `variant`: 'default' | 'hover' | 'bordered'
- `header`: ReactNode
- `footer`: ReactNode
- `onClick`: function

### Badge

Badge/etiqueta reutilizable para mostrar estados o categorías.

```jsx
<Badge variant="dorado" size="mediano">
  Destacado
</Badge>
```

**Props:**
- `variant`: 'default' | 'exito' | 'peligro' | 'advertencia' | 'info' | 'dorado'
- `size`: 'pequeno' | 'mediano' | 'grande'

## Beneficios

✅ **Consistencia**: Todos los componentes usan los mismos estilos y colores
✅ **Mantenibilidad**: Cambios en un solo lugar afectan todo el proyecto
✅ **Reutilización**: No duplicar código de componentes similares
✅ **Accesibilidad**: Componentes con soporte para focus, disabled, etc.

## Agregar Nuevos Componentes

1. Crear carpeta con el nombre del componente en `UI/`
2. Crear `Componente.jsx` y `Componente.css`
3. Importar variables de colores en el JSX: `import '../../../../estilos/variables.css';`
4. Exportar en `index.js`
