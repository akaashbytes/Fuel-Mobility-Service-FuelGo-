import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  elevated = true,
  hoverable = false,
  glass = false,
  className = '',
  headerAction,
  ...props
}) {
  const baseStyles = 'rounded-card overflow-hidden transition-all duration-300';
  
  const styles = glass
    ? 'glassmorphic'
    : elevated
    ? 'bg-surface-lowest shadow-industrial border border-borders-outline/10'
    : 'bg-surface-low border border-borders-outline/20';

  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:shadow-floating cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${styles} ${hoverStyles} ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-borders-outline/10">
          <div>
            {title && <h3 className="text-lg font-bold text-text-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
