import React from 'react';
import { Luggage } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Skeleton from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';
import Alert from '../../../components/common/Alert';
import TripCard from '../../../components/trips/TripCard';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const trips = useApi(() => tripsService.list(), []);
  const destinations = useApi(() => destinationsService.list(), []);

  if (trips.loading || destinations.loading) {
    return (
      <div className="space-y-6 animate-fadeUp">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Trips</h1>
          <p className="mt-1 text-sm text-slate-500">Review and manage every trip in one place.</p>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton variant="card" count={2} />
        </div>
      </div>
    );
  }

  const destinationMap = new Map((destinations.data || []).map((item) => [item.destination_id, item]));

  return (
    <div className="space-y-6 animate-fadeUp">
      {trips.error ? <Alert title="Trips unavailable" message={trips.error} /> : null}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">My Trips</h1>
        <p className="mt-1 text-sm text-slate-500">Review and manage every trip in one place.</p>
      </div>
      {(trips.data || []).length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {trips.data.map((trip) => <TripCard key={trip.trip_id} trip={trip} destination={destinationMap.get(trip.destination_id)} />)}
        </div>
      ) : <EmptyState title="No trips yet" description="Create a trip to start planning destinations, itineraries, and budgets." actionLabel="Create Trip" icon={Luggage} onAction={() => navigate('/create-trip')} />}
    </div>
  );
}
