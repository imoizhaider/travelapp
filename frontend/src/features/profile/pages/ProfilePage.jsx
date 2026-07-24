import React, { useState } from 'react';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';

import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Avatar from '../../../components/common/Avatar';
import { useAuth } from '../../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form] = useState({ fullName: user?.profile?.fullName || '', timezone: user?.profile?.timezone || '', bio: user?.profile?.bio || '' });

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Review your account details and preferences.</p>
      </div>
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={form.fullName || 'Traveler'} imageUrl={user?.profile?.avatarUrl} />
          <div>
            <div className="text-lg font-semibold text-white">{form.fullName || 'Traveler'}</div>
            <div className="text-sm text-slate-400">{user?.roleName}</div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" value={form.fullName} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
          <Input label="Timezone" value={form.timezone} readOnly />
          <Input label="Role" value={user?.roleName || ''} readOnly />
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-200">Bio</span>
            <textarea value={form.bio} readOnly rows={4} className="w-full rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-slate-100 outline-none" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" disabled><UserRound className="h-4 w-4" /> Edit profile</Button>
          <Button variant="secondary" disabled><Mail className="h-4 w-4" /> Change email</Button>
          <Button variant="secondary" disabled><ShieldCheck className="h-4 w-4" /> Security settings</Button>
        </div>
      </Card>
    </div>
  );
}
