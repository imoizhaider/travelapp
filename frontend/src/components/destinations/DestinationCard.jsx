import React from 'react';
import { Globe, Star } from 'lucide-react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function DestinationCard({ destination, onSelect, onFavorite }) {
  return (
    <Card className="h-full transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="info">{destination.country}</Badge>
          <h3 className="mt-3 text-xl font-semibold text-white">{destination.destination_name}</h3>
          <p className="mt-1 text-sm text-slate-300">{destination.city}{destination.region ? `, ${destination.region}` : ''}</p>
        </div>
        <div className="rounded-2xl bg-white/8 p-3 text-amber-300">
          <Star className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-slate-300">{destination.summary || 'Explore curated destination details, weather, and hotels.'}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Popularity {destination.popularity_score || '—'}</span>
        <span>{destination.average_cost_level || 'Flexible'}</span>
      </div>
      <div className="mt-5 flex gap-3">
        <Button className="flex-1" onClick={() => onSelect?.(destination)}>Plan Trip</Button>
        <Button variant="secondary" className="flex-1" onClick={() => onFavorite?.(destination)}>Save</Button>
      </div>
    </Card>
  );
}
