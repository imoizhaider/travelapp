import React from 'react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatMoney } from '../../utils/formatters';

export default function HotelCard({ hotel, onBook, onFavorite }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge tone="info">{hotel.room_type}</Badge>
          <h3 className="mt-3 text-lg font-semibold text-white">{hotel.hotel_name}</h3>
          <p className="mt-1 text-sm text-slate-300">{hotel.hotel_description || 'Premium mock hotel listing for itinerary planning.'}</p>
        </div>
        <Badge>{hotel.star_rating || '—'}★</Badge>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        From <span className="text-base font-semibold text-white">{formatMoney(hotel.nightly_rate, hotel.currency_code)}</span> / night
      </div>
      <div className="mt-5 flex gap-3">
        <Button className="flex-1" onClick={() => onBook?.(hotel)}>Book Mock</Button>
        <Button variant="secondary" className="flex-1" onClick={() => onFavorite?.(hotel)}>Save</Button>
      </div>
    </Card>
  );
}
