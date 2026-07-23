import React from 'react';

import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Alert from '../../../components/common/Alert';
import TripCard from '../../../components/trips/TripCard';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';

export default function MyTripsPage() {
  const trips = useApi(() => tripsService.list(), []);
  const destinations = useApi(() => destinationsService.list(), []);

  if (trips.loading || destinations.loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader label="Loading trips..." /></div>;
  }

  const destinationMap = new Map((destinations.data || []).map((item) => [item.destination_id, item]));

  return (
    <div className="space-y-6">
      {trips.error ? <Alert title="Trips unavailable" message={trips.error} /> : null}
      <div>
        <h1 className="text-3xl font-semibold text-white">My Trips</h1>
        <p className="mt-2 text-sm text-slate-400">Review and manage every trip in one place.</p>
      </div>
      {(trips.data || []).length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {trips.data.map((trip) => <TripCard key={trip.trip_id} trip={trip} destination={destinationMap.get(trip.destination_id)} />)}
        </div>
      ) : <EmptyState title="No trips yet" description="Create a trip to start planning destinations, itineraries, and budgets." actionLabel="Create Trip" />}
    </div>
  );
}
