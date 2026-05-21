"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, FileText, Check, AlertCircle } from "lucide-react";

interface ResumeCardProps {
  user: User;
}

export function ResumeCard({ user }: ResumeCardProps) {
  const { refreshUser } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: resumeUrl, isLoading: isResumeUrlLoading } = useQuery({
    queryKey: ["profile", "resume"],
    queryFn: profileService.getResumeUrl,
    enabled: !!user.resume_url,
  });

  const uploadMutation = useMutation({
    mutationFn: profileService.uploadResume,
    onSuccess: async () => {
      toast.success("Resume uploaded successfully!");
      setResumeFile(null);
      await refreshUser();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Resume upload failed.");
    },
  });

  if (user.role === "admin") return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Resume Management</h3>
        <p className="text-sm text-muted-foreground">Upload and manage your current resume for job applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Resume Status */}
        <div className="flex flex-col justify-center p-8 rounded-xl border border-dashed border-border bg-muted/10 items-center text-center">
          {user.resume_url ? (
            <>
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h4 className="font-medium text-lg text-emerald-500 mb-1">Resume is Active</h4>
              <p className="text-sm text-muted-foreground mb-6">Your resume is ready for applications.</p>
              
              <Button 
                variant="outline" 
                className="w-full max-w-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                onClick={() => resumeUrl && window.open(resumeUrl, "_blank")}
                disabled={isResumeUrlLoading || !resumeUrl}
              >
                {isResumeUrlLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                View Current Resume
              </Button>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
              <h4 className="font-medium text-lg text-amber-500 mb-1">No Resume Found</h4>
              <p className="text-sm text-muted-foreground">You must upload a resume before you can apply to jobs.</p>
            </>
          )}
        </div>

        {/* Upload Section */}
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card">
          <h4 className="font-medium mb-4">{user.resume_url ? "Upload New Resume" : "Upload Resume"}</h4>
          
          <div className="space-y-2">
            <Input
              type="file"
              accept="application/pdf"
              className="w-full cursor-pointer h-auto py-1.5 pl-1.5 pr-3 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80 overflow-hidden text-ellipsis whitespace-nowrap"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-1">PDF format only. Max size 5MB.</p>
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
            disabled={!resumeFile || uploadMutation.isPending}
            onClick={() => resumeFile && uploadMutation.mutate(resumeFile)}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {user.resume_url ? "Replace Resume" : "Upload Resume"}
          </Button>

          {resumeFile && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50 text-sm flex justify-between items-center">
              <span className="truncate max-w-[200px]">{resumeFile.name}</span>
              <span className="text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
