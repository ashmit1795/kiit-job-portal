export type UserRole = "student" | "volunteer" | "admin";

export interface User {
  id: string;
  email: string;
  roll_number: string | null;
  role: UserRole;
  profile_completed: boolean;
  avatar_url: string | null;
  full_name: string | null;
  cgpa: number | null;
  tenth_percentage: number | null;
  twelfth_percentage: number | null;
  branch: {
    id: string;
    name: string;
    code: string;
    program: {
      id: string;
      name: string;
      level: "UG" | "PG";
      duration_years: number;
    } | null;
  } | null;
  batch: {
    id: string;
    year: number;
  } | null;
  resume_url: string | null;
  personal_email?: string | null;
  phone_number?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
}
