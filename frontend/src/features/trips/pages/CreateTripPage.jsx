import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import Loader from '../../../components/common/Loader';
import Skeleton from '../../../components/common/Skeleton';
import { useApi } from '../../../hooks/useApi';
import { destinationsService } from '../../../services/destinations.service';
import { tripsService } from '../../../services/trips.service';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destinations = useApi(() => destinationsService.list(), []);
  const duplicateTripId = searchParams.get('duplicate');

  const [form, setForm] = useState({
    destinationId: '',
    tripTitle: duplicateTripId ? 'Copied Trip' : '',
    tripPurpose: '',
    startDate: '',
    endDate: '',
    travelerCount: 1,
    tripStatus: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const destinationOptions = useMemo(() => destinations.data || [], [destinations.data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await tripsService.create({
        ...form,
        destinationId: Number(form.destinationId),
        travelerCount: Number(form.travelerCount)
      });
      navigate(`/trips/${response.data.data.trip_id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create trip');
    } finally {
      setLoading(false);
    }
  };

  if (destinations.loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 animate-fadeUp">
        <div>
          <h1 className="text-2xl font-semibold text-white">Create Trip</h1>
          <p className="mt-1 text-sm text-slate-400">Build a structured trip with destination, schedule, and traveler details.</p>
        </div>
        <Skeleton variant="card" count={1} className="min-h-[400px]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create Trip</h1>
        <p className="mt-1 text-sm text-slate-400">Build a structured trip with destination, schedule, and traveler details.</p>
      </div>
      {destinations.error ? <Alert title="Destination list unavailable" message={destinations.error} /> : null}
      {error ? <Alert message={error} /> : null}
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-200">Destination</span>
            <select
              value={form.destinationId}
              onChange={(event) => setForm({ ...form, destinationId: event.target.value })}
              className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-slate-100 outline-none"
            >
              <option value="">Select a destination</option>
              {destinationOptions.map((destination) => <option key={destination.destination_id} value={destination.destination_id}>{destination.destination_name}</option>)}
            </select>
          </label>
          <Input label="Trip title" value={form.tripTitle} onChange={(event) => setForm({ ...form, tripTitle: event.target.value })} />
          <Input label="Purpose" value={form.tripPurpose} onChange={(event) => setForm({ ...form, tripPurpose: event.target.value })} />
          <Input label="Start date" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
          <Input label="End date" type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
          <Input label="Travelers" type="number" min="1" value={form.travelerCount} onChange={(event) => setForm({ ...form, travelerCount: event.target.value })} />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">Status</span>
            <select value={form.tripStatus} onChange={(event) => setForm({ ...form, tripStatus: event.target.value })} className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-slate-100 outline-none">
              <option value="draft">Draft</option>
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <div className="md:col-span-2 flex justify-end">
            <Button size="lg" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Trip'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
