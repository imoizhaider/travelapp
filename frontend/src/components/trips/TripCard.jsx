import React from 'react';
import { CalendarRange, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate, formatMoney } from '../../utils/formatters';

export default function TripCard({ trip, budget, destination }) {
  const dailyBudget = budget?.estimate?.total_estimated ? Math.round(budget.estimate.total_estimated / Math.max(1, trip?.traveler_count || 1)) : null;

  return (
    <Card className="group h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="info">{trip.trip_status}</Badge>
          <h3 className="mt-3 text-xl font-semibold text-white">{trip.trip_title}</h3>
          <p className="mt-1 text-sm text-slate-300">{destination?.destination_name || destination?.city || 'Destination unavailable'}</p>
        </div>
        <div className="rounded-2xl bg-white/8 p-3 text-ocean-300">
          <MapPin className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-slate-400"><CalendarRange className="h-4 w-4" /> Dates</div>
          <div className="mt-1 text-white">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-slate-400"><Users className="h-4 w-4" /> Travelers</div>
          <div className="mt-1 text-white">{trip.traveler_count}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-ocean-500/10 p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Estimated Budget</div>
          <div className="text-lg font-semibold text-white">{budget?.estimate ? formatMoney(budget.estimate.total_estimated, budget.estimate.currency_code) : 'Add budget'}</div>
        </div>
        {dailyBudget ? <Badge>{formatMoney(dailyBudget, budget?.estimate?.currency_code || 'USD')} / traveler</Badge> : null}
      </div>

      <div className="mt-5 flex gap-3">
        <Button className="flex-1" as={Link} to={`/trips/${trip.trip_id}`}>Open Trip</Button>
        <Button variant="secondary" className="flex-1" as={Link} to={`/create-trip?duplicate=${trip.trip_id}`}>Duplicate</Button>
      </div>
    </Card>
  );
}
