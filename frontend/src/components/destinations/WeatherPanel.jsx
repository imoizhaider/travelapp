import React from 'react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function WeatherPanel({ forecasts = [] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Weather</h3>
          <p className="text-sm text-slate-400">Forecast for the destination</p>
        </div>
        <Badge tone="info">Live</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {forecasts.length ? forecasts.map((forecast) => (
          <div key={`${forecast.destination_id}-${forecast.forecast_date}`} className="rounded-xl border border-white/6 bg-white/3 p-4">
            <div className="text-sm text-slate-400">{formatDate(forecast.forecast_date)}</div>
            <div className="mt-1 text-base font-semibold text-white">{forecast.weather_condition}</div>
            <div className="mt-1 text-sm text-slate-400">High {forecast.temperature_high_c ?? '—'}°C · Low {forecast.temperature_low_c ?? '—'}°C</div>
          </div>
        )) : <div className="col-span-full text-sm text-slate-500">No forecast data available yet.</div>}
      </div>
    </Card>
  );
}
