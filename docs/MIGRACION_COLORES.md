# Migración de Colores y Componentes Reutilizables

## ✅ Cambios Realizados

### 1. Variables CSS Centralizadas
- ✅ Creado `src/estilos/variables.css` con la paleta de colores exacta
- ✅ Importado en `main.jsx` para disponibilidad global
- ✅ Importado en `App.css`
- ✅ Eliminadas definiciones `:root` duplicadas en:
  - `AdminPanel.css`
  - `NavBarPrincipal.css`
  - `Carrito.css`
  - `Ofertas.css`
  - `CardProducto.css`
  - `PaginaProductos.css`
  - `DetalleProducto.css`
  - `ModalPerfil.css`

### 2. Componentes Reutilizables Creados
- ✅ `Boton` - Componente de botón con múltiples variantes
- ✅ `Input` - Componente de input con soporte para labels, errores e iconos
- ✅ `Card` - Componente de tarjeta con header y footer opcionales
- ✅ `Badge` - Componente de badge/etiqueta para estados

### 3. Paleta de Colores Aplicada
```css
--color-crema: #e8e1c4;        /* Crema vintage más apagado */
--color-dorado: #c89b2b;       /* Dorado estilo Royal Enfield */
--color-oscuro: #111111;       /* Negro carbón */
--color-rojo: #6b0000;         /* Rojo borgoña oscuro */
--color-metal: #5f5f5f;        /* Gris acero más oscuro */
--color-verde-militar: #3b4636; /* Verde clásico de motos RE */
--color-bronce: #8c6a2f;       /* Bronce envejecido */
```

## 📋 Próximos Pasos (Opcional)

### Reemplazar Componentes Existentes

1. **Botones**: Reemplazar `<Button>` de react-bootstrap por `<Boton>` reutilizable
2. **Inputs**: Reemplazar inputs hardcodeados por `<Input>` reutilizable
3. **Cards**: Reemplazar `<Card>` de react-bootstrap por `<Card>` reutilizable donde sea apropiado

### Ejemplo de Migración

**Antes:**
```jsx
<Button variant="primary" onClick={handleClick}>
  Enviar
</Button>
```

**Después:**
```jsx
import { Boton } from '../Shared/UI';

<Boton variant="primario" onClick={handleClick}>
  Enviar
</Boton>
```

## 📁 Estructura Creada

```
src/
├── estilos/
│   ├── variables.css      # Variables CSS centralizadas
│   └── README.md          # Documentación
└── Componentes/
    └── Shared/
        └── UI/
            ├── Boton/     # Componente Botón
            ├── Input/     # Componente Input
            ├── Card/      # Componente Card
            ├── Badge/     # Componente Badge
            ├── index.js   # Exportación centralizada
            └── README.md  # Documentación
```

## 🎨 Uso de Variables CSS

Ahora todos los archivos CSS pueden usar las variables:

```css
.mi-clase {
  color: var(--color-dorado);
  background: var(--color-oscuro);
  border: 2px solid var(--color-dorado);
}
```

## 📚 Documentación

- Ver `src/estilos/README.md` para uso de variables CSS
- Ver `src/Componentes/Shared/UI/README.md` para componentes reutilizables
- Ver `src/Componentes/Shared/UI/EJEMPLOS.md` para ejemplos de uso
