import React, { useState } from 'react';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { ITINERARY_CATEGORIES } from '../../lib/constants';

const emptyForm = {
  categoryId: '',
  itemDate: '',
  startTime: '',
  endTime: '',
  itemTitle: '',
  locationName: '',
  notes: '',
  estimatedCost: '',
  sortOrder: 1
};

export default function ItineraryItemForm({ open, onClose, onSave, tripStartDate, tripEndDate, initial }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial ? { ...initial, estimatedCost: initial.estimatedCost || '' } : { ...emptyForm, itemDate: tripStartDate || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.categoryId || !form.itemDate || !form.itemTitle) {
      setError('Category, date, and title are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        categoryId: Number(form.categoryId),
        itemDate: form.itemDate,
        startTime: form.startTime || null,
        endTime: form.endTime || null,
        itemTitle: form.itemTitle,
        locationName: form.locationName || null,
        notes: form.notes || null,
        estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : null,
        sortOrder: Number(form.sortOrder) || 1
      };
      await onSave(payload);
      if (!isEdit) setForm({ ...emptyForm, itemDate: tripStartDate || '' });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save itinerary item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Edit Itinerary Item' : 'Add Itinerary Item'} onClose={onClose}>
      {error ? <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Category *</span>
          <select value={form.categoryId} onChange={set('categoryId')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none">
            <option value="">Select category</option>
            {ITINERARY_CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </label>
        <Input label="Date *" type="date" value={form.itemDate} onChange={set('itemDate')} min={tripStartDate} max={tripEndDate} />
        <Input label="Start time" type="time" value={form.startTime} onChange={set('startTime')} />
        <Input label="End time" type="time" value={form.endTime} onChange={set('endTime')} />
        <Input label="Title *" value={form.itemTitle} onChange={set('itemTitle')} className="md:col-span-2" />
        <Input label="Location" value={form.locationName} onChange={set('locationName')} />
        <Input label="Estimated cost ($)" type="number" min="0" step="0.01" value={form.estimatedCost} onChange={set('estimatedCost')} />
        <Input label="Sort order" type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} />
        <label className="block space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Notes</span>
          <textarea value={form.notes} onChange={set('notes')} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none" />
        </label>
        <div className="flex justify-end gap-3 md:col-span-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
}