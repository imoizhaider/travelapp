import React, { useState } from 'react';
import { ArrowRight, BadgeCheck, Globe2, Sparkles } from 'lucide-react';
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
    <div className="space-y-10 animate-fadeUp">
      <section className="grid gap-8 rounded-3xl border border-white/8 bg-hero px-6 py-10 shadow-soft lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:py-14">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-accent-blue" /> Premium travel planning
          </div>
          <h1 className="max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Plan trips with clarity, speed, and a polished experience.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Search destinations, build itineraries, estimate budgets, compare mock hotels, and share plans with collaborators from one cohesive workspace.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="gold-gradient" size="lg" onClick={() => navigate(user ? '/dashboard' : '/register')}>Start Planning <ArrowRight className="h-4 w-4" /></Button>
            <Button size="lg" variant="secondary" as={Link} to="/login">Open Account</Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Fast search', 'Find destinations with live filtering.'],
              ['Smart planning', 'Create itineraries and budgets quickly.'],
              ['Collaboration', 'Share trips with view or edit access.']
            ].map(([title, description]) => (
              <Card key={title} variant="nested">
                <BadgeCheck className="h-5 w-5 text-emerald-400" />
                <div className="mt-2 font-semibold text-white">{title}</div>
                <p className="mt-1 text-sm text-slate-400">{description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent-blue/15 p-3 text-accent-blue"><Globe2 className="h-5 w-5" /></div>
            <div>
              <div className="text-sm text-slate-400">Trip readiness</div>
              <div className="text-base font-semibold text-white">Ready to explore</div>
            </div>
          </div>
          <SearchBar value={query} onChange={setQuery} placeholder="Search destinations by city or country" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {['Weather insights', 'Budget estimates', 'Favorites sync', 'Hotel booking'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/3 px-4 py-3 text-sm text-slate-300">
                <span>{item}</span>
                <span className="text-emerald-400">Active</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Featured destinations</h2>
            <p className="mt-1 text-sm text-slate-400">Explore the current catalog and start a new trip from any destination.</p>
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
      </section>
    </div>
  );
}
