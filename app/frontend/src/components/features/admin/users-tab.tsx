"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { AdminUser } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRoleDropdown, RoleBadge } from "./user-role-dropdown";
import { ConfirmDialog } from "./confirm-dialog";
import { toast } from "sonner";
import { Search, Trash2, ChevronLeft, ChevronRight, UserX, AlertTriangle } from "lucide-react";

const PAGE_SIZE = 15;

export function UsersTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ user: AdminUser; newRole: string } | null>(null);

  const queryParams = {
    page,
    limit: PAGE_SIZE,
    role: roleFilter !== "all" ? roleFilter : undefined,
    search: search || undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "users", queryParams],
    queryFn: () => adminService.fetchUsers(queryParams),
    placeholderData: (prev) => prev,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingRoleChange(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update role");
      setPendingRoleChange(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      toast.success("User removed");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setPendingDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to remove user");
      setPendingDelete(null);
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilter = (val: string | null) => {
    setRoleFilter(val ?? "all");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-card border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-muted/30 border-border/50"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-full sm:w-[150px] bg-muted/30 border-border/50">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="volunteer">Volunteers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
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
              <p className="font-medium text-red-400">Failed to load users</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden md:table-cell">Roll</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Branch / Batch</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Profile</th>
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
                    : data?.users.map((user) => {
                        const fallback =
                          user.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ||
                          user.email.charAt(0).toUpperCase();
                        return (
                          <tr
                            key={user.id}
                            className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 shrink-0">
                                  {user.avatar_url && <AvatarImage src={user.avatar_url} />}
                                  <AvatarFallback className="bg-emerald-900/30 text-emerald-400 text-xs font-semibold">
                                    {fallback}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium truncate max-w-[160px]">
                                    {user.full_name || "—"}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                              {user.roll_number || "—"}
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <div className="text-xs">
                                <p>{user.branch?.code || "—"}</p>
                                <p className="text-muted-foreground">{user.batch?.year || "—"}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <UserRoleDropdown
                                currentRole={user.role}
                                userId={user.id}
                                onRoleChange={(uid, newRole) =>
                                  setPendingRoleChange({ user, newRole })
                                }
                                disabled={roleMutation.isPending}
                              />
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              {user.profile_completed ? (
                                <Badge className="bg-emerald-600/15 text-emerald-400 border-emerald-700/30 text-xs">
                                  Complete
                                </Badge>
                              ) : (
                                <Badge className="bg-muted/50 text-muted-foreground border-border/50 text-xs">
                                  Incomplete
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-950/20"
                                onClick={() => setPendingDelete(user)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>

              {!isLoading && !data?.users.length && (
                <div className="text-center py-16 text-muted-foreground">
                  <UserX className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="font-medium text-sm">No users found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} · {data?.total} users
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border/50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border/50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Role change confirm */}
      <ConfirmDialog
        open={!!pendingRoleChange}
        onOpenChange={(o) => !o && setPendingRoleChange(null)}
        title="Change User Role"
        description={
          pendingRoleChange
            ? `Change ${pendingRoleChange.user.email}'s role from "${pendingRoleChange.user.role}" to "${pendingRoleChange.newRole}"?`
            : ""
        }
        confirmLabel="Change Role"
        onConfirm={() => {
          if (pendingRoleChange) {
            roleMutation.mutate({ userId: pendingRoleChange.user.id, role: pendingRoleChange.newRole });
          }
        }}
        loading={roleMutation.isPending}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Remove User"
        description={`Permanently remove ${pendingDelete?.email}? This cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
        }}
        loading={deleteMutation.isPending}
        destructive
      />
    </div>
  );
}
