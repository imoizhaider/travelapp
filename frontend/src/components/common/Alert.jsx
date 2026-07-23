import React from 'react';

export default function Alert({ title = 'Notice', message, type = 'error' }) {
  const styles = type === 'error'
    ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles}`}>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm opacity-90">{message}</div>
    </div>
  );
}
