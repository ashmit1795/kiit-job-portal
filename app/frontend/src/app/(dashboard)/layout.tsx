"use client";

import { useAuth } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/features/auth/auth-guard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, User, FilePlus, Settings, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const routes = [
    { href: "/jobs", label: "Jobs Feed", icon: Briefcase, roles: ["student", "volunteer", "admin"] },
    { href: "/profile", label: "My Profile", icon: User, roles: ["student", "volunteer", "admin"] },
    { href: "/create-job", label: "Post Job", icon: FilePlus, roles: ["volunteer", "admin"] },
    { href: "/admin", label: "Admin Panel", icon: Settings, roles: ["admin"] },
  ];

  const visibleRoutes = routes.filter((route) => route.roles.includes(user?.role || "student"));

  const NavLinks = () => (
    <>
      {visibleRoutes.map((route) => {
        const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
        const Icon = route.icon;
        return (
          <Link key={route.href} href={route.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
        
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6 dark:bg-zinc-950 dark:border-zinc-800 shadow-sm">
          <Sheet>
            <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4 p-4 sm:max-w-xs">
              <div className="font-bold text-lg tracking-tight mb-4">KIIT Placement Component</div>
              <nav className="grid gap-2 text-lg font-medium">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <Link href="/jobs" className="hidden md:flex items-center gap-2 font-bold tracking-tight text-lg mr-auto">
              KIIT Placement Portal
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full ml-auto hover:ring-2 hover:ring-zinc-200 focus:outline-none dark:hover:ring-zinc-700 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.roll_number || "Admin"}</span>
                    <span className="text-xs text-zinc-500">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-500 font-medium focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Desktop Sidebar + Main Content */}
        <div className="flex flex-1 w-full max-w-7xl mx-auto md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="hidden md:flex border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex h-full flex-col gap-2 p-4 w-full">
              <nav className="grid items-start gap-2">
                <NavLinks />
              </nav>
            </div>
          </aside>
          
          <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        
      </div>
    </AuthGuard>
  );
}
