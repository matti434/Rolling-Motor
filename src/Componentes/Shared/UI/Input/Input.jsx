import React, { useMemo } from 'react';
import '../../../../estilos/variables.css';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder = '',
  label = '',
  error = '',
  required = false,
  className = '',
  icon,
  onChange,
  value,
  name,
  id,
  ...props
}) => {
  const inputId = useMemo(() => {
    if (id) return id;
    if (name) return name;
    return `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, [id, name]);

  return (
    <div className={`input-container ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          className={`input-reutilizable ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
          onChange={onChange}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
