"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementFeed } from "@/components/features/announcements/announcement-feed";
import { AnnouncementType } from "@/types/announcement";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { announcementTypeConfig } from "@/components/features/announcements/announcement-type-badge";
import { CreateAnnouncementModal } from "@/components/features/announcements/create-announcement-modal";
import { EditAnnouncementModal } from "@/components/features/announcements/edit-announcement-modal";
import { DeleteAnnouncementDialog } from "@/components/features/announcements/delete-announcement-dialog";
import { Announcement } from "@/types/announcement";
import { announcementService } from "@/services/announcement.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export default function AnnouncementsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdminOrVolunteer = user?.role === "admin" || user?.role === "volunteer";

  const [typeFilter, setTypeFilter] = useState<AnnouncementType | "all">("all");
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [announcementToEdit, setAnnouncementToEdit] = useState<Announcement | null>(null);
  
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  const togglePinMutation = useMutation({
    mutationFn: (announcement: Announcement) => 
      announcementService.updateAnnouncement(announcement.id, { is_pinned: !announcement.is_pinned }),
    onSuccess: () => {
      toast.success("Pin status updated");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update pin status");
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Placement Updates</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay informed with the latest announcements, test links, and results.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-md px-3 py-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter((val as AnnouncementType | "all") ?? "all")}>
              <SelectTrigger className="h-8 border-0 bg-transparent dark:bg-transparent dark:hover:bg-transparent shadow-none focus:ring-0 px-0 min-w-[120px] text-sm font-medium">
                <SelectValue placeholder="All Updates">
                  {(val: string | null) => {
                    if (!val || val === "all") return "All Updates";
                    const config = announcementTypeConfig[val as keyof typeof announcementTypeConfig];
                    if (config) {
                      return (
                        <div className="flex items-center gap-2">
                          <config.icon className="h-3.5 w-3.5" />
                          <span>{config.label}</span>
                        </div>
                      );
                    }
                    return val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all" label="All Updates">All Updates</SelectItem>
                {Object.entries(announcementTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key} label={config.label}>
                    <div className="flex items-center gap-2">
                      <config.icon className="h-3.5 w-3.5" />
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdminOrVolunteer && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-lg shadow-emerald-900/20"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Update</span>
            </Button>
          )}
        </div>
      </div>

      <AnnouncementFeed 
        typeFilter={typeFilter} 
        onEdit={(a) => setAnnouncementToEdit(a)}
        onDelete={(a) => setAnnouncementToDelete(a)}
        onTogglePin={(a) => togglePinMutation.mutate(a)}
        onCardClick={(a) => router.push(`/announcements/${a.id}`)}
      />

      {isAdminOrVolunteer && (
        <>
          <CreateAnnouncementModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />

          {announcementToEdit && (
            <EditAnnouncementModal
              isOpen={true}
              onClose={() => setAnnouncementToEdit(null)}
              announcement={announcementToEdit}
            />
          )}

          {announcementToDelete && (
            <DeleteAnnouncementDialog
              isOpen={true}
              onClose={() => setAnnouncementToDelete(null)}
              announcement={announcementToDelete}
            />
          )}
        </>
      )}
    </div>
  );
}
