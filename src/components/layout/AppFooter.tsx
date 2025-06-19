
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, HelpCircle, UserCircle, LogIn, MessageSquare, Users, BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function AppFooter() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItemsBase = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/modules', label: 'Learn', icon: BookCopy },
    { href: '/quiz', label: 'Quiz', icon: HelpCircle },
    { href: '/feed', label: 'Feed', icon: LayoutGrid },
  ];

  const getLoggedInItems = () => {
    const publicProfileLink = user ? `/profile/${encodeURIComponent(user.displayName || user.email?.split('@')[0] || 'me')}` : '/login';
    return [
      ...navItemsBase,
      { href: publicProfileLink, label: 'Profile', icon: UserCircle },
    ].filter(Boolean);
  };

  const loggedOutItems = [
    ...navItemsBase,
    { href: '/login', label: 'Login', icon: LogIn },
  ];

  if (loading) {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
            <div className="flex justify-around items-center h-full">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center p-2 w-1/5">
                        <div className="h-6 w-6 bg-muted rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-10 bg-muted rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </footer>
    );
  }

  const currentNavItems = user ? getLoggedInItems() : loggedOutItems;
  // Ensure we always show up to 5 items. Profile or Login will be the 5th.
  const displayItems = [...currentNavItems].slice(0, 5);


  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex justify-around items-center h-full">
        {displayItems.map((item) => {
          const Icon = item.icon;
          let isActive = pathname === item.href;
          // More specific active state for non-home routes to avoid highlighting /feed for /feed/post-id etc.
          // Home is exact match, others are startsWith, profile is also exact match or startsWith specific user profile path
          if (item.href === '/') {
            isActive = pathname === '/';
          } else if (item.label === 'Profile') {
            // Profile link is active if the pathname exactly matches the generated profile link
            // or if it starts with /profile/ and ends with the user's specific identifier or 'me'
            isActive = pathname === item.href || (pathname.startsWith('/profile/') && pathname.endsWith(item.href.substring(item.href.lastIndexOf('/') + 1)));
          }
          else {
            isActive = pathname.startsWith(item.href);
          }


          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center p-1 text-xs transition-colors w-1/5",
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
