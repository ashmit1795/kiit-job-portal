"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, FileText, Check, GraduationCap, User } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: resumeUrl } = useQuery({
    queryKey: ["profile", "resume"],
    queryFn: profileService.getResumeUrl,
    enabled: !!user?.resume_url,
  });

  const uploadMutation = useMutation({
    mutationFn: profileService.uploadResume,
    onSuccess: async () => {
      toast.success("Resume uploaded!");
      setResumeFile(null);
      await refreshUser();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Upload failed.");
    },
  });

  if (!user) return null;

  const roleBadge = () => {
    if (user.role === "admin") return <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-700/30">⚡ Admin</Badge>;
    if (user.role === "volunteer") return <Badge className="bg-amber-600/20 text-amber-400 border-amber-700/30">🎯 Volunteer</Badge>;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-900/40 via-card to-card border border-border/50 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-14 w-14 rounded-xl">
            {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} className="rounded-xl" />}
            <AvatarFallback className="h-14 w-14 rounded-xl bg-emerald-600/20 text-emerald-400 text-xl font-bold">
              {user.full_name ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{user.full_name || user.roll_number || user.email}</h1>
              {roleBadge()}
            </div>
            {user.roll_number && <p className="text-sm text-muted-foreground mt-0.5">{user.roll_number}</p>}
            <p className="text-sm text-muted-foreground mt-0.5 break-all">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="md:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500" /> Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Program & Branch</Label>
                <p className="font-medium mt-1">
                  {user.branch ? `${user.branch.name} (${user.branch.program?.name})` : "Not set"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Batch</Label>
                <p className="font-medium mt-1">{user.batch?.year || "Not set"}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-emerald-900/10 border border-emerald-700/20">
                <GraduationCap className="h-5 w-5 mx-auto text-emerald-500 mb-2" />
                <p className="text-xs text-muted-foreground font-medium uppercase">CGPA</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{user.cgpa || "–"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground font-medium uppercase">12th %</p>
                <p className="text-2xl font-bold mt-1">{user.twelfth_percentage || "–"}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground font-medium uppercase">10th %</p>
                <p className="text-2xl font-bold mt-1">{user.tenth_percentage || "–"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        {user.role !== "admin" && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Resume</CardTitle>
              <CardDescription>Upload your latest resume (PDF)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.resume_url ? (
                <div className="p-4 rounded-xl bg-emerald-900/10 border border-emerald-700/20 text-center">
                  <Check className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-emerald-400">Resume Uploaded</p>
                  {resumeUrl && (
                    <Button variant="link" className="mt-1 text-emerald-400 text-xs p-0 h-auto" onClick={() => window.open(resumeUrl, "_blank")}>
                      View Resume
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-700/20 text-center">
                  <FileText className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-amber-400">No Resume</p>
                </div>
              )}

              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />

              <Button
                className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold"
                disabled={!resumeFile || uploadMutation.isPending}
                onClick={() => resumeFile && uploadMutation.mutate(resumeFile)}
              >
                {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                {user.resume_url ? "Update Resume" : "Upload Resume"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
