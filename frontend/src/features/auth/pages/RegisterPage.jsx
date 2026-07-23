import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-10">
      <Card className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Get a premium workspace for travel planning, budgeting, and sharing.</p>
        </div>
        {error ? <Alert message={error} /> : null}
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input label="Full name" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button className="w-full" size="lg" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
        </form>
      </Card>
    </div>
  );
}
