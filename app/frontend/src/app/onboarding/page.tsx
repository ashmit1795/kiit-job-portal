"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { academicService } from "@/services/academic.service";
import { profileService, CompleteProfilePayload } from "@/services/profile.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, GraduationCap } from "lucide-react";

import type { AxiosError } from "axios";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser, isLoading: isAuthLoading } = useAuth();

  const [programId, setProgramId] = useState<string>("");
  const [formData, setFormData] = useState<CompleteProfilePayload>({
    branch_id: "",
    batch_id: "",
    cgpa: 0,
    tenth_percentage: 0,
    twelfth_percentage: 0,
  });

  useEffect(() => {
    if (!isAuthLoading && user?.profile_completed) {
      router.push("/jobs");
    }
  }, [user, isAuthLoading, router]);

  const { data: programs, isLoading: isProgramsLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: academicService.fetchPrograms,
  });
  const { data: branches, isLoading: isBranchesLoading } = useQuery({
    queryKey: ["branches", programId],
    queryFn: () => academicService.fetchBranches(programId),
    enabled: !!programId,
  });
  const { data: batches, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: academicService.fetchBatches,
  });

  // Build items arrays in the { value, label } shape Base UI expects
  const programItems = (programs ?? []).map((p) => ({
    value: p.id,
    label: `${p.name} (${p.level})`,
  }));

  const branchItems = (branches ?? []).map((b) => ({
    value: b.id,
    label: `${b.name} (${b.code})`,
  }));

  const batchItems = (batches ?? []).map((b) => ({
    value: b.id,
    label: String(b.year),
  }));

  const completeProfileMutation = useMutation({
    mutationFn: profileService.completeProfile,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile completed!");
      router.push("/jobs");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to complete profile.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch_id || !formData.batch_id) {
      toast.error("Please select a branch and batch.");
      return;
    }
    completeProfileMutation.mutate(formData);
  };

  if (isAuthLoading || user?.profile_completed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-background to-background pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-lg border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/10">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Complete your profile</CardTitle>
          <CardDescription>Fill in your academic details to access placement opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Program */}
              <div className="space-y-2">
                <Label>Program</Label>
                {/* Pass items to Root so SelectValue renders the label, not the UUID */}
                <Select
                  items={programItems}
                  disabled={isProgramsLoading}
                  onValueChange={(val) => {
                    setProgramId(val as string);
                    setFormData({ ...formData, branch_id: "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  items={branchItems}
                  disabled={!programId || isBranchesLoading}
                  onValueChange={(val) => setFormData({ ...formData, branch_id: val as string })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Batch */}
              <div className="space-y-2">
                <Label>Graduation Batch</Label>
                <Select
                  items={batchItems}
                  disabled={isBatchesLoading}
                  onValueChange={(val) => setFormData({ ...formData, batch_id: val as string })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Label>Current CGPA (out of 10)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  placeholder="e.g. 8.5"
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>10th %</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 90.5"
                    onChange={(e) => setFormData({ ...formData, tenth_percentage: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>12th %</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 88.0"
                    onChange={(e) => setFormData({ ...formData, twelfth_percentage: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold h-11 rounded-xl shadow-lg shadow-emerald-900/20"
              disabled={completeProfileMutation.isPending}
            >
              {completeProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
