"use client";

import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { JobCard } from "@/components/features/jobs/job-card";
import { JobCardSkeleton } from "@/components/features/jobs/job-card-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Briefcase, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function JobsFeedPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: allJobs, isLoading: isAllLoading, error: allJobsError, refetch: refetchAllJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.fetchJobs,
  });

  const { data: feedJobs, isLoading: isFeedLoading, error: feedJobsError, refetch: refetchFeedJobs } = useQuery({
    queryKey: ["jobs", "feed"],
    queryFn: jobService.fetchJobFeed,
    enabled: !!user?.profile_completed,
  });

  const filterJobs = (jobs: typeof allJobs) =>
    jobs?.filter((job) => {
      const matchesSearch =
        job.company_name.toLowerCase().includes(search.toLowerCase()) ||
        job.role_title.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || job.job_type === typeFilter;
      return matchesSearch && matchesType;
    });

  const showStatus = user?.role === "admin" || user?.role === "volunteer";

  const FilterBar = () => (
    <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-card border border-border/50">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 bg-muted/30 border-border/50"
          placeholder="Search companies, roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[180px]">
        <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as string)}>
          <SelectTrigger className="bg-muted/30 border-border/50">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" label="All Types">All Types</SelectItem>
            <SelectItem value="placement" label="Placement">Placement</SelectItem>
            <SelectItem value="internship" label="Internship">Internship</SelectItem>
            <SelectItem value="internship_fulltime" label="Internship + PPO">Internship + PPO</SelectItem>
            <SelectItem value="hackathon" label="Hackathon">Hackathon</SelectItem>
            <SelectItem value="webinar" label="Webinar">Webinar</SelectItem>
            <SelectItem value="talk" label="Talk">Talk</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const JobGrid = ({ jobs, loading, error, onRetry }: { jobs: typeof allJobs; loading: boolean; error: Error | null; onRetry: () => void }) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-red-700/30">
          <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-400 opacity-60" />
          <p className="font-medium text-red-400">Failed to load jobs</p>
          <p className="text-sm mt-1">Something went wrong while fetching opportunities.</p>
          <Button variant="outline" size="sm" className="mt-4 border-red-700/30 text-red-400 hover:bg-red-600/10" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      );
    }

    const filtered = filterJobs(jobs);

    if (!filtered?.length) {
      return (
        <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border/50">
          <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No opportunities found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} showStatus={showStatus} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/30 border border-border/50">
          <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
            <Briefcase className="h-4 w-4" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="feed" className="gap-2 data-[state=active]:bg-emerald-600/15 data-[state=active]:text-emerald-400">
            <Sparkles className="h-4 w-4" />
            My Feed
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <FilterBar />
        </div>

        <TabsContent value="all" className="mt-4">
          <JobGrid jobs={allJobs} loading={isAllLoading} error={allJobsError} onRetry={() => refetchAllJobs()} />
        </TabsContent>

        <TabsContent value="feed" className="mt-4">
          {!user?.profile_completed ? (
            <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border/50">
              <Sparkles className="h-10 w-10 mx-auto mb-3 text-emerald-500 opacity-50" />
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm mt-1">Personalized feed requires your academic details.</p>
            </div>
          ) : (
            <JobGrid jobs={feedJobs} loading={isFeedLoading} error={feedJobsError} onRetry={() => refetchFeedJobs()} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
