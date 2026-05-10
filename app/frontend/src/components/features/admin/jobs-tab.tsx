"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { jobService } from "@/services/job.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Search, CheckCircle, XCircle, ExternalLink, ChevronLeft,
  ChevronRight, Briefcase, AlertTriangle, Clock,
} from "lucide-react";
import Link from "next/link";
import { formatDate, isExpired as checkExpired } from "@/lib/date-utils";

const PAGE_SIZE = 15;

const JOB_TYPES = [
  { value: "placement", label: "Placement" },
  { value: "internship", label: "Internship" },
  { value: "internship_fulltime", label: "Internship + PPO" },
  { value: "hackathon", label: "Hackathon" },
  { value: "webinar", label: "Webinar" },
  { value: "talk", label: "Talk" },
];

function statusBadge(status: string) {
  if (status === "approved")
    return <Badge className="bg-emerald-600/15 text-emerald-400 border-emerald-700/30 text-xs">Approved</Badge>;
  if (status === "pending")
    return <Badge className="bg-amber-600/15 text-amber-400 border-amber-700/30 text-xs">Pending</Badge>;
  return <Badge className="bg-red-600/15 text-red-400 border-red-700/30 text-xs">Rejected</Badge>;
}

export function JobsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
    search: search || undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "jobs", queryParams],
    queryFn: () => adminService.fetchAllJobs(queryParams),
    placeholderData: (prev) => prev,
  });

  const approveMutation = useMutation({
    mutationFn: jobService.approveJob,
    onSuccess: () => {
      toast.success("Job approved");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to approve"),
  });

  const rejectMutation = useMutation({
    mutationFn: jobService.rejectJob,
    onSuccess: () => {
      toast.success("Job rejected");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Failed to reject"),
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleStatus = (val: string | null) => { setStatusFilter(val ?? "all"); setPage(1); };
  const handleType = (val: string | null) => { setTypeFilter(val ?? "all"); setPage(1); };

  const jobs = data?.jobs || [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-card border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-muted/30 border-border/50"
            placeholder="Search company, circular number..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatus}>
          <SelectTrigger className="w-full sm:w-[140px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={handleType}>
          <SelectTrigger className="w-full sm:w-[160px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {JOB_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data && (
          <div className="flex items-center text-sm text-muted-foreground whitespace-nowrap">
            {data.total} total
          </div>
        )}
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-3 text-red-400 opacity-60" />
              <p className="font-medium text-red-400">Failed to load jobs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">Job</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Deadline</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Posted By</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/30">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="h-4 rounded bg-muted/40 animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : jobs.map((job) => {
                        const poster = job.posted_by_user;
                        const posterFallback =
                          poster?.full_name?.charAt(0)?.toUpperCase() ||
                          poster?.email?.charAt(0)?.toUpperCase() || "?";
                        const isExpired = checkExpired(job.deadline);
                        return (
                          <tr
                            key={job.id}
                            className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="min-w-0">
                                <Link
                                  href={`/jobs/${job.id}?from=admin`}
                                  className="font-medium hover:text-emerald-400 transition-colors line-clamp-1"
                                >
                                  {job.role_title} @ {job.company_name}
                                </Link>
                                <p className="text-xs text-muted-foreground mt-0.5">{job.circular_number}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-xs text-muted-foreground capitalize">
                                {job.job_type.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3">{statusBadge(job.approval_status)}</td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`text-xs ${isExpired ? "text-red-400" : "text-muted-foreground"}`}>
                                {formatDate(job.deadline)}
                                {isExpired && " (expired)"}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              {poster ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    {poster.avatar_url && <AvatarImage src={poster.avatar_url} />}
                                    <AvatarFallback className="bg-muted text-xs">{posterFallback}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs truncate max-w-[100px]">
                                    {poster.full_name || poster.email}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Link href={`/jobs/${job.id}?from=admin`}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                                {job.approval_status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-emerald-400 hover:bg-emerald-950/20"
                                      onClick={() => approveMutation.mutate(job.id)}
                                      disabled={approveMutation.isPending || rejectMutation.isPending}
                                    >
                                      <CheckCircle className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-red-400 hover:bg-red-950/20"
                                      onClick={() => rejectMutation.mutate(job.id)}
                                      disabled={approveMutation.isPending || rejectMutation.isPending}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>

              {!isLoading && jobs.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="font-medium text-sm">No jobs found</p>
                  <p className="text-xs mt-1">Try adjusting your filters.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages} · {data?.total} jobs</span>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm" className="border-border/50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline" size="sm" className="border-border/50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
