import React from 'react';

export default function LivePulse({
  status = 'primary',
  className = '',
  label,
  ...props
}) {
  const colorMap = {
    primary: {
      dot: 'bg-brand-primary',
      pulse: 'bg-brand-primary/40',
    },
    emergency: {
      dot: 'bg-emergency',
      pulse: 'bg-emergency/40',
    },
    success: {
      dot: 'bg-success',
      pulse: 'bg-success/40',
    },
    warning: {
      dot: 'bg-warning',
      pulse: 'bg-warning/40',
    },
    secondary: {
      dot: 'bg-text-muted',
      pulse: 'bg-text-muted/40',
    },
  };

  const colors = colorMap[status] || colorMap.primary;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} {...props}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.pulse}`} />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors.dot}`} />
      </span>
      {label && (
        <span className="font-mono text-[10px] font-bold text-text-secondary uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
