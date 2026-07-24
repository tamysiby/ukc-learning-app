import React from 'react';

/**
 * Reusable User Icon Placeholder Avatar Component
 */
export default function UserAvatar({ size = 'md', className = '' }) {
  // Size map
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-20 h-20 text-4xl rounded-2xl'
  };

  const baseSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/80 flex items-center justify-center shrink-0 shadow-xs ${baseSize} ${className}`}
    >
      <span className="material-symbols-outlined select-none">person</span>
    </div>
  );
}
