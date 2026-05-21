
# अवSaar — Student Placement Platform

> **An independent, student-built platform centralizing placement information for the KIIT community.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> ⚠️ **Important:** अवSaar is an **independent student initiative** and is **not affiliated with, endorsed by, or operated by KIIT University**. All institutional names and trademarks belong to their respective owners.

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
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)

---

## 💡 Why Avsaar?

Placement information at KIIT arrives through fragmented, unreliable channels. Students face a daily problem:

| Problem | Impact |
|---------|--------|
| Circulars buried in WhatsApp chat history | Students miss opportunities |
| No eligibility filtering | Manual checking wastes time |
| Scattered across multiple groups | No single source of truth |
| No deadline tracking | Students forget to apply |
| No searchable archive | Past opportunities are lost |
| Misinformation from forwarded messages | Confusion and missed deadlines |

**Avsaar is our answer to that chaos** — a centralized, searchable, eligibility-aware platform where every circular is catalogued with metadata, deadlines, and PDF downloads. Built by students who experienced this problem firsthand.

> **Key principle:** Avsaar is NOT a job application platform. It is a **placement opportunity aggregator** — students discover opportunities here, then apply through the company's own process.

---

## 🚀 What It Does

### For Students
- **Personalized Feed** — see only jobs matching your branch, batch, and CGPA
- **All Jobs View** — browse every approved opportunity with search & filters
- **Circular Downloads** — download placement circular PDFs directly
- **Deadline Visibility** — never miss an application window
- **Profile Management** — maintain academic details and upload resume

### For Volunteers
- **Post Opportunities** — create job postings with circular uploads (requires admin review before publishing)
- **Community contribution** — help keep the platform current for fellow students

### For Admins
- **Overview Dashboard** — 8-metric stats grid (users, students, volunteers, admins, total/pending/approved/expired jobs)
- **Job Approval** — review and approve or reject volunteer-submitted postings
- **Full Job Management** — view all jobs with status, type, and search filters
- **User Management** — paginated user table with search, role filter, promote/demote, delete
- **Volunteer Management** — dedicated view showing each volunteer's posting stats
- **Academic Structure** — create and delete programs, branches, and batches
- **Audit Log** — full timestamped trail of every admin action, filterable by action type
- **Auto-approved Posts** — admin-created jobs skip the review queue

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** (App Router) | React framework with SSR/SSG |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Component library |
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
| **Inngest** | Background job scheduling (email workflows) |
| **Brevo (SMTP)** | Transactional email delivery |
| **Helmet** | Security headers |
| **Morgan** | HTTP request logging |

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
                            │
                    ┌───────┴──────┐
                    │   Inngest    │  Background jobs
                    │  (Email      │  (welcome, reminders,
                    │   workflows) │   job alerts)
                    └──────────────┘
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
│   └── profile/          # User profile page (with notification prefs)
├── login/                # Google OAuth sign-in
├── onboarding/           # Profile completion form
├── auth/callback/        # OAuth redirect handler
├── about/, faqs/, etc.   # Public informational pages
└── page.tsx              # Landing page (auth-aware)

providers/
├── auth-provider.tsx     # Global auth state (session + user)
└── query-provider.tsx    # TanStack Query client

services/
├── job.service.ts        # Job CRUD API calls
├── profile.service.ts    # Profile + resume API calls
├── academic.service.ts   # Branches/batches API calls
└── admin.service.ts      # All admin API calls
```

---

## 🗄 Database Schema

All tables live under the `placement` schema. Managed via incremental Supabase migrations.

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

users ──1:1──▶ job_alert_subscriptions
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
| `circular_number` | TEXT | Circular reference number |
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
| `approval_status` | ENUM | `pending` / `approved` / `rejected` |
| `is_active` | BOOLEAN | Soft-delete flag |

**Uniqueness:** `(circular_number, role_title)` — one circular can have multiple roles.

#### `placement.job_alert_subscriptions`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `user_id` | UUID (FK) | → `users.id` |
| `email_alerts` | BOOLEAN | Opt-in for job notification emails |

#### Junction Tables
- **`job_eligible_branches`** — `(job_id, branch_id)` composite PK
- **`job_eligible_batches`** — `(job_id, batch_id)` composite PK
- **`job_locations`** — `(job_id, location TEXT)`

#### `placement.admin_logs`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `admin_id` | UUID (FK → users) | Admin who performed the action |
| `action` | TEXT | e.g. `approve_job`, `promote_user` |
| `target_type` | TEXT | `job`, `user`, `program`, `branch`, `batch` |
| `target_id` | UUID | ID of the affected entity |
| `details` | JSONB | Contextual data |
| `created_at` | TIMESTAMPTZ | Timestamp of action |

### RPC Functions

| Function | Purpose |
|----------|---------|
| `placement.create_job_v3(...)` | Creates job + inserts branches, batches, locations in one transaction |
| `placement.get_job_feed(branch_id, batch_id, cgpa)` | Personalized feed filtered by eligibility (handles "ALL" branches) |
| `placement.get_eligible_subscribers(branch_ids, batch_ids)` | Returns opted-in users eligible for a specific job (for email alerts) |
| `placement.admin_dashboard_stats()` | Aggregated user + job counts for admin dashboard |
| `placement.get_job_stats()` | Job type breakdown statistics |

### Storage Buckets

| Bucket | Path Pattern | Purpose |
|--------|------------|---------|
| `job-circulars` | `circulars/{circular_number}.pdf` | Placement circular PDFs |
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
| `GET` | `/profile/notification-preferences` | ✅ | Get email alert subscription status |
| `PATCH` | `/profile/notification-preferences` | ✅ | Update email alert opt-in/out |

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
| `/` | Landing page — auth-aware |
| `/login` | Google OAuth sign-in |
| `/about` | About the project |
| `/contact` | Contact form |
| `/faqs` | Accordion FAQ section |
| `/blog` | Placement tips & updates |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |

### Auth-Protected Pages
| Route | Description |
|-------|-------------|
| `/auth/callback` | OAuth redirect handler |
| `/onboarding` | Profile completion form |
| `/jobs` | Job feed with "All Jobs" and "My Feed" tabs |
| `/jobs/:id` | Job detail page with circular download |
| `/create-job` | Multi-step job creation form (admin/volunteer only) |
| `/admin` | Admin dashboard — 6 tabs |
| `/profile` | User profile + notification preferences |

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
         ├── ❌ Non-@kiit.ac.in email → 403 → signOut → /login
         │
         └── ✅ Valid email
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
| **Volunteer** | ✅ | ❌ (pending review) | ❌ | ❌ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

Admins are defined via the `ADMIN_EMAILS` environment variable. Volunteers are promoted from students by admins.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase project with Google OAuth configured
- Inngest account (for background email jobs)
- Brevo (formerly Sendinblue) account (for transactional email)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/avsaar.git
cd avsaar

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
ADMIN_EMAILS=youremail@kiit.ac.in
FRONTEND_BASE_URL=http://localhost:5500
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=अवSaar
LOGO_URL=https://your-logo-url.jpg
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
npx supabase db push
```

### 4. Seed Academic Data

Use the admin dashboard (`/admin?tab=academics`) or the admin API to create programs, branches, and batches.

### 5. Start Development Servers

```bash
# Terminal 1: Backend
cd app/backend && npm run dev

# Terminal 2: Frontend
cd app/frontend && npm run dev
```

- Frontend: `http://localhost:5500`
- Backend API: `http://localhost:5000`
- Inngest Dev Server: `http://localhost:8288` (run `npx inngest-cli@latest dev`)

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
| `FRONTEND_BASE_URL` | ✅ | Frontend URL (used in email templates) |
| `INNGEST_EVENT_KEY` | ✅ | Inngest event signing key |
| `INNGEST_SIGNING_KEY` | ✅ | Inngest webhook signing key |
| `BREVO_API_KEY` | ✅ | Brevo transactional email API key |
| `BREVO_SENDER_EMAIL` | ✅ | From address for platform emails |
| `BREVO_SENDER_NAME` | No | Sender display name (default: अवSaar) |
| `LOGO_URL` | No | Logo image URL for email templates |

### Frontend (`app/frontend/.env`)
| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |

---

## 📁 Project Structure

```
avsaar/
├── app/
│   ├── backend/
│   │   └── src/
│   │       ├── config/          # env.js, supabase.js
│   │       ├── emails/          # Email templates (welcome, reminder, job alert)
│   │       ├── inngest/         # Inngest client + background functions
│   │       │   └── functions/jobs/  # sendJobAlertEmails function
│   │       ├── middlewares/     # auth, roleGuard, profileGuard, upload, validate
│   │       ├── modules/
│   │       │   ├── academics/   # Programs, branches, batches CRUD
│   │       │   ├── admin/       # Dashboard, users, jobs, logs
│   │       │   ├── job/         # Job CRUD, approval, feed, circular download
│   │       │   └── users/       # Auth (me), profile, resume, subscription
│   │       ├── routes/          # Central route registration
│   │       └── utils/           # AppError, AppResponse, logger
│   │
│   └── frontend/
│       └── src/
│           ├── app/
│           │   ├── (dashboard)/ # Auth-protected pages
│           │   ├── about/       # About page
│           │   ├── faqs/        # FAQ accordion
│           │   ├── login/       # Sign-in page
│           │   ├── onboarding/  # Profile setup
│           │   ├── privacy/     # Privacy policy
│           │   └── terms/       # Terms of service
│           ├── components/
│           │   ├── ui/          # shadcn/ui + custom components
│           │   └── features/    # Domain-specific feature components
│           ├── lib/
│           │   ├── api.ts       # Axios + 401 interceptor
│           │   └── supabase.ts  # Supabase browser client
│           ├── providers/       # AuthProvider, QueryProvider
│           └── services/        # API call layer
│
├── supabase/
│   └── migrations/              # Incremental SQL migrations
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
- [x] Job approval workflow (admin reviews volunteer posts)
- [x] Personalized job feed (branch + batch + CGPA filtering via Postgres RPC)
- [x] "ALL" branch support — jobs targeting all branches of a program reach all eligible students
- [x] Circular PDF download via signed URLs
- [x] Resume upload & download
- [x] Full admin dashboard — 6-tab UI (Overview, Users, Volunteers, Jobs, Academics, Logs)
- [x] Admin user management — search, role filter, promote/demote with confirmation
- [x] Volunteer management — expandable cards with per-volunteer job stats
- [x] Academic structure CRUD — programs, branches, batches via admin UI
- [x] Admin audit log — full trail of every admin action
- [x] Email notifications via Inngest + Brevo — welcome emails, profile reminders, job alerts
- [x] Job alert subscription system — opt-in on onboarding, manageable from profile
- [x] Mobile-responsive navigation

### 🔜 Planned
- [ ] Push notifications (web push via service workers)
- [ ] Job bookmarking / save for later
- [ ] Search & advanced filters on job feed
- [ ] AI circular parsing (auto-fill job form from PDF upload)
- [ ] Analytics charts on admin dashboard
- [ ] Announcements board (general updates, not tied to job postings)
- [ ] Email digest mode (weekly summary instead of per-posting alerts)

### 🌱 Long-term Vision
The goal is a smoother, more organized placement experience for the entire KIIT community. We hope this initiative contributes positively to that ecosystem, and we remain open to collaboration with stakeholders who share that vision.

---

## 🤝 Contributing

Contributions are welcome! If you're a KIIT student and want to help improve the platform:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes with clear commit messages
4. Open a pull request with a description of what you've changed and why

For larger changes, open an issue first to discuss the approach.

---

## ⚠️ Disclaimer

**अवSaar is an independent student initiative.**

This platform is **not** affiliated with, endorsed by, or officially operated by KIIT University or its Training & Placement department. It is built and maintained voluntarily by students.

- All institutional names and trademarks belong to their respective owners.
- Placement information on this platform is community-contributed and best-effort.
- Always verify important details through official KIIT T&P channels.
- We make no guarantees about placement outcomes or the accuracy of information posted here.

---

<div align="center">

Crafted with ❤️ by students, for students.

*An independent community initiative for the KIIT placement ecosystem.*

</div>
