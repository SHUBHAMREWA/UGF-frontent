import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

/**
 * Reusable form field component
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={name} className={required ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={error && touched ? 'border-destructive' : ''}
        {...props}
      />
      {error && touched && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FormField;

