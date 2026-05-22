"use client";

import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { announcementService } from "@/services/announcement.service";
import { Announcement, AnnouncementType } from "@/types/announcement";
import { AnnouncementCard } from "./announcement-card";
import { PinnedAnnouncements } from "./pinned-announcements";
import { AnnouncementFeedSkeleton } from "./announcement-feed-skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, Megaphone, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

interface AnnouncementFeedProps {
  jobId?: string;
  typeFilter?: AnnouncementType | "all";
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  onTogglePin?: (announcement: Announcement) => void;
  onCardClick?: (announcement: Announcement) => void;
}

export function AnnouncementFeed({
  jobId,
  typeFilter = "all",
  onEdit,
  onDelete,
  onTogglePin,
  onCardClick,
}: AnnouncementFeedProps) {
  const { user } = useAuth();
  const isAdminOrVolunteer = user?.role === "admin" || user?.role === "volunteer";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["announcements", { jobId, typeFilter }],
    queryFn: ({ pageParam = 1 }) =>
      announcementService.fetchAnnouncements({
        job_id: jobId,
        page: pageParam,
        limit: 10,
        // Assuming we could filter by type if the backend supported it, but we can also client-side filter if not.
        // The current API contract doesn't explicitly mention type filtering, so we might need to filter client-side or just not pass it if the backend ignores it.
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });

  const allAnnouncements = useMemo(() => {
    return data?.pages.flatMap((page) => page.announcements) || [];
  }, [data]);

  // Client-side type filtering if the backend doesn't support it directly
  const filteredAnnouncements = useMemo(() => {
    if (typeFilter === "all") return allAnnouncements;
    return allAnnouncements.filter((a) => a.announcement_type === typeFilter);
  }, [allAnnouncements, typeFilter]);

  const pinnedAnnouncements = useMemo(() => {
    return filteredAnnouncements.filter((a) => a.is_pinned);
  }, [filteredAnnouncements]);

  const regularAnnouncements = useMemo(() => {
    return filteredAnnouncements.filter((a) => !a.is_pinned);
  }, [filteredAnnouncements]);

  if (isLoading) {
    return <AnnouncementFeedSkeleton count={3} />;
  }

  if (isError) {
    return (
      <div className="text-center py-12 rounded-xl border border-red-900/30 bg-red-900/10">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-red-400">Failed to load updates</h3>
        <p className="text-sm text-red-400/80 mt-1 mb-4">There was a problem fetching the announcements.</p>
        <Button variant="outline" onClick={() => refetch()} className="border-red-800 text-red-400 hover:bg-red-900/30">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="text-center py-16 rounded-xl border border-border/50 bg-muted/10">
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium">No updates found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          {jobId 
            ? "There are no placement updates for this job yet." 
            : "There are no announcements to show right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!jobId && (
        <PinnedAnnouncements
          announcements={pinnedAnnouncements}
          currentUser={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onCardClick={onCardClick}
        />
      )}

      {/* For job-specific timeline, we might show pinned items inline or at the top. Let's keep them at the top as well. */}
      {jobId && pinnedAnnouncements.length > 0 && (
        <PinnedAnnouncements
          announcements={pinnedAnnouncements}
          currentUser={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onCardClick={onCardClick}
        />
      )}

      <div className={jobId ? "relative pl-6 border-l-2 border-border/30 space-y-6" : "space-y-4"}>
        {regularAnnouncements.map((announcement) => (
          <div key={announcement.id} className="relative">
            {jobId && (
              <div className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-background" />
            )}
            <AnnouncementCard
              announcement={announcement}
              currentUser={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onCardClick={onCardClick}
            />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="pt-6 pb-2 flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {isFetchingNextPage ? "Loading..." : "Load More Updates"}
          </Button>
        </div>
      )}
    </div>
  );
}
