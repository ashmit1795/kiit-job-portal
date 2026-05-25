export type AnnouncementType =
  | "general"
  | "deadline_extension"
  | "shortlist"
  | "test_link"
  | "venue_update"
  | "eligibility_update"
  | "joining_update"
  | "result"
  | "warning";

export interface AnnouncementCreatedByUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export interface AnnouncementJob {
  id: string;
  company_name: string;
  role_title: string;
  circular_number: string;
}

export interface Announcement {
  id: string;
  subject: string;
  description: string;
  job_id: string | null;
  circular_file_path: string | null;
  circular_number: string | null;
  announcement_type: AnnouncementType;
  is_pinned: boolean;
  announcement_priority: number;
  alert_sent: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  created_by_user: AnnouncementCreatedByUser | null;
  job: AnnouncementJob | null;
}

export interface PaginatedAnnouncements {
  announcements: Announcement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAnnouncementPayload {
  subject: string;
  description: string;
  job_id?: string | null;
  announcement_type?: AnnouncementType;
  is_pinned?: boolean;
  send_email?: boolean;
  circular?: File | null;
  circular_number?: string | null;
}

export interface UpdateAnnouncementPayload {
  subject?: string;
  description?: string;
  announcement_type?: AnnouncementType;
  is_pinned?: boolean;
  announcement_priority?: number;
  job_id?: string | null;
  circular?: File | null;
  circular_number?: string | null;
}
