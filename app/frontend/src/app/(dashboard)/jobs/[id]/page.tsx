"use client";

import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ArrowLeft, Download, MapPin, CalendarDays, GraduationCap, Building, Briefcase, IndianRupee } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [circularUrl, setCircularUrl] = useState<string | null>(null);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => jobService.fetchJobById(jobId),
  });

  useEffect(() => {
    if (job?.circular_file_path) {
      const getSignedUrl = async () => {
        const { data } = await supabase.storage.from("job-circulars").createSignedUrl(job.circular_file_path!, 3600);
        if (data?.signedUrl) setCircularUrl(data.signedUrl);
      };
      getSignedUrl();
    }
  }, [job]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-16 text-zinc-500">
        Job not found or failed to load.
        <br />
        <Button variant="link" onClick={() => router.push("/jobs")}>Return to Jobs</Button>
      </div>
    );
  }

  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/jobs")} className="pl-0 gap-2 hover:bg-transparent hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" /> Back to Feed
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm dark:border-zinc-800">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  {job.job_type.replace("_", " ").toUpperCase()}
                </Badge>
                <div className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full ${isExpired ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400'}`}>
                  <CalendarDays className="h-4 w-4" />
                  {isExpired ? "Closed" : "Accepting Applications"}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">{job.role_title}</CardTitle>
              <CardDescription className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mt-2 flex items-center gap-2">
                <Building className="h-5 w-5 text-zinc-400" /> {job.company_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800">
                {job.ctc && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CTC</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-zinc-400" /> {job.ctc}
                    </span>
                  </div>
                )}
                {job.stipend && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stipend</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-zinc-400" /> {job.stipend}
                    </span>
                  </div>
                )}
                {job.locations?.length > 0 && (
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Locations</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-zinc-400" /> {job.locations.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {job.description && (
                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-zinc-400" /> Job Description
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="shadow-sm dark:border-zinc-800">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 rounded-t-xl border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" /> Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Minimum CGPA</span>
                <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100">{job.min_cgpa || "N/A"}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Eligible Batches</span>
                <div className="flex flex-wrap gap-2">
                  {job.eligible_batches?.map(b => (
                    <Badge key={b.id} variant="secondary" className="font-medium">Batch {b.year}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Eligible Branches</span>
                <ul className="space-y-2">
                  {job.eligible_branches?.map(b => (
                    <li key={b.id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex flex-col bg-zinc-50 dark:bg-zinc-900 p-2 rounded-md border border-zinc-100 dark:border-zinc-800">
                      <span>{b.name} <span className="text-zinc-400 ml-1">({b.code})</span></span>
                      <span className="text-xs text-zinc-500">{b.program_name} • {b.program_level}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </CardContent>
          </Card>

          <Card className="shadow-sm dark:border-zinc-800 border-blue-100 dark:border-blue-900/30">
            <CardContent className="p-6">
              <div className="space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Download className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Official Circular</h3>
                  <p className="text-xs text-zinc-500 mb-4 break-words">Ref: {job.circular_number}</p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={!circularUrl}
                    onClick={() => circularUrl && window.open(circularUrl, "_blank")}
                  >
                    {circularUrl ? "Download PDF" : "Loading Link..."}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
