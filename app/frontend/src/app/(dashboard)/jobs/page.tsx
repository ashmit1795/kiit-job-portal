"use client";

import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/job.service";
import { JobCard } from "@/components/features/jobs/job-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

export default function JobsFeedPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: jobService.fetchJobs,
  });

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.company_name.toLowerCase().includes(search.toLowerCase()) || 
                          job.role_title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || job.job_type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Failed to load jobs.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            className="pl-9 bg-zinc-50 dark:bg-zinc-950" 
            placeholder="Search companies, roles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto min-w-[200px]">
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as string)}>
            <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="placement">Placement</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="internship_fulltime">Internship + PPO</SelectItem>
              <SelectItem value="hackathon">Hackathon</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredJobs?.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 bg-white rounded-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          No opportunities found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs?.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
