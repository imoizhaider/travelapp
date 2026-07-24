import React from 'react';
import clsx from 'clsx';

export default function Skeleton({ variant = 'card', count = 1, className = '' }) {
  const shimmer = 'animate-shimmer rounded-lg bg-slate-200';

  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx('rounded-xl border border-slate-200 bg-white p-5 shadow-card', className)}>
            <div className={`${shimmer} h-4 w-1/3`} />
            <div className={`${shimmer} mt-4 h-3 w-3/4`} />
            <div className={`${shimmer} mt-2 h-3 w-1/2`} />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={`${shimmer} h-14 w-full rounded-lg`} />
              <div className={`${shimmer} h-14 w-full rounded-lg`} />
            </div>
            <div className={`${shimmer} mt-4 h-10 w-full rounded-lg`} />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'stat') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx('rounded-xl border border-slate-200 bg-white p-5 shadow-card', className)}>
            <div className={`${shimmer} h-5 w-5 rounded-lg`} />
            <div className={`${shimmer} mt-4 h-3 w-1/2`} />
            <div className={`${shimmer} mt-2 h-6 w-1/3`} />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'text') {
    return (
      <div className={clsx(shimmer, className)} />
    );
  }

  return null;
}
