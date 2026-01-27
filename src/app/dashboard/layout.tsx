'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Database, User, LogOut, Menu, X, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardContent>{children}
      {/* <ChatbotWidget
        apiUrl="http://localhost:9002/api"
        apiKey="sk_uL1Uo7HTSpLn9V6REwEYMxSD7X8wVtEF"
      fontSize="15px"
      headerFontSize="15px"
      smallFontSize="15px"
      enableContactSupport={true}  // New prop!
       
      /> */}
      </DashboardContent>
    </ProtectedRoute>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { tenant, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Support Tickets',
      href: '/dashboard/tickets',
      icon: Ticket,
    },
    {
      name: 'Add Your Data',
      href: '/dashboard/data',
      icon: Database,
    },
    {
      name: 'Account Settings',
      href: '/dashboard/tenant',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-20 items-center justify-between px-4 md:px-8">
          {/* Logo and Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="h-12 w-12 relative rounded-lg  flex items-center justify-center">
              <Image src="/logo.png" alt="FyreBot Logo" fill className="object-contain p-1" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl tracking-tight">FyreBot</h1>
              {/* <p className="text-xs text-muted-foreground -mt-1">Dashboard</p> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto pl-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`gap-2 transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Section - User and Actions */}
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {/* User Info - Desktop Only */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {tenant?.name.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="font-medium text-sm leading-none">{tenant?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{tenant?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            {/* toggle theme button  */}




            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-muted/30 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl">{children}</main>
    </div>
  );
}
