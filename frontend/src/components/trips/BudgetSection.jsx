import React, { useState } from 'react';
import { Edit3, Plus, Trash2, Wallet } from 'lucide-react';

import Card from '../common/Card';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import BudgetItemForm from './BudgetItemForm';
import { formatMoney } from '../../utils/formatters';
import { BUDGET_CATEGORIES } from '../../lib/constants';

const categoryName = (id) => BUDGET_CATEGORIES.find((c) => c.id === id)?.name || 'Other';

export default function BudgetSection({ budget, tripId, onSaveBudget, onAddItem, onUpdateItem, onDeleteItem, onRefresh }) {
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    currencyCode: budget?.estimate?.currency_code || 'USD',
    totalEstimated: budget?.estimate?.total_estimated || 0,
    contingencyAmount: budget?.estimate?.contingency_amount || 0
  });
  const [savingBudget, setSavingBudget] = useState(false);

  const estimate = budget?.estimate || null;
  const items = budget?.items || [];

  const totalItems = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const savingsRatio = estimate?.total_estimated ? (estimate.total_estimated - totalItems) / estimate.total_estimated : 0;
  const isUnderBudget = savingsRatio >= 0.3;

  const handleSaveBudget = async () => {
    setSavingBudget(true);
    try {
      await onSaveBudget({
        currencyCode: budgetForm.currencyCode,
        totalEstimated: Number(budgetForm.totalEstimated),
        contingencyAmount: Number(budgetForm.contingencyAmount)
      });
      setShowBudgetForm(false);
      onRefresh();
    } catch (err) {
      // error will be shown by parent
    } finally {
      setSavingBudget(false);
    }
  };

  const handleAddItem = async (payload) => {
    await onAddItem(payload);
    onRefresh();
  };

  const handleUpdateItem = async (payload) => {
    await onUpdateItem(editingItem.budget_item_id, payload);
    setEditingItem(null);
    onRefresh();
  };

  const handleDeleteItem = async (itemId) => {
    await onDeleteItem(itemId);
    onRefresh();
  };

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-teal-600" />
          <div>
            <h2 className="text-base font-semibold text-slate-800">Budget</h2>
            <p className="text-sm text-slate-500">Track lodging, transport, food, and more</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowBudgetForm(true)}>
            <Edit3 className="h-4 w-4" /> {estimate ? 'Edit' : 'Set Budget'}
          </Button>
          {estimate ? <Button size="sm" onClick={() => setShowItemForm(true)}><Plus className="h-4 w-4" /> Add</Button> : null}
        </div>
      </div>

      {estimate ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className={`rounded-lg border p-4 ${isUnderBudget ? 'border-teal-200 bg-teal-50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="text-xs uppercase tracking-wide text-slate-500">Total Estimated</div>
            <div className="mt-1 text-xl font-semibold text-slate-800">{formatMoney(estimate.total_estimated, estimate.currency_code)}</div>
            {isUnderBudget ? <div className="mt-1 text-xs text-teal-600">Under budget</div> : null}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Items Total</div>
            <div className="mt-1 text-xl font-semibold text-slate-800">{formatMoney(totalItems, estimate.currency_code)}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Contingency</div>
            <div className="mt-1 text-xl font-semibold text-teal-600">{formatMoney(estimate.contingency_amount, estimate.currency_code)}</div>
          </div>
        </div>
      ) : null}

      {estimate && items.length ? (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-slate-600">Expense Breakdown</div>
          {items.map((item) => (
            <div key={item.budget_item_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm group">
              <div>
                <span className="text-slate-700">{item.item_description}</span>
                <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">{item.category_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-800 font-medium">{formatMoney(item.amount, estimate.currency_code)}</span>
                <button onClick={() => { setEditingItem(item); setShowItemForm(true); }} className="opacity-0 group-hover:opacity-100 rounded-lg bg-white p-1.5 text-slate-400 hover:bg-slate-100 transition shadow-sm">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDeleteItem(item.budget_item_id)} className="opacity-0 group-hover:opacity-100 rounded-lg bg-white p-1.5 text-red-400 hover:bg-red-50 transition shadow-sm">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!estimate ? (
        <div className="mt-4">
          <EmptyState title="No budget set" description="Set a total budget and add expense items to track spending." />
        </div>
      ) : null}

      {showBudgetForm ? (
        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">{estimate ? 'Edit Budget' : 'Set Budget'}</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-xs text-slate-500">Currency</span>
              <select value={budgetForm.currencyCode} onChange={(e) => setBudgetForm({ ...budgetForm, currencyCode: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="IDR">IDR</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-500">Total Estimated</span>
              <input type="number" min="0" value={budgetForm.totalEstimated} onChange={(e) => setBudgetForm({ ...budgetForm, totalEstimated: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-500">Contingency</span>
              <input type="number" min="0" value={budgetForm.contingencyAmount} onChange={(e) => setBudgetForm({ ...budgetForm, contingencyAmount: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none" />
            </label>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowBudgetForm(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveBudget} disabled={savingBudget}>{savingBudget ? 'Saving...' : 'Save Budget'}</Button>
          </div>
        </div>
      ) : null}

      <BudgetItemForm
        open={showItemForm}
        onClose={() => { setShowItemForm(false); setEditingItem(null); }}
        onSave={editingItem ? handleUpdateItem : handleAddItem}
        initial={editingItem ? { budgetCategoryId: editingItem.budget_category_id, itemDescription: editingItem.item_description, amount: editingItem.amount, plannedDate: editingItem.planned_date, sortOrder: editingItem.sort_order } : null}
      />
    </Card>
  );
}
