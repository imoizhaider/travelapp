import React from 'react';

export default function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-slate-100 text-slate-600',
    info: 'bg-teal-50 text-teal-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    gold: 'bg-amber-50 text-amber-700'
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
