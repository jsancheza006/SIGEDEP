"use client";

import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';
import AdminGuard from '../components/AdminGuard';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="flex">
          <Sidebar isAdmin={true} />
          <div className="flex-1 flex flex-col min-h-screen pt-[80px]">
            <Header />
            <main className="p-6">{children}</main>
            <Toaster />
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
