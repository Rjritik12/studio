
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HelpCircle, Swords, Users, LayoutGrid, UserCircle, BookOpen, LogIn, MessageSquare, SettingsIcon as ProfileSettingsIcon } from 'lucide-react'; 
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext'; 

const navItemsBase = [
  { href: '/', label: 'Dashboard', icon: Home, requiresAuth: false },
  { href: '/quiz', label: 'KBC Quiz', icon: HelpCircle, requiresAuth: false },
  { href: '/battles', label: 'Online Battles', icon: Swords, requiresAuth: false },
  { href: '/study-room', label: 'AI Study Room', icon: Users, requiresAuth: false },
  { href: '/feed', label: 'Social Feed', icon: LayoutGrid, requiresAuth: false },
];

const publicProfileNavItem = (username: string) => ({ 
  href: `/profile/${encodeURIComponent(username)}`, 
  label: 'Profile', // Changed from "My Profile" for conciseness
  icon: UserCircle, 
  requiresAuth: true 
});

// Removed accountSettingsNavItem as it's now primarily in AppHeader dropdown

const loginNavItem = { href: '/login', label: 'Login', icon: LogIn, requiresAuth: false };
const messagesNavItem = { href: '/messages', label: 'Messages', icon: MessageSquare, requiresAuth: true };


interface NavLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function NavLinks({ isMobile = false, onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const getNavItems = () => {
    if (loading) return []; 
    
    const items = [...navItemsBase];
    if (user) {
      items.push(messagesNavItem); 
      const userProfileName = user.displayName || user.email?.split('@')[0] || 'me';
      items.push(publicProfileNavItem(userProfileName));
      // The "Account Settings" link is now primarily in the AppHeader dropdown
    } else {
      if (pathname !== '/login' && pathname !== '/signup') {
         items.push(loginNavItem);
      }
    }
    return items;
  };

  const currentNavItems = getNavItems();

  if (loading && !isMobile) { 
    return (
      <div className={cn("flex flex-col gap-2", isMobile ? "mt-6" : "")}>
        {[...Array(6)].map((_, i) => ( // Adjusted for potentially fewer items
          <SidebarMenuButton key={i} asChild={false} disabled className={cn("justify-start", isMobile && "text-lg py-3")}>
             <div className="mr-2 h-5 w-5 bg-muted rounded animate-pulse" />
             <span className="h-4 w-24 bg-muted rounded animate-pulse" />
          </SidebarMenuButton>
        ))}
      </div>
    );
  }


  return (
    <nav className={cn("flex flex-col gap-2", isMobile ? "mt-6" : "")}>
      {currentNavItems.map((item) => {
        const Icon = item.icon;
        if (item.requiresAuth && !user && !loading) {
          return null; 
        }
        
        let isActive = pathname === item.href;
        // Special handling for dynamic /profile/[username] routes for "Profile"
        if (item.label === 'Profile' && pathname.startsWith('/profile/') && item.href.startsWith('/profile/')) {
            isActive = pathname === item.href;
        } else if (item.label !== 'Dashboard' && pathname.startsWith(item.href) && item.href !== '/') {
             // For other non-dynamic routes like /feed, /quiz etc. make sure it's not dashboard
            isActive = true;
        }


        return (
          <Link href={item.href} key={item.label} passHref>
            <SidebarMenuButton
              asChild={false}
              onClick={onLinkClick}
              isActive={isActive} 
              tooltip={item.label}
              className={cn(
                "justify-start",
                isMobile && "text-lg py-3"
              )}
            >
              <Icon className="mr-2 h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        );
      })}
    </nav>
  );
}
