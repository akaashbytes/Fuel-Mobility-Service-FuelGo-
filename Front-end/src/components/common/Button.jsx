import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-container rounded-btn',
    secondary: 'bg-transparent border-[1.5px] border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white rounded-btn',
    emergency: 'bg-emergency text-white hover:bg-red-700 animate-pulse-glow rounded-btn uppercase tracking-wider',
    danger: 'bg-red-600 text-white hover:bg-red-700 rounded-btn',
    success: 'bg-success text-white hover:bg-emerald-600 rounded-btn',
    ghost: 'bg-transparent hover:bg-surface-low text-text-primary rounded-btn',
    outline: 'border border-borders-outline bg-transparent hover:bg-surface-low text-text-primary rounded-btn',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
