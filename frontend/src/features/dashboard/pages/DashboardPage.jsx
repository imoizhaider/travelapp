import React from 'react';
import { CalendarDays, Compass, Hotel, Wallet } from 'lucide-react';

import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import Badge from '../../../components/common/Badge';
import Loader from '../../../components/common/Loader';
import Skeleton from '../../../components/common/Skeleton';
import TripCard from '../../../components/trips/TripCard';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';

export default function DashboardPage() {
  const { user } = useAuth();
  const trips = useApi(() => tripsService.list(), []);
  const destinations = useApi(() => destinationsService.list(), []);

  if (trips.loading || destinations.loading) {
    return (
      <div className="space-y-8 animate-fadeUp">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton variant="card" count={1} className="min-h-[180px]" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Skeleton variant="stat" count={4} />
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton variant="card" count={2} />
        </div>
      </div>
    );
  }

  const destinationMap = new Map((destinations.data || []).map((item) => [item.destination_id, item]));
  const tripCount = trips.data?.length || 0;

  return (
    <div className="space-y-8 animate-fadeUp">
      {trips.error ? <Alert title="Trips unavailable" message={trips.error} /> : null}
      {destinations.error ? <Alert title="Destination catalog unavailable" message={destinations.error} /> : null}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card variant="elevated" className="bg-gradient-to-br from-white/6 to-accent-blue/8">
          <Badge tone="info">Welcome back</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-white">{user?.profile?.fullName || 'Traveler'}, your trip workspace is ready.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Track active trips, review budgets, and manage collaborative planning from a single dashboard.</p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CalendarDays className="h-5 w-5 text-accent-blue" />
            <div className="mt-4 text-sm text-slate-400">Trips</div>
            <div className="mt-1 text-2xl font-semibold text-white">{tripCount}</div>
            {tripCount > 0 ? <div className="mt-1 text-xs text-accent-gold">{tripCount} active trip{tripCount !== 1 ? 's' : ''}</div> : null}
          </Card>
          <Card>
            <Compass className="h-5 w-5 text-accent-blue" />
            <div className="mt-4 text-sm text-slate-400">Destinations</div>
            <div className="mt-1 text-2xl font-semibold text-white">{destinations.data?.length || 0}</div>
          </Card>
          <Card>
            <Wallet className="h-5 w-5 text-accent-blue" />
            <div className="mt-4 text-sm text-slate-400">Budget</div>
            <div className="mt-1 text-2xl font-semibold text-white">—</div>
            <div className="mt-1 text-xs text-slate-500">Set a budget on any trip</div>
          </Card>
          <Card>
            <Hotel className="h-5 w-5 text-accent-blue" />
            <div className="mt-4 text-sm text-slate-400">Bookings</div>
            <div className="mt-1 text-2xl font-semibold text-white">—</div>
            <div className="mt-1 text-xs text-slate-500">Mock bookings available</div>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your trips</h2>
            <p className="mt-1 text-sm text-slate-400">Open any trip to manage itinerary, weather, budget, and sharing.</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {(trips.data || []).slice(0, 4).map((trip) => (
            <TripCard key={trip.trip_id} trip={trip} destination={destinationMap.get(trip.destination_id)} />
          ))}
          {!trips.data?.length ? (
            <div className="xl:col-span-2">
              <Card className="text-center text-slate-400 py-8">
                <Compass className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-3">No trips yet. Create your first trip to get started.</p>
              </Card>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
