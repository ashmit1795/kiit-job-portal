import { Job } from "@/types/job";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <Card className="hover:shadow-md transition-shadow dark:border-zinc-800">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-900 dark:text-blue-400 mb-2">
              {job.job_type.replace("_", " ")}
            </Badge>
            <CardTitle className="text-xl">{job.role_title}</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400 font-medium text-base">
              {job.company_name}
            </CardDescription>
          </div>
          <Badge variant={job.approval_status === "approved" ? "secondary" : "default"}>
            {job.approval_status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          {job.ctc && (
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">CTC:</span> {job.ctc}
            </div>
          )}
          {job.stipend && (
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Stipend:</span> {job.stipend}
            </div>
          )}
          {job.locations?.length > 0 && (
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <MapPin className="h-4 w-4" />
              <span>{job.locations.join(", ")}</span>
            </div>
          )}
          {job.min_cgpa && (
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <GraduationCap className="h-4 w-4" />
              <span>Min CGPA: {job.min_cgpa}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Badge variant="outline" className="text-xs font-normal">
            {job.eligible_batches.map(b => b.year).join(", ")} Batches
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-0">
        <div className={`flex items-center gap-1.5 text-sm font-medium ${isExpired ? 'text-red-500' : 'text-orange-500'}`}>
          <CalendarDays className="h-4 w-4" />
          {isExpired ? "Deadline Passed" : `Closes: ${new Date(job.deadline).toLocaleDateString()}`}
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button variant="default" size="sm">Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
