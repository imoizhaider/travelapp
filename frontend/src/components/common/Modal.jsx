import React, { useEffect } from 'react';

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    const onEscape = (event) => event.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-xl animate-fadeUp rounded-xl border border-slate-200 bg-white p-6 shadow-modal" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 transition" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
