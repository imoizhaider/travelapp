import React from 'react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-ocean-500" />
      <span>{label}</span>
    </div>
  );
}
