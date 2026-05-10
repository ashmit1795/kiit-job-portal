"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { AdminUser, UserJobsResponse } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "./confirm-dialog";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, GraduationCap, CheckCircle, Clock, XCircle,
  Briefcase, Users, UserX, Loader2, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/date-utils";

function VolunteerCard({ volunteer }: { volunteer: AdminUser }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [pendingDemote, setPendingDemote] = useState(false);

  const { data: jobData, isLoading: jobsLoading } = useQuery({
    queryKey: ["admin", "users", volunteer.id, "jobs"],
    queryFn: () => adminService.fetchUserJobs(volunteer.id),
    enabled: expanded,
  });

  const demoteMutation = useMutation({
    mutationFn: () => adminService.updateUserRole(volunteer.id, "student"),
    onSuccess: () => {
      toast.success(`${volunteer.full_name || volunteer.email} demoted to student`);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingDemote(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to demote volunteer");
      setPendingDemote(false);
    },
  });

  const fallback =
    volunteer.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ||
    volunteer.email.charAt(0).toUpperCase();

  const statsConfig = [
    { label: "Total", value: jobData?.stats.total ?? 0, color: "text-foreground" },
    { label: "Approved", value: jobData?.stats.approved ?? 0, color: "text-emerald-400" },
    { label: "Pending", value: jobData?.stats.pending ?? 0, color: "text-amber-400" },
    { label: "Rejected", value: jobData?.stats.rejected ?? 0, color: "text-red-400" },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-0">
        {/* Header row */}
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-10 w-10 shrink-0">
            {volunteer.avatar_url && <AvatarImage src={volunteer.avatar_url} />}
            <AvatarFallback className="bg-amber-900/30 text-amber-400 text-sm font-semibold">
              {fallback}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm">{volunteer.full_name || "—"}</p>
            <p className="text-xs text-muted-foreground truncate">{volunteer.email}</p>
            {(volunteer.branch || volunteer.batch) && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {volunteer.branch?.code} · {volunteer.batch?.year}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-border/50 text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={() => setPendingDemote(true)}
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1" /> Demote
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Expandable jobs section */}
        {expanded && (
          <div className="border-t border-border/50 bg-muted/5 p-4 space-y-4">
            {/* Job stats */}
            {jobsLoading ? (
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 flex-1 rounded-lg bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {statsConfig.map((s) => (
                  <div key={s.label} className="text-center p-2 rounded-lg bg-muted/20 border border-border/30">
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Jobs list */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Posted Jobs
              </p>
              {jobsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-muted/20 animate-pulse" />
                ))
              ) : !jobData?.jobs.length ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Briefcase className="h-7 w-7 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No jobs posted yet</p>
                </div>
              ) : (
                jobData.jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}?from=admin`}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {job.role_title} @ {job.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {job.circular_number} · {timeAgo(job.created_at)}
                        </p>
                      </div>
                      <Badge
                        className={
                          job.approval_status === "approved"
                            ? "bg-emerald-600/15 text-emerald-400 border-emerald-700/30 text-xs shrink-0 ml-2"
                            : job.approval_status === "pending"
                            ? "bg-amber-600/15 text-amber-400 border-amber-700/30 text-xs shrink-0 ml-2"
                            : "bg-red-600/15 text-red-400 border-red-700/30 text-xs shrink-0 ml-2"
                        }
                      >
                        {job.approval_status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Mobile demote */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden w-full border-border/50 text-muted-foreground hover:text-foreground"
              onClick={() => setPendingDemote(true)}
            >
              <GraduationCap className="h-4 w-4 mr-2" /> Demote to Student
            </Button>
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={pendingDemote}
        onOpenChange={(o) => !o && setPendingDemote(false)}
        title="Demote Volunteer"
        description={`Demote ${volunteer.full_name || volunteer.email} back to student? They will lose job posting ability.`}
        confirmLabel="Demote"
        onConfirm={() => demoteMutation.mutate()}
        loading={demoteMutation.isPending}
      />
    </Card>
  );
}

export function VolunteersTab() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users", { role: "volunteer" }],
    queryFn: () => adminService.fetchUsers({ role: "volunteer", limit: 100 }),
  });

  const volunteers = data?.users || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Volunteers</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Students with job-posting privileges. Click any card to see their posted jobs.
          </p>
        </div>
        {!isLoading && (
          <Badge className="bg-amber-600/15 text-amber-400 border-amber-700/30">
            {volunteers.length} volunteer{volunteers.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {error ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-red-700/30">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-400 opacity-60" />
          <p className="font-medium text-red-400 text-sm">Failed to load volunteers</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-card border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border/50">
          <Users className="h-9 w-9 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-sm">No volunteers yet</p>
          <p className="text-xs mt-1">Promote students from the Users tab to grant posting privileges.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((v) => (
            <VolunteerCard key={v.id} volunteer={v} />
          ))}
        </div>
      )}
    </div>
  );
}
