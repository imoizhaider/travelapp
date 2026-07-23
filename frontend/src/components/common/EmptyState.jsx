import React from 'react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
      {actionLabel ? <Button className="mt-5" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
