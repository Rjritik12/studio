
import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'EduVerse',
  description: 'Next-gen educational social web app',
  // PWA manifest link (you'll need to create public/manifest.json)
  manifest: '/manifest.json', 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // PRD Primary: #3498DB
  const primaryThemeColor = "#3498DB"; 

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content={primaryThemeColor} />
        {/* Recommended: Add favicon links here */}
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <AuthProvider>
          <SidebarProvider>
            <AppLayout>{children}</AppLayout>
          </SidebarProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
