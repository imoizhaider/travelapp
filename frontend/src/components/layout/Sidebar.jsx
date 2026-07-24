import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-lift' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`;

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/8 bg-white/4 p-4 lg:block">
      <div className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/trips" className={linkClass}>My Trips</NavLink>
        <NavLink to="/create-trip" className={linkClass}>Create Trip</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </div>
    </aside>
  );
}
