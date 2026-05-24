"use client";

import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobService, CreateJobPayload } from "@/services/job.service";
import { academicService } from "@/services/academic.service";
import { Job } from "@/types/job";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle, ArrowLeft, ArrowRight, Link as LinkIcon, X } from "lucide-react";

import type { AxiosError } from "axios";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

const toLocalDatetimeInput = (isoString?: string) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset();
  const localTime = new Date(d.getTime() - offset * 60 * 1000);
  return localTime.toISOString().slice(0, 16);
};

export function EditJobModal({ isOpen, onClose, job }: EditJobModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);

  const { data: branches } = useQuery({ queryKey: ["branches", ""], queryFn: () => academicService.fetchBranches() });
  const { data: batches } = useQuery({ queryKey: ["batches"], queryFn: academicService.fetchBatches });

  const [formData, setFormData] = useState<Partial<CreateJobPayload>>({
    circular_number: job.circular_number,
    company_name: job.company_name,
    role_title: job.role_title,
    job_type: job.job_type,
    ctc: job.ctc || "",
    stipend: job.stipend || "",
    min_cgpa: job.min_cgpa || undefined,
    deadline: toLocalDatetimeInput(job.deadline),
    joining_date: job.joining_date || "",
    apply_link_1: job.apply_link_1 || "",
    apply_link_2: job.apply_link_2 || "",
    branches: job.eligible_branches?.map((b) => b.id) || [],
    batches: job.eligible_batches?.map((b) => b.id) || [],
    created_at: toLocalDatetimeInput(job.created_at),
  });

  const [file, setFile] = useState<File | null>(null);
  const [locationsInput, setLocationsInput] = useState(job.locations?.join(", ") || "");
  const [description, setDescription] = useState<string>(job.description || "");

  // Pre-fill if the job prop changes
  useEffect(() => {
    if (job) {
      setFormData({
        circular_number: job.circular_number,
        company_name: job.company_name,
        role_title: job.role_title,
        job_type: job.job_type,
        ctc: job.ctc || "",
        stipend: job.stipend || "",
        min_cgpa: job.min_cgpa || undefined,
        deadline: toLocalDatetimeInput(job.deadline),
        joining_date: job.joining_date || "",
        apply_link_1: job.apply_link_1 || "",
        apply_link_2: job.apply_link_2 || "",
        branches: job.eligible_branches?.map((b) => b.id) || [],
        batches: job.eligible_batches?.map((b) => b.id) || [],
        created_at: toLocalDatetimeInput(job.created_at),
      });
      setLocationsInput(job.locations?.join(", ") || "");
      setDescription(job.description || "");
      setStep(1);
      setFile(null);
    }
  }, [job, isOpen]);

  const updateJobMutation = useMutation({
    mutationFn: (payload: Omit<CreateJobPayload, "circular_file"> & { circular_file?: File }) => 
      jobService.updateJob(job.id, payload),
    onSuccess: () => {
      toast.success("Opportunity updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs", job.id] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to update opportunity.");
    },
  });

  const toggleArrayItem = (key: "branches" | "batches", id: string) => {
    const arr = formData[key] || [];
    if (arr.includes(id)) {
      setFormData({ ...formData, [key]: arr.filter((i) => i !== id) });
    } else {
      setFormData({ ...formData, [key]: [...arr, id] });
    }
  };

  const selectAllBranches = () => {
    setFormData({ ...formData, branches: branches?.map((b) => b.id) || [] });
  };

  const deselectAllBranches = () => {
    setFormData({ ...formData, branches: [] });
  };

  const validateStep1 = () => {
    if (!formData.circular_number?.trim()) { toast.error("Circular number is required."); return false; }
    if (!formData.company_name?.trim()) { toast.error("Company name is required."); return false; }
    if (!formData.role_title?.trim()) { toast.error("Role title is required."); return false; }
    if (!formData.job_type) { toast.error("Please select a job type."); return false; }
    if (!formData.deadline) { toast.error("Deadline is required."); return false; }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((formData.branches?.length || 0) === 0 || (formData.batches?.length || 0) === 0) { toast.error("Select at least one branch and batch"); return; }
    if (!formData.deadline) { toast.error("Deadline is required"); return; }

    const payload = {
      ...formData,
      description: description || undefined,
      locations: locationsInput.split(",").map((l) => l.trim()).filter((l) => l),
      circular_file: file || undefined, // Send only if a new file is uploaded
      deadline: new Date(formData.deadline).toISOString(),
      joining_date: formData.joining_date || undefined,
      apply_link_1: formData.apply_link_1 || undefined,
      apply_link_2: formData.apply_link_2 || undefined,
      created_at: formData.created_at ? new Date(formData.created_at).toISOString() : undefined,
    } as any;

    updateJobMutation.mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-xl border border-border/50 bg-card shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Edit Opportunity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Modify placement details, eligibility, or attachment.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-border/40 bg-muted/20 flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            step === 1 ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/30" : "bg-muted/30 text-muted-foreground"
          }`}>
            <span className="h-4.5 w-4.5 rounded-full bg-emerald-600/20 flex items-center justify-center text-[10px] font-bold">1</span>
            Opportunity Details
          </div>
          <div className="h-px flex-1 bg-border/40" />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            step === 2 ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/30" : "bg-muted/30 text-muted-foreground"
          }`}>
            <span className="h-4.5 w-4.5 rounded-full bg-emerald-600/20 flex items-center justify-center text-[10px] font-bold">2</span>
            Eligibility & Upload
          </div>
        </div>

        {/* Modal content body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Job Details */}
            <div className={step === 1 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Circular Number *</Label>
                    <Input required placeholder="KIIT-DU/T&P/..." value={formData.circular_number || ""} onChange={(e) => setFormData({ ...formData, circular_number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input required placeholder="Alphabet Inc." value={formData.company_name || ""} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role Title *</Label>
                    <Input required placeholder="Software Engineer" value={formData.role_title || ""} onChange={(e) => setFormData({ ...formData, role_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Type *</Label>
                    <Select value={formData.job_type || ""} onValueChange={(val) => setFormData({ ...formData, job_type: val as any })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placement">Placement</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="internship_fulltime">Internship + PPO</SelectItem>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="talk">Talk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>CTC</Label>
                    <Input placeholder="e.g. 15 LPA" value={formData.ctc || ""} onChange={(e) => setFormData({ ...formData, ctc: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stipend</Label>
                    <Input placeholder="e.g. 40k/month" value={formData.stipend || ""} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Min CGPA</Label>
                    <Input type="number" step="0.01" min="0" max="10" placeholder="e.g. 7.5" value={formData.min_cgpa || ""} onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value ? parseFloat(e.target.value) : undefined })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Deadline *</Label>
                    <Input required type="datetime-local" value={formData.deadline || ""} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Joining Date</Label>
                    <Input placeholder="e.g. May/June 2027" value={formData.joining_date || ""} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Created Date (Backdate)</Label>
                    <Input type="datetime-local" value={formData.created_at || ""} onChange={(e) => setFormData({ ...formData, created_at: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Locations</Label>
                  <Input placeholder="Bangalore, Hyderabad, Remote (comma separated)" value={locationsInput} onChange={(e) => setLocationsInput(e.target.value)} />
                </div>

                {/* Apply Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-emerald-500" /> Apply Link 1
                    </Label>
                    <Input type="url" placeholder="https://..." value={formData.apply_link_1 || ""} onChange={(e) => setFormData({ ...formData, apply_link_1: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <LinkIcon className="h-3.5 w-3.5 text-emerald-500" /> Apply Link 2
                    </Label>
                    <Input type="url" placeholder="https://..." value={formData.apply_link_2 || ""} onChange={(e) => setFormData({ ...formData, apply_link_2: e.target.value })} />
                  </div>
                </div>

                {/* Markdown description editor */}
                <div className="space-y-2" data-color-mode="dark">
                  <Label>Description <span className="text-xs text-muted-foreground ml-1">(Markdown supported)</span></Label>
                  <MDEditor
                    value={description}
                    onChange={(val) => setDescription(val || "")}
                    height={200}
                    preview="edit"
                    textareaProps={{
                      placeholder: "Write job description, requirements, skills...",
                    }}
                  />
                </div>

                <Button type="button" onClick={() => { if (validateStep1()) setStep(2); }} className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold">
                  Next: Eligibility & Upload <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Step 2: Eligibility & Upload */}
            <div className={step === 2 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Circular PDF <span className="text-xs text-muted-foreground font-normal ml-1">(Optional &mdash; leave empty to keep existing circular)</span></Label>
                  <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${file ? "border-emerald-700/30 bg-emerald-900/10" : "border-border/50 hover:border-emerald-700/30"}`}>
                    {file ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload a new circular PDF</p>
                        {job.circular_file_path && (
                          <p className="text-xs text-emerald-500/70 mt-1">Currently has a circular PDF attached</p>
                        )}
                      </div>
                    )}
                    <Input type="file" accept="application/pdf" className="opacity-0 absolute inset-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Eligible Batches *</Label>
                  <div className="flex flex-wrap gap-2">
                    {batches?.map((b) => (
                      <Badge
                        key={b.id}
                        variant={formData.batches?.includes(b.id) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${formData.batches?.includes(b.id) ? "bg-emerald-600/20 text-emerald-400 border-emerald-700/30 hover:bg-emerald-600/30" : "hover:border-emerald-700/30"}`}
                        onClick={() => toggleArrayItem("batches", b.id)}
                      >
                        {b.year}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Eligible Branches *</Label>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" className="text-xs text-emerald-400 h-7" onClick={selectAllBranches}>Select All</Button>
                      <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={deselectAllBranches}>Clear</Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-border/50 rounded-xl bg-muted/10">
                    {!branches ? (
                      <div className="w-full flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading branches...</span>
                      </div>
                    ) : branches.map((b) => (
                      <Badge
                        key={b.id}
                        variant={formData.branches?.includes(b.id) ? "default" : "outline"}
                        className={`cursor-pointer font-normal transition-all ${formData.branches?.includes(b.id) ? "bg-emerald-600/20 text-emerald-400 border-emerald-700/30 hover:bg-emerald-600/30" : "hover:border-emerald-700/30"}`}
                        onClick={() => toggleArrayItem("branches", b.id)}
                      >
                        {b.program?.name} {b.code}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{formData.branches?.length || 0} branch(es) selected</p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-brand hover:opacity-90 text-white font-semibold" disabled={updateJobMutation.isPending}>
                    {updateJobMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
