import React from 'react';

export default function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-white/10 text-slate-100',
    info: 'bg-accent-blue/15 text-accent-blue',
    success: 'bg-emerald-500/15 text-emerald-300',
    warning: 'bg-amber-500/15 text-amber-300',
    gold: 'bg-accent-gold/15 text-accent-gold'
  };

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
