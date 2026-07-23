import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={clsx('rounded-3xl border border-white/10 bg-white/6 p-5 shadow-soft backdrop-blur-xl', className)} {...props}>
      {children}
    </div>
  );
}
