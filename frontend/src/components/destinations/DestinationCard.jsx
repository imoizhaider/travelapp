import React from 'react';
import { Globe, Star } from 'lucide-react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function DestinationCard({ destination, onSelect, onFavorite }) {
  const isPopular = (destination.popularity_score || 0) >= 90;

  return (
    <Card variant={isPopular ? 'gold' : 'default'} className="group h-full transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone={isPopular ? 'gold' : 'info'}>{destination.country}</Badge>
          <h3 className="mt-3 text-lg font-semibold text-white">{destination.destination_name}</h3>
          <p className="mt-1 text-sm text-slate-400">{destination.city}{destination.region ? `, ${destination.region}` : ''}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${isPopular ? 'bg-accent-gold/15 text-accent-gold' : 'bg-white/8 text-amber-300'}`}>
          <Star className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-400">{destination.summary || 'Explore curated destination details, weather, and hotels.'}</p>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/6 bg-white/3 px-4 py-3 text-sm text-slate-400">
        <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> {destination.popularity_score ? `${destination.popularity_score}/100` : '—'}</span>
        <span>{destination.average_cost_level || 'Flexible'}</span>
      </div>
      <div className="mt-4 flex gap-3">
        <Button className="flex-1" onClick={() => onSelect?.(destination)}>Plan Trip</Button>
        <Button variant="secondary" className="flex-1" onClick={() => onFavorite?.(destination)}>Save</Button>
      </div>
    </Card>
  );
}
