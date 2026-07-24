import React from 'react';

export default function Alert({ title = 'Notice', message, type = 'error' }) {
  const styles = type === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className={`rounded-lg border px-4 py-3 ${styles}`}>
      <div className="font-semibold">{title}</div>
      {message ? <div className="mt-1 text-sm opacity-80">{message}</div> : null}
    </div>
  );
}
