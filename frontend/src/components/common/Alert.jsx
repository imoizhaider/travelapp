import React from 'react';

export default function Alert({ title = 'Notice', message, type = 'error' }) {
  const styles = type === 'error'
    ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  return (
    <div className={`rounded-xl border px-4 py-3 ${styles}`}>
      <div className="font-semibold">{title}</div>
      {message ? <div className="mt-1 text-sm opacity-90">{message}</div> : null}
    </div>
  );
}
