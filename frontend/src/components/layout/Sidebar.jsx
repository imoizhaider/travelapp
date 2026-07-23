import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-ocean-500 text-white shadow-lift' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`;

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/5 p-4 lg:block">
      <div className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/trips" className={linkClass}>My Trips</NavLink>
        <NavLink to="/create-trip" className={linkClass}>Create Trip</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </div>
    </aside>
  );
}
