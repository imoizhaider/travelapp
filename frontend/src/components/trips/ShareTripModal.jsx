import React, { useState } from 'react';
import { Check, Copy, UserPlus } from 'lucide-react';

import Modal from '../common/Modal';
import Button from '../common/Button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function ShareTripModal({ open, onClose, tripId, shareLinks, collaborators, onCreateShareLink, onAddCollaborator, onUpdateCollaborator }) {
  const [accessLevel, setAccessLevel] = useState('view');
  const [collabEmail, setCollabEmail] = useState('');
  const [collabAccess, setCollabAccess] = useState('view');
  const [generating, setGenerating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateLink = async () => {
    setGenerating(true);
    setError('');
    try {
      await onCreateShareLink({ accessLevel, expiresAt: null, revokedAt: null });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create share link');
    } finally {
      setGenerating(false);
    }
  };

  const handleInvite = async () => {
    if (!collabEmail) return;
    setInviting(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/by-email/${encodeURIComponent(collabEmail)}`);
      if (!response.ok) throw new Error('User not found');
      const { data: user } = await response.json();
      await onAddCollaborator({ userId: user.user_id, accessLevel: collabAccess, status: 'pending' });
      setCollabEmail('');
    } catch (err) {
      setError(err.message || 'Failed to invite collaborator');
    } finally {
      setInviting(false);
    }
  };

  const copyToClipboard = (token) => {
    const url = `${window.location.origin}/shared-trip/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(token);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <Modal open={open} title="Share Trip" onClose={onClose}>
      {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Share Links</h3>
        {shareLinks.length ? (
          <div className="space-y-2">
            {shareLinks.map((link) => (
              <div key={link.share_link_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">{link.share_token.slice(0, 8)}...</span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">{link.access_level}</span>
                  {link.revoked_at ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">Revoked</span> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(link.share_token)} className="rounded-lg bg-white p-2 text-slate-400 hover:bg-slate-100 transition shadow-sm" title="Copy link">
                    {copiedId === link.share_token ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No share links yet. Generate one below.</p>
        )}
        <div className="mt-3 flex gap-2">
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            <option value="view">View only</option>
            <option value="edit">Can edit</option>
          </select>
          <Button size="sm" onClick={handleGenerateLink} disabled={generating}>{generating ? 'Generating...' : 'Generate Link'}</Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Collaborators</h3>
        {collaborators.length ? (
          <div className="space-y-2">
            {collaborators.map((col) => (
              <div key={col.user_id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
                <div>
                  <span className="text-slate-700">{col.full_name || col.email}</span>
                  <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">{col.access_level}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${col.collaborator_status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{col.collaborator_status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No collaborators yet. Invite someone below.</p>
        )}
        <div className="mt-3 flex gap-2">
          <input
            value={collabEmail} onChange={(e) => setCollabEmail(e.target.value)} placeholder="User email..."
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <select value={collabAccess} onChange={(e) => setCollabAccess(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <Button size="sm" onClick={handleInvite} disabled={inviting || !collabEmail}>
            <UserPlus className="h-4 w-4" /> {inviting ? 'Sending...' : 'Invite'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
