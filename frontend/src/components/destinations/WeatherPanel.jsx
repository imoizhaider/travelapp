import React from 'react';

import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function WeatherPanel({ forecasts = [] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Weather</h3>
          <p className="text-sm text-slate-300">Forecast for the selected destination</p>
        </div>
        <Badge tone="info">Live API</Badge>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {forecasts.length ? forecasts.map((forecast) => (
          <div key={`${forecast.destination_id}-${forecast.forecast_date}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm text-slate-300">{formatDate(forecast.forecast_date)}</div>
            <div className="mt-1 text-lg font-semibold text-white">{forecast.weather_condition}</div>
            <div className="mt-2 text-sm text-slate-300">High {forecast.temperature_high_c ?? '—'}°C · Low {forecast.temperature_low_c ?? '—'}°C</div>
          </div>
        )) : <div className="text-sm text-slate-400">No forecast data available yet.</div>}
      </div>
    </Card>
  );
}
