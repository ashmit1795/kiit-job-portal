import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/date-utils";
import { AnnouncementCreatedByUser } from "@/types/announcement";

interface AnnouncementMetaProps {
  user: AnnouncementCreatedByUser | null;
  createdAt: string;
}

export function AnnouncementMeta({ user, createdAt }: AnnouncementMetaProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-muted text-xs">?</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs font-medium">Unknown User</span>
          <span className="text-[10px] text-muted-foreground">
            {timeAgo(createdAt)}
          </span>
        </div>
      </div>
    );
  }

  const fallback =
    user.full_name?.charAt(0).toUpperCase() || user.role.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6 shrink-0">
        {user.avatar_url && <AvatarImage src={user.avatar_url} />}
        <AvatarFallback className="bg-emerald-900/30 text-emerald-400 text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className="text-xs font-medium line-clamp-1">
            {user.full_name || "Admin"}
          </span>
          <Badge
            variant="outline"
            className="text-[9px] px-1 py-0 h-3.5 bg-muted/30 border-border/50 capitalize"
          >
            {user.role}
          </Badge>
        </div>
        <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
          {timeAgo(createdAt)}
        </span>
      </div>
    </div>
  );
}
