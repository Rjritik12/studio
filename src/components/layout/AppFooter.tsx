
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, HelpCircle, User, LogIn, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function AppFooter() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItemsBase = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/feed', label: 'Feed', icon: LayoutGrid },
    { href: '/quiz', label: 'Quiz', icon: HelpCircle },
  ];

  const loggedInItems = [
    ...navItemsBase,
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const loggedOutItems = [
    ...navItemsBase,
    { href: '/login', label: 'Login', icon: LogIn },
  ];

  if (loading) {
    // Render a loading state or null for the footer during auth loading
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
            <div className="flex justify-around items-center h-full">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center p-2">
                        <div className="h-6 w-6 bg-muted rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-10 bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </footer>
    );
  }

  const currentNavItems = user ? loggedInItems : loggedOutItems;
  // Ensure we don't have too many items, cap at 5 for typical mobile footers
  const displayItems = currentNavItems.slice(0, 5);


  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex justify-around items-center h-full">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/profile' && pathname.startsWith('/profile/'));
          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center p-1 text-xs transition-colors w-1/5", // w-1/5 for up to 5 items
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
