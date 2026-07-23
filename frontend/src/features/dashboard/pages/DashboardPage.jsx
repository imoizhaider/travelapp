import React from 'react';
import { CalendarDays, Compass, Hotel, Wallet } from 'lucide-react';

import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import Badge from '../../../components/common/Badge';
import Loader from '../../../components/common/Loader';
import TripCard from '../../../components/trips/TripCard';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';
import { formatMoney } from '../../../utils/formatters';

export default function DashboardPage() {
  const { user } = useAuth();
  const trips = useApi(() => tripsService.list(), []);
  const destinations = useApi(() => destinationsService.list(), []);

  if (trips.loading || destinations.loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader label="Loading your travel workspace..." /></div>;
  }

  const destinationMap = new Map((destinations.data || []).map((item) => [item.destination_id, item]));

  return (
    <div className="space-y-8 animate-fadeUp">
      {trips.error ? <Alert title="Trips unavailable" message={trips.error} /> : null}
      {destinations.error ? <Alert title="Destination catalog unavailable" message={destinations.error} /> : null}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-gradient-to-br from-white/8 to-ocean-500/10">
          <Badge tone="info">Welcome back</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-white">{user?.profile?.fullName || 'Traveler'}, your trip workspace is ready.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Track active trips, review budgets, and manage collaborative planning from a single dashboard.</p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {[
            { icon: CalendarDays, label: 'Trips', value: trips.data?.length || 0 },
            { icon: Compass, label: 'Destinations', value: destinations.data?.length || 0 },
            { icon: Wallet, label: 'Budget', value: formatMoney(0) },
            { icon: Hotel, label: 'Bookings', value: 'Mock data' }
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <Icon className="h-5 w-5 text-ocean-300" />
              <div className="mt-4 text-sm text-slate-400">{label}</div>
              <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
            </Card>
          ))}
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
          {!trips.data?.length ? <Card className="xl:col-span-2 text-slate-300">No trips yet. Create your first trip to get started.</Card> : null}
        </div>
      </section>
    </div>
  );
}
