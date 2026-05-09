"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Briefcase, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/jobs");
  }, [user, router]);

  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: jobService.fetchJobs });

  const approveMutation = useMutation({
    mutationFn: jobService.approveJob,
    onSuccess: () => { toast.success("Job approved"); queryClient.invalidateQueries({ queryKey: ["jobs"] }); },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to approve job."),
  });

  const rejectMutation = useMutation({
    mutationFn: jobService.rejectJob,
    onSuccess: () => { toast.success("Job rejected"); queryClient.invalidateQueries({ queryKey: ["jobs"] }); },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject job."),
  });

  if (!user || user.role !== "admin") return null;

  const pendingJobs = jobs?.filter((j) => j.approval_status === "pending") || [];
  const approvedJobs = jobs?.filter((j) => j.approval_status === "approved") || [];
  const rejectedJobs = jobs?.filter((j) => j.approval_status === "rejected") || [];

  const statCards = [
    { label: "Total Jobs", value: jobs?.length || 0, icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-700/30" },
    { label: "Pending", value: pendingJobs.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-600/10 border-amber-700/30" },
    { label: "Approved", value: approvedJobs.length, icon: TrendingUp, color: "text-green-400", bg: "bg-green-600/10 border-green-700/30" },
    { label: "Rejected", value: rejectedJobs.length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-600/10 border-red-700/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-border/50">
                <CardContent className="p-4 flex items-center gap-3 animate-pulse">
                  <div className="h-10 w-10 rounded-lg bg-muted/50" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-muted/50 rounded" />
                    <div className="h-6 w-10 bg-muted/50 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          : statCards.map((s) => (
              <Card key={s.label} className={`border ${s.bg}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-muted/30 flex items-center justify-center ${s.color} shrink-0`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))
        }
      </div>

      {/* Pending List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Pending Approvals</CardTitle>
          <CardDescription>Review jobs submitted by volunteers.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-emerald-500" /></div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-emerald-500 opacity-40" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm mt-1">No pending jobs to review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}?from=admin`} className="block">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-border/50 rounded-xl bg-muted/10 gap-3 hover:bg-muted/20 hover:border-emerald-700/20 transition-all cursor-pointer">
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold hover:text-emerald-400 transition-colors line-clamp-1">
                        {job.role_title} @ {job.company_name}
                      </span>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center mt-1">
                        <span className="bg-muted px-2 py-0.5 rounded text-xs">Ref: {job.circular_number}</span>
                        <span>{job.job_type.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/15"
                        onClick={(e) => { e.preventDefault(); approveMutation.mutate(job.id); }}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-700/30 text-red-400 hover:bg-red-600/15"
                        onClick={(e) => { e.preventDefault(); rejectMutation.mutate(job.id); }}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
