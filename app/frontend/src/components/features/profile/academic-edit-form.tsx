"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { academicService } from "@/services/academic.service";
import { profileService, UpdateProfilePayload } from "@/services/profile.service";
import { useAuth } from "@/providers/auth-provider";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit2, Check, X } from "lucide-react";

interface AcademicEditFormProps {
  user: User;
}

export function AcademicEditForm({ user }: AcademicEditFormProps) {
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [programId, setProgramId] = useState<string>(user.branch?.program?.id || "");
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    branch_id: user.branch?.id || "",
    batch_id: user.batch?.id || "",
    cgpa: user.cgpa || 0,
    tenth_percentage: user.tenth_percentage || 0,
    twelfth_percentage: user.twelfth_percentage || 0,
  });

  // Reset form when user props change or editing is cancelled
  useEffect(() => {
    if (!isEditing) {
      // Instead of synchronously setting state here for every render, 
      // we'll rely on the default values. But if user changes, we need to sync it.
      const timer = setTimeout(() => {
        setProgramId(user.branch?.program?.id || "");
        setFormData({
          branch_id: user.branch?.id || "",
          batch_id: user.batch?.id || "",
          cgpa: user.cgpa || 0,
          tenth_percentage: user.tenth_percentage || 0,
          twelfth_percentage: user.twelfth_percentage || 0,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, isEditing]);

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: academicService.fetchPrograms,
    enabled: isEditing,
  });
  const { data: branches, isLoading: isBranchesLoading } = useQuery({
    queryKey: ["branches", programId],
    queryFn: () => academicService.fetchBranches(programId),
    enabled: isEditing && !!programId,
  });
  const { data: batches, isLoading: isBatchesLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: academicService.fetchBatches,
    enabled: isEditing,
  });

  const programItems = (programs ?? []).map((p) => ({
    value: p.id,
    label: `${p.name} (${p.level})`,
  }));

  const branchItems = (branches ?? [])
    .filter((b) => b.code !== "ALL")
    .map((b) => ({
      value: b.id,
      label: b.code === "N/A" ? b.name : `${b.name} (${b.code})`,
    }));

  const batchItems = (batches ?? []).map((b) => ({
    value: b.id,
    label: String(b.year),
  }));

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Academic details updated successfully");
      setIsEditing(false);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update details");
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Academic Details</h3>
            <p className="text-sm text-muted-foreground">Your educational background and scores.</p>
          </div>
          {user.role !== "admin" && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl border border-border/50">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Program & Branch</Label>
            <p className="font-medium text-foreground">{user.branch ? `${user.branch.name} (${user.branch.program?.name})` : "Not set"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Graduation Batch</Label>
            <p className="font-medium text-foreground">{user.batch?.year || "Not set"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Current CGPA</Label>
            <p className="font-medium text-foreground">{user.cgpa ?? "Not set"}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">12th Percentage</Label>
            <p className="font-medium text-foreground">{user.twelfth_percentage ?? "Not set"}%</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">10th Percentage</Label>
            <p className="font-medium text-foreground">{user.tenth_percentage ?? "Not set"}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 border border-emerald-500/30 rounded-xl p-6 bg-emerald-950/5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-emerald-400">Edit Academic Details</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={updateMutation.isPending}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white" 
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Program</Label>
          <Select
            items={programItems}
            value={programId}
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

        <div className="space-y-2">
          <Label>Branch</Label>
          <Select
            items={branchItems}
            value={formData.branch_id}
            onValueChange={(val) => setFormData({ ...formData, branch_id: val as string })}
            disabled={!programId || isBranchesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={!programId ? "Select Program first" : "Select Branch"} />
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

        <div className="space-y-2">
          <Label>Batch (Graduation Year)</Label>
          <Select
            items={batchItems}
            value={formData.batch_id}
            onValueChange={(val) => setFormData({ ...formData, batch_id: val as string })}
            disabled={isBatchesLoading}
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

        <div className="space-y-2">
          <Label>CGPA (out of 10)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
            placeholder="e.g. 8.5"
          />
        </div>

        <div className="space-y-2">
          <Label>12th Percentage</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.twelfth_percentage}
            onChange={(e) => setFormData({ ...formData, twelfth_percentage: parseFloat(e.target.value) || 0 })}
            placeholder="e.g. 92.5"
          />
        </div>

        <div className="space-y-2">
          <Label>10th Percentage</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.tenth_percentage}
            onChange={(e) => setFormData({ ...formData, tenth_percentage: parseFloat(e.target.value) || 0 })}
            placeholder="e.g. 95.0"
          />
        </div>
      </div>
    </div>
  );
}
