import React, { useState } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 text-slate-50">
      <Navbar onMenuClick={() => setSidebarOpen((value) => !value)} />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar />
        </div>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
