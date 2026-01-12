import React from 'react';
import '../../../../estilos/variables.css';
import './Boton.css';

const Boton = ({
  variant = 'primario',
  size = 'mediano',
  disabled = false,
  className = '',
  onClick,
  children,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const clases = [
    'boton-reutilizable',
    `boton-${variant}`,
    `boton-${size}`,
    fullWidth && 'boton-full-width',
    disabled && 'boton-disabled',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={clases}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Boton;
