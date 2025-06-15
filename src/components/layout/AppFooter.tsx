"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, HelpCircle, UserCircle, LogIn, MessageSquare, SettingsIcon as ProfileSettingsIcon } from 'lucide-react'; 
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

  const getLoggedInItems = () => {
    const publicProfileLink = user ? `/profile/${encodeURIComponent(user.displayName || user.email?.split('@')[0] || 'me')}` : '/login';
    return [
      ...navItemsBase,
      { href: '/messages', label: 'Messages', icon: MessageSquare },
      { href: publicProfileLink, label: 'Profile', icon: UserCircle }, // Public profile
      // { href: '/profile', label: 'Settings', icon: ProfileSettingsIcon }, // Settings page if needed as a 5th item
    ];
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
  // Ensure we always show 5 items, or fewer if not enough are defined
  const displayItems = currentNavItems.slice(0, 5); 


  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex justify-around items-center h-full">
        {displayItems.map((item) => {
          const Icon = item.icon;
          let isActive = pathname === item.href;
          
          // Check for dynamic profile route
          if (item.label === 'Profile' && pathname.startsWith('/profile/')) {
             isActive = pathname === item.href; // Ensure it matches the specific user's profile link
          } else if (item.label === 'Settings' && pathname === '/profile') {
             isActive = true; // For the settings page
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

