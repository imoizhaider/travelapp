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
  const color = pct < 50 ? 'stroke-accent-gold' : pct < 80 ? 'stroke-emerald-400' : pct < 100 ? 'stroke-amber-400' : 'stroke-rose-400';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="18" cy="18" r={radius} fill="none" className={color} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-semibold text-white">{pct}%</span>
    </div>
  );
}

export default function TripCard({ trip, budget, destination }) {
  const estimate = budget?.estimate;
  const itemsTotal = (budget?.items || []).reduce((sum, item) => sum + Number(item.amount), 0);
  const isPremium = estimate?.total_estimated >= 5000;

  return (
    <Card variant={isPremium ? 'gold' : 'default'} className="group h-full transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={isPremium ? 'gold' : 'info'}>{trip.trip_status}</Badge>
          <h3 className="mt-3 text-lg font-semibold text-white">{trip.trip_title}</h3>
          <p className="mt-1 text-sm text-slate-400">{destination?.destination_name || destination?.city || 'Destination unavailable'}</p>
        </div>
        <div className="rounded-xl bg-white/8 p-2.5 text-slate-400">
          <MapPin className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400">
        <div className="rounded-xl border border-white/6 bg-white/3 p-3">
          <div className="flex items-center gap-2 text-slate-500"><CalendarRange className="h-4 w-4" /> Dates</div>
          <div className="mt-1 text-white">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</div>
        </div>
        <div className="rounded-xl border border-white/6 bg-white/3 p-3">
          <div className="flex items-center gap-2 text-slate-500"><Users className="h-4 w-4" /> Travelers</div>
          <div className="mt-1 text-white">{trip.traveler_count}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-white/3 p-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-slate-500">Budget</div>
          <div className="mt-0.5 text-base font-semibold text-white">{estimate ? formatMoney(estimate.total_estimated, estimate.currency_code) : 'Not set'}</div>
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
