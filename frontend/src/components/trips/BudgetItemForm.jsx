import React, { useState } from 'react';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { BUDGET_CATEGORIES } from '../../lib/constants';

const emptyForm = {
  budgetCategoryId: '',
  itemDescription: '',
  amount: '',
  plannedDate: '',
  sortOrder: 1
};

export default function BudgetItemForm({ open, onClose, onSave, initial }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial ? { ...initial, amount: initial.amount || '' } : { ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.budgetCategoryId || !form.itemDescription || !form.amount) {
      setError('Category, description, and amount are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        budgetCategoryId: Number(form.budgetCategoryId),
        itemDescription: form.itemDescription,
        amount: Number(form.amount),
        plannedDate: form.plannedDate || null,
        sortOrder: Number(form.sortOrder) || 1
      };
      await onSave(payload);
      if (!isEdit) setForm({ ...emptyForm });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save budget item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Edit Budget Item' : 'Add Budget Item'} onClose={onClose}>
      {error ? <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-200">Category *</span>
          <select value={form.budgetCategoryId} onChange={set('budgetCategoryId')} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none">
            <option value="">Select category</option>
            {BUDGET_CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </label>
        <Input label="Amount ($) *" type="number" min="0" step="0.01" value={form.amount} onChange={set('amount')} />
        <Input label="Description *" value={form.itemDescription} onChange={set('itemDescription')} className="md:col-span-2" />
        <Input label="Planned date" type="date" value={form.plannedDate} onChange={set('plannedDate')} />
        <Input label="Sort order" type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} />
        <div className="flex justify-end gap-3 md:col-span-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </Modal>
  );
}