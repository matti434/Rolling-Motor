# Estilos - Rolling Motor

Esta carpeta contiene los estilos centralizados del proyecto.

## Estructura

```
estilos/
├── variables.css    # Variables CSS (colores, sombras, etc.)
└── README.md        # Este archivo
```

## Uso

### Importar variables de colores

```jsx
import '../../estilos/variables.css';

const estilos = {
  color: 'var(--color-dorado)',
  backgroundColor: 'var(--color-oscuro)'
};
```

**Nota:** Las variables CSS se importan en los componentes JSX, no en los archivos CSS, para compatibilidad con Vite.

## Variables Disponibles

### Colores Principales
- `--color-crema`: #e8e1c4
- `--color-dorado`: #c89b2b
- `--color-oscuro`: #111111
- `--color-rojo`: #6b0000
- `--color-metal`: #5f5f5f
- `--color-verde-militar`: #3b4636
- `--color-bronce`: #8c6a2f

### Colores de Estado
- `--color-exito`: #28a745
- `--color-error`: #dc3545
- `--color-advertencia`: #ffc107
- `--color-info`: #17a2b8

### Sombras
- `--sombra-suave`: 0 2px 4px rgba(0, 0, 0, 0.1)
- `--sombra-media`: 0 4px 8px rgba(0, 0, 0, 0.2)
- `--sombra-fuerte`: 0 6px 20px rgba(0, 0, 0, 0.4)
- `--sombra-dorada`: 0 4px 12px rgba(200, 155, 43, 0.3)

Ver `variables.css` para la lista completa de variables disponibles.
