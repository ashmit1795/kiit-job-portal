"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: resumeUrl, isLoading: isResumeLoading } = useQuery({
    queryKey: ["profile", "resume"],
    queryFn: profileService.getResumeUrl,
    enabled: !!user?.resume_url,
  });

  const uploadMutation = useMutation({
    mutationFn: profileService.uploadResume,
    onSuccess: async () => {
      toast.success("Resume uploaded successfully!");
      setResumeFile(null);
      await refreshUser();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to upload resume.");
    },
  });

  const handleUpload = () => {
    if (!resumeFile) return;
    uploadMutation.mutate(resumeFile);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm dark:border-zinc-800">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Your personal and academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">Email / ID</Label>
                <div className="font-semibold text-lg">{user.email}</div>
                <div className="text-sm text-zinc-500 mt-1">Roll Number: {user.roll_number || "N/A"}</div>
              </div>
              <Badge variant="outline" className="text-sm capitalize px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                {user.role} role
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">Program & Branch</Label>
                <div className="font-medium mt-1">
                  {user.branch ? `${user.branch.name} (${user.branch.program?.name})` : "Not Provided"}
                </div>
              </div>
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">Graduation Batch</Label>
                <div className="font-medium mt-1">{user.batch?.year || "Not Provided"}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">CGPA</Label>
                <div className="font-bold text-xl text-blue-600 dark:text-blue-400 mt-1">{user.cgpa || "N/A"}</div>
              </div>
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">12th %</Label>
                <div className="font-bold text-xl mt-1">{user.twelfth_percentage || "N/A"}</div>
              </div>
              <div>
                <Label className="text-zinc-500 uppercase tracking-wider text-xs">10th %</Label>
                <div className="font-bold text-xl mt-1">{user.tenth_percentage || "N/A"}</div>
              </div>
            </div>

          </CardContent>
        </Card>

        {user.role !== "admin" && (
          <Card className="shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your latest resume (PDF)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center justify-center text-center">
              
              {user.resume_url ? (
                <div className="w-full flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-xl">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-500 mb-2" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-500">Resume Uploaded</span>
                  {resumeUrl && (
                    <Button variant="link" className="mt-2 text-blue-600" onClick={() => window.open(resumeUrl, "_blank")}>
                      View Current Resume
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl">
                  <FileText className="h-8 w-8 text-amber-500 mb-2" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-500">No Resume Found</span>
                </div>
              )}

              <div className="w-full space-y-2 mt-4">
                <Input 
                  type="file" 
                  accept="application/pdf" 
                  className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setResumeFile(e.target.files?.[0] || null)}
                />
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  disabled={!resumeFile || uploadMutation.isPending}
                  onClick={handleUpload}
                >
                  {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {user.resume_url ? "Update Resume" : "Upload Resume"}
                </Button>
              </div>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
