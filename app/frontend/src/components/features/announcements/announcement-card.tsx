import { Announcement, AnnouncementType } from "@/types/announcement";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Edit2, Trash2, Building, AlertTriangle, ChevronRight } from "lucide-react";
import { AnnouncementTypeBadge } from "./announcement-type-badge";
import { AnnouncementMeta } from "./announcement-meta";
import { CircularAttachmentCard } from "./circular-attachment-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnnouncementCardProps {
  announcement: Announcement;
  currentUser?: { id: string; role: string } | null;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  onTogglePin?: (announcement: Announcement) => void;
  isTogglingPin?: boolean;
  onCardClick?: (announcement: Announcement) => void;
}

const typeBorderColors: Record<AnnouncementType, string> = {
  general: "border-l-emerald-500",
  deadline_extension: "border-l-amber-500",
  shortlist: "border-l-blue-500",
  test_link: "border-l-violet-500",
  venue_update: "border-l-cyan-500",
  eligibility_update: "border-l-orange-500",
  joining_update: "border-l-green-500",
  result: "border-l-purple-500",
  warning: "border-l-red-500",
};

export function AnnouncementCard({
  announcement,
  currentUser,
  onEdit,
  onDelete,
  onTogglePin,
  isTogglingPin = false,
  onCardClick,
}: AnnouncementCardProps) {
  const borderColor = typeBorderColors[announcement.announcement_type] || "border-l-emerald-500";
  
  const isAdmin = currentUser?.role === "admin";
  const isVolunteer = currentUser?.role === "volunteer";
  
  // Strict RBAC logic
  const canEdit = isAdmin || (isVolunteer && announcement.created_by === currentUser?.id);

  return (
    <Card 
      onClick={() => onCardClick?.(announcement)}
      className={`border-l-4 ${borderColor} ${onCardClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-l-emerald-400 group" : ""} hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-200 bg-card relative overflow-visible`}
    >
      {announcement.is_pinned && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-amber-500 text-white rounded-full p-1.5 shadow-lg shadow-amber-900/20">
            <Pin className="h-4 w-4" fill="currentColor" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AnnouncementTypeBadge type={announcement.announcement_type} />
            {announcement.job && (
              <Badge variant="outline" className="bg-muted/30 border-border/50 text-muted-foreground gap-1.5 font-medium max-w-[200px] truncate sm:max-w-xs">
                <Building className="h-3 w-3 shrink-0" />
                <span className="truncate">{announcement.job.company_name}</span>
              </Badge>
            )}
          </div>

          {canEdit && (
            <div className="flex items-center gap-1 shrink-0 bg-muted/20 rounded-md p-1 border border-border/30">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${announcement.is_pinned ? "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10" : "text-muted-foreground hover:text-foreground"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin?.(announcement);
                }}
                disabled={isTogglingPin}
                title={announcement.is_pinned ? "Unpin" : "Pin"}
              >
                <Pin className="h-3.5 w-3.5" fill={announcement.is_pinned ? "currentColor" : "none"} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(announcement);
                }}
                title="Edit"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(announcement);
                  }}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1 flex items-start justify-between gap-4">
          <h3 className="font-semibold text-lg leading-tight transition-colors group-hover:text-emerald-400">
            {announcement.subject}
          </h3>
          {onCardClick && (
            <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4 space-y-4">
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground
          prose-headings:text-foreground prose-strong:text-foreground
          prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
          prose-code:text-emerald-400 prose-code:bg-muted/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-p:leading-snug
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {announcement.description}
          </ReactMarkdown>
        </div>

        {announcement.circular_file_path && (
          <div onClick={(e) => e.stopPropagation()}>
            <CircularAttachmentCard announcementId={announcement.id} />
          </div>
        )}

        <div className="pt-3 border-t border-border/50">
          <AnnouncementMeta 
            user={announcement.created_by_user} 
            createdAt={announcement.created_at} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
