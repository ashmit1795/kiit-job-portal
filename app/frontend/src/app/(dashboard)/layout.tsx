"use client";

import { useAuth } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/features/auth/auth-guard";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  const router = useRouter();
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
    const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const fromAdmin = searchParams.get("from") === "admin";
    
    let isActive = false;
    if (route.href === "/jobs") {
      // "Jobs Feed" should be active on /jobs but NOT on /jobs/[id]?from=admin
      isActive = pathname === "/jobs" || (pathname.startsWith("/jobs/") && !fromAdmin);
    } else if (route.href === "/admin") {
      // "Admin Panel" should be active on /admin AND on /jobs/[id]?from=admin
      isActive = pathname === "/admin" || pathname.startsWith("/admin/") || (pathname.startsWith("/jobs/") && fromAdmin);
    } else {
      isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
    }
    const Icon = route.icon;
    return (
      <Link href={route.href} onClick={() => setMobileOpen(false)}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? "bg-emerald-600/15 text-emerald-400"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">{route.label}</span>
        </div>
      </Link>
    );
  };

  // Get user display name
  const displayName = user?.full_name || user?.roll_number || "User";
  const avatarFallback = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header with integrated navigation */}
        <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6">
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link href="/jobs" className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <div className="h-7 w-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-black text-xs">A</div>
            <span className="hidden sm:inline-block">Avsaar</span>
          </Link>

          {/* Desktop Nav Links — inline in header */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {visibleRoutes.map((route) => (
              <NavLink key={route.href} route={route} />
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* User section */}
          <div className="flex items-center gap-3">
            {roleBadge()}
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full hover:ring-2 hover:ring-emerald-700/30 focus:outline-none transition-all">
                <Avatar className="h-8 w-8">
                  {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={displayName} />}
                  <AvatarFallback className="bg-emerald-900/30 text-emerald-400 font-semibold text-xs">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{displayName}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  {(user?.role === "volunteer" || user?.role === "admin") && (
                    <DropdownMenuItem
                      onClick={() => router.push("/create-job")}
                      className="cursor-pointer"
                    >
                      <FilePlus className="mr-2 h-4 w-4" /> Post Job
                    </DropdownMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-red-400 font-medium focus:text-red-400 focus:bg-red-950/30 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile nav drawer (slide-down) */}
        {mobileOpen && (
          <div className="lg:hidden border-b border-border/50 bg-background/95 backdrop-blur-md px-4 py-3 space-y-1 animate-in slide-in-from-top duration-200">
            {visibleRoutes.map((route) => {
              const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`);
              const Icon = route.icon;
              return (
                <Link key={route.href} href={route.href} onClick={() => setMobileOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-600/15 text-emerald-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {route.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main content — full width, no sidebar */}
        <main className="flex flex-1 flex-col w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
