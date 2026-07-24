import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import { useAuth } from '../../../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-3xl text-slate-800">Travel Planner</h1>
          <p className="mt-1 text-sm text-slate-500">Plan with precision</p>
        </div>
        <Card>
          <h2 className="text-xl font-semibold text-slate-800">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500">Get a premium workspace for travel planning, budgeting, and sharing.</p>
          {error ? <Alert title="Registration failed" message={error} /> : null}
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <Input label="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <Button className="w-full" size="lg" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
