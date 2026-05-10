export interface AdminStats {
  users: {
    total: number;
    students: number;
    volunteers: number;
    admins: number;
    profile_completed: number;
    profile_incomplete: number;
  };
  jobs: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    active: number;
    expired: number;
  };
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, any> | null;
  created_at: string;
  admin: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  roll_number: string | null;
  role: "student" | "volunteer" | "admin";
  profile_completed: boolean;
  cgpa: number | null;
  tenth_percentage: number | null;
  twelfth_percentage: number | null;
  resume_url: string | null;
  branch: { id: string; name: string; code: string } | null;
  batch: { id: string; year: number } | null;
}

export interface AdminJob {
  id: string;
  circular_number: string;
  company_name: string;
  role_title: string;
  job_type: string;
  approval_status: "pending" | "approved" | "rejected";
  deadline: string;
  created_at: string;
  is_active: boolean;
  posted_by: string;
  posted_by_user: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
}

export interface UserJobsResponse {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
  };
  jobs: {
    id: string;
    circular_number: string;
    company_name: string;
    role_title: string;
    job_type: string;
    approval_status: "pending" | "approved" | "rejected";
    deadline: string;
    created_at: string;
    is_active: boolean;
  }[];
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

export interface PaginatedUsers {
  users: AdminUser[];
  total: number;
}

export interface PaginatedJobs {
  jobs: AdminJob[];
  total: number;
}

export interface PaginatedLogs {
  logs: AdminLog[];
  total: number;
}
