
"use client"
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon, UserCircle, LogIn, LogOut, Loader2 } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { NavLinks } from './NavLinks';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export function AppHeader() {
  const { isMobile } = useSidebar();
  const { user, loading, logout } = useAuth(); // Get auth state and functions

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {isMobile ? (
         <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground">
             <NavLinks isMobile={true} />
          </SheetContent>
        </Sheet>
      ) : (
        <SidebarTrigger className="hidden md:flex" />
      )}

      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {/* In a real app, user.photoURL would be used if available */}
                  <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png?text=U"} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>
                    {user.email ? user.email.substring(0,1).toUpperCase() : <UserCircle className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile" passHref>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="ghost">
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" /> Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
