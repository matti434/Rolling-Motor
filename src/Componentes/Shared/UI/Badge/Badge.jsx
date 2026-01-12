import React from 'react';
import '../../../../estilos/variables.css';
import './Badge.css';

const Badge = ({
  variant = 'default',
  size = 'mediano',
  className = '',
  children,
  ...props
}) => {
  const clases = [
    'badge-reutilizable',
    `badge-${variant}`,
    `badge-${size}`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={clases} {...props}>
      {children}
    </span>
  );
};

export default Badge;
