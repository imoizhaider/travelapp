import React from 'react';
import clsx from 'clsx';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        className={clsx(
          'w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-accent-blue focus:bg-white/6',
          error && 'border-rose-500 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  );
}
