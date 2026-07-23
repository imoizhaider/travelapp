import React, { useMemo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Plus, Share2 } from 'lucide-react';

import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Badge from '../../../components/common/Badge';
import WeatherPanel from '../../../components/destinations/WeatherPanel';
import HotelCard from '../../../components/destinations/HotelCard';
import ItineraryItemForm from '../../../components/trips/ItineraryItemForm';
import BudgetSection from '../../../components/trips/BudgetSection';
import ShareTripModal from '../../../components/trips/ShareTripModal';
import { useApi } from '../../../hooks/useApi';
import { tripsService } from '../../../services/trips.service';
import { destinationsService } from '../../../services/destinations.service';
import { hotelsService } from '../../../services/hotels.service';
import { formatDate, formatMoney } from '../../../utils/formatters';

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [editingItineraryItem, setEditingItineraryItem] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const tripState = useApi(() => tripsService.getById(tripId), [tripId]);
  const budgetState = useApi(() => tripsService.getBudget(tripId), [tripId]);
  const itineraryState = useApi(() => tripsService.listItinerary(tripId), [tripId]);
  const shareLinksState = useApi(() => tripsService.listShareLinks(tripId), [tripId]);
  const collaboratorsState = useApi(() => tripsService.listCollaborators(tripId), [tripId]);

  const destinationId = tripState.data?.destination_id;
  const weatherState = useApi(() => (destinationId ? destinationsService.getWeather(destinationId) : Promise.resolve({ data: [] })), [destinationId]);
  const hotelState = useApi(() => (destinationId ? hotelsService.listByDestination(destinationId) : Promise.resolve({ data: [] })), [destinationId]);

  const trip = tripState.data;
  const itinerary = itineraryState.data || [];
  const budget = budgetState.data;
  const shareLinks = shareLinksState.data || [];
  const collaborators = collaboratorsState.data || [];
  const weather = weatherState.data || [];
  const hotels = hotelState.data || [];

  const groupedItinerary = useMemo(() => {
    const groups = new Map();
    itinerary.forEach((item) => {
      const key = item.item_date;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return groups;
  }, [itinerary]);

  const refreshAll = useCallback(() => {
    tripState.refetch();
    budgetState.refetch();
    itineraryState.refetch();
    shareLinksState.refetch();
    collaboratorsState.refetch();
    if (destinationId) {
      weatherState.refetch();
      hotelState.refetch();
    }
  }, [destinationId]);

  const handleAddItineraryItem = useCallback(async (payload) => {
    await tripsService.addItineraryItem(tripId, payload);
    itineraryState.refetch();
  }, [tripId]);

  const handleUpdateItineraryItem = useCallback(async (itemId, payload) => {
    await tripsService.updateItineraryItem(itemId, payload);
    itineraryState.refetch();
  }, []);

  const handleDeleteItineraryItem = useCallback(async (itemId) => {
    await tripsService.deleteItineraryItem(itemId);
    itineraryState.refetch();
  }, []);

  const handleSaveBudget = useCallback(async (payload) => {
    await tripsService.saveBudget(tripId, payload);
    budgetState.refetch();
  }, [tripId]);

  const handleAddBudgetItem = useCallback(async (payload) => {
    await tripsService.addBudgetItem(tripId, payload);
    budgetState.refetch();
  }, [tripId]);

  const handleCreateShareLink = useCallback(async (payload) => {
    await tripsService.createShareLink(tripId, payload);
    shareLinksState.refetch();
  }, [tripId]);

  const handleAddCollaborator = useCallback(async (payload) => {
    await tripsService.addCollaborator(tripId, payload);
    collaboratorsState.refetch();
  }, [tripId]);

  const handleUpdateCollaborator = useCallback(async (userId, payload) => {
    await tripsService.updateCollaborator(tripId, userId, payload);
    collaboratorsState.refetch();
  }, [tripId]);

  if (tripState.loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader label="Loading trip details..." /></div>;
  }

  if (!trip) {
    if (tripState.error) {
      return <div className="space-y-4"><Alert title="Trip details unavailable" message={tripState.error} /><EmptyState title="Trip unavailable" description="The trip could not be loaded from the API." /></div>;
    }
    return <EmptyState title="Trip not found" description="This trip may have been removed or you may not have access." />;
  }

  return (
    <div className="space-y-8 animate-fadeUp">
      {budgetState.error ? <Alert title="Budget unavailable" message={budgetState.error} /> : null}
      {itineraryState.error ? <Alert title="Itinerary unavailable" message={itineraryState.error} /> : null}
      {weatherState.error ? <Alert title="Weather unavailable" message={weatherState.error} /> : null}

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-gradient-to-br from-white/8 to-ocean-500/10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="info">{trip.trip_status}</Badge>
            <Badge>{trip.destination_name}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white">{trip.trip_title}</h1>
          <p className="mt-2 text-sm text-slate-300">{trip.city}, {trip.country}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><CalendarDays className="h-4 w-4" /> {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><MapPin className="h-4 w-4" /> {trip.traveler_count} traveler{trip.traveler_count > 1 ? 's' : ''}</span>
          </div>
          <div className="mt-5 flex gap-3">
            <Button variant="secondary" onClick={() => setShowShareModal(true)}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="text-sm text-slate-400">Trip Purpose</div>
            <div className="mt-1 text-lg font-semibold text-white">{trip.trip_purpose || 'Not specified'}</div>
          </Card>
          <Card>
            <div className="text-sm text-slate-400">Trip Budget</div>
            <div className="mt-1 text-lg font-semibold text-white">{budget?.estimate ? formatMoney(budget.estimate.total_estimated, budget.estimate.currency_code) : 'Not set'}</div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Itinerary</h2>
              <p className="text-sm text-slate-400">Day-by-day travel plans.</p>
            </div>
            <Button variant="secondary" onClick={() => { setEditingItineraryItem(null); setShowItineraryForm(true); }}>
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
          {itinerary.length ? Array.from(groupedItinerary.entries()).map(([date, items]) => (
            <div key={date} className="mb-5">
              <div className="mb-3 text-sm font-semibold text-ocean-300">{formatDate(date)}</div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.itinerary_item_id} className="rounded-2xl border border-white/10 bg-white/5 p-4 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{item.item_title}</span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{item.category_name}</span>
                          {item.is_completed ? <Badge tone="success">Done</Badge> : <Badge>Planned</Badge>}
                        </div>
                        <div className="mt-1 text-sm text-slate-400">
                          {item.start_time ? <span>{item.start_time.slice(0, 5)}{item.end_time ? ` - ${item.end_time.slice(0, 5)}` : ''} · </span> : null}
                          {item.location_name ? <span>{item.location_name} · </span> : null}
                          {item.estimated_cost ? <span>{formatMoney(item.estimated_cost)}</span> : null}
                        </div>
                        {item.notes ? <p className="mt-2 text-sm text-slate-400">{item.notes}</p> : null}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditingItineraryItem(item); setShowItineraryForm(true); }} className="rounded-lg bg-white/8 p-1.5 text-slate-300 hover:bg-white/12" title="Edit">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteItineraryItem(item.itinerary_item_id)} className="rounded-lg bg-white/8 p-1.5 text-rose-300 hover:bg-rose-500/20" title="Delete">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )) : <EmptyState title="No itinerary items yet" description="Add flights, hotel stays, meals, and activities to structure the trip." />}
        </Card>

        <div className="space-y-5">
          <WeatherPanel forecasts={weather} />
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Sharing</h2>
                <p className="text-sm text-slate-400">Collaborators and share links</p>
              </div>
              <Share2 className="h-5 w-5 text-ocean-300" />
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Collaborators</span>
                <span className="font-semibold text-white">{collaborators.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Share links</span>
                <span className="font-semibold text-white">{shareLinks.length}</span>
              </div>
              {collaborators.slice(0, 3).map((c) => (
                <div key={c.user_id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-slate-200">{c.full_name || c.email}</span>
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{c.access_level}</span>
                </div>
              ))}
              <Button variant="secondary" size="sm" className="w-full" onClick={() => setShowShareModal(true)}>
                <Share2 className="h-4 w-4" /> Manage Sharing
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <BudgetSection
        budget={budget}
        tripId={tripId}
        onSaveBudget={handleSaveBudget}
        onAddItem={handleAddBudgetItem}
        onUpdateItem={async (itemId, payload) => { await tripsService.updateBudgetItem(itemId, payload); budgetState.refetch(); }}
        onDeleteItem={async (itemId) => { await tripsService.deleteBudgetItem(itemId); budgetState.refetch(); }}
        onRefresh={() => budgetState.refetch()}
      />

      <section>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Hotels</h2>
              <p className="text-sm text-slate-400">Mock hotel listings for planning and budget comparison.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hotels.length ? hotels.slice(0, 6).map((hotel) => (
              <HotelCard key={hotel.hotel_id} hotel={hotel} onBook={(h) => alert(`Mock booking for ${h.hotel_name}`)} onFavorite={(h) => alert(`Save ${h.hotel_name} to favorites`)} />
            )) : <div className="md:col-span-2 xl:col-span-3 text-sm text-slate-400">No hotel listings available for this destination.</div>}
          </div>
        </Card>
      </section>

      <ItineraryItemForm
        open={showItineraryForm}
        onClose={() => { setShowItineraryForm(false); setEditingItineraryItem(null); }}
        onSave={editingItineraryItem
          ? (payload) => handleUpdateItineraryItem(editingItineraryItem.itinerary_item_id, payload)
          : handleAddItineraryItem
        }
        tripStartDate={trip.start_date}
        tripEndDate={trip.end_date}
        initial={editingItineraryItem ? {
          categoryId: editingItineraryItem.category_id,
          itemDate: editingItineraryItem.item_date,
          startTime: editingItineraryItem.start_time,
          endTime: editingItineraryItem.end_time,
          itemTitle: editingItineraryItem.item_title,
          locationName: editingItineraryItem.location_name,
          notes: editingItineraryItem.notes,
          estimatedCost: editingItineraryItem.estimated_cost,
          sortOrder: editingItineraryItem.sort_order || 1
        } : null}
      />

      <ShareTripModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        tripId={tripId}
        shareLinks={shareLinks}
        collaborators={collaborators}
        onCreateShareLink={handleCreateShareLink}
        onAddCollaborator={handleAddCollaborator}
        onUpdateCollaborator={handleUpdateCollaborator}
      />
    </div>
  );
}