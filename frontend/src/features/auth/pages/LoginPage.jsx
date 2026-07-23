import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-10">
      <Card className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your trips, favorites, and shared itineraries.</p>
        </div>
        {error ? <Alert message={error} /> : null}
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button className="w-full" size="lg" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
        </form>
      </Card>
    </div>
  );
}
