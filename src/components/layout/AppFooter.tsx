
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, HelpCircle, UserCircle, LogIn, MessageSquare, Users } from 'lucide-react'; // Added Users icon
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function AppFooter() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Base items available to all or when logged out (if not auth-specific)
  const navItemsBase = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/feed', label: 'Feed', icon: LayoutGrid },
    { href: '/quiz', label: 'Quiz', icon: HelpCircle },
  ];

  // Items specifically for logged-in users
  const getLoggedInItems = () => {
    const publicProfileLink = user ? `/profile/${encodeURIComponent(user.displayName || user.email?.split('@')[0] || 'me')}` : '/login';
    return [
      ...navItemsBase,
      { href: '/study-room', label: 'AI Study', icon: Users }, // Changed from Messages to AI Study Room
      { href: publicProfileLink, label: 'Profile', icon: UserCircle },
    ];
  };

  // Items for logged-out users
  const loggedOutItems = [
    ...navItemsBase,
    { href: '/login', label: 'Login', icon: LogIn },
    // Add a placeholder or another relevant item if needed to fill up to 4-5 items for logged out users
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
  // Ensure we display a consistent number of items, typically 5 for a footer like this.
  const displayItems = [...currentNavItems].slice(0,5); 
   if (displayItems.length < 5 && !user) {
    // Example: Add a generic link or an empty placeholder if needed for layout consistency for logged-out users
   }


  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="flex justify-around items-center h-full">
        {displayItems.map((item) => {
          const Icon = item.icon;
          let isActive = pathname === item.href;

          // More specific active state logic for nested routes
           if (item.href !== '/' && pathname.startsWith(item.href)) {
            isActive = true;
          }
          if (item.label === 'Home' && pathname === '/') { // Ensure Home is only active for exact match
              isActive = true;
          } else if (item.label === 'Home' && pathname !== '/') {
              isActive = false;
          }


          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "flex flex-col items-center justify-center p-1 text-xs transition-colors w-1/5", // Ensure w-1/5 for 5 items
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
