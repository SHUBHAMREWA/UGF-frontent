import React from "react";
import { Button as UIButton } from '../ui/button';
import { cn } from '../../utils/cn';

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  asChild = false,
  ...props
}) => {
  return (
    <UIButton
      variant={variant}
      size={size}
      type={type}
      disabled={disabled}
      onClick={onClick}
      asChild={asChild}
      className={cn(fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </UIButton>
  );
};

export default Button;
