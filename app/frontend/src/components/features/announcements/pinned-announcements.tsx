import { Announcement } from "@/types/announcement";
import { AnnouncementCard } from "./announcement-card";
import { Pin } from "lucide-react";

interface PinnedAnnouncementsProps {
  announcements: Announcement[];
  currentUser?: { id: string; role: string; [key: string]: unknown } | null;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  onTogglePin?: (announcement: Announcement) => void;
}

export function PinnedAnnouncements({
  announcements,
  currentUser,
  onEdit,
  onDelete,
  onTogglePin,
}: PinnedAnnouncementsProps) {
  if (!announcements.length) return null;

  return (
    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-2 px-1">
        <Pin className="h-4 w-4 text-amber-500" fill="currentColor" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Pinned Updates
        </h2>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        <div className="flex w-max space-x-4 px-4 pt-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="w-[350px] sm:w-[450px] inline-block whitespace-normal align-top">
              <AnnouncementCard
                announcement={announcement}
                currentUser={currentUser}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
