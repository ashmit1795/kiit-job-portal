
# 🎯 Avsaar — KIIT Placement Portal

**A centralized placement opportunity aggregator for KIIT University**

Built by **Team UdaanX 🚀**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Table of Contents

- [Why Avsaar?](#-why-avsaar)
- [What It Does](#-what-it-does)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Frontend Pages](#-frontend-pages)
- [Authentication Flow](#-authentication-flow)
- [Role System](#-role-system)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)

---

## 💡 Why Avsaar?

KIIT University's Training & Placement (T&P) Cell shares job circulars through WhatsApp and Telegram groups. This creates real problems:

| Problem | Impact |
|---------|--------|
| Circulars buried in chat history | Students miss opportunities |
| No eligibility filtering | Manual checking wastes time |
| Scattered across multiple groups | No single source of truth |
| No deadline tracking | Students forget to apply |
| No searchable archive | Past opportunities are lost |

**Avsaar solves this** by providing a centralized, searchable, eligibility-aware portal where every circular is catalogued with metadata, deadlines, and PDF downloads.

> **Key principle:** Avsaar is NOT a job application platform. It is a **placement opportunity aggregator** — students discover opportunities here, then apply through the company's own process.

---

## 🚀 What It Does

### For Students
- **Personalized Feed** — see only jobs matching your branch, batch, and CGPA
- **All Jobs View** — browse every approved opportunity with search & filters
- **Circular Downloads** — download official T&P circular PDFs directly
- **Profile Management** — maintain academic details and upload resume

### For Volunteers
- **Post Opportunities** — create job postings with circular uploads (requires admin approval)
- **Same student features** — volunteers are students with extra posting privileges

### For Admins
- **Overview Dashboard** — 8-metric stats grid (users, students, volunteers, admins, total/pending/approved/expired jobs)
- **Job Approval** — approve or reject volunteer-submitted postings inline
- **Full Job Management** — view all jobs with status, type, and search filters; approve/reject from the table
- **User Management** — paginated user table with search, role filter, promote/demote, delete (all with confirmation)
- **Volunteer Management** — dedicated view showing each volunteer's posted job stats and drill-down list
- **Academic Structure** — create and delete programs, branches, and batches directly from the UI
- **Audit Log** — full timestamped trail of every admin action, filterable by action type
- **Auto-approved Posts** — admin-created jobs skip the approval queue

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** (App Router) | React framework with SSR/SSG |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Component library (Button, Input, Avatar, etc.) |
| **TanStack Query** | Server state management & caching |
| **Axios** | HTTP client with interceptors |
| **Supabase JS** | Client-side auth (Google OAuth) |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |
| **MDEditor** | Markdown editor for job descriptions |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** (ES Modules) | Runtime |
| **Express 5** | HTTP framework |
| **Supabase JS** (service role) | DB queries, storage, auth verification |
| **Zod** | Request validation schemas |
| **Multer** | File upload handling (circulars, resumes) |
| **Helmet** | Security headers |
| **Morgan** | HTTP request logging |
| **Chalk** | Colored console output |

### Database & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Supabase PostgreSQL** | Primary database (all tables under `placement` schema) |
| **Supabase Auth** | Google OAuth provider |
| **Supabase Storage** | PDF storage (`job-circulars`, `resumes` buckets) |

---

## 🏗 Architecture

### System Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────────┐
│   Browser   │────▶│  Next.js App │────▶│  Express Backend  │
│  (React UI) │◀────│  (Port 5500) │◀────│   (Port 5000)     │
└──────┬──────┘     └──────────────┘     └────────┬──────────┘
       │                                          │
       │  Google OAuth                            │  Service Role Key
       ▼                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Cloud                         │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────────┐  │
│  │   Auth   │  │  Storage   │  │  PostgreSQL (placement) │  │
│  │  (OAuth) │  │ (Buckets)  │  │  users, jobs, branches… │  │
│  └──────────┘  └────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Backend Layered Architecture

```
   HTTP Request
       │
       ▼
┌──────────────┐   Parses request, calls service, sends response
│  Controller  │
└──────┬───────┘
       ▼
┌──────────────┐   Business logic: validation, approval rules, file uploads
│   Service    │
└──────┬───────┘
       ▼
┌──────────────┐   Database queries via Supabase client, RPC calls
│  Repository  │
└──────┬───────┘
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

### Frontend Architecture

```
app/
├── (dashboard)/          # Auth-protected routes (wrapped in AuthGuard)
│   ├── layout.tsx        # Header nav + mobile drawer
│   ├── jobs/             # Job feed + job detail pages
│   ├── create-job/       # Multi-step job creation form
│   ├── admin/            # Full admin dashboard (6-tab)
│   └── profile/          # User profile page
├── login/                # Google OAuth sign-in
├── onboarding/           # Profile completion form
├── auth/callback/        # OAuth redirect handler
├── about/, blog/, etc.   # Static informational pages
└── page.tsx              # Landing page (auth-aware)

providers/
├── auth-provider.tsx     # Global auth state (session + user)
└── query-provider.tsx    # TanStack Query client

services/
├── job.service.ts        # Job CRUD API calls
├── profile.service.ts    # Profile + resume API calls
├── academic.service.ts   # Branches/batches API calls
└── admin.service.ts      # All admin API calls

components/features/admin/
├── overview-tab.tsx      # Stats grid + pending approvals + recent activity
├── users-tab.tsx         # Paginated user table with role management
├── volunteers-tab.tsx    # Volunteer cards with job drill-down
├── jobs-tab.tsx          # All-jobs table with filters + approve/reject
├── academics-tab.tsx     # CRUD for programs, branches, batches
├── logs-tab.tsx          # Admin activity timeline
├── confirm-dialog.tsx    # Reusable confirmation modal
└── user-role-dropdown.tsx # Role badge + change dropdown

lib/
├── api.ts                # Axios instance with token injection + 401 interceptor
├── supabase.ts           # Supabase browser client
└── date-utils.ts         # Zero-dependency date helpers (timeAgo, formatDate)

types/
├── admin.ts              # Admin dashboard TypeScript interfaces
├── api.ts                # ApiResponse wrapper type
└── academic.ts           # Program, Branch, Batch interfaces
```

---

## 🗄 Database Schema

All tables live under the `placement` schema. Managed via **37 incremental Supabase migrations**.

### Entity Relationship

```
programs ──1:N──▶ branches ──1:N──▶ users
                                     │
batches ──────────────────────1:N──▶ users
                                     │
                                     │ (posted_by)
                                     ▼
                                   jobs
                                  / | \
                                 /  |  \
              job_eligible_branches │  job_eligible_batches
                                    │
                               job_locations
```

### Core Tables

#### `placement.users`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Same as Supabase auth ID |
| `email` | TEXT (UNIQUE) | Must be `@kiit.ac.in` |
| `roll_number` | TEXT | Extracted from email (digits before @) |
| `full_name` | TEXT | From Google profile |
| `avatar_url` | TEXT | Google profile photo |
| `role` | ENUM | `student` / `volunteer` / `admin` |
| `profile_completed` | BOOLEAN | Gates access to main features |
| `branch_id` | UUID (FK) | → `branches.id` |
| `batch_id` | UUID (FK) | → `batches.id` |
| `cgpa` | NUMERIC(3,2) | 0.00–10.00 |
| `tenth_percentage` | NUMERIC | 10th board percentage |
| `twelfth_percentage` | NUMERIC | 12th board percentage |
| `resume_url` | TEXT | Path in Supabase Storage |

#### `placement.jobs`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `circular_number` | TEXT | T&P circular reference (e.g., `KIIT-DU/T&P/26/219`) |
| `company_name` | TEXT | |
| `role_title` | TEXT | |
| `job_type` | ENUM | `placement` / `internship` / `internship_fulltime` / `hackathon` / `webinar` / `talk` |
| `ctc` | TEXT | Compensation (free text) |
| `stipend` | TEXT | For internships |
| `min_cgpa` | NUMERIC(3,2) | Minimum CGPA requirement |
| `deadline` | TIMESTAMPTZ | Application deadline |
| `joining_date` | TEXT | Expected joining date |
| `description` | TEXT | Markdown-supported |
| `circular_file_path` | TEXT | Path in `job-circulars` bucket |
| `apply_link_1` | TEXT | Primary application URL |
| `apply_link_2` | TEXT | Secondary application URL |
| `posted_by` | UUID (FK) | → `users.id` |
| `approval_status` | ENUM | `pending` / `approved` / `rejected` |
| `is_active` | BOOLEAN | Soft-delete flag |

**Uniqueness:** `(circular_number, role_title)` — one circular can have multiple roles (e.g., SDE + Data Analyst).

#### `placement.programs`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `name` | TEXT (UNIQUE) | e.g., "B.Tech", "M.Tech" |
| `level` | TEXT | `UG` or `PG` |
| `duration_years` | INTEGER | |

#### `placement.branches`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `program_id` | UUID (FK) | → `programs.id` |
| `name` | TEXT | e.g., "Computer Science and Engineering" |
| `code` | TEXT | e.g., "CSE" |

#### Junction Tables
- **`job_eligible_branches`** — (job_id, branch_id) composite PK
- **`job_eligible_batches`** — (job_id, batch_id) composite PK
- **`job_locations`** — (job_id, location TEXT)

#### `placement.admin_logs`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `admin_id` | UUID (FK → users) | Admin who performed the action |
| `action` | TEXT | e.g. `approve_job`, `promote_user`, `delete_branch` |
| `target_type` | TEXT | `job`, `user`, `program`, `branch`, `batch` |
| `target_id` | UUID | ID of the affected entity |
| `details` | JSONB | Contextual data (email, role, company name, etc.) |
| `created_at` | TIMESTAMPTZ | Timestamp of action |

Indexed on `admin_id`, `created_at DESC`, and `action` for fast log queries.

### RPC Functions

| Function | Purpose |
|----------|---------|
| `placement.create_job_v3(...)` | Creates job + inserts branches, batches, locations in one transaction |
| `placement.get_job_feed(branch_id, batch_id, cgpa)` | Returns personalized feed filtered by eligibility |
| `placement.admin_dashboard_stats()` | Aggregated user + job counts for admin dashboard |
| `placement.get_job_stats()` | Job type breakdown statistics |

### Storage Buckets

| Bucket | Path Pattern | Purpose |
|--------|-------------|---------|
| `job-circulars` | `circulars/{circular_number}.pdf` | Official T&P circular PDFs |
| `resumes` | `resumes/{user_id}.pdf` | Student resume uploads |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

All responses follow a standard format:
```json
{
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/auth/me` | ✅ | Get current user profile |

### Profile Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/profile/complete` | ✅ | Complete profile (branch, batch, CGPA, etc.) |
| `PATCH` | `/profile/update` | ✅ | Update profile fields |
| `POST` | `/profile/resume` | ✅ | Upload resume PDF (multipart) |
| `GET` | `/profile/resume` | ✅ | Get signed download URL for resume |

### Job Routes
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/jobs` | ✅ | admin, volunteer | Create job (multipart — includes circular PDF) |
| `GET` | `/jobs` | ✅ | any | List all jobs (students see only approved) |
| `GET` | `/jobs/feed` | ✅ | any | Personalized feed (branch + batch + CGPA filter) |
| `GET` | `/jobs/:id` | ✅ | any | Job details |
| `GET` | `/jobs/:id/circular` | ✅ | any | Get signed circular download URL |
| `PATCH` | `/jobs/:id/approve` | ✅ | admin | Approve a pending job |
| `PATCH` | `/jobs/:id/reject` | ✅ | admin | Reject a pending job |

### Academic Routes
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/academics/programs` | ✅ | any | List all programs |
| `GET` | `/academics/branches` | ✅ | any | List all branches (supports `?program_id=`) |
| `GET` | `/academics/batches` | ✅ | any | List all batches |
| `POST` | `/academics/programs` | ✅ | admin | Create a program |
| `POST` | `/academics/branches` | ✅ | admin | Create a branch |
| `POST` | `/academics/batches` | ✅ | admin | Create a batch |
| `DELETE` | `/academics/programs/:id` | ✅ | admin | Delete a program |
| `DELETE` | `/academics/branches/:id` | ✅ | admin | Delete a branch |
| `DELETE` | `/academics/batches/:id` | ✅ | admin | Delete a batch |

### Admin Routes
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/admin/dashboard` | ✅ | admin | Stats (8 metrics: user/job breakdown) |
| `GET` | `/admin/users` | ✅ | admin | List users (supports `?role=`, `?search=`, `?page=`, `?limit=`) |
| `GET` | `/admin/users/:id` | ✅ | admin | Get full user details |
| `GET` | `/admin/users/:id/jobs` | ✅ | admin | Get jobs posted by a user + per-status stats |
| `PATCH` | `/admin/users/:id/role` | ✅ | admin | Change user role (logs promote/demote) |
| `DELETE` | `/admin/users/:id` | ✅ | admin | Delete user (logs action) |
| `GET` | `/admin/jobs` | ✅ | admin | All jobs with filters (`?status=`, `?type=`, `?search=`, `?page=`) |
| `GET` | `/admin/jobs/stats` | ✅ | admin | Job type breakdown analytics |
| `GET` | `/admin/logs` | ✅ | admin | Paginated audit log (supports `?action=`, `?page=`) |

---

## 🖥 Frontend Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page — auth-aware (shows Dashboard/Profile for logged-in users) |
| `/login` | Google OAuth sign-in |
| `/about` | About Avsaar |
| `/contact` | Contact information + form |
| `/faqs` | Accordion FAQ section |
| `/blog` | Placement tips & news |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |

### Auth-Protected Pages
| Route | Description |
|-------|-------------|
| `/auth/callback` | OAuth redirect handler (routes to jobs/onboarding/login) |
| `/onboarding` | Profile completion form (branch, batch, CGPA, etc.) |
| `/jobs` | Job feed with "All Jobs" and "My Feed" tabs |
| `/jobs/:id` | Job detail page with circular download |
| `/create-job` | Multi-step job creation form (admin/volunteer only) |
| `/admin` | Admin dashboard — 6 tabs: Overview, Users, Volunteers, Jobs, Academics, Logs |
| `/admin?tab=users` | User management tab |
| `/admin?tab=volunteers` | Volunteer management tab |
| `/admin?tab=jobs` | All-jobs management tab |
| `/admin?tab=academics` | Academic structure CRUD tab |
| `/admin?tab=logs` | Admin activity audit log tab |
| `/profile` | User profile with resume upload |

---

## 🔐 Authentication Flow

```
1. User clicks "Sign In with Google"
         │
         ▼
2. Supabase Auth redirects to Google OAuth
         │
         ▼
3. Google authenticates → redirects to /auth/callback
         │
         ▼
4. AuthProvider fires onAuthStateChange(INITIAL_SESSION)
         │
         ▼
5. AuthProvider calls GET /auth/me with Bearer token
         │
         ▼
6. Backend verifies token via supabase.auth.getUser(token)
         │
         ├── ❌ Invalid token → 401 → redirect to /login
         │
         ├── ❌ Non-KIIT email → 403 → toast + signOut → /login
         │
         └── ✅ Valid KIIT email
              │
              ├── New user → INSERT into placement.users
              │
              └── Existing user → UPDATE metadata (name, avatar)
                   │
                   ▼
7. /auth/callback checks user state:
         │
         ├── profile_completed = false → /onboarding
         │
         └── profile_completed = true → /jobs
```

### Security Layers

| Layer | Implementation |
|-------|---------------|
| **Email domain restriction** | Backend rejects non-`@kiit.ac.in` emails (403) |
| **Token verification** | Every API call verified via `supabase.auth.getUser()` |
| **Role-based access** | `roleGuard` middleware checks `req.user.role` |
| **Profile completion gate** | `profileGuard` blocks incomplete profiles from core routes |
| **401 interceptor** | Frontend auto-redirects to `/login` on expired tokens |
| **Security headers** | Helmet middleware on all responses |

---

## 👥 Role System

| Role | Create Jobs | Auto-Approve | Approve/Reject | User Management | View Feed |
|------|:-----------:|:------------:|:--------------:|:---------------:|:---------:|
| **Student** | ❌ | — | ❌ | ❌ | ✅ |
| **Volunteer** | ✅ | ❌ (pending) | ❌ | ❌ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

Admins are defined via the `ADMIN_EMAILS` environment variable. Volunteers are promoted from students by admins.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase project with Google OAuth configured

### 1. Clone & Install

```bash
git clone https://github.com/your-username/kiit-job-portal.git
cd kiit-job-portal

# Install backend dependencies
cd app/backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

Create `app/backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key
ADMIN_EMAILS=admin@kiit.ac.in,admin2@kiit.ac.in
```

Create `app/frontend/.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Supabase Migrations

```bash
cd supabase
supabase db push
```

### 4. Seed Academic Data

Use the admin API or Supabase dashboard to create programs, branches, and batches.

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd app/backend && npm run dev

# Terminal 2: Frontend
cd app/frontend && npm run dev
```

- Frontend: `http://localhost:5500`
- Backend: `http://localhost:5000`

---

## 🔧 Environment Variables

### Backend (`app/backend/.env`)
| Variable | Required | Description |
|----------|:--------:|-------------|
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `development` / `production` |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SECRET_KEY` | ✅ | Supabase service role key (NOT anon key) |
| `ADMIN_EMAILS` | No | Comma-separated admin emails |
| `DEV_AUTH_ENABLED` | No | Enable dev auth mode (skips OAuth) |

### Frontend (`app/frontend/.env`)
| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |

---

## 📁 Project Structure

```
kiit-job-portal/
├── app/
│   ├── backend/
│   │   └── src/
│   │       ├── config/          # env.js, supabase.js
│   │       ├── middlewares/     # auth, roleGuard, profileGuard, upload, validate, errorHandler
│   │       ├── modules/
│   │       │   ├── academics/   # Programs, branches, batches CRUD + DELETE
│   │       │   ├── admin/       # Dashboard, users, jobs, logs — full admin module
│   │       │   ├── health/      # Health check endpoint
│   │       │   ├── job/         # Job CRUD, approval, feed, circular download
│   │       │   └── users/       # Auth (me), profile, resume, user sync
│   │       ├── routes/          # Central route registration
│   │       ├── utils/           # AppError, AppResponse, logger, mapSupabaseError
│   │       └── validators/      # Zod schemas (job, profile, academic)
│   │
│   └── frontend/
│       └── src/
│           ├── app/(dashboard)/admin/  # Admin page (6-tab URL-synced dashboard)
│           ├── components/
│           │   ├── ui/                 # shadcn/ui + custom components
│           │   └── features/admin/     # 8 admin tab + shared components
│           ├── lib/
│           │   ├── api.ts              # Axios + 401 interceptor
│           │   ├── supabase.ts         # Supabase browser client
│           │   └── date-utils.ts       # Zero-dep date helpers
│           ├── providers/              # AuthProvider, QueryProvider
│           ├── services/
│           │   ├── admin.service.ts    # All admin API calls
│           │   ├── job.service.ts
│           │   ├── profile.service.ts
│           │   └── academic.service.ts
│           └── types/
│               ├── admin.ts            # Admin dashboard interfaces
│               ├── api.ts
│               └── academic.ts
│
├── supabase/
│   └── migrations/              # 37 incremental SQL migrations
│
├── PROJECT-CONTEXT.md           # Design decisions & system overview
└── readme.md                    # This file
```

---

## 🗺 Roadmap

### ✅ Implemented
- [x] Google OAuth with `@kiit.ac.in` domain restriction
- [x] User sync & profile completion flow
- [x] Multi-step job creation with circular upload
- [x] Job approval workflow (admin approves volunteer posts)
- [x] Personalized job feed (branch + batch + CGPA filtering via Postgres RPC)
- [x] Circular PDF download via signed URLs
- [x] Resume upload & download
- [x] Full admin dashboard — 6-tab UI (Overview, Users, Volunteers, Jobs, Academics, Logs)
- [x] Admin user management — search, role filter, promote/demote with confirmation
- [x] Volunteer management — expandable cards with per-volunteer job stats
- [x] Academic structure CRUD — programs, branches, batches via admin UI
- [x] Admin audit log — full trail of every admin action with action-type filtering
- [x] Auth-aware landing page
- [x] Toast notifications & error handling
- [x] Mobile-responsive navigation

### 🔜 Planned
- [ ] Deadline reminder system (push notifications / email)
- [ ] Job bookmarking / save for later
- [ ] Search & advanced filters on job feed
- [ ] AI circular parsing (auto-fill job form from PDF)
- [ ] Email notifications for new approved jobs
- [ ] Analytics charts on admin dashboard
- [ ] Volunteer promotion workflow from admin UI

---

< align="center">

Crafted with ❤️ by **Team UdaanX 🚀**

*KIIT University — Training & Placement Portal*
