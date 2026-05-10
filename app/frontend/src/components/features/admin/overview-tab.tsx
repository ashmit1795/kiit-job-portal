"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { jobService } from "@/services/job.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Users, Briefcase, Clock, CheckCircle, XCircle, GraduationCap,
  Shield, AlertTriangle, TrendingUp, UserCheck, Activity, Loader2,
} from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/date-utils";
import { AdminLog } from "@/types/admin";

function formatLogAction(log: AdminLog): string {
  const d = log.details || {};
  switch (log.action) {
    case "approve_job": return `approved job "${d.role_title} @ ${d.company_name}"`;
    case "reject_job": return `rejected job "${d.role_title} @ ${d.company_name}"`;
    case "promote_user": return `promoted ${d.user_email} from ${d.from_role} → ${d.to_role}`;
    case "demote_user": return `demoted ${d.user_email} from ${d.from_role} → ${d.to_role}`;
    case "change_user_role": return `changed ${d.user_email}'s role to ${d.to_role}`;
    case "delete_user": return `deleted user ${d.user_email}`;
    case "create_program": return `created program "${d.name}"`;
    case "create_branch": return `created branch "${d.name} (${d.code})"`;
    case "create_batch": return `created batch "${d.year}"`;
    case "delete_program": return `deleted program "${d.name}"`;
    case "delete_branch": return `deleted branch "${d.name}"`;
    case "delete_batch": return `deleted batch "${d.year}"`;
    default: return log.action.replace(/_/g, " ");
  }
}

export function OverviewTab() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminService.fetchDashboardStats,
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["admin", "jobs", { status: "pending" }],
    queryFn: () => adminService.fetchAllJobs({ status: "pending", limit: 10 }),
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["admin", "logs", { limit: 5 }],
    queryFn: () => adminService.fetchLogs({ limit: 5 }),
  });

  const approveMutation = useMutation({
    mutationFn: jobService.approveJob,
    onSuccess: () => {
      toast.success("Job approved");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to approve job"),
  });

  const rejectMutation = useMutation({
    mutationFn: jobService.rejectJob,
    onSuccess: () => {
      toast.success("Job rejected");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject job"),
  });

  const statCards = [
    { label: "Total Users", value: stats?.users.total, icon: Users, color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-700/30" },
    { label: "Students", value: stats?.users.students, icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-600/10 border-blue-700/30" },
    { label: "Volunteers", value: stats?.users.volunteers, icon: UserCheck, color: "text-amber-400", bg: "bg-amber-600/10 border-amber-700/30" },
    { label: "Admins", value: stats?.users.admins, icon: Shield, color: "text-purple-400", bg: "bg-purple-600/10 border-purple-700/30" },
    { label: "Total Jobs", value: stats?.jobs.total, icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-600/10 border-cyan-700/30" },
    { label: "Pending", value: stats?.jobs.pending, icon: Clock, color: "text-orange-400", bg: "bg-orange-600/10 border-orange-700/30" },
    { label: "Approved", value: stats?.jobs.approved, icon: TrendingUp, color: "text-green-400", bg: "bg-green-600/10 border-green-700/30" },
    { label: "Expired", value: stats?.jobs.expired, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-600/10 border-red-700/30" },
  ];

  const pendingJobs = pendingData?.jobs || [];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <Card key={s.label} className={`border ${s.bg}`}>
            <CardContent className="p-4 flex items-center gap-3">
              {statsLoading ? (
                <div className="h-10 w-10 rounded-lg bg-muted/40 animate-pulse shrink-0" />
              ) : (
                <div className={`h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center ${s.color} shrink-0`}>
                  <s.icon className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                {statsLoading ? (
                  <div className="h-6 w-10 bg-muted/40 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{s.value ?? "—"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Pending Approvals</CardTitle>
                <CardDescription>Volunteer-submitted jobs awaiting review</CardDescription>
              </div>
              {pendingJobs.length > 0 && (
                <Badge className="bg-orange-600/15 text-orange-400 border-orange-700/30">
                  {pendingJobs.length} pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-muted/20 animate-pulse" />
              ))
            ) : pendingJobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CheckCircle className="h-9 w-9 mx-auto mb-2 text-emerald-500 opacity-40" />
                <p className="font-medium text-sm">All caught up!</p>
                <p className="text-xs mt-1">No pending jobs to review.</p>
              </div>
            ) : (
              pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/10 border border-border/50 hover:bg-muted/20 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <Link href={`/jobs/${job.id}?from=admin`} className="font-medium text-sm hover:text-emerald-400 transition-colors line-clamp-1">
                      {job.role_title} @ {job.company_name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {job.circular_number}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {job.posted_by_user?.full_name || job.posted_by_user?.email || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/15"
                      onClick={() => approveMutation.mutate(job.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-red-700/30 text-red-400 hover:bg-red-600/15"
                      onClick={() => rejectMutation.mutate(job.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Recent Activity
            </CardTitle>
            <CardDescription>Latest admin actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {logsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-muted/40 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-full bg-muted/40 rounded animate-pulse" />
                    <div className="h-2 w-16 bg-muted/30 rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : !logsData?.logs.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-7 w-7 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No activity yet</p>
              </div>
            ) : (
              logsData.logs.map((log) => {
                const admin = log.admin;
                const fallback = admin?.full_name?.charAt(0) || admin?.email?.charAt(0) || "A";
                return (
                  <div key={log.id} className="flex gap-2.5 items-start">
                    <Avatar className="h-7 w-7 shrink-0">
                      {admin?.avatar_url && <AvatarImage src={admin.avatar_url} />}
                      <AvatarFallback className="bg-emerald-900/30 text-emerald-400 text-xs font-semibold">
                        {fallback.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs leading-snug line-clamp-2">
                        <span className="font-medium">{admin?.full_name || admin?.email || "Admin"}</span>{" "}
                        <span className="text-muted-foreground">{formatLogAction(log)}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {timeAgo(log.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
