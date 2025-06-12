
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HelpCircle, Swords, Users, LayoutGrid, User, BookOpen, LogIn, MessageCircle } from 'lucide-react'; // Added MessageCircle
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

const messagesNavItem = { href: '/messages', label: 'Messages', icon: MessageCircle, requiresAuth: true };
const profileNavItem = { href: '/profile', label: 'Profile', icon: User, requiresAuth: true };
const loginNavItem = { href: '/login', label: 'Login', icon: LogIn, requiresAuth: false };


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
      items.push(messagesNavItem); // Add messages link if user is logged in
      items.push(profileNavItem);
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
        {[...Array(6)].map((_, i) => ( // Increased array size for potential new item
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

        return (
          <Link href={item.href} key={item.label} passHref>
            <SidebarMenuButton
              asChild={false}
              onClick={onLinkClick}
              isActive={pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')} // More robust active check for nested routes
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
