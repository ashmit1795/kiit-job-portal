"use client";

import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { profileService, UpdateProfilePayload } from "@/services/profile.service";
import { useAuth } from "@/providers/auth-provider";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Edit2, Check, X, Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

interface ContactEditFormProps {
  user: User;
}

export function ContactEditForm({ user }: ContactEditFormProps) {
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    personal_email: user.personal_email || "",
    phone_number: user.phone_number || "",
    linkedin_url: user.linkedin_url || "",
    github_url: user.github_url || "",
    portfolio_url: user.portfolio_url || "",
  });

  // Reset form when user props change or editing is cancelled
  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => {
        setFormData({
          personal_email: user.personal_email || "",
          phone_number: user.phone_number || "",
          linkedin_url: user.linkedin_url || "",
          github_url: user.github_url || "",
          portfolio_url: user.portfolio_url || "",
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, isEditing]);

  const updateMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: async () => {
      await refreshUser();
      toast.success("Contact details updated successfully");
      setIsEditing(false);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update details");
    },
  });

  const handleSave = () => {
    const payload: Partial<UpdateProfilePayload> = {};
    let hasChanges = false;

    // Helper to normalize values for comparison (treat null and "" as equivalent)
    const normalize = (val: any) => (val === null || val === undefined ? "" : val);

    Object.keys(formData).forEach((key) => {
      const formValue = formData[key as keyof UpdateProfilePayload];
      const userValue = (user as any)[key];
      
      if (normalize(formValue) !== normalize(userValue)) {
        // If it's an empty string, convert to null for the backend validation (.nullable())
        payload[key as keyof UpdateProfilePayload] = formValue === "" ? null : (formValue as any);
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      toast.info("No changes to save");
      setIsEditing(false);
      return;
    }

    updateMutation.mutate(payload);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Contact & Social Links</h3>
            <p className="text-sm text-muted-foreground">Your alternative contact methods and professional profiles.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Links
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl border border-border/50">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Personal Email</Label>
              <p className="font-medium text-foreground break-all">{user.personal_email || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Phone Number</Label>
              <p className="font-medium text-foreground">{user.phone_number || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Linkedin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">LinkedIn Profile</Label>
              {user.linkedin_url ? (
                <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="font-medium text-emerald-400 hover:underline break-all">
                  {user.linkedin_url}
                </a>
              ) : (
                <p className="font-medium text-foreground">Not provided</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Github className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">GitHub Profile</Label>
              {user.github_url ? (
                <a href={user.github_url} target="_blank" rel="noreferrer" className="font-medium text-emerald-400 hover:underline break-all">
                  {user.github_url}
                </a>
              ) : (
                <p className="font-medium text-foreground">Not provided</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3 md:col-span-2">
            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Portfolio / Website</Label>
              {user.portfolio_url ? (
                <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="font-medium text-emerald-400 hover:underline break-all">
                  {user.portfolio_url}
                </a>
              ) : (
                <p className="font-medium text-foreground">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 border border-emerald-500/30 rounded-xl p-6 bg-emerald-950/5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-emerald-400">Edit Contact Details</h3>
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
          <Label>Personal Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              className="pl-9"
              value={formData.personal_email || ""}
              onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
              placeholder="e.g. yourname@gmail.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              className="pl-9"
              value={formData.phone_number || ""}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="e.g. 9876543210"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              className="pl-9"
              value={formData.linkedin_url || ""}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              className="pl-9"
              value={formData.github_url || ""}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Portfolio / Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              className="pl-9"
              value={formData.portfolio_url || ""}
              onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
