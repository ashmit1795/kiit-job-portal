"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "@/services/announcement.service";
import { Announcement } from "@/types/announcement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, Loader2, Edit2, Trash2, Pin, CalendarDays } from "lucide-react";
import { AnnouncementTypeBadge } from "@/components/features/announcements/announcement-type-badge";
import { timeAgo, formatDateTime } from "@/lib/date-utils";
import { useState } from "react";
import { CreateAnnouncementModal } from "@/components/features/announcements/create-announcement-modal";
import { EditAnnouncementModal } from "@/components/features/announcements/edit-announcement-modal";
import { DeleteAnnouncementDialog } from "@/components/features/announcements/delete-announcement-dialog";

export function AnnouncementsTab() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState<Announcement | null>(null);
  const [updateToDelete, setUpdateToDelete] = useState<Announcement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["announcements", { page, limit: 15 }],
    queryFn: () => announcementService.fetchAnnouncements({ page, limit: 15 }),
    placeholderData: (prev) => prev,
  });

  const togglePinMutation = useMutation({
    mutationFn: (announcement: Announcement) => 
      announcementService.updateAnnouncement(announcement.id, { is_pinned: !announcement.is_pinned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });

  const announcements = data?.announcements || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-emerald-500" /> Announcements Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage global and job-specific placement updates.
          </p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
          onClick={() => setIsCreateOpen(true)}
        >
          Post New Update
        </Button>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-muted/40 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No announcements found.
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {announcement.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          <span className="font-medium line-clamp-1">{announcement.subject}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <AnnouncementTypeBadge type={announcement.announcement_type} />
                      </td>
                      <td className="px-4 py-3">
                        {announcement.job ? (
                          <div className="line-clamp-1 max-w-[200px]">
                            {announcement.job.company_name} - {announcement.job.role_title}
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-muted/30">Global</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{announcement.created_by_user?.full_name || "Admin"}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{announcement.created_by_user?.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        <div className="flex items-center gap-1.5" title={formatDateTime(announcement.created_at)}>
                          <CalendarDays className="h-3.5 w-3.5" />
                          {timeAgo(announcement.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${announcement.is_pinned ? "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => togglePinMutation.mutate(announcement)}
                            title={announcement.is_pinned ? "Unpin" : "Pin"}
                            disabled={togglePinMutation.isPending}
                          >
                            <Pin className="h-3.5 w-3.5" fill={announcement.is_pinned ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                            onClick={() => setUpdateToEdit(announcement)}
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => setUpdateToDelete(announcement)}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {updateToEdit && (
        <EditAnnouncementModal
          isOpen={true}
          onClose={() => setUpdateToEdit(null)}
          announcement={updateToEdit}
        />
      )}

      {updateToDelete && (
        <DeleteAnnouncementDialog
          isOpen={true}
          onClose={() => setUpdateToDelete(null)}
          announcement={updateToDelete}
        />
      )}
    </div>
  );
}
