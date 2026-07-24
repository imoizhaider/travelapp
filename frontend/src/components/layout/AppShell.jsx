import React from 'react';

import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
