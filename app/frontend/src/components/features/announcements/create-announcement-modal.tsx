"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "@/services/announcement.service";
import { CreateAnnouncementPayload } from "@/types/announcement";
import { AnnouncementForm } from "./announcement-form";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { AxiosError } from "axios";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAnnouncementModal({ isOpen, onClose }: CreateAnnouncementModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) => announcementService.createAnnouncement(payload),
    onSuccess: () => {
      toast.success("Update posted successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to post update");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-border/50 bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold">Post New Update</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          <AnnouncementForm
            onSubmit={(payload) => createMutation.mutate(payload)}
            isSubmitting={createMutation.isPending}
            submitLabel="Post Update"
          />
        </div>
      </div>
    </div>
  );
}
