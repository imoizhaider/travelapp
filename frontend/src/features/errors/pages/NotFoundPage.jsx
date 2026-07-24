import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-lg space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
          <Compass className="h-8 w-8 text-teal-600" />
        </div>
        <div className="text-7xl text-teal-600">404</div>
        <h1 className="text-2xl font-semibold text-slate-800">Page not found</h1>
        <p className="text-slate-500">The page you requested does not exist or has been moved.</p>
        <Button as={Link} to="/dashboard">Go to dashboard</Button>
      </div>
    </div>
  );
}
