'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-8 bg-[#090909] min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}