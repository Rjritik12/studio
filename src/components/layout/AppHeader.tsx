
"use client"
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle
import { MenuIcon, UserCircle, LogIn, LogOut, Loader2, Bell, BarChart3, SettingsIcon as ProfileSettingsIcon } from 'lucide-react'; 
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { NavLinks } from './NavLinks';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AppHeader() {
  const { isMobile } = useSidebar();
  const { user, loading, logout } = useAuth();

  const getAvatarFallback = () => {
    if (user?.displayName) {
      return user.displayName.substring(0, 1).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 1).toUpperCase();
    }
    return <UserCircle className="h-6 w-6" />;
  };
  
  const currentUserPublicProfileLink = user ? `/profile/${encodeURIComponent(user.displayName || user.email?.split('@')[0] || 'me')}` : '/login';
  const accountSettingsLink = '/profile';


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md">
      {isMobile ? (
         <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col bg-sidebar text-sidebar-foreground p-0"> {/* Removed default padding */}
            <SheetHeader className="p-4 border-b border-sidebar-border"> {/* Header with its own padding and border */}
              <SheetTitle className="text-xl font-headline text-sidebar-primary">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto"> {/* Scrollable content area for NavLinks */}
              <NavLinks isMobile={true} /> {/* NavLinks already has mt-6 in mobile mode */}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <SidebarTrigger className="hidden md:flex" />
      )}

      <div className="flex w-full items-center justify-end gap-2 md:ml-auto md:gap-2 lg:gap-4">
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-muted-foreground text-sm text-center justify-center py-4">
                No new notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-center justify-center text-xs text-muted-foreground">
                Notification system coming soon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>

        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar" />
                  <AvatarFallback>
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || user.email || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={currentUserPublicProfileLink}> 
                  <UserCircle className="mr-2 h-4 w-4" /> 
                  My Public Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={accountSettingsLink}> 
                  <ProfileSettingsIcon className="mr-2 h-4 w-4" /> 
                  Edit Profile & Settings
                </Link>
              </DropdownMenuItem>
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
