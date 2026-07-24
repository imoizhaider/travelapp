import React from 'react';
import clsx from 'clsx';

export default function Button({ children, className = '', variant = 'primary', size = 'md', as: Component = 'button', type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    'amber-cta': 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const resolvedType = Component === 'button' ? type : undefined;

  return (
    <Component className={clsx(base, variants[variant], sizes[size], className)} type={resolvedType} {...props}>
      {children}
    </Component>
  );
}
