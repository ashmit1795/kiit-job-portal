"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "@/services/announcement.service";
import { Announcement, CreateAnnouncementPayload } from "@/types/announcement";
import { AnnouncementForm } from "./announcement-form";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { AxiosError } from "axios";

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
}

export function EditAnnouncementModal({ isOpen, onClose, announcement }: EditAnnouncementModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => 
      announcementService.updateAnnouncement(announcement.id, payload),
    onSuccess: () => {
      toast.success("Update saved successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to save update");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold">Edit Update</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <AnnouncementForm
            initialValues={{
              subject: announcement.subject,
              description: announcement.description,
              announcement_type: announcement.announcement_type,
              job_id: announcement.job_id || "global",
              is_pinned: announcement.is_pinned,
              branches: announcement.eligible_branches?.map(b => b.id) || [],
              batches: announcement.eligible_batches?.map(b => b.id) || [],
            }}
            existingCircularPath={announcement.circular_file_path}
            onSubmit={(payload) => updateMutation.mutate(payload)}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
