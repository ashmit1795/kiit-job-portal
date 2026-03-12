"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/jobs");
    }
  }, [user, router]);

  const { data: jobs, isLoading } = useQuery({ queryKey: ["jobs"], queryFn: jobService.fetchJobs });

  const approveMutation = useMutation({
    mutationFn: jobService.approveJob,
    onSuccess: () => {
      toast.success("Job approved successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to approve job"),
  });

  const rejectMutation = useMutation({
    mutationFn: jobService.rejectJob,
    onSuccess: () => {
      toast.success("Job rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Failed to reject job"),
  });

  if (!user || user.role !== "admin") return null;

  const pendingJobs = jobs?.filter(j => j.approval_status === "pending") || [];
  const approvedJobs = jobs?.filter(j => j.approval_status === "approved") || [];
  const rejectedJobs = jobs?.filter(j => j.approval_status === "rejected") || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Jobs</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{jobs?.length || 0}</div></CardContent>
        </Card>
        <Card className="shadow-sm border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending Review</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{pendingJobs.length}</div></CardContent>
        </Card>
        <Card className="shadow-sm border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Approved</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{approvedJobs.length}</div></CardContent>
        </Card>
        <Card className="shadow-sm border-red-100 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{rejectedJobs.length}</div></CardContent>
        </Card>
      </div>

      <Card className="shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review jobs submitted by volunteers.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">No pending jobs to review.</div>
          ) : (
            <div className="space-y-4">
              {pendingJobs.map(job => (
                <div key={job.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 gap-4">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-lg hover:underline text-blue-600 dark:text-blue-400">
                      {job.role_title} @ {job.company_name}
                    </Link>
                    <div className="text-sm text-zinc-500 flex gap-2 items-center mt-1">
                      <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs">Ref: {job.circular_number}</span>
                      <span>Type: {job.job_type.replace("_", " ")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900 dark:text-green-500 dark:hover:bg-green-900/30"
                      onClick={() => approveMutation.mutate(job.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-500 dark:hover:bg-red-900/30"
                      onClick={() => rejectMutation.mutate(job.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
