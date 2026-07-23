import React, { useEffect } from 'react';

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    const onEscape = (event) => event.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button className="rounded-full bg-white/8 px-3 py-2 text-sm text-slate-200 hover:bg-white/12" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
