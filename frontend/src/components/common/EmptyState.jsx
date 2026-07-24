import React from 'react';
import { Compass } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel, onAction, icon: Icon = Compass }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {actionLabel ? <Button className="mt-5" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
