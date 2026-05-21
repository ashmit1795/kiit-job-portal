"use client";

import { useState } from "react";
import { CreateAnnouncementPayload, AnnouncementType } from "@/types/announcement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Upload, Loader2, ArrowRight } from "lucide-react";
import { announcementTypeConfig } from "./announcement-type-badge";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
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
  const [formData, setFormData] = useState<Partial<CreateAnnouncementPayload>>({
    subject: initialValues?.subject || "",
    announcement_type: initialValues?.announcement_type || "general",
    job_id: initialValues?.job_id || "global", // using 'global' as empty state for Select
    is_pinned: initialValues?.is_pinned || false,
  });

  const [description, setDescription] = useState(initialValues?.description || "");
  const [file, setFile] = useState<File | null>(null);

  // Fetch jobs for the selector
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs", "active-list"],
    queryFn: () => adminService.fetchAllJobs({ status: "approved", limit: 100 }),
  });

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
      circular: file,
    };

    onSubmit(payload);
  };

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
                  if (!val || val === "global") return <span className="font-medium">Global (All Users)</span>;
                  const selectedJob = jobsData?.jobs.find((j) => j.id === val);
                  if (selectedJob) {
                    return `${selectedJob.company_name} - ${selectedJob.role_title}`;
                  }
                  return val;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global" label="Global (All Users)">
                <span className="font-medium">Global (All Users)</span>
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

      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input 
          type="checkbox" 
          checked={formData.is_pinned}
          onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
          className="rounded border-border bg-muted/50 text-emerald-500 focus:ring-emerald-500/20"
        />
        <span className="text-sm font-medium">Pin this update to the top</span>
      </label>

      <Button type="submit" className="w-full bg-gradient-brand text-white" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
