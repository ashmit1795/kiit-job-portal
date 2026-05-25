"use client";

import { useState } from "react";
import { CreateAnnouncementPayload, AnnouncementType } from "@/types/announcement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Upload, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { announcementTypeConfig } from "./announcement-type-badge";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { academicService } from "@/services/academic.service";
import { useAuth } from "@/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AnnouncementFormProps {
  initialValues?: Partial<CreateAnnouncementPayload>;
  existingCircularPath?: string | null;
  onSubmit: (payload: CreateAnnouncementPayload) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function AnnouncementForm({
  initialValues,
  existingCircularPath,
  onSubmit,
  isSubmitting,
  submitLabel = "Submit",
}: AnnouncementFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<CreateAnnouncementPayload>>({
    subject: initialValues?.subject || "",
    announcement_type: initialValues?.announcement_type || "general",
    job_id: initialValues?.job_id || "global", // using 'global' as empty state for Select
    is_pinned: initialValues?.is_pinned || false,
    send_email: false,
    circular_number: initialValues?.circular_number || "KIIT-DU/T&P/26/",
  });

  const [description, setDescription] = useState(initialValues?.description || "");
  const [file, setFile] = useState<File | null>(null);

  // Standalone targets branch/batch selection
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    initialValues?.branches || 
    (initialValues as any)?.eligible_branches?.map((b: any) => b.id) || 
    []
  );
  const [selectedBatches, setSelectedBatches] = useState<string[]>(
    initialValues?.batches || 
    (initialValues as any)?.eligible_batches?.map((b: any) => b.id) || 
    []
  );

  // Fetch jobs for the selector
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs", "active-list"],
    queryFn: () => adminService.fetchAllJobs({ status: "approved", limit: 100 }),
  });

  // Fetch branches and batches for standalone targeting
  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: ["branches", ""],
    queryFn: () => academicService.fetchBranches()
  });

  const { data: batches, isLoading: isLoadingBatches } = useQuery({
    queryKey: ["batches"],
    queryFn: academicService.fetchBatches
  });

  const toggleArrayItem = (type: "branches" | "batches", id: string) => {
    if (type === "branches") {
      setSelectedBranches((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedBatches((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const selectAllBranches = () => {
    if (branches) {
      setSelectedBranches(branches.map((b) => b.id));
    }
  };

  const deselectAllBranches = () => {
    setSelectedBranches([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject?.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!description?.trim()) {
      toast.error("Description is required");
      return;
    }

    const payload: CreateAnnouncementPayload = {
      subject: formData.subject,
      description: description,
      announcement_type: formData.announcement_type as AnnouncementType,
      job_id: formData.job_id === "global" ? null : formData.job_id,
      is_pinned: formData.is_pinned,
      send_email: formData.send_email,
      circular: file,
      circular_number: formData.circular_number || null,
      branches: formData.job_id === "global" ? selectedBranches : undefined,
      batches: formData.job_id === "global" ? selectedBatches : undefined,
    };

    onSubmit(payload);
  };

  const isStandalone = !formData.job_id || formData.job_id === "global";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Subject *</Label>
        <Input
          placeholder="Enter update subject..."
          value={formData.subject || ""}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Update Type *</Label>
          <Select
            value={formData.announcement_type}
            onValueChange={(val) => setFormData({ ...formData, announcement_type: val as AnnouncementType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type">
                {(val: string | null) => {
                  if (!val) return "Select type";
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
            <SelectContent>
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

        <div className="space-y-2">
          <Label>Target Job (Optional)</Label>
          <Select
            value={formData.job_id || "global"}
            onValueChange={(val) => setFormData({ ...formData, job_id: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job">
                {(val: string | null) => {
                  if (!val || val === "global") return <span className="font-medium">Global (No Job Linked)</span>;
                  const selectedJob = jobsData?.jobs.find((j) => j.id === val);
                  if (selectedJob) {
                    return `${selectedJob.company_name} - ${selectedJob.role_title}`;
                  }
                  return val;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global" label="Global (No Job Linked)">
                <span className="font-medium">Global (No Job Linked)</span>
              </SelectItem>
              {isLoadingJobs ? (
                <div className="p-2 text-xs text-muted-foreground text-center">Loading jobs...</div>
              ) : (
                jobsData?.jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id} label={`${job.company_name} - ${job.role_title}`}>
                    {job.company_name} - {job.role_title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Target Audience controls based on job association */}
      {!isStandalone ? (
        <div className="bg-emerald-950/15 border border-emerald-800/25 rounded-xl p-4 flex gap-3 animate-in fade-in duration-200">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-emerald-400">Target Eligibility Inherited</span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              This update is linked to a specific job opening. It will automatically inherit all branch and batch eligibility criteria of that job. Irrelevant students will not see this in their feed.
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border border-border/40 bg-muted/10 p-4 rounded-xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-1 border-b border-border/30 pb-2">
            <span className="text-sm font-semibold text-foreground">Target Audience (Standalone Update)</span>
            <span className="text-xs text-muted-foreground">Select specific target groups for this standalone announcement, or leave empty to broadcast to everyone.</span>
          </div>

          <div className="space-y-2">
            <Label>Eligible Batches</Label>
            <div className="flex flex-wrap gap-2">
              {isLoadingBatches ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              ) : (
                batches?.map((b) => (
                  <Badge
                    key={b.id}
                    variant={selectedBatches.includes(b.id) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedBatches.includes(b.id)
                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-700/30 hover:bg-emerald-600/30"
                        : "hover:border-emerald-700/30"
                    }`}
                    onClick={() => toggleArrayItem("batches", b.id)}
                  >
                    {b.year}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Eligible Branches</Label>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" className="text-xs text-emerald-400 h-7" onClick={selectAllBranches}>Select All</Button>
                <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={deselectAllBranches}>Clear</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 border border-border/40 rounded-xl bg-muted/10">
              {isLoadingBranches ? (
                <div className="w-full flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                  <span className="ml-2 text-xs text-muted-foreground">Loading branches...</span>
                </div>
              ) : (
                branches?.map((b) => (
                  <Badge
                    key={b.id}
                    variant={selectedBranches.includes(b.id) ? "default" : "outline"}
                    className={`cursor-pointer font-normal transition-all ${
                      selectedBranches.includes(b.id)
                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-700/30 hover:bg-emerald-600/30"
                        : "hover:border-emerald-700/30"
                    }`}
                    onClick={() => toggleArrayItem("branches", b.id)}
                  >
                    {b.program?.name} {b.code}
                  </Badge>
                ))
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedBranches.length === 0 ? "Broadcasts to all branches" : `${selectedBranches.length} branch(es) selected`}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Circular Reference No. <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
        <Input
          placeholder="e.g. KIIT-DU/T&P/26/403"
          value={formData.circular_number || ""}
          onChange={(e) => setFormData({ ...formData, circular_number: e.target.value })}
        />
      </div>

      <div className="space-y-2" data-color-mode="dark">
        <Label>Details * <span className="text-xs text-muted-foreground font-normal ml-1">(Markdown supported)</span></Label>
        <MDEditor
          value={description}
          onChange={(val) => setDescription(val || "")}
          height={200}
          preview="edit"
        />
      </div>

      <div className="space-y-2">
        <Label>Attachment (PDF only)</Label>
        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-colors ${file ? "border-emerald-700/30 bg-emerald-900/10" : "border-border/50 hover:border-emerald-700/30"}`}>
          {file ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
            </div>
          ) : (
            <div>
              <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to attach circular PDF</p>
            </div>
          )}
          <Input 
            type="file" 
            accept="application/pdf" 
            className="opacity-0 absolute inset-0 cursor-pointer" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>
        {existingCircularPath && !file && (
          <p className="text-xs text-muted-foreground mt-1">Leave empty to keep existing attachment.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.is_pinned}
            onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
            className="rounded border-border bg-muted/50 text-emerald-500 focus:ring-emerald-500/20 h-4 w-4"
          />
          <span className="text-sm font-medium">Pin this update to the top</span>
        </label>

        {user?.role === "admin" && !initialValues?.subject && (
          <label className="flex items-center gap-3 cursor-pointer text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 p-3 rounded-lg hover:bg-emerald-500/10 transition-colors">
            <input 
              type="checkbox" 
              checked={formData.send_email}
              onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
              className="rounded border-emerald-500/30 bg-muted/50 text-emerald-500 focus:ring-emerald-500/20 h-4 w-4 shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Send immediate email notifications to students</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">This will immediately email all opted-in target students.</span>
            </div>
          </label>
        )}
      </div>

      <Button type="submit" className="w-full bg-gradient-brand text-white font-semibold" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
