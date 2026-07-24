import React, { useMemo } from 'react';
import { CalendarDays, Compass, Hotel, Wallet, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Card from '../../../components/common/Card';
import Alert from '../../../components/common/Alert';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Skeleton from '../../../components/common/Skeleton';
import TripCard from '../../../components/trips/TripCard';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';
import { formatDate } from '../../../utils/formatters';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const trips = useApi(() => tripsService.list(), []);
  const destinations = useApi(() => destinationsService.list(), []);

  const upcomingTrip = useMemo(() => {
    const list = trips.data || [];
    if (!list.length) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = list
      .filter((t) => new Date(t.start_date) >= today)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    if (upcoming.length) return upcoming[0];
    const recent = list
      .filter((t) => new Date(t.start_date) < today)
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    return recent[0] || null;
  }, [trips.data]);

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
        <Card className="border-teal-100 bg-gradient-to-br from-teal-50 to-white">
          <Badge tone="info">Welcome back</Badge>
          <h1 className="mt-4 text-3xl font-semibold text-slate-800">{user?.profile?.fullName || 'Traveler'}, your trip workspace is ready.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Track active trips, review budgets, and manage collaborative planning from a single dashboard.</p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CalendarDays className="h-5 w-5 text-teal-600" />
            <div className="mt-4 text-sm text-slate-500">Trips</div>
            <div className="mt-1 text-2xl font-semibold text-slate-800">{tripCount}</div>
            {tripCount > 0 ? <div className="mt-1 text-xs text-amber-600">{tripCount} active trip{tripCount !== 1 ? 's' : ''}</div> : null}
          </Card>
          <Card>
            <Compass className="h-5 w-5 text-teal-600" />
            <div className="mt-4 text-sm text-slate-500">Destinations</div>
            <div className="mt-1 text-2xl font-semibold text-slate-800">{destinations.data?.length || 0}</div>
          </Card>
          <Card>
            <Wallet className="h-5 w-5 text-teal-600" />
            <div className="mt-4 text-sm text-slate-500">Budget</div>
            <div className="mt-1 text-2xl font-semibold text-slate-800">—</div>
            <div className="mt-1 text-xs text-slate-400">Set a budget on any trip</div>
          </Card>
          <Card>
            <Hotel className="h-5 w-5 text-teal-600" />
            <div className="mt-4 text-sm text-slate-500">Bookings</div>
            <div className="mt-1 text-2xl font-semibold text-slate-800">—</div>
            <div className="mt-1 text-xs text-slate-400">Mock bookings available</div>
          </Card>
        </div>
      </section>

      {upcomingTrip ? (
        <section>
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge>{upcomingTrip.trip_status}</Badge>
                    <span className="text-xs text-slate-400">{upcomingTrip.destination_name}</span>
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-slate-800">{upcomingTrip.trip_title}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                    {formatDate(upcomingTrip.start_date)} - {formatDate(upcomingTrip.end_date)}
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate(`/trips/${upcomingTrip.trip_id}`)}>
                View Trip <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Your trips</h2>
            <p className="mt-1 text-sm text-slate-500">Open any trip to manage itinerary, weather, budget, and sharing.</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {(trips.data || []).slice(0, 4).map((trip) => (
            <TripCard key={trip.trip_id} trip={trip} destination={destinationMap.get(trip.destination_id)} />
          ))}
          {!trips.data?.length ? (
            <div className="xl:col-span-2">
              <Card className="py-8 text-center text-slate-400">
                <Compass className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3">No trips yet. Create your first trip to get started.</p>
              </Card>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
