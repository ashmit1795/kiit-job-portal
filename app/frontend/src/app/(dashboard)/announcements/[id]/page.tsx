"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { AxiosError } from "axios";
import {
  ArrowLeft,
  Building,
  CalendarDays,
  Clock,
  Pin,
  Loader2,
  AlertTriangle,
  Megaphone,
  Download,
  Edit2,
  Trash2,
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { announcementService } from "@/services/announcement.service";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnnouncementTypeBadge } from "@/components/features/announcements/announcement-type-badge";
import { CircularAttachmentCard } from "@/components/features/announcements/circular-attachment-card";
import { EditAnnouncementModal } from "@/components/features/announcements/edit-announcement-modal";
import { DeleteAnnouncementDialog } from "@/components/features/announcements/delete-announcement-dialog";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const id = params.id as string;
  const from = searchParams.get("from");
  const jobId = searchParams.get("jobId");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch the announcement by ID
  const { data: announcement, isLoading, error } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcementService.fetchAnnouncementById(id),
    enabled: !!id,
  });

  // Toggle Pin Mutation
  const togglePinMutation = useMutation({
    mutationFn: () =>
      announcementService.updateAnnouncement(id, {
        is_pinned: !announcement?.is_pinned,
      }),
    onSuccess: () => {
      toast.success(announcement?.is_pinned ? "Announcement unpinned" : "Announcement pinned");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update pin status");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="text-sm text-muted-foreground animate-pulse">Loading announcement...</span>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-lg font-bold">Failed to Load Announcement</h2>
        <p className="text-sm text-muted-foreground">
          The announcement might have been deleted, or there was a connection error.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/announcements")}
          className="w-full gap-2 border-border/50 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Announcements
        </Button>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer";
  const canEdit = isAdmin || (isVolunteer && announcement.created_by === user?.id);

  // Formulate Back Button Details
  const backPath = from === "job" && jobId ? `/jobs/${jobId}` : "/announcements";
  const backLabel = from === "job" && jobId ? "Back to Job Details" : "Back to Updates";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Dynamic Navigation Header */}
      <Button
        variant="ghost"
        onClick={() => router.push(backPath)}
        className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        {backLabel}
      </Button>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-emerald-950/20 via-card to-card p-6 md:p-8 shadow-md">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-4 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <AnnouncementTypeBadge type={announcement.announcement_type} />
              {announcement.is_pinned && (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 font-semibold text-xs px-2.5">
                  <Pin className="h-3 w-3" fill="currentColor" /> Pinned
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground break-words leading-tight">
              {announcement.subject}
            </h1>

            {/* User Meta Row */}
            <div className="flex items-center gap-3 pt-2">
              <Avatar className="h-10 w-10 border border-border/50 shadow-inner">
                {announcement.created_by_user?.avatar_url && (
                  <AvatarImage src={announcement.created_by_user.avatar_url} alt="User avatar" />
                )}
                <AvatarFallback className="bg-emerald-900/30 text-emerald-400 text-sm font-semibold">
                  {(announcement.created_by_user?.full_name || "A").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">
                    {announcement.created_by_user?.full_name || "Coordinator"}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-muted/40 border-border/50 capitalize font-medium text-muted-foreground">
                    {announcement.created_by_user?.role || "Staff"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>
                    {new Date(announcement.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                  {announcement.updated_at !== announcement.created_at && (
                    <span className="text-[10px] bg-muted/30 text-muted-foreground/80 px-1 py-0.5 rounded border border-border/20">
                      Edited
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content (Left, 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Associated Job Card (if job_id exists) */}
          {announcement.job && (
            <Card className="border-emerald-700/20 bg-emerald-900/5 backdrop-blur-sm overflow-hidden hover:border-emerald-700/30 transition-colors shadow-sm">
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900/20 border border-emerald-700/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 flex-wrap">
                      <span>Linked Job Opening</span>
                      <Badge variant="secondary" className="bg-emerald-600/10 text-emerald-400 border-emerald-700/20 text-[10px] font-normal leading-none py-0.5 px-1.5">
                        Active
                      </Badge>
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium mt-0.5">
                      {announcement.job.company_name} — <span className="text-foreground">{announcement.job.role_title}</span>
                    </p>
                    {announcement.job.circular_number && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ref: <span className="font-mono text-muted-foreground/80">{announcement.job.circular_number}</span>
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/jobs/${announcement.job_id}`)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/10 gap-1.5 shrink-0"
                >
                  View Job Details
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          )}

          {/* Description Section */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                <Megaphone className="h-4 w-4 text-emerald-500" />
                Update Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm prose-invert max-w-none text-muted-foreground
                prose-headings:text-foreground prose-strong:text-foreground
                prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-emerald-400 prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/50
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:marker:text-emerald-500
                prose-table:border-collapse prose-th:border prose-th:border-border/50 prose-th:p-2 prose-th:bg-muted/30
                prose-td:border prose-td:border-border/50 prose-td:p-2
                prose-p:leading-relaxed
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {announcement.description}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right, 1 column) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/30 px-4 py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-500" /> Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Update Type
                </span>
                <AnnouncementTypeBadge type={announcement.announcement_type} />
              </div>

              {announcement.circular_number && (
                <div className="pt-3 border-t border-border/30">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Circular Reference
                  </span>
                  <div className="text-sm font-semibold text-foreground break-all flex items-center gap-1.5">
                    <Badge variant="outline" className="border-border font-mono py-0.5 text-xs bg-muted/40 font-semibold text-muted-foreground">
                      Ref: {announcement.circular_number}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/30 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Posted On
                  </span>
                  <span className="text-xs font-medium text-foreground block">
                    {new Date(announcement.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Priority
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block border ${
                    announcement.announcement_priority > 0
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}>
                    {announcement.announcement_priority > 0 ? `High (${announcement.announcement_priority})` : "Normal"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Official Attachment (PDF circular) */}
          {announcement.circular_file_path && (
            <Card className="border-emerald-700/20 bg-emerald-900/10 overflow-hidden shadow-sm">
              <CardContent className="p-5 text-center space-y-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Official Circular Attachment</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download the official placement circular PDF file.
                  </p>
                </div>
                <CircularAttachmentCard announcementId={announcement.id} />
              </CardContent>
            </Card>
          )}

          {/* Admin Administrative Panel */}
          {canEdit && (
            <Card className="border-amber-700/20 bg-amber-900/5 overflow-hidden shadow-sm">
              <CardHeader className="bg-amber-950/20 border-b border-amber-700/20 px-4 py-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-2 text-amber-400">
                  <ShieldCheck className="h-4 w-4" /> Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={() => togglePinMutation.mutate()}
                  disabled={togglePinMutation.isPending}
                  variant="outline"
                  size="sm"
                  className={`w-full font-semibold border-amber-700/30 gap-1.5 h-9 justify-start ${
                    announcement.is_pinned
                      ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground hover:text-amber-400 hover:bg-amber-500/5"
                  }`}
                >
                  {togglePinMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : (
                    <Pin className="h-4 w-4 shrink-0" fill={announcement.is_pinned ? "currentColor" : "none"} />
                  )}
                  {announcement.is_pinned ? "Unpin Announcement" : "Pin Announcement"}
                </Button>

                <Button
                  onClick={() => setIsEditOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold border-emerald-700/20 text-emerald-400 hover:bg-emerald-950/20 gap-1.5 h-9 justify-start"
                >
                  <Edit2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Edit Announcement
                </Button>

                <Button
                  onClick={() => setIsDeleteOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold border-red-700/20 text-red-400 hover:bg-red-950/20 gap-1.5 h-9 justify-start"
                >
                  <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
                  Delete Announcement
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals Container */}
      {canEdit && (
        <>
          <EditAnnouncementModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            announcement={announcement}
          />

          <DeleteAnnouncementDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            announcement={announcement}
            onSuccess={() => {
              // Redirect back to updates or the origin page upon deletion
              router.push(backPath);
            }}
          />
        </>
      )}
    </div>
  );
}
