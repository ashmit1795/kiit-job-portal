"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { useAuth } from "@/providers/auth-provider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Download, MapPin, CalendarDays, GraduationCap, Building, Briefcase, IndianRupee, ExternalLink, Clock, Link as LinkIcon, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { AnnouncementFeed } from "@/components/features/announcements/announcement-feed";
import { CreateAnnouncementModal } from "@/components/features/announcements/create-announcement-modal";
import { EditAnnouncementModal } from "@/components/features/announcements/edit-announcement-modal";
import { DeleteAnnouncementDialog } from "@/components/features/announcements/delete-announcement-dialog";
import { Announcement } from "@/types/announcement";
import { announcementService } from "@/services/announcement.service";
import { Megaphone, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { AxiosError } from "axios";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const jobId = params.id as string;
  const fromAdmin = searchParams.get("from") === "admin";
  const [isDownloading, setIsDownloading] = useState(false);

  const [isUpdatesExpanded, setIsUpdatesExpanded] = useState(true);
  const [isCreateUpdateOpen, setIsCreateUpdateOpen] = useState(false);
  const [updateToEdit, setUpdateToEdit] = useState<Announcement | null>(null);
  const [updateToDelete, setUpdateToDelete] = useState<Announcement | null>(null);

  const togglePinMutation = useMutation({
    mutationFn: (announcement: Announcement) => 
      announcementService.updateAnnouncement(announcement.id, { is_pinned: !announcement.is_pinned }),
    onSuccess: () => {
      toast.success("Pin status updated");
      queryClient.invalidateQueries({ queryKey: ["announcements", { jobId }] });
    },
    onError: (err: AxiosError<{ message?: string }>) => toast.error(err.response?.data?.message || "Failed to update pin status"),
  });

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => jobService.fetchJobById(jobId),
  });

  const approveMutation = useMutation({
    mutationFn: () => jobService.approveJob(jobId),
    onSuccess: () => {
      toast.success("Job approved!");
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to approve job"),
  });

  const rejectMutation = useMutation({
    mutationFn: () => jobService.rejectJob(jobId),
    onSuccess: () => {
      toast.success("Job rejected.");
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to reject job"),
  });

  const handleDownloadCircular = async () => {
    setIsDownloading(true);
    try {
      const url = await jobService.downloadCircular(jobId);
      if (url) window.open(url, "_blank");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      toast.error(axiosErr?.response?.data?.message || "Failed to download circular.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="font-medium">Job not found or failed to load.</p>
        <Button variant="link" onClick={() => router.push(fromAdmin ? "/admin" : "/jobs")} className="text-emerald-400 mt-2">
          {fromAdmin ? "Return to Admin Panel" : "Return to Jobs"}
        </Button>
      </div>
    );
  }

  const isExpired = new Date(job.deadline) < new Date();
  const isAdmin = user?.role === "admin";
  const isPending = job.approval_status === "pending";

  // Build approval badge
  const statusBadge = () => {
    switch (job.approval_status) {
      case "approved":
        return (
          <div className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-emerald-600/15 text-emerald-400 border border-emerald-700/30">
            <CheckCircle className="h-4 w-4" /> Approved
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-red-600/15 text-red-400 border border-red-700/30">
            <XCircle className="h-4 w-4" /> Rejected
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-amber-600/15 text-amber-400 border border-amber-700/30">
            <Clock className="h-4 w-4" /> Pending Approval
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(fromAdmin ? "/admin" : "/jobs")}
        className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {fromAdmin ? "Back to Admin Panel" : "Back to Feed"}
      </Button>

      {/* Hero header */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-900/40 via-card to-card border border-border/50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-emerald-600/15 text-emerald-400 border-emerald-700/30 font-medium">
                {({
                  placement: "Placement",
                  internship: "Internship",
                  internship_fulltime: "Internship + PPO",
                  hackathon: "Hackathon",
                  webinar: "Webinar",
                  talk: "Talk",
                } as Record<string, string>)[job.job_type] || job.job_type.replace(/_/g, " ").toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words">{job.role_title}</h1>
            <div className="flex items-center gap-2 text-lg text-muted-foreground font-medium">
              <Building className="h-5 w-5 text-emerald-500 shrink-0" />
              <span className="break-words">{job.company_name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {isAdmin && statusBadge()}
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
              isExpired
                ? "bg-red-600/10 text-red-400 border border-red-700/20"
                : "bg-emerald-600/10 text-emerald-400 border border-emerald-700/20"
            }`}>
              <Clock className="h-3.5 w-3.5" />
              {isExpired ? "Applications Closed" : "Accepting Applications"}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action Bar — only for admins on pending jobs */}
      {isAdmin && isPending && (
        <Card className="border-amber-700/30 bg-amber-900/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-semibold text-sm">Admin Review Required</span>
                <span className="text-xs text-amber-400/70">— This job is awaiting your approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/15 font-semibold"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {approveMutation.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1.5" />}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-700/30 text-red-400 hover:bg-red-600/15 font-semibold"
                  onClick={() => rejectMutation.mutate()}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <XCircle className="h-4 w-4 mr-1.5" />}
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.ctc && (
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CTC</span>
                    <span className="font-semibold flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4 text-emerald-500" /> {job.ctc}
                    </span>
                  </div>
                )}
                {job.stipend && (
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stipend</span>
                    <span className="font-semibold flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4 text-emerald-500" /> {job.stipend}
                    </span>
                  </div>
                )}
                {job.locations?.length > 0 && (
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 sm:col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Locations</span>
                    <span className="font-semibold flex items-center gap-1.5 flex-wrap">
                      <MapPin className="h-4 w-4 text-emerald-500 shrink-0" /> {job.locations.join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</span>
                  <span className="font-semibold flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-emerald-500" />
                    {new Date(job.deadline).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                  </span>
                </div>
                {job.joining_date && (
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joining Date</span>
                    <span className="font-semibold">{job.joining_date}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Apply Links */}
          {(job.apply_link_1 || job.apply_link_2) && (
            <Card className="border-emerald-700/30 bg-emerald-900/5">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {job.apply_link_1 && (
                    <a href={job.apply_link_1} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold gap-2">
                        <LinkIcon className="h-4 w-4" /> Apply Link 1
                      </Button>
                    </a>
                  )}
                  {job.apply_link_2 && (
                    <a href={job.apply_link_2} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/10 font-semibold gap-2">
                        <LinkIcon className="h-4 w-4" /> Apply Link 2
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description — rendered as Markdown */}
          {job.description && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-500" /> Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground
                  prose-headings:text-foreground prose-strong:text-foreground
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-code:text-emerald-400 prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-muted/30 prose-pre:border prose-pre:border-border/50
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:marker:text-emerald-500
                  prose-table:border-collapse prose-th:border prose-th:border-border/50 prose-th:p-2 prose-th:bg-muted/30
                  prose-td:border prose-td:border-border/50 prose-td:p-2
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {job.description}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Announcements / Updates Section */}
          <div className="space-y-4">
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setIsUpdatesExpanded(!isUpdatesExpanded)}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-emerald-500" />
                <h2 className="text-xl font-semibold tracking-tight">Placement Updates</h2>
              </div>
              <div className="flex items-center gap-3">
                {user?.role === "admin" || user?.role === "volunteer" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCreateUpdateOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Post Update
                  </Button>
                ) : null}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-foreground">
                  {isUpdatesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isUpdatesExpanded && (
              <div className="pt-2">
                <AnnouncementFeed 
                  jobId={jobId}
                  onEdit={(a) => setUpdateToEdit(a)}
                  onDelete={(a) => setUpdateToDelete(a)}
                  onTogglePin={(a) => togglePinMutation.mutate(a)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eligibility */}
          <Card className="border-border/50">
            <CardHeader className="bg-muted/30 rounded-t-xl border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" /> Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Min CGPA</span>
                <span className="font-bold text-xl text-emerald-400">{job.min_cgpa || "No restriction"}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Batches</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.eligible_batches?.map((b) => (
                    <Badge key={b.id} variant="secondary" className="font-medium text-xs">{b.year}</Badge>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Branches</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {job.eligible_branches?.map((b) => (
                    <div key={b.id} className="text-sm p-2 rounded-md bg-muted/30 border border-border/30">
                      <span className="font-medium">{b.name} <span className="text-muted-foreground">({b.code})</span></span>
                      <div className="text-xs text-muted-foreground mt-0.5">{b.program_name} · {b.program_level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Circular Download */}
          <Card className="border-emerald-700/30 bg-emerald-900/10">
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Official Circular</h3>
                <p className="text-xs text-muted-foreground break-all">Ref: {job.circular_number}</p>
              </div>
              <Button
                className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/20"
                onClick={handleDownloadCircular}
                disabled={isDownloading}
              >
                {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {(user?.role === "admin" || user?.role === "volunteer") && (
        <>
          <CreateAnnouncementModal
            isOpen={isCreateUpdateOpen}
            onClose={() => setIsCreateUpdateOpen(false)}
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
        </>
      )}
    </div>
  );
}
