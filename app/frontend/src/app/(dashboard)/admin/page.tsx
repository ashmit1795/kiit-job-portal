"use client";

import { Suspense } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/features/admin/overview-tab";
import { UsersTab } from "@/components/features/admin/users-tab";
import { VolunteersTab } from "@/components/features/admin/volunteers-tab";
import { JobsTab } from "@/components/features/admin/jobs-tab";
import { AcademicsTab } from "@/components/features/admin/academics-tab";
import { LogsTab } from "@/components/features/admin/logs-tab";
import {
  LayoutDashboard, Users, UserCheck, Briefcase, BookOpen, Activity,
} from "lucide-react";

const TABS = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "users", label: "Users", icon: Users },
  { value: "volunteers", label: "Volunteers", icon: UserCheck },
  { value: "jobs", label: "Jobs", icon: Briefcase },
  { value: "academics", label: "Academics", icon: BookOpen },
  { value: "logs", label: "Logs", icon: Activity },
];

function AdminContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/jobs");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const handleTabChange = (tab: string) => {
    router.push(`/admin?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage users, jobs, academic structure, and view activity logs.
        </p>
      </div>

      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-muted/30 border border-border/50 h-auto flex-wrap gap-1 p-1 w-full overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-1.5 text-xs sm:text-sm data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-700/30 whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <UsersTab />
        </TabsContent>

        <TabsContent value="volunteers" className="mt-0">
          <VolunteersTab />
        </TabsContent>

        <TabsContent value="jobs" className="mt-0">
          <JobsTab />
        </TabsContent>

        <TabsContent value="academics" className="mt-0">
          <AcademicsTab />
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <LogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted/40 rounded animate-pulse" />
        <div className="h-10 bg-muted/30 rounded-xl animate-pulse" />
        <div className="h-64 bg-muted/20 rounded-xl animate-pulse" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
