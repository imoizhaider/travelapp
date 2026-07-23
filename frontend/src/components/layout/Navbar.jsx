import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard, LogOut, Menu, PlusCircle, User } from 'lucide-react';

import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) => `rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`;

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-500 to-cyan-400 text-white shadow-lift">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold tracking-tight text-white">Travel Planner</div>
              <div className="text-xs text-slate-400">Plan with precision</div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/dashboard" className={navLinkClass}><span className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</span></NavLink>
          <NavLink to="/trips" className={navLinkClass}>Trips</NavLink>
          <NavLink to="/create-trip" className={navLinkClass}><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Trip</span></NavLink>
          <NavLink to="/profile" className={navLinkClass}><span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> Profile</span></NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
                <Avatar name={user?.profile?.fullName || user?.email || 'Traveler'} imageUrl={user?.profile?.avatarUrl} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{user?.profile?.fullName || 'Traveler'}</div>
                  <div className="truncate text-xs text-slate-400">{user?.roleName}</div>
                </div>
              </div>
              <Button variant="secondary" onClick={handleLogout} className="hidden md:inline-flex">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
