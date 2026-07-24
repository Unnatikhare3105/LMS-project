'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Slidebar';
import Header from './Header';
import { useAppSelector } from '@/src/hooks/useAppSelector';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const sidebarOpen = useAppSelector((s: any) => s.ui.sidebarOpen);
  const { isAuthenticated } = useAppSelector((s: any) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}