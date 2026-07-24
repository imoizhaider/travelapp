import React from 'react';
import clsx from 'clsx';

export default function Skeleton({ variant = 'card', count = 1, className = '' }) {
  const shimmer = 'animate-shimmer rounded-lg bg-white/6';

  if (variant === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx('rounded-2xl border border-white/8 bg-white/4 p-5', className)}>
            <div className={`${shimmer} h-4 w-1/3`} />
            <div className={`${shimmer} mt-4 h-3 w-3/4`} />
            <div className={`${shimmer} mt-2 h-3 w-1/2`} />
            <div className={`mt-5 grid grid-cols-2 gap-3`}>
              <div className={`${shimmer} h-14 w-full rounded-xl`} />
              <div className={`${shimmer} h-14 w-full rounded-xl`} />
            </div>
            <div className={`${shimmer} mt-4 h-10 w-full rounded-xl`} />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'stat') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={clsx('rounded-2xl border border-white/8 bg-white/4 p-5', className)}>
            <div className={`${shimmer} h-5 w-5`} />
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
