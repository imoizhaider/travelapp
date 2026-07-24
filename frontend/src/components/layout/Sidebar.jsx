import React from 'react';
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`;

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/trips" className={linkClass}>My Trips</NavLink>
        <NavLink to="/create-trip" className={linkClass}>Create Trip</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </div>
    </aside>
  );
}
