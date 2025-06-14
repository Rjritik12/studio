
import type { ReactNode } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 overflow-y-auto max-w-xl mx-auto w-full">
          {children}
        </main>
        {/* Optional: <AppFooter /> */}
      </SidebarInset>
    </>
  );
}
