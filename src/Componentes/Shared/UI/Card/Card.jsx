import React from 'react';
import '../../../../estilos/variables.css';
import './Card.css';

const Card = ({
  variant = 'default',
  className = '',
  children,
  onClick,
  header,
  footer,
  ...props
}) => {
  const clases = [
    'card-reutilizable',
    `card-${variant}`,
    onClick && 'card-clickable',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={clases} onClick={onClick} {...props}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
