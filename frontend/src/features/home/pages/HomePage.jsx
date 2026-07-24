import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, Globe2, Sparkles, Compass } from 'lucide-react';
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
    <div className="space-y-0 animate-fadeUp">
      <section className="bg-hero pb-20 pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/90">
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
    </div>
  );
}
