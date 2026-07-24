import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '', variant = 'default', ...props }) {
  const styles = {
    default: 'rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl',
    elevated: 'rounded-2xl border border-white/10 bg-white/6 backdrop-blur-xl shadow-lift',
    nested: 'rounded-xl border border-white/6 bg-white/3',
    gold: 'rounded-2xl border border-accent-gold/30 bg-white/4 backdrop-blur-xl shadow-glow'
  };

  return (
    <div className={clsx(styles[variant], 'p-5', className)} {...props}>
      {children}
    </div>
  );
}
