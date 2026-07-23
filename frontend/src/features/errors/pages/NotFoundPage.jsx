import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center text-white">
      <div className="max-w-lg space-y-5">
        <div className="text-7xl font-black text-ocean-300">404</div>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-slate-400">The page you requested does not exist or has been moved.</p>
        <Button as={Link} to="/dashboard">Go to dashboard</Button>
      </div>
    </div>
  );
}
