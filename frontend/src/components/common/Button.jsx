import React from 'react';
import clsx from 'clsx';

export default function Button({ children, className = '', variant = 'primary', size = 'md', as: Component = 'button', type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-surface-950 disabled:cursor-not-allowed disabled:opacity-60';

  const variants = {
    primary: 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white hover:from-accent-blue/90 hover:to-accent-cyan/90 shadow-lift',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/8',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    'gold-gradient': 'bg-gradient-to-r from-accent-gold to-accent-blue text-white hover:from-accent-gold/90 hover:to-accent-blue/90 shadow-glow'
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
