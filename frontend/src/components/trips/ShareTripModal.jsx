import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Trash2, UserPlus, X } from 'lucide-react';

import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

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
      const response = await fetch(`http://localhost:5000/api/users/by-email/${encodeURIComponent(collabEmail)}`);
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
      {error ? <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Share Links</h3>
        {shareLinks.length ? (
          <div className="space-y-2">
            {shareLinks.map((link) => (
              <div key={link.share_link_id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">{link.share_token.slice(0, 8)}...</span>
                  <span className="rounded-full bg-ocean-500/15 px-2 py-0.5 text-xs text-ocean-100">{link.access_level}</span>
                  {link.revoked_at ? <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs text-rose-100">Revoked</span> : null}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(link.share_token)} className="rounded-lg bg-white/8 p-2 text-slate-300 hover:bg-white/12" title="Copy link">
                    {copiedId === link.share_token ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No share links yet. Generate one below.</p>
        )}
        <div className="mt-3 flex gap-2">
          <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none">
            <option value="view">View only</option>
            <option value="edit">Can edit</option>
          </select>
          <Button size="sm" onClick={handleGenerateLink} disabled={generating}>{generating ? 'Generating...' : 'Generate Link'}</Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Collaborators</h3>
        {collaborators.length ? (
          <div className="space-y-2">
            {collaborators.map((col) => (
              <div key={col.user_id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <div>
                  <span className="text-slate-200">{col.full_name || col.email}</span>
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{col.access_level}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${col.collaborator_status === 'accepted' ? 'bg-emerald-500/15 text-emerald-100' : 'bg-amber-500/15 text-amber-100'}`}>{col.collaborator_status}</span>
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
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 outline-none"
          />
          <select value={collabAccess} onChange={(e) => setCollabAccess(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none">
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