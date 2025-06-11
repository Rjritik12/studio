"use client"
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavLinks } from './NavLinks';

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-semibold group-data-[collapsible=icon]:hidden">EduVerse</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLinks />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
