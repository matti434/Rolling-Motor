# Estructura del Proyecto - Rolling Motor

## 📁 Estructura de Carpetas

```
src/
├── Componentes/
│   ├── Admin/                    # Panel de administración
│   │   ├── AdminPanel.jsx
│   │   ├── AdminPanel.css
│   │   └── MapaUsuarios.jsx
│   │
│   ├── Context/                  # Contextos de React
│   │   ├── ContextoCarrito.jsx
│   │   ├── ContextoProducto.jsx
│   │   └── ContextoUsuario.jsx
│   │
│   ├── Shared/                   # Componentes compartidos
│   │   ├── UI/                   # Componentes reutilizables
│   │   │   ├── Boton/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   └── index.js
│   │   ├── Footer/
│   │   └── Menu/
│   │       └── NavBarPrincipal/
│   │
│   ├── Utils/                    # Utilidades
│   │   ├── CoordenadasPaises.js
│   │   ├── I18next.js
│   │   ├── inicializarLocalStorage.js
│   │   ├── RutaProtegida.jsx
│   │   ├── ValidacionesBuscador.js
│   │   └── ValidacionesForm.js
│   │
│   └── Views/                    # Vistas/Páginas
│       ├── Contacto/
│       ├── Home/
│       ├── Login/
│       ├── Nosotros/
│       ├── Pagina404/
│       ├── Productos/
│       └── Registro/
│
├── estilos/                      # Variables CSS centralizadas
│   └── variables.css
│
└── Servicios/                    # Servicios y lógica de negocio
    └── serviciosGenerales.js
```

## 🎯 Organización

### Componentes por Categoría

- **Admin/**: Funcionalidad de administración
- **Context/**: Estado global de la aplicación
- **Shared/**: Componentes reutilizables y compartidos
- **Utils/**: Funciones auxiliares y utilidades
- **Views/**: Páginas principales de la aplicación

### Convenciones de Nombres

- Componentes: PascalCase (ej: `NavBarPrincipal.jsx`)
- Archivos CSS: Mismo nombre que el componente
- Utilidades: camelCase (ej: `inicializarLocalStorage.js`)

## 📝 Notas

- Los componentes reutilizables están en `Shared/UI/`
- Las variables CSS están centralizadas en `estilos/variables.css`
- Los servicios están en `Servicios/` para lógica de negocio
