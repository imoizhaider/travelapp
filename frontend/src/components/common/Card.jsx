import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '', variant = 'default', ...props }) {
  const styles = {
    default: 'rounded-xl border border-slate-200 bg-white shadow-card',
    elevated: 'rounded-xl border border-slate-200 bg-white shadow-card-hover',
    nested: 'rounded-lg bg-slate-50 border border-slate-100',
    teal: 'rounded-xl border border-teal-200 bg-teal-50 shadow-card'
  };

  return (
    <div className={clsx(styles[variant], 'p-5', className)} {...props}>
      {children}
    </div>
  );
}
