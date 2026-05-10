"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { AdminLog } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Activity, AlertTriangle } from "lucide-react";
import { timeAgo, formatDateTime } from "@/lib/date-utils";

const PAGE_SIZE = 20;

const ACTION_LABELS: Record<string, string> = {
  approve_job: "Approved Job",
  reject_job: "Rejected Job",
  promote_user: "Promoted User",
  demote_user: "Demoted User",
  change_user_role: "Changed Role",
  delete_user: "Deleted User",
  create_program: "Created Program",
  create_branch: "Created Branch",
  create_batch: "Created Batch",
  delete_program: "Deleted Program",
  delete_branch: "Deleted Branch",
  delete_batch: "Deleted Batch",
};

const ACTION_COLORS: Record<string, string> = {
  approve_job: "bg-emerald-600/15 text-emerald-400 border-emerald-700/30",
  reject_job: "bg-red-600/15 text-red-400 border-red-700/30",
  promote_user: "bg-blue-600/15 text-blue-400 border-blue-700/30",
  demote_user: "bg-orange-600/15 text-orange-400 border-orange-700/30",
  change_user_role: "bg-purple-600/15 text-purple-400 border-purple-700/30",
  delete_user: "bg-red-600/15 text-red-400 border-red-700/30",
  create_program: "bg-cyan-600/15 text-cyan-400 border-cyan-700/30",
  create_branch: "bg-amber-600/15 text-amber-400 border-amber-700/30",
  create_batch: "bg-teal-600/15 text-teal-400 border-teal-700/30",
  delete_program: "bg-red-600/15 text-red-400 border-red-700/30",
  delete_branch: "bg-red-600/15 text-red-400 border-red-700/30",
  delete_batch: "bg-red-600/15 text-red-400 border-red-700/30",
};

function formatLogDescription(log: AdminLog): string {
  const d = log.details || {};
  switch (log.action) {
    case "approve_job": return `"${d.role_title} @ ${d.company_name}" (${d.circular_number})`;
    case "reject_job": return `"${d.role_title} @ ${d.company_name}" (${d.circular_number})`;
    case "promote_user": return `${d.user_email} — ${d.from_role} → ${d.to_role}`;
    case "demote_user": return `${d.user_email} — ${d.from_role} → ${d.to_role}`;
    case "change_user_role": return `${d.user_email} → ${d.to_role}`;
    case "delete_user": return `${d.user_email} (was ${d.user_role})`;
    case "create_program": return `"${d.name}" (${d.level}, ${d.duration_years}y)`;
    case "create_branch": return `"${d.name} (${d.code})"`;
    case "create_batch": return `Year ${d.year}`;
    case "delete_program": return `"${d.name}"`;
    case "delete_branch": return `"${d.name} (${d.code})"`;
    case "delete_batch": return `Year ${d.year}`;
    default: return JSON.stringify(d);
  }
}

export function LogsTab() {
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    action: actionFilter !== "all" ? actionFilter : undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "logs", queryParams],
    queryFn: () => adminService.fetchLogs(queryParams),
    placeholderData: (prev) => prev,
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);
  const logs = data?.logs || [];

  const handleFilter = (val: string | null) => {
    setActionFilter(val ?? "all");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Admin Activity Log</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Full audit trail of all admin actions across the portal.
          </p>
        </div>
        <Select value={actionFilter} onValueChange={handleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="approve_job">Job Approvals</SelectItem>
            <SelectItem value="reject_job">Job Rejections</SelectItem>
            <SelectItem value="promote_user">Promotions</SelectItem>
            <SelectItem value="demote_user">Demotions</SelectItem>
            <SelectItem value="delete_user">User Deletions</SelectItem>
            <SelectItem value="create_branch">Branch Created</SelectItem>
            <SelectItem value="create_batch">Batch Created</SelectItem>
            <SelectItem value="create_program">Program Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Log entries */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-3 text-red-400 opacity-60" />
              <p className="font-medium text-red-400">Failed to load logs</p>
            </div>
          ) : isLoading ? (
            <div className="divide-y divide-border/30">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4">
                  <div className="h-9 w-9 rounded-full bg-muted/40 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-3/4 bg-muted/40 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted/30 rounded animate-pulse" />
                    <div className="h-2 w-20 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Activity className="h-9 w-9 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-sm">No logs found</p>
              <p className="text-xs mt-1">Admin activity will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {logs.map((log, idx) => {
                const admin = log.admin;
                const fallback =
                  admin?.full_name?.charAt(0)?.toUpperCase() ||
                  admin?.email?.charAt(0)?.toUpperCase() || "A";
                const actionLabel = ACTION_LABELS[log.action] || log.action.replace(/_/g, " ");
                const actionColor = ACTION_COLORS[log.action] || "bg-muted/50 text-muted-foreground border-border/50";
                const description = formatLogDescription(log);

                return (
                  <div
                    key={log.id}
                    className="flex gap-4 p-4 hover:bg-muted/5 transition-colors"
                  >
                    {/* Timeline line */}
                    <div className="relative flex flex-col items-center">
                      <Avatar className="h-9 w-9 shrink-0">
                        {admin?.avatar_url && <AvatarImage src={admin.avatar_url} />}
                        <AvatarFallback className="bg-emerald-900/30 text-emerald-400 text-sm font-semibold">
                          {fallback}
                        </AvatarFallback>
                      </Avatar>
                      {idx < logs.length - 1 && (
                        <div className="w-px flex-1 bg-border/30 mt-2 min-h-[16px]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <span className="font-medium text-sm">
                          {admin?.full_name || admin?.email || "Unknown Admin"}
                        </span>
                        <Badge className={`${actionColor} text-xs shrink-0`}>
                          {actionLabel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground/60">
                          {timeAgo(log.created_at)}
                        </span>
                        <span className="text-xs text-muted-foreground/40">
                          {formatDateTime(log.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Page {page} of {totalPages} · {data?.total} entries</span>
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
