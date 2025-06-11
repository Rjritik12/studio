"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HelpCircle, Swords, Users, LayoutGrid, User, BookOpen } from 'lucide-react';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/quiz', label: 'KBC Quiz', icon: HelpCircle },
  { href: '/battles', label: 'Online Battles', icon: Swords },
  { href: '/study-room', label: 'AI Study Room', icon: Users },
  { href: '/feed', label: 'Social Feed', icon: LayoutGrid },
  { href: '/profile', label: 'Profile', icon: User },
];

interface NavLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export function NavLinks({ isMobile = false, onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2", isMobile ? "mt-6" : "")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link href={item.href} key={item.label}>
            <SidebarMenuButton
              asChild={false}
              onClick={onLinkClick}
              isActive={pathname === item.href}
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
