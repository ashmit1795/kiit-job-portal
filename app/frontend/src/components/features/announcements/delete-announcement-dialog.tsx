"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "@/services/announcement.service";
import { Announcement } from "@/types/announcement";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

interface DeleteAnnouncementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
  onSuccess?: () => void;
}

export function DeleteAnnouncementDialog({ isOpen, onClose, announcement, onSuccess }: DeleteAnnouncementDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => announcementService.deleteAnnouncement(announcement.id),
    onSuccess: () => {
      toast.success("Update deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      onSuccess?.();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to delete update");
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border border-red-900/30 bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Delete Update?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete the update <strong>"{announcement.subject}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => deleteMutation.mutate()} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
