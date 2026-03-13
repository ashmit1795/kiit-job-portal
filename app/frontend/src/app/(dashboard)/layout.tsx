"use client";

import { useAuth } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/features/auth/auth-guard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, User, FilePlus, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routes = [
    { href: "/jobs", label: "Jobs Feed", icon: Briefcase, roles: ["student", "volunteer", "admin"] },
    { href: "/profile", label: "My Profile", icon: User, roles: ["student", "volunteer", "admin"] },
    { href: "/create-job", label: "Post Job", icon: FilePlus, roles: ["volunteer", "admin"] },
    { href: "/admin", label: "Admin Panel", icon: Settings, roles: ["admin"] },
  ];

  const visibleRoutes = routes.filter((route) => route.roles.includes(user?.role || "student"));

  const roleBadge = () => {
    if (user?.role === "admin") {
      return <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-700/30 text-xs font-medium">⚡ Admin</Badge>;
    }
    if (user?.role === "volunteer") {
      return <Badge className="bg-amber-600/20 text-amber-400 border-amber-700/30 text-xs font-medium">🎯 Volunteer</Badge>;
    }
    return null;
  };

  const NavLink = ({ route }: { route: typeof routes[0] }) => {
    const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
    const Icon = route.icon;
    return (
      <Link href={route.href} onClick={() => setMobileOpen(false)}>
        <div
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? "bg-emerald-600/15 text-emerald-400 border-l-2 border-emerald-500"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {route.label}
        </div>
      </Link>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6">
          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/jobs" className="flex items-center gap-2 font-bold tracking-tight text-lg mr-auto">
            <div className="h-7 w-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-black text-xs">A</div>
            <span className="hidden sm:inline-block">Avsaar</span>
          </Link>

          {/* User dropdown */}
          <div className="flex items-center gap-3">
            {roleBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full hover:ring-2 hover:ring-emerald-700/30 focus:outline-none transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-900/30 text-emerald-400 font-semibold text-xs">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{user?.roll_number || "Admin"}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-red-400 font-medium focus:text-red-400 focus:bg-red-950/30"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1 w-full max-w-7xl mx-auto">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-[220px] lg:w-[260px] border-r border-border/50 shrink-0">
            <div className="flex h-full flex-col gap-1.5 p-4 w-full sticky top-14 self-start">
              <nav className="grid gap-1">
                {visibleRoutes.map((route) => (
                  <NavLink key={route.href} route={route} />
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {mobileOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-14 bottom-0 w-64 bg-background border-r border-border/50 p-4 space-y-1 animate-in slide-in-from-left duration-200">
                {visibleRoutes.map((route) => (
                  <NavLink key={route.href} route={route} />
                ))}
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
