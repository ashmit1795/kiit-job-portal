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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  // Protect route
  useEffect(() => {
    if (!isAuthLoading && user?.profile_completed) {
      router.push("/jobs");
    }
  }, [user, isAuthLoading, router]);

  // Queries
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

  // Mutation
  const completeProfileMutation = useMutation({
    mutationFn: profileService.completeProfile,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Profile completed successfully!");
      router.push("/jobs");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to complete profile.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch_id || !formData.batch_id) {
      toast.error("Please select a branch and a batch.");
      return;
    }
    completeProfileMutation.mutate(formData);
  };

  const isPageLoading = isAuthLoading || user?.profile_completed;

  if (isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50/50 p-4 dark:bg-zinc-950">
      <Card className="w-full max-w-lg shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Complete your profile</CardTitle>
          <CardDescription>
            You need to complete your profile before accessing placement opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Academic Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="program">Program</Label>
                <Select onValueChange={(val) => {
                  setProgramId(val as string);
                  setFormData({ ...formData, branch_id: "" });
                }}>
                  <SelectTrigger id="program" disabled={isProgramsLoading}>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs?.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.level})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Select 
                  disabled={!programId || isBranchesLoading}
                  onValueChange={(val) => setFormData({ ...formData, branch_id: val as string })}
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name} ({b.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="batch">Graduation Batch (Year)</Label>
                <Select
                  disabled={isBatchesLoading}
                  onValueChange={(val) => setFormData({ ...formData, batch_id: val as string })}
                >
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches?.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold text-lg">Performance</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="cgpa">Current CGPA (Out of 10)</Label>
                <Input
                  id="cgpa"
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
                <div className="grid gap-2">
                  <Label htmlFor="tenth">10th Percentage</Label>
                  <Input
                    id="tenth"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 90.5"
                    onChange={(e) => setFormData({ ...formData, tenth_percentage: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twelfth">12th Percentage</Label>
                  <Input
                    id="twelfth"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
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
