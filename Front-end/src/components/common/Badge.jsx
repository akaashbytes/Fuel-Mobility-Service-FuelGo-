import React from 'react';

export default function Badge({
  children,
  variant = 'info',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider select-none';

  const variants = {
    primary: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
    secondary: 'bg-brand-dark/10 text-brand-dark border border-brand-dark/20',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-emergency/10 text-emergency border border-emergency/20',
    info: 'bg-text-secondary/10 text-text-secondary border border-text-secondary/20',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
