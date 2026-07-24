import React from 'react';
import { CalendarRange, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatDate, formatMoney } from '../../utils/formatters';

function BudgetArc({ spent, total, currencyCode }) {
  if (!total || total <= 0) return null;
  const ratio = Math.min(spent / total, 1);
  const pct = Math.round(ratio * 100);
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);
  const color = pct < 50 ? 'stroke-teal-500' : pct < 80 ? 'stroke-emerald-500' : pct < 100 ? 'stroke-amber-500' : 'stroke-red-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="3" />
        <circle cx="18" cy="18" r={radius} fill="none" className={color} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-semibold text-slate-600">{pct}%</span>
    </div>
  );
}

export default function TripCard({ trip, budget, destination }) {
  const estimate = budget?.estimate;
  const itemsTotal = (budget?.items || []).reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Card className="group h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="info">{trip.trip_status}</Badge>
          <h3 className="mt-2 text-lg font-semibold text-slate-800">{trip.trip_title}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{destination?.destination_name || destination?.city || 'Destination unavailable'}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-400">
          <MapPin className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500">
        <div className="rounded-lg bg-teal-50 p-3">
          <div className="flex items-center gap-2 text-slate-500"><CalendarRange className="h-4 w-4" /> Dates</div>
          <div className="mt-1 font-medium text-slate-800">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</div>
        </div>
        <div className="rounded-lg bg-teal-50 p-3">
          <div className="flex items-center gap-2 text-slate-500"><Users className="h-4 w-4" /> Travelers</div>
          <div className="mt-1 font-medium text-slate-800">{trip.traveler_count}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-slate-500">Budget</div>
          <div className="mt-0.5 text-base font-semibold text-slate-800">{estimate ? formatMoney(estimate.total_estimated, estimate.currency_code) : 'Not set'}</div>
        </div>
        {estimate ? <BudgetArc spent={itemsTotal} total={estimate.total_estimated} currencyCode={estimate.currency_code} /> : null}
      </div>

      <div className="mt-4 flex gap-3">
        <Button className="flex-1" as={Link} to={`/trips/${trip.trip_id}`}>Open Trip</Button>
        <Button variant="secondary" className="flex-1" as={Link} to={`/create-trip?duplicate=${trip.trip_id}`}>Duplicate</Button>
      </div>
    </Card>
  );
}
