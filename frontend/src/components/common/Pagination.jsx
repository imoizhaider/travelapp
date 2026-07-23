import React from 'react';

export default function Pagination({ page = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="disabled:opacity-40">Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="disabled:opacity-40">Next</button>
    </div>
  );
}
