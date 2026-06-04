import React from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[11px] font-semibold tracking-wider text-text-secondary uppercase select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-text-muted pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-surface-lowest text-text-primary placeholder:text-text-muted/60 border-[1.5px] rounded-input py-3 px-4 ${
            Icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-borders-outline/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="font-mono text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
