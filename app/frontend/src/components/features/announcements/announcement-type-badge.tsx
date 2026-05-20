import { AnnouncementType } from "@/types/announcement";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  CalendarClock,
  ListChecks,
  Link,
  MapPin,
  GraduationCap,
  CalendarCheck,
  Trophy,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";

export const announcementTypeConfig: Record<
  AnnouncementType,
  { label: string; color: string; icon: LucideIcon }
> = {
  general: {
    label: "General",
    color: "bg-emerald-600/15 text-emerald-400 border-emerald-700/30",
    icon: Megaphone,
  },
  deadline_extension: {
    label: "Deadline Extended",
    color: "bg-amber-600/15 text-amber-400 border-amber-700/30",
    icon: CalendarClock,
  },
  shortlist: {
    label: "Shortlist",
    color: "bg-blue-600/15 text-blue-400 border-blue-700/30",
    icon: ListChecks,
  },
  test_link: {
    label: "Test Link",
    color: "bg-violet-600/15 text-violet-400 border-violet-700/30",
    icon: Link,
  },
  venue_update: {
    label: "Venue Update",
    color: "bg-cyan-600/15 text-cyan-400 border-cyan-700/30",
    icon: MapPin,
  },
  eligibility_update: {
    label: "Eligibility Update",
    color: "bg-orange-600/15 text-orange-400 border-orange-700/30",
    icon: GraduationCap,
  },
  joining_update: {
    label: "Joining Update",
    color: "bg-green-600/15 text-green-400 border-green-700/30",
    icon: CalendarCheck,
  },
  result: {
    label: "Result",
    color: "bg-purple-600/15 text-purple-400 border-purple-700/30",
    icon: Trophy,
  },
  warning: {
    label: "Warning",
    color: "bg-red-600/15 text-red-400 border-red-700/30",
    icon: AlertTriangle,
  },
};

interface AnnouncementTypeBadgeProps {
  type: AnnouncementType;
  className?: string;
  showIcon?: boolean;
}

export function AnnouncementTypeBadge({
  type,
  className = "",
  showIcon = true,
}: AnnouncementTypeBadgeProps) {
  const config = announcementTypeConfig[type] || announcementTypeConfig.general;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.color} text-xs font-medium gap-1 ${className}`}
    >
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      {config.label}
    </Badge>
  );
}
