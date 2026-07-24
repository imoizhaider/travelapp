import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>Travel Planner — premium trip planning.</p>
        <p>&copy; {new Date().getFullYear()} Travel Planner</p>
      </div>
    </footer>
  );
}
