import { Job } from "@/types/job";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, GraduationCap, IndianRupee, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
  showStatus?: boolean;
}

const typeColors: Record<string, string> = {
  placement: "border-l-emerald-500",
  internship: "border-l-blue-500",
  internship_fulltime: "border-l-violet-500",
  hackathon: "border-l-purple-500",
  webinar: "border-l-amber-500",
  talk: "border-l-cyan-500",
};

const typeBadgeColors: Record<string, string> = {
  placement: "bg-emerald-600/15 text-emerald-400 border-emerald-700/30",
  internship: "bg-blue-600/15 text-blue-400 border-blue-700/30",
  internship_fulltime: "bg-violet-600/15 text-violet-400 border-violet-700/30",
  hackathon: "bg-purple-600/15 text-purple-400 border-purple-700/30",
  webinar: "bg-amber-600/15 text-amber-400 border-amber-700/30",
  talk: "bg-cyan-600/15 text-cyan-400 border-cyan-700/30",
};

function getDeadlineInfo(deadline: string) {
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { text: "Closed", color: "text-red-400", urgent: true };
  if (days === 0) return { text: "Today", color: "text-red-400", urgent: true };
  if (days === 1) return { text: "Tomorrow", color: "text-amber-400", urgent: true };
  if (days <= 3) return { text: `${days} days left`, color: "text-amber-400", urgent: true };
  if (days <= 7) return { text: `${days} days left`, color: "text-yellow-400", urgent: false };
  return { text: `${days} days left`, color: "text-emerald-400", urgent: false };
}

export function JobCard({ job, showStatus = false }: JobCardProps) {
  const deadlineInfo = getDeadlineInfo(job.deadline);

  return (
    <Link href={`/jobs/${job.id}`} className="group block">
      <Card className={`border-l-4 ${typeColors[job.job_type] || "border-l-emerald-500"} hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col`}>
        <CardHeader className="pb-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className={`${typeBadgeColors[job.job_type] || typeBadgeColors.placement} text-xs font-medium`}>
              {job.job_type.replace(/_/g, " ")}
            </Badge>
            {showStatus && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  job.approval_status === "approved"
                    ? "bg-emerald-600/15 text-emerald-400 border-emerald-700/30"
                    : job.approval_status === "rejected"
                    ? "bg-red-600/15 text-red-400 border-red-700/30"
                    : "bg-amber-600/15 text-amber-400 border-amber-700/30"
                }`}
              >
                {job.approval_status}
              </Badge>
            )}
          </div>

          {/* Company + Role */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-emerald-400 transition-colors line-clamp-1">
              {job.role_title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-900/30 text-emerald-400 text-xs font-bold shrink-0">
                {job.company_name.charAt(0)}
              </span>
              <span className="line-clamp-1">{job.company_name}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="pb-3 flex-1">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {job.ctc && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{job.ctc}</span>
              </div>
            )}
            {job.stipend && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IndianRupee className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{job.stipend}</span>
              </div>
            )}
            {job.locations?.length > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{job.locations.join(", ")}</span>
              </div>
            )}
            {job.min_cgpa && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>CGPA ≥ {job.min_cgpa}</span>
              </div>
            )}
          </div>

          {job.eligible_batches?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.eligible_batches.map((b) => (
                <span key={b.id} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {b.year}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 border-t border-border/50 mt-auto">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${deadlineInfo.color}`}>
            <Clock className="h-3.5 w-3.5" />
            {deadlineInfo.text}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
