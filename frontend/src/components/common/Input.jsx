import React from 'react';
import clsx from 'clsx';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2">
      {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
      <input
        className={clsx(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-ocean-500 focus:bg-white/7',
          error && 'border-rose-500 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </label>
  );
}
