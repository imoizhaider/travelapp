import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>Travel Planner. Built for premium trip planning experiences.</p>
        <p>React · Router · Axios · Tailwind</p>
      </div>
    </footer>
  );
}
