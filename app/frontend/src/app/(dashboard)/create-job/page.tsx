"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jobService, CreateJobPayload } from "@/services/job.service";
import { academicService } from "@/services/academic.service";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (user && !["admin", "volunteer"].includes(user.role)) {
      router.push("/jobs");
    }
  }, [user, router]);

  const { data: branches } = useQuery({ queryKey: ["branches", ""], queryFn: () => academicService.fetchBranches() });
  const { data: batches } = useQuery({ queryKey: ["batches"], queryFn: academicService.fetchBatches });

  const [formData, setFormData] = useState<Partial<CreateJobPayload>>({
    branches: [],
    batches: [],
    locations: [],
  });

  const [file, setFile] = useState<File | null>(null);
  const [locationsInput, setLocationsInput] = useState("");

  const createJobMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => jobService.createJob(payload),
    onSuccess: () => {
      toast.success(user?.role === "admin" ? "Job posted & approved!" : "Job submitted for review.");
      router.push("/jobs");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create job.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Circular PDF is required"); return; }
    if ((formData.branches?.length || 0) === 0 || (formData.batches?.length || 0) === 0) { toast.error("Select at least one branch and batch"); return; }
    if (!formData.deadline) { toast.error("Deadline is required"); return; }

    const payload = {
      ...formData,
      locations: locationsInput.split(",").map((l) => l.trim()).filter((l) => l),
      circular_file: file,
      deadline: new Date(formData.deadline).toISOString(),
      joining_date: formData.joining_date ? new Date(formData.joining_date).toISOString() : undefined,
    } as CreateJobPayload;

    createJobMutation.mutate(payload);
  };

  if (!user || !["admin", "volunteer"].includes(user.role)) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          step === 1 ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/30" : "bg-muted/30 text-muted-foreground"
        }`}>
          <span className="h-5 w-5 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-bold">1</span>
          Job Details
        </div>
        <div className="h-px flex-1 bg-border/50" />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          step === 2 ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/30" : "bg-muted/30 text-muted-foreground"
        }`}>
          <span className="h-5 w-5 rounded-full bg-emerald-600/20 flex items-center justify-center text-xs font-bold">2</span>
          Eligibility & Upload
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Post a New Job Opportunity</CardTitle>
          <CardDescription>
            {user.role === "admin" ? "Jobs posted by admins are auto-approved." : "Jobs will be pending admin approval."}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    <Select value={formData.job_type || ""} onValueChange={(val) => setFormData({ ...formData, job_type: val as string })}>
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
                    <Input type="number" step="0.01" min="0" max="10" placeholder="e.g. 7.5" value={formData.min_cgpa || ""} onChange={(e) => setFormData({ ...formData, min_cgpa: parseFloat(e.target.value) })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deadline *</Label>
                    <Input required type="datetime-local" value={formData.deadline || ""} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Joining Date</Label>
                    <Input type="date" value={formData.joining_date || ""} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Locations</Label>
                  <Input placeholder="Bangalore, Hyderabad, Remote (comma separated)" value={locationsInput} onChange={(e) => setLocationsInput(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={3} placeholder="Key requirements, skills, notes..." value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <Button type="button" onClick={() => setStep(2)} className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold">
                  Next: Eligibility & Upload <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Step 2: Eligibility & Upload */}
            <div className={step === 2 ? "block" : "hidden"}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Circular PDF *</Label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${file ? "border-emerald-700/30 bg-emerald-900/10" : "border-border/50 hover:border-emerald-700/30"}`}>
                    {file ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload circular PDF</p>
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
                    {branches?.map((b) => (
                      <Badge
                        key={b.id}
                        variant={formData.branches?.includes(b.id) ? "default" : "outline"}
                        className={`cursor-pointer font-normal transition-all ${formData.branches?.includes(b.id) ? "bg-emerald-600/20 text-emerald-400 border-emerald-700/30 hover:bg-emerald-600/30" : "hover:border-emerald-700/30"}`}
                        onClick={() => toggleArrayItem("branches", b.id)}
                      >
                        {b.code}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{formData.branches?.length || 0} branch(es) selected</p>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-brand hover:opacity-90 text-white font-semibold" disabled={createJobMutation.isPending}>
                    {createJobMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Opportunity
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
