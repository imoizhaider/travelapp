import React from 'react';
import { Compass } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, onAction, icon: Icon = Compass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-card">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {actionLabel ? <Button className="mt-5" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
