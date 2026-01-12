# Ejemplos de Uso - Componentes Reutilizables

## Ejemplo 1: Formulario con Botón e Input

```jsx
import { Boton, Input } from '../Shared/UI';
import { FaUser, FaLock } from 'react-icons/fa';

function FormularioLogin() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <form>
      <Input
        type="text"
        label="Usuario"
        placeholder="Ingresa tu usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        icon={<FaUser />}
        error={error}
        required
      />
      
      <Input
        type="password"
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<FaLock />}
        required
      />

      <Boton 
        variant="primario" 
        type="submit"
        fullWidth
      >
        Iniciar Sesión
      </Boton>
    </form>
  );
}
```

## Ejemplo 2: Card con Badge

```jsx
import { Card, Badge, Boton } from '../Shared/UI';

function ProductoCard({ producto }) {
  return (
    <Card variant="hover" onClick={() => verDetalle(producto.id)}>
      <Card header={
        <div>
          <h3>{producto.nombre}</h3>
          {producto.destacado && <Badge variant="dorado">Destacado</Badge>}
          {!producto.stock && <Badge variant="peligro">Sin Stock</Badge>}
        </div>
      }>
        <p>{producto.descripcion}</p>
        <p>Precio: ${producto.precio}</p>
      </Card>
      <Card footer={
        <Boton variant="primario" size="pequeno">
          Agregar al Carrito
        </Boton>
      }>
        {/* Contenido adicional */}
      </Card>
    </Card>
  );
}
```

## Ejemplo 3: Botones con Variantes

```jsx
import { Boton } from '../Shared/UI';

function AccionesProducto() {
  return (
    <div>
      <Boton variant="primario" onClick={agregarAlCarrito}>
        Agregar al Carrito
      </Boton>
      
      <Boton variant="secundario" onClick={verDetalle}>
        Ver Detalles
      </Boton>
      
      <Boton variant="peligro" onClick={eliminar}>
        Eliminar
      </Boton>
      
      <Boton variant="exito" onClick={guardar}>
        Guardar Cambios
      </Boton>
      
      <Boton variant="outline" onClick={cancelar}>
        Cancelar
      </Boton>
    </div>
  );
}
```

## Ejemplo 4: Lista de Productos con Cards

```jsx
import { Card, Badge, Boton } from '../Shared/UI';

function ListaProductos({ productos }) {
  return (
    <div className="grid-productos">
      {productos.map(producto => (
        <Card key={producto.id} variant="hover">
          <img src={producto.imagen} alt={producto.nombre} />
          <h3>{producto.nombre}</h3>
          <div>
            <Badge variant="dorado">{producto.categoria}</Badge>
            {producto.destacado && <Badge variant="exito">Destacado</Badge>}
          </div>
          <p>${producto.precio}</p>
          <Boton 
            variant="primario" 
            fullWidth
            onClick={() => agregarAlCarrito(producto)}
          >
            Agregar al Carrito
          </Boton>
        </Card>
      ))}
    </div>
  );
}
```

## Ejemplo 5: Formulario Completo

```jsx
import { Input, Boton, Card } from '../Shared/UI';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';

function FormularioContacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  return (
    <Card variant="bordered">
      <Card header={<h2>Contacto</h2>}>
        <Input
          type="text"
          label="Nombre"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          icon={<FaUser />}
          error={errors.nombre}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          icon={<FaEnvelope />}
          error={errors.email}
          required
        />

        <Input
          type="tel"
          label="Teléfono"
          placeholder="+54 9 11 1234-5678"
          value={formData.telefono}
          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          icon={<FaPhone />}
          error={errors.telefono}
        />
      </Card>
      
      <Card footer={
        <>
          <Boton variant="outline" onClick={limpiar}>
            Limpiar
          </Boton>
          <Boton variant="primario" onClick={enviar}>
            Enviar
          </Boton>
        </>
      }>
        {/* Footer con botones */}
      </Card>
    </Card>
  );
}
```
