import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, CalendarDays, Compass, Globe2, Map, Search, Share2, Sparkles, Wallet, CloudSun, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import SearchBar from '../../../components/common/SearchBar';
import Skeleton from '../../../components/common/Skeleton';
import DestinationCard from '../../../components/destinations/DestinationCard';
import { useApi } from '../../../hooks/useApi';
import { useDebounce } from '../../../hooks/useDebounce';
import { destinationsService } from '../../../services/destinations.service';
import { useAuth } from '../../../context/AuthContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80';

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Search Destinations',
    desc: 'Browse our catalog of destinations by city or country. Filter and find your next adventure.',
    icon: Search
  },
  {
    step: 2,
    title: 'Build Your Trip',
    desc: 'Create day-by-day itineraries, set budgets by category, and check weather forecasts for any destination.',
    icon: CalendarDays
  },
  {
    step: 3,
    title: 'Share & Collaborate',
    desc: 'Invite travel companions with view or edit access. Share trip links and plan together in real time.',
    icon: Share2
  }
];

const WHY_FEATURES = [
  {
    title: 'Itinerary Builder',
    desc: 'Structure every day with categorized items — flights, hotels, meals, activities. Sort by time, add notes and costs.',
    icon: Map
  },
  {
    title: 'Budget Tracking',
    desc: 'Set a trip budget, log expenses by category, and track your progress with a visual arc chart.',
    icon: Wallet
  },
  {
    title: 'Team Collaboration',
    desc: 'Add collaborators with view or edit permissions. Share trip links so anyone can follow along.',
    icon: Users
  },
  {
    title: 'Weather Integration',
    desc: 'Pull live forecasts for any destination. Plan around conditions with temperature and precipitation data.',
    icon: CloudSun
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);
  const { data, loading, error } = useApi(() => destinationsService.list(), []);

  const destinations = (data || [])
    .filter((destination) => `${destination.destination_name} ${destination.city} ${destination.country}`.toLowerCase().includes(debouncedQuery.toLowerCase()))
    .slice(0, 6);

  return (
    <div className="space-y-0 animate-fadeUp overflow-x-clip">
      <section
        className="relative flex flex-col items-center bg-cover bg-center pb-20 pt-14 sm:pt-20"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          width: '100vw',
          marginLeft: 'calc((100% - 100vw) / 2)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-900/70 via-teal-900/50 to-teal-800/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" /> Premium travel planning
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Plan trips with clarity and speed.
            </h1>
            <p className="mt-4 text-base leading-7 text-teal-50/80 sm:text-lg">
              Search destinations, build itineraries, estimate budgets, and share plans with collaborators from one workspace.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="amber-cta" size="lg" onClick={() => navigate(user ? '/dashboard' : '/register')}>Start Planning <ArrowRight className="h-4 w-4" /></Button>
              <Button size="lg" variant="secondary" className="bg-white/15 text-white border-white/20 hover:bg-white/25" as={Link} to="/login">Open Account</Button>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-card">
              <SearchBar value={query} onChange={setQuery} placeholder="Search destinations by city or country" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card sm:grid-cols-3">
            {[
              ['Destinations Available', data?.length || 0, Compass],
              ['Trips Planned', '—', Globe2],
              ['Features Ready', '8', BadgeCheck]
            ].map(([label, value, Icon]) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Featured destinations</h2>
              <p className="mt-1 text-sm text-slate-500">Explore the catalog and start a new trip from any destination.</p>
            </div>
            <Button variant="secondary" as={Link} to={user ? '/dashboard' : '/login'}>Go to dashboard</Button>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <Skeleton variant="card" count={3} />
            </div>
          ) : null}

          {error ? <Alert title="Destination feed unavailable" message={error} /> : null}

          {!loading && query !== '' && destinations.length === 0 ? <Alert title="No matches" message="No destinations matched your search term." type="warning" /> : null}

          {!loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard key={destination.destination_id} destination={destination} onSelect={() => navigate('/create-trip')} onFavorite={() => navigate(user ? '/profile' : '/login')} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">How it works</h2>
            <p className="mt-1 text-sm text-slate-500">Three steps to plan your next trip.</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-sm font-semibold text-teal-600">Step {step}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800">Why Travel Planner</h2>
            <p className="mt-1 text-sm text-slate-500">Everything you need to organise a trip, built into one workspace.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_FEATURES.map(({ title, desc, icon: Icon }) => (
              <Card key={title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-800">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-600">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-white">Ready to plan your next trip?</h2>
            <p className="mt-2 text-sm leading-6 text-teal-50/80">Create a trip, add destinations, build an itinerary, and share it with travel companions — all from one workspace.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="amber-cta" size="lg" onClick={() => navigate(user ? '/create-trip' : '/register')}>Create Your First Trip <ArrowRight className="h-4 w-4" /></Button>
              <Button size="lg" variant="secondary" className="bg-white/15 text-white border-white/20 hover:bg-white/25" as={Link} to={user ? '/dashboard' : '/login'}>{user ? 'Go to Dashboard' : 'Sign In'}</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
