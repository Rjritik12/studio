
import type { ReactNode } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { AppFooter } from './AppFooter'; // Import the new AppFooter

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="flex flex-col"> {/* Ensures SidebarInset can manage header, main, footer in a column */}
        <AppHeader />
        <main className="flex-1 p-4 overflow-y-auto pb-20 md:pb-4"> {/* Adjusted padding-bottom for mobile */}
          {children}
        </main>
        <AppFooter /> {/* Add AppFooter here, it will be fixed positioned by its own styles */}
      </SidebarInset>
    </>
  );
}
