import React from 'react';
import { Globe, Star, DollarSign } from 'lucide-react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const COST_COLORS = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', label: '$ Low' },
  medium: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200', label: '$$ Medium' },
  high: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', label: '$$$ High' },
  'very high': { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', label: '$$$$ Very High' },
};

function costStyle(level) {
  const key = (level || '').toLowerCase();
  return COST_COLORS[key] || { bg: 'bg-slate-50', text: 'text-slate-600', ring: 'ring-slate-200', label: level || 'Flexible' };
}

export default function DestinationCard({ destination, onSelect, onFavorite }) {
  const isPopular = (destination.popularity_score || 0) >= 90;
  const cs = costStyle(destination.average_cost_level);

  return (
    <div className="group rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative h-28 rounded-t-xl bg-gradient-to-r from-teal-600 to-teal-500 overflow-hidden">
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
          <DollarSign className="h-3 w-3" />
          <span>{destination.average_cost_level || 'Flexible'}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge tone={isPopular ? 'gold' : 'info'}>{destination.country}</Badge>
            <h3 className="mt-2 text-lg font-semibold text-slate-800">{destination.destination_name}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{destination.city}{destination.region ? `, ${destination.region}` : ''}</p>
          </div>
          <div className={`rounded-lg p-2 ${isPopular ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
            <Star className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{destination.summary || 'Explore curated destination details, weather, and hotels.'}</p>
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> {destination.popularity_score ? `${destination.popularity_score}/100` : '—'}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cs.bg} ${cs.text} ring-1 ${cs.ring}`}>
            {cs.label}
          </span>
        </div>
        <div className="mt-4 flex gap-3">
          <Button className="flex-1" onClick={() => onSelect?.(destination)}>Plan Trip</Button>
          <Button variant="secondary" className="flex-1" onClick={() => onFavorite?.(destination)}>Save</Button>
        </div>
      </div>
    </div>
  );
}
