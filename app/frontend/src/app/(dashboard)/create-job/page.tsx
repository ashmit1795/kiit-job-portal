"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { jobService, CreateJobPayload } from "@/services/job.service";
import { academicService } from "@/services/academic.service";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Role Gate
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
      toast.success(user?.role === "admin" ? "Job posted & approved successfully!" : "Job submitted for admin approval.");
      router.push("/jobs");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create job.");
    },
  });

  const toggleArrayItem = (key: "branches" | "batches", id: string) => {
    const arr = formData[key] || [];
    if (arr.includes(id)) {
      setFormData({ ...formData, [key]: arr.filter(i => i !== id) });
    } else {
      setFormData({ ...formData, [key]: [...arr, id] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Circular PDF is required");
      return;
    }
    if ((formData.branches?.length || 0) === 0 || (formData.batches?.length || 0) === 0) {
      toast.error("Select at least one branch and batch");
      return;
    }
    if (!formData.deadline) {
      toast.error("Deadline is required");
      return;
    }

    const payload = {
      ...formData,
      locations: locationsInput.split(",").map(l => l.trim()).filter(l => l),
      circular_file: file,
      deadline: new Date(formData.deadline).toISOString(),
      joining_date: formData.joining_date ? new Date(formData.joining_date).toISOString() : undefined,
    } as CreateJobPayload;

    createJobMutation.mutate(payload);
  };

  if (!user || !["admin", "volunteer"].includes(user.role)) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job Opportunity</CardTitle>
          <CardDescription>
            {user.role === "admin" 
              ? "Jobs posted by admins are automatically approved." 
              : "Jobs posted by volunteers will be pending admin approval."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Circular Number *</Label>
                <Input required placeholder="KIIT-DU/T&P/..." onChange={e => setFormData({...formData, circular_number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input required placeholder="Alphabet Inc." onChange={e => setFormData({...formData, company_name: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role Title *</Label>
                <Input required placeholder="Software Engineer" onChange={e => setFormData({...formData, role_title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select required onValueChange={val => setFormData({...formData, job_type: val as string})}>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>CTC</Label>
                <Input placeholder="e.g. 15 LPA" onChange={e => setFormData({...formData, ctc: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Stipend</Label>
                <Input placeholder="e.g. 40k/month" onChange={e => setFormData({...formData, stipend: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Min CGPA</Label>
                <Input type="number" step="0.01" min="0" max="10" placeholder="e.g. 7.5" onChange={e => setFormData({...formData, min_cgpa: parseFloat(e.target.value)})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Deadline *</Label>
                <Input required type="datetime-local" onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Joining Date</Label>
                <Input type="date" onChange={e => setFormData({...formData, joining_date: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Locations</Label>
              <Input placeholder="Bangalore, Hyderabad, Remote (Comma separated)" value={locationsInput} onChange={e => setLocationsInput(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} placeholder="Key requirements, skills, notes..." onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Circular PDF *</Label>
              <Input required type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>

            <div className="space-y-4 pt-4 border-t dark:border-zinc-800">
              <div className="space-y-2">
                <Label>Eligible Batches *</Label>
                <div className="flex flex-wrap gap-2">
                  {batches?.map(b => (
                    <Badge 
                      key={b.id} 
                      variant={formData.batches?.includes(b.id) ? "default" : "outline"} 
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem("batches", b.id)}
                    >
                      {b.year}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eligible Branches *</Label>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border rounded-md dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                  {branches?.map(b => (
                    <Badge 
                      key={b.id} 
                      variant={formData.branches?.includes(b.id) ? "default" : "outline"} 
                      className="cursor-pointer font-normal"
                      onClick={() => toggleArrayItem("branches", b.id)}
                    >
                      {b.code} ({b.name})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={createJobMutation.isPending}>
              {createJobMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Opportunity
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
