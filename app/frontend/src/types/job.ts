export type JobType = "placement" | "internship" | "internship_fulltime" | "webinar" | "hackathon" | "talk";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Job {
  id: string;
  circular_number: string;
  company_name: string;
  role_title: string;
  job_type: JobType;
  ctc: string | null;
  stipend: string | null;
  min_cgpa: number | null;
  deadline: string;
  joining_date: string | null;
  description: string | null;
  circular_file_path: string | null;
  approval_status: ApprovalStatus;
  is_active: boolean;
  created_at: string;
  posted_by: string;
  locations: string[];
  eligible_branches: {
    id: string;
    code: string;
    name: string;
    program_name: string;
    program_level: string;
  }[];
  eligible_batches: {
    id: string;
    year: number;
  }[];
}
