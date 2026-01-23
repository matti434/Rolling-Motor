import React from 'react';

/**
 * View pura para la sección de Usuarios Activos
 * Solo recibe props y renderiza UI
 */
export const AdminUsuariosView = ({
  usuarios,
  totalAdmins,
  totalUsuarios,
  totalNormales,
  onEditarUsuario,
  onSuspenderUsuario,
}) => {
  return (
    <div className="contenedor-tabla">
      <h2>👥 Usuarios Activos</h2>
      
      {/* Tarjetas de resumen */}
      <div className="tabla-resumen">
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{totalAdmins}</span>
          <span className="texto-resumen">Administradores</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{totalNormales}</span>
          <span className="texto-resumen">Usuarios Normales</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{totalUsuarios}</span>
          <span className="texto-resumen">Total Activos</span>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>País</th>
              <th>Fecha Nac</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td data-label="Usuario">
                  <div className="info-usuario">
                    <span className="nombre-usuario">
                      {u.nombreDeUsuario}
                    </span>
                  </div>
                </td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Rol">
                  <span
                    className={`badge-rol ${
                      u.role === "admin" ? "badge-admin" : "badge-user"
                    }`}
                  >
                    {u.role === "admin" ? "👑 Admin" : "👤 Usuario"}
                  </span>
                </td>
                <td data-label="País">{u.pais || "No especificado"}</td>
                <td data-label="Fecha Nac">
                  {new Date(u.fechaNacimiento).toLocaleDateString()}
                </td>
                <td data-label="Acciones">
                  <div className="acciones">
                    <button
                      className="boton-editar"
                      onClick={() => onEditarUsuario(u)}
                      title="Editar usuario"
                    >
                      ✏️ Editar
                    </button>
                    {u.role !== "admin" && (
                      <button
                        className="boton-suspender"
                        onClick={() => onSuspenderUsuario(u.id)}
                        title="Suspender usuario"
                      >
                        ⚠️ Suspender
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && (
          <div className="sin-datos">
            📭 No hay usuarios activos en el sistema
          </div>
        )}
      </div>
    </div>
  );
};
