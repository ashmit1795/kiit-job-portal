# अवSaar — Student Placement Aggregator Platform

> **An independent, student-built platform centralizing, organizing, and filtering placement information for the KIIT community.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel Analytics](https://img.shields.io/badge/Vercel-Analytics-000000?logo=vercel)](https://vercel.com/)
[![Inngest](https://img.shields.io/badge/Inngest-Background%20Workers-F25C54)](https://www.inngest.com/)

> ⚠️ **Important:** अवSaar is an **independent student initiative** and is **not affiliated with, endorsed by, or operated by KIIT University**. All institutional names, logos, and trademarks belong to their respective owners.

---

## 📖 Table of Contents

- [💡 Why Avsaar?](#-why-avsaar)
- [🚀 What It Does](#-what-it-does)
  - [For Students](#for-students)
  - [For Volunteers](#for-volunteers)
  - [For Admins](#for-admins)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture & Blueprints](#-architecture--blueprints)
  - [System Overview](#system-overview)
  - [Backend Layered Architecture](#backend-layered-architecture)
  - [Background Async Event & Worker Flow](#background-async-event--worker-flow)
- [🗄 Database Schema & Postgres Engine](#-database-schema--postgres-engine)
  - [Entity Relationship Structure](#entity-relationship-structure)
  - [Core Tables Reference](#core-tables-reference)
  - [Junction Tables Reference](#junction-tables-reference)
  - [High-Performance RPC Functions](#high-performance-rpc-functions)
  - [Storage Buckets Configuration](#storage-buckets-configuration)
- [📡 API Reference](#-api-reference)
  - [Public & General Routes](#public--general-routes)
  - [Authenticated Base Routes](#authenticated-base-routes)
  - [Opportunity & Jobs Routes](#opportunity--jobs-routes)
  - [Targeted Announcements Routes](#targeted-announcements-routes)
  - [Academic Structure Management Routes](#academic-structure-management-routes)
  - [Administrative Operations Routes](#administrative-operations-routes)
- [🔐 Authentication & Session Security Flow](#-authentication--session-security-flow)
- [👥 Role & Capabilities System](#-role--capabilities-system)
- [🚀 Platform Performance & Speed Polish](#-platform-performance--speed-polish)
- [🖥️ Premium UI Polish & Micro-interactions](#️-premium-ui-polish--micro-interactions)
- [🏁 Getting Started](#-getting-started)
- [🔧 Environment Variables Specification](#-environment-variables-specification)
- [📁 Project Directory Tree](#-project-directory-tree)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 MIT License](#-mit-license)

---

## 💡 Why Avsaar?

Placement and circular information at KIIT arrives through fragmented, noisy, and transient communication channels. Students face constant information overload, leading to missed opportunities due to systemic challenges:

| Problem | Practical Impact on Students | Avsaar Solution |
| :--- | :--- | :--- |
| **Buried in Chat History** | PDFs are lost in rapid WhatsApp discussions. | **Permanent Archive** with indexed searchable tags. |
| **No Eligibility Filtering** | Mechanical students spend hours reading B.Tech CSE criteria. | **Personalized Feed** that automatically filters by branch, batch, and CGPA. |
| **Scattered Channels** | Info is split across 5+ groups (WhatsApp, Telegram, email lists). | **Single Source of Truth** aggregating all campus placement circulars. |
| **No Deadline Tracking** | Students miss narrow application windows or closing dates. | **Dynamic Countdowns & Warnings** for closing vacancies. |
| **Lack of Past History** | Lost reference numbers or historical CTC stats when preparation starts. | **Searchable Archive** filterable by year, role, company type, and compensation. |
| **Spam / Forward Noise** | Endless notifications about unrelated career seminars or forwards. | **Targeted Announcements & Alerts** matching specific eligible student subsets. |

**Avsaar is our answer to that chaos** — a unified, high-performance, eligibility-aware dashboard where every circular is parsed, catalogued, tagged, and distributed. Built by KIIT students who experienced the pain first-hand.

> **Key Aggregator Principle:** Avsaar is NOT an active job application portal. It is a **placement opportunity discoverability index**. Students discover matches here, analyze eligibility criteria, and are redirected to the company's designated official portal (e.g., Superset, Cocubes, or company careers link) to complete their application.

---

## 🚀 What It Does

Avsaar splits access control and features into three specialized user roles:

### For Students
*   **My Eligible Feed** — A personalized dashboard showing only approved jobs that match your precise Branch, Batch, CGPA, 10th/12th percentages, and backlog status.
*   **Targeted Announcements** — A real-time notification board showing academic updates, venue changes, results, shortlist PDFs, and deadlines matching your branch and batch.
*   **All Opportunities Directory** — A searchable archive where you can browse every historical, active, or closed listing on the platform.
*   **Secure Circular Downloads** — View and download official circular PDF attachments stored in Supabase via secure, cryptographically signed, expiring URLs.
*   **Dynamic Profile Management** — Sync Google OAuth info, update your CGPA, input academic details, and upload your resume PDF.
*   **Opt-In Email Notifications** — Control subscription states on your profile. Receive direct, elegant transactional email alerts the second a job matches your profile.

### For Volunteers
*   **Multi-Step Opportunity Creator** — Draft detailed job listings with compound branch targeting, batch restrictions, salary CTC metadata, and circular attachments.
*   **Announcement Board Poster** — Create branch/batch targeted announcements, set priorities (Low, Medium, High, Critical), link them to specific jobs, and upload supporting circulars or results spreadsheets.
*   **Owned Opportunity Management** — Edit, update, and manage opportunities and announcements created by yourself. Keeps listings updated with newly released interview instructions.
*   **Moderation Flow Compliance** — Submit postings into an Admin review queue before they are visible to students, protecting platform reliability.

### For Admins
*   **Metric Operations Grid** — An overview tab displaying 8 real-time platform metrics (Active Users, Students count, Volunteers count, Admins count, and Total / Pending / Approved / Expired Jobs).
*   **Opportunity Review Queues** — Approve or reject volunteer-submitted jobs with one-click modal inputs. Admin-created jobs bypass review and are auto-approved.
*   **Unified User Manager** — Search and filter users by name, role, email, or profile completion state. Demote volunteers, promote outstanding students to volunteers, or delete obsolete user records.
*   **Academic Schema Customizer** — Add and delete programs (e.g., B.Tech, MCA), branches (e.g., CSE, MECH), and batches (e.g., 2026, 2027) dynamically, which instantly updates onboarding forms and targeting engines.
*   **On-Demand Safety Email Alerts** — Trigger high-fidelity email dispatches manually on approved jobs or critical announcements. Protected by specialized Tailwind double-confirm safety dialogs to prevent accidental student mail spam.
*   **Administrative Audit Logs** — A paginated, timestamped log recording all administrative actions (promotions, job approvals, academic changes, manual dispatches, deletions) for accountability.

---

## 🛠 Tech Stack

### Frontend Architecture
*   **Next.js 16 (App Router)** — Modern core React framework utilizing server-side layout shells and client-side page sheets.
*   **TypeScript** — Enforces compile-time type-safety across all components, hooks, services, and API definitions.
*   **Tailwind CSS 4** — Sleek utility-first CSS engine implementing a customized glassmorphic dark-mode design system.
*   **shadcn/ui** — Pre-engineered accessible UI component structures (Dialogs, Tabs, Collapsibles, Dropdowns).
*   **TanStack Query v5** — In-memory caching, refetching, and state synchronization of API data.
*   **Axios** — Custom instance equipped with latency-free headers mapping and automatic 401 token interceptors.
*   **Supabase Client SDK** — Handles client-side Google OAuth 2.0 authentication cycles.
*   **Sonner** — Clean visual toast notifications for instant mutation feedback.
*   **Lucide React** — Unified SVGs icon library.
*   **SimpleMDE (React MDEditor)** — Markdown editor and rendering engine for beautiful job circular descriptions.

### Backend Infrastructure
*   **Node.js (ES Modules)** — Server-side JavaScript runtime with structured modular design.
*   **Express 5** — Fast, minimal server framework powering API endpoints and route logic.
*   **Supabase JS (Service Role Key)** — Bypasses Row Level Security (RLS) to manage secure transactions, upload storage attachments, and execute specialized PostgreSQL functions.
*   **Zod** — Strict validation schemas verifying incoming request headers, parameters, and bodies at the router level.
*   **Multer** — Streams and intercepts multipart form-data file uploads (circular PDFs and student resumes).
*   **Inngest** — Event-driven background executor executing queue flows, profile triggers, delayed reminders, and transactional subscriber alerts asynchronously.
*   **Brevo (SMTP SDK)** — Transactional SMTP provider distributing platform alerts, onboarding digests, and manual alerts.
*   **Helmet** — Sets HTTP response security headers to block cross-site scripting (XSS) and clickjacking.
*   **Morgan** — Microsecond-precision console request logging.

### Database & Cloud Assets
*   **Supabase PostgreSQL** — Relational database containing indices, custom types, and transactional stored procedures.
*   **Supabase Auth** — Manages identity verification via Google OAuth, locked exclusively to student accounts.
*   **Supabase Storage** — Host for file binary buckets:
    *   `job-circulars` — Holds official company job attachments in PDF.
    *   `resumes` — Stores verified student resumes.

---

## 🏗 Architecture & Blueprints

### System Overview
Avsaar utilizes a decoupled headless architecture where the client browser, server logic, and cloud database communicate via secure API channels:

```
┌─────────────────────────┐      HTTPS      ┌─────────────────────┐      HTTPS      ┌─────────────────────────┐
│     Client Browser      │────────────────▶│ Next.js App Router  │────────────────▶│     Express Backend     │
│   (React + Tailwind)    │◀────────────────│  (Port 5500 / Vercel)│◀────────────────│  (Port 5000 / Render)   │
└────────────┬────────────┘                 └─────────────────────┘                 └────────────┬────────────┘
             │                                                                                   │
             │ Google OAuth 2.0                                                                  │ Service Role Token
             ▼                                                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             Supabase Cloud Suite                                            │
│   ┌─────────────────────┐                 ┌─────────────────────┐                 ┌─────────────────────┐   │
│   │    Supabase Auth    │                 │  Supabase Storage   │                 │ Supabase PostgreSQL │   │
│   │ (Google Identity)   │                 │ (PDF Buckets)       │                 │ (`placement` Schema)│   │
│   └─────────────────────┘                 └─────────────────────┘                 └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       ▲
                                                       │ Async Job Handlers (Events & Webhooks)
                                                       ▼
                                            ┌─────────────────────┐
                                            │   Inngest Engine    │
                                            │ (Background Queues) │
                                            └──────────┬──────────┘
                                                       │
                                                       ▼ Brevo SMTP API
                                            ┌─────────────────────┐
                                            │  Student Mailboxes  │
                                            │   (Inbox Alerts)    │
                                            └─────────────────────┘
```

### Backend Layered Architecture
Every backend request traverses distinct architectural layers to decouple database access from HTTP routing:

```
                  Client HTTP Request
                           │
                           ▼
                  ┌─────────────────┐
                  │  Express Router │ ── Validate Zod Schema & Bearer JWT
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │   Controller    │ ── Parse params, request context, delegate to service
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │     Service     │ ── Evaluate role permissions, business rules, transaction checks
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │   Repository    │ ── Direct database commands, execute PostgreSQL RPCs
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ PostgreSQL (DB) │ ── Read, write, compute, and return rows
                  └─────────────────┘
```

### Background Async Event & Worker Flow
Asynchronous tasks like email blasts are offloaded to Inngest to protect API response times from SMTP delays:

```
1. Admin Posts Job/Announcement ────▶ Backend Creates Record & Emits Event to Inngest
                                                       │
                                                       ▼
2. Inngest Intercepts Event (e.g., `job/posted` or `announcement/posted`)
                                                       │
                                                       ▼
3. Run Worker Process:
   ├── A. Verify Deadline: Is deadline in the past? ──▶ [YES] ──▶ Abort (Avoid mailbox spam)
   │                                                             
   └── B. [NO] ──▶ Invoke Stored Database RPC: `placement.get_eligible_subscribers(...)`
                                                       │
                                                       ▼
4. RPC Returns Subset of Targeted Students (Batch size: 100 subscribers)
                                                       │
                                                       ▼
5. Inngest Batches Transactions and Calls Brevo SMTP Server
                                                       │
                                                       ▼
6. Elegant Transactional HTML Emails Delivered to Eligible Students
```

---

## 🗄 Database Schema & Postgres Engine

Every database entity exists under the isolated `placement` schema to decouple from Supabase systems.

### Entity Relationship Structure
```
┌────────────────┐          ┌────────────────┐          ┌────────────────┐
│    programs    │───1:N───▶│    branches    │───1:N───▶│     users      │
└────────────────┘          └────────────────┘          └───────┬────────┘
                                                                │
  ┌─────────────────────────────────────────────────────────────┤
  │ (posted_by)                                                 │ (FK)
  ▼                                                             ▼
┌────────────────┐                                      ┌────────────────┐
│      jobs      │                                      │  announcements │
└───────┬────────┘                                      └───────┬────────┘
        │                                                       │
        ├───────────────────────┐                               ├───────────────────────┐
        ▼                       ▼                               ▼                       ▼
┌───────────────┐       ┌───────────────┐               ┌───────────────┐       ┌───────────────┐
│ job_branches  │       │  job_batches  │               │ announce_bran │       │ announce_batc │
└───────────────┘       └───────────────┘               └───────────────┘       └───────────────┘
```

### Core Tables Reference

#### `placement.users`
*   `id`: `uuid` (Primary Key, matches Supabase auth `users.id`)
*   `email`: `text` (Unique, verified domain restriction `@kiit.ac.in`)
*   `roll_number`: `text` (Extracted from email digits)
*   `full_name`: `text` (Synced from Google OAuth metadata)
*   `avatar_url`: `text` (Direct link to Google profile photo)
*   `role`: `placement.user_role` enum (`student`, `volunteer`, `admin`)
*   `profile_completed`: `boolean` (Default `false`, controls router access)
*   `branch_id`: `uuid` (Foreign Key -> `placement.branches(id)`)
*   `batch_id`: `uuid` (Foreign Key -> `placement.batches(id)`)
*   `cgpa`: `numeric(3,2)` (Value range `0.00` to `10.00`)
*   `tenth_percentage`: `numeric(5,2)` (10th board grade)
*   `twelfth_percentage`: `numeric(5,2)` (12th board/diploma grade)
*   `resume_url`: `text` (Storage bucket URL path)
*   `created_at`/`updated_at`: `timestamptz`

#### `placement.jobs`
*   `id`: `uuid` (Primary Key, default `gen_random_uuid()`)
*   `circular_number`: `text` (Official placement reference index)
*   `company_name`: `text` (Hiring corporation name)
*   `role_title`: `text` (Designation title)
*   `job_type`: `placement.job_type` enum (`placement`, `internship`, `internship_fulltime`, `hackathon`, `webinar`, `talk`)
*   `ctc`: `text` (Salary package, e.g., "12 LPA")
*   `stipend`: `text` (Monthly internship stipend, e.g., "₹45,000/mo")
*   `min_cgpa`: `numeric(3,2)` (Eligibility cutoff, default `0.00`)
*   `deadline`: `timestamptz` (Timestamp after which applications lock)
*   `joining_date`: `text` (Tentative joining month/year)
*   `description`: `text` (Markdown content format)
*   `circular_file_path`: `text` (Reference file in PDF storage)
*   `approval_status`: `placement.approval_status` enum (`pending`, `approved`, `rejected`)
*   `is_active`: `boolean` (Default `true`, allows soft delete)
*   `posted_by`: `uuid` (Foreign Key -> `placement.users(id)`)
*   `created_at`/`updated_at`: `timestamptz`

#### `placement.job_announcements`
*   `id`: `uuid` (Primary Key, default `gen_random_uuid()`)
*   `subject`: `text` (Headline of the announcement)
*   `description`: `text` (Detailed markdown notification text)
*   `job_id`: `uuid` (Optional, Foreign Key -> `placement.jobs(id)` on delete cascade)
*   `circular_file_path`: `text` (Optional, attachment PDF link)
*   `circular_number`: `text` (Optional, custom text pointer)
*   `announcement_type`: `placement.announcement_type` enum (`general`, `deadline_extension`, `shortlist`, `test_link`, `venue_update`, `eligibility_update`, `joining_update`, `result`, `warning`)
*   `is_pinned`: `boolean` (Pushes announcement to the top of student dashboards)
*   `announcement_priority`: `integer` (Priority levels: `0 = Low`, `1 = Medium`, `2 = High`, `3 = Critical`)
*   `alert_sent`: `boolean` (Ensures single manual dispatch execution)
*   `is_active`: `boolean` (Default `true`, allows soft delete)
*   `created_by`: `uuid` (Foreign Key -> `placement.users(id)`)
*   `created_at`/`updated_at`: `timestamptz`

#### `placement.admin_logs`
*   `id`: `uuid` (Primary Key)
*   `admin_id`: `uuid` (Foreign Key -> `placement.users(id)`)
*   `action`: `text` (E.g., `approve_job`, `demote_user`, `send_alert`)
*   `target_type`: `text` (E.g., `job`, `user`, `announcement`)
*   `target_id`: `uuid` (Entity UID)
*   `details`: `jsonb` (Meta payload storing audit context)
*   `created_at`: `timestamptz`

---

### Junction Tables Reference

#### `placement.job_eligible_branches`
Maps eligible branch IDs to specific job opportunities.
*   `job_id` (FK -> `placement.jobs(id)`) + `branch_id` (FK -> `placement.branches(id)`) = Composite Primary Key.

#### `placement.job_eligible_batches`
Maps eligible batch years to specific job opportunities.
*   `job_id` (FK -> `placement.jobs(id)`) + `batch_id` (FK -> `placement.batches(id)`) = Composite Primary Key.

#### `placement.announcement_eligible_branches`
Filters standalone announcement visibility to specific student branches.
*   `announcement_id` (FK -> `placement.job_announcements(id)`) + `branch_id` (FK -> `placement.branches(id)`) = Composite Primary Key.

#### `placement.announcement_eligible_batches`
Filters standalone announcement visibility to specific student batches.
*   `announcement_id` (FK -> `placement.job_announcements(id)`) + `batch_id` (FK -> `placement.batches(id)`) = Composite Primary Key.

#### `placement.job_locations`
Attaches physical work regions to job postings.
*   `job_id` (FK -> `placement.jobs(id)`) + `location` (text) = Composite Primary Key.

---

### High-Performance RPC Functions

#### 1. `placement.create_job_v3(...)`
Executes multi-table inserts in a single database transaction.
*   **Arguments**: `p_circular_number`, `p_company_name`, `p_role_title`, `p_job_type`, `p_ctc`, `p_stipend`, `p_min_cgpa`, `p_deadline`, `p_joining_date`, `p_description`, `p_circular_file_path`, `p_posted_by`, `p_branch_ids uuid[]`, `p_batch_ids uuid[]`, `p_locations text[]`, `p_created_at timestamptz`
*   **Process**: Creates job record, inserts locations, branches, and batches, returning the new job UID. Resolves retroactivity by binding `p_created_at` optionally.

#### 2. `placement.update_job(...)`
Handles atomic updates of job opportunities by cleaning up old relation trees.
*   **Arguments**: `p_id`, `p_circular_number`, `p_company_name`, `p_role_title`, `p_job_type`, `p_ctc`, `p_stipend`, `p_min_cgpa`, `p_deadline`, `p_joining_date`, `p_description`, `p_circular_file_path`, `p_branch_ids uuid[]`, `p_batch_ids uuid[]`, `p_locations text[]`
*   **Process**: Modifies the job record, deletes old records in `job_eligible_branches`, `job_eligible_batches`, and `job_locations`, and inserts updated associations.

#### 3. `placement.get_job_feed(...)`
Performs eligibility verification at the database level.
*   **Arguments**: `p_branch_id uuid`, `p_batch_id uuid`, `p_cgpa numeric`
*   **Logic**: Returns approved, active jobs where `p_cgpa >= min_cgpa`. Handles "ALL" sentinel branches by matching all branches belonging to the same academic program.

#### 4. `placement.get_announcement_feed(...)`
Filters announcements based on student branch and batch targeting.
*   **Arguments**: `p_branch_id uuid`, `p_batch_id uuid`
*   **Logic**:
    *   *Linked Announcements*: Resolves targeting against the linked job's eligibility profiles.
    *   *Standalone Announcements*: Resolves targeting against `announcement_eligible_branches` and `announcement_eligible_batches`.
    *   *Global Fallback*: Displays announcements if targeting junction records are empty.
    *   *JSONB Aggregation*: Pre-aggregates creators, job profiles, and eligible tags to minimize connection latency.

#### 5. `placement.get_eligible_subscribers(...)`
Fetches opted-in students matching branch and batch arrays.
*   **Arguments**: `p_branch_ids uuid[]`, `p_batch_ids uuid[]`
*   **Patched Cardinality Guard**:
    ```sql
    AND (cardinality(p_branch_ids) = 0 OR u.branch_id = ANY(p_branch_ids))
    AND (cardinality(p_batch_ids) = 0 OR u.batch_id = ANY(p_batch_ids))
    ```
    This cardinality check allows selective matching (e.g. branch-only or batch-only targeting) without failing when one array is empty.

---

### Storage Buckets Configuration
*   **`job-circulars`** — Read/write access restricted to the backend service role. Public reads are blocked; client file downloads are served via signed, expiring URLs (`300` seconds duration).
*   **`resumes`** — Stores student resumes using the path schema `resumes/{user_id}.pdf`. Access is controlled by custom backend policies that restrict downloads to administrators only.

---

## 📡 API Reference

Base Namespace: `http://localhost:5000/api`

Standard Response Structure:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": { ... }
}
```

### Public & General Routes

#### `GET /health`
Returns system heartbeat metrics.
*   **Auth Required**: None.
*   **Output**: Server uptime status, local time, and CPU utilization metrics.

#### `POST /contact`
Handles contact and support form submissions.
*   **Auth Required**: None.
*   **Payload**: `{ "name": "Name", "email": "email@example.com", "subject": "Query", "message": "Text..." }`
*   **Output**: Success message confirming delivery.

---

### Authenticated Base Routes

#### `GET /auth/me`
Fetches current session user information.
*   **Auth Required**: JWT Bearer.
*   **Output**: Complete profile row. Syncs profile and Google OAuth details on login.

#### `POST /profile/complete`
Saves user's academic and onboarding profile details.
*   **Auth Required**: JWT Bearer.
*   **Payload**: `{ "branch_id", "batch_id", "cgpa", "tenth_percentage", "twelfth_percentage", "email_alerts": true/false }`

#### `PATCH /profile/update`
Modifies student academic details.
*   **Auth Required**: JWT Bearer.
*   **Payload**: `{ "cgpa", "tenth_percentage", "twelfth_percentage" }`

#### `POST /profile/resume`
Uploads and stores a student's resume PDF.
*   **Auth Required**: JWT Bearer (Student / Volunteer roles).
*   **Payload**: `multipart/form-data` containing `resume` file key.
*   **Output**: Upload path verification metadata.

#### `GET /profile/resume`
Retrieves a signed download URL for the student's resume.
*   **Auth Required**: JWT Bearer.

---

### Opportunity & Jobs Routes

#### `POST /jobs`
Creates a job posting.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin`, `volunteer`.
*   **Payload**: `multipart/form-data` (includes fields like `company_name`, `role_title`, branch/batch arrays, and a PDF file attachment).

#### `GET /jobs`
Lists job postings.
*   **Auth Required**: JWT Bearer + Profile Guard.
*   **Filtering**: Students see only approved listings. Admins/volunteers see all listings.

#### `GET /jobs/feed`
Retrieves personalized, eligibility-filtered job postings.
*   **Auth Required**: JWT Bearer + Profile Guard.

#### `GET /jobs/:id`
Retrieves detailed information for a specific job.
*   **Auth Required**: JWT Bearer + Profile Guard.

#### `GET /jobs/:id/circular`
Generates a signed, temporary circular download URL.
*   **Auth Required**: JWT Bearer + Profile Guard.

#### `POST /jobs/:id/send-alert`
Triggers email alerts manually for an approved job.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

---

### Targeted Announcements Routes

#### `POST /announcements`
Creates a targeted announcement.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin`, `volunteer`.
*   **Payload**: `multipart/form-data` (includes `subject`, `description`, optional `job_id`, priority integer, and target branch/batch arrays).

#### `GET /announcements`
Retrieves announcements.
*   **Auth Required**: JWT Bearer + Profile Guard.
*   **Filtering**: Filters standalone and job-linked announcements based on the student's eligibility criteria using PostgreSQL RPCs.

#### `GET /announcements/:id`
Retrieves detailed information for an announcement.
*   **Auth Required**: JWT Bearer + Profile Guard.

#### `PATCH /announcements/:id`
Updates announcement targeting, priorities, or descriptions.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin`, `volunteer`.

#### `DELETE /announcements/:id`
Performs a soft delete on an announcement.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin`, `volunteer`.

#### `POST /announcements/:id/send-alert`
Triggers email alerts manually for an announcement.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

---

### Academic Structure Management Routes

#### `GET /academics/programs` | `GET /academics/branches` | `GET /academics/batches`
Fetches academic configurations for selectors.
*   **Auth Required**: JWT Bearer.

#### `POST /academics/programs` | `POST /academics/branches` | `POST /academics/batches`
Creates new academic configuration options.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

#### `DELETE /academics/programs/:id` | `DELETE /academics/branches/:id` | `DELETE /academics/batches/:id`
Deletes academic configuration options.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

---

### Administrative Operations Routes

#### `GET /admin/dashboard`
Fetches real-time statistical metrics.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

#### `GET /admin/users`
Retrieves paginated user accounts with search and role filters.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

#### `PATCH /admin/users/:id/role`
Updates a user's role (e.g. promoting or demoting).
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

#### `DELETE /admin/users/:id`
Deletes a user account.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

#### `GET /admin/logs`
Retrieves administrative audit logs.
*   **Auth Required**: JWT Bearer.
*   **Role Locked**: `admin` only.

---

## 🔐 Authentication & Session Security Flow

Avsaar protects student and portal data using a multi-layered security model:

```
1. Client Initiates Google OAuth Login
               │
               ▼
2. Supabase Authenticates Google Account and Issues JWT Token
               │
               ▼
3. Client Stores JWT Token in Session Memory
               │
               ▼
4. Every API Request Passes JWT Bearer Token in Header
               │
               ▼
5. Express Backend Intercepts Request using `authenticate` Middleware
               │
               ▼
6. Backend Decodes Token using `supabase.auth.getUser()`
   ├── [INVALID / EXPIRED JWT] ──▶ Returns 401 Unauthorized error
   │                                     
   └── [VALID JWT]
         │
         ▼
7. Validate Email Domain Constraints:
   ├── [NON-KIIT EMAIL (e.g. gmail.com)] ──▶ Aborts request, revokes session, returns 403 Forbidden error
   │                                     
   └── [KIIT EMAIL (e.g. student@kiit.ac.in)]
         │
         ▼
8. Sync Profile Data to Database
         │
         ▼
9. Check Role Boundaries:
   ├── [ROLE MISMATCH] ──▶ Returns 403 Forbidden error
   │                                     
   └── [ROLE MATCHED]
         │
         ▼
10. Check Onboarding Profile Status:
    ├── [STUDENT INCOMPLETE] ──▶ `profileGuard` redirects user to `/onboarding`
    │                                     
    └── [STUDENT COMPLETED / ADMIN] ──▶ Controller processes request
```

---

## 👥 Role & Capabilities System

Capabilities are strictly enforced by the backend router. The table below outlines role permissions:

| Capability / Action | Student | Volunteer | Admin |
| :--- | :---: | :---: | :---: |
| **View Feed & Circular Archive** | ✅ | ✅ | ✅ |
| **Upload Personal Resume** | ✅ | ✅ | ✅ |
| **Create Standalone & Job-Linked Posts** | ❌ | ✅ *(Pending review)* | ✅ *(Auto-approved)* |
| **Edit/Modify Owned Job Posts** | ❌ | ✅ | ✅ |
| **Review and Approve Opportunities** | ❌ | ❌ | ✅ |
| **Manage Academic Structures** | ❌ | ❌ | ✅ |
| **Promote/Demote Users** | ❌ | ❌ | ✅ |
| **Trigger Manual Email Alerts** | ❌ | ❌ | ✅ |
| **Access Administrative Audit Logs** | ❌ | ❌ | ✅ |

---

## 🚀 Platform Performance & Speed Polish

*   **Lazy-Tab Query Optimization** — Replaced concurrent data prefetching on `/jobs` with active-tab event queries. TanStack Queries only fetch data when their specific tab becomes active, cutting initial page load times and database queries in half.
*   **Dual-Pass Chronological Sorting** — Promotes active opportunities (with future deadlines) to the top of the feed, while placing closed listings at the bottom. Opportunities are sorted chronologically within these groups using custom PostgreSQL queries.
*   **Strict Base-10 Integer Parsing** — Fixed a type-coercion bug in pagination parameters where string queries resulted in incorrect database ranges (e.g. querying thousands of rows). Strict parsing (`parseInt(page, 10)`) ensures accurate paginated database requests.
*   **Retroactive Backdating** — Added an optional `p_created_at` timestamp parameter to the `create_job` database function, allowing administrators to backdate postings to keep chronological archives accurate.
*   **Past-Deadline Safety Guards** — Background workers inspect opportunity deadlines before processing notifications. If an opportunity is backdated or its deadline has passed, email notifications are cancelled to prevent spamming students.

---

## 🖥️ Premium UI Polish & Micro-interactions

*   **Glassmorphic Dark Styling** — Styled using Tailwind CSS 4 to create a premium dark interface with custom green glass accents (`from-emerald-950/20 via-zinc-950 to-emerald-950/20`), harmonized border colors, custom scrollbars, and Outfit typography.
*   **Targeting Badge Checklists** — Includes interactive multi-select check-badges in standalone forms, allowing volunteers to target specific batches and branches easily.
*   **Confirm Alert Modals** — Destructive or administrative operations (e.g. promoting users, deleting configurations, manual notification alerts) require confirmation through specialized dialog modals.
*   **Cycler Beta Banner** — Renders an interactive beta cycler banner at the top of the layout. Features sliding transitions, displays rotating platform status updates, and stores its dismissal state in the user's local storage with hydration guards.
*   **Vercel Web Analytics** — Integrated within layout providers to measure site traffic, page transition speeds, and user actions on the client side.

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+ and npm.
*   A Supabase project with Google OAuth configured.
*   Inngest accounts for background worker tasks.
*   A Brevo SMTP account for handling transactional email notifications.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/ashmit1795/kiit-job-portal.git
cd kiit-job-portal

# Install project roots
npm install

# Install backend dependencies
cd app/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create the backend environment file (`app/backend/.env`):
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your-service-role-key-secret
ADMIN_EMAILS=admin@kiit.ac.in,sysop@kiit.ac.in
FRONTEND_BASE_URL=http://localhost:5500
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=अवSaar
LOGO_URL=https://yourdomain.com/assets/logo.png
```

Create the frontend environment file (`app/frontend/.env`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Database Migrations

Apply database updates to your Supabase project:
```bash
cd supabase
npx supabase db push
```

### 4. Seed Academic Configurations
Open the admin dashboard (`/admin?tab=academics`) to populate branches (e.g. B.Tech CSE, B.Tech ETC), programs (e.g. B.Tech, MCA), and active graduation batch years (e.g. 2026, 2027).

### 5. Launch Development Servers

```bash
# Terminal 1: Backend Server
cd app/backend
npm run dev

# Terminal 2: Frontend Client
cd app/frontend
npm run dev

# Terminal 3: Inngest Dev Server
npx inngest-cli@latest dev
```

*   **Frontend Client**: `http://localhost:5500`
*   **Backend Server**: `http://localhost:5000/api`
*   **Inngest Dashboard**: `http://localhost:8288`

---

## 🔧 Environment Variables Specification

### Backend Configuration (`app/backend/.env`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | No | Server port (defaults to `5000`). |
| `NODE_ENV` | Yes | Defines execution context (`development` or `production`). |
| `SUPABASE_URL` | Yes | Supabase endpoint. |
| `SUPABASE_SECRET_KEY`| Yes | Supabase service-role key (used to bypass RLS). |
| `ADMIN_EMAILS` | Yes | Comma-separated emails with automatic administrative rights. |
| `FRONTEND_BASE_URL` | Yes | Target client URL (used in email templates). |
| `INNGEST_EVENT_KEY` | Yes | Authenticates events sent to Inngest. |
| `INNGEST_SIGNING_KEY`| Yes | Signs and secures background execution endpoints. |
| `BREVO_API_KEY` | Yes | API key for Brevo transactional email delivery. |
| `BREVO_SENDER_EMAIL`| Yes | From address for outgoing transactional emails. |
| `BREVO_SENDER_NAME` | No | Sender name displayed in student inboxes (default: `अवSaar`). |

### Frontend Configuration (`app/frontend/.env`)

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase endpoint for client auth. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anonymous key for client access. |
| `NEXT_PUBLIC_API_URL` | Yes | Express server API endpoint. |

---

## 📁 Project Directory Tree

```
kiit-job-portal/
├── app/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── config/          # Environment variables and database drivers
│   │   │   ├── emails/          # Transactional HTML email templates
│   │   │   ├── inngest/         # Inngest configuration and background workers
│   │   │   ├── middlewares/     # Auth, file upload, role, and Zod validation middlewares
│   │   │   ├── modules/
│   │   │   │   ├── academics/   # Programs, branches, and batches CRUD
│   │   │   │   ├── admin/       # Dashboard, audit logging, and user operations
│   │   │   │   ├── announcement/# Branch/batch targeted announcements
│   │   │   │   ├── contact/     # Support messaging
│   │   │   │   ├── health/      # Heartbeat checks
│   │   │   │   ├── job/         # Opportunity creation, updates, and feeds
│   │   │   │   └── users/       # Auth sync and profile configuration
│   │   │   └── routes/          # API route definitions
│   │   └── package.json
│   │
│   └── frontend/
│       ├── src/
│       │   ├── app/             # Next.js page sheets
│       │   ├── components/
│       │   │   ├── ui/          # Generic shadcn UI components
│       │   │   └── features/    # Feature-specific interface components
│       │   ├── lib/             # Axios and Supabase client configs
│       │   ├── providers/       # Auth and TanStack Query state providers
│       │   ├── services/        # Frontend API services
│       │   └── types/           # TypeScript definitions
│       └── package.json
│
├── supabase/
│   └── migrations/              # PostgreSQL migrations
│
├── PROJECT-CONTEXT.md           # Architectural context and design decisions
├── LICENSE                      # Project license file
└── readme.md                    # This documentation file
```

---

## 🗺 Roadmap

### Completed Features (MVP)
*   Google OAuth login restricted to KIIT domain accounts.
*   Academic branch/batch targeted announcements feed using custom database procedures.
*   Optional automated job-linked inheritance for announcements.
*   Administrative overview dashboard with 8 operational metrics.
*   Transactional welcome and profile setup reminder emails via Inngest.
*   Manual safety confirmations for administrative email dispatches.
*   Expiring storage attachments for circular files.
*   Lazy-loading tab queries and chronological opportunity sorting.
*   Onboarding and profile setup flow.

### Planned Features
*   Web push notifications using browser service workers.
*   Resume analyzer powered by Google Gemini to suggest improvements for job requirements.
*   AI-powered circular parser to automatically populate forms from uploaded PDFs.
*   Bookmark and save features for student job listings.
*   Dynamic analytics charts for the admin dashboard.
*   Weekly circular email summaries for students.

---

## 🤝 Contributing

Contributions from the KIIT student community are welcome:

1. Fork the repository and create a feature branch (`git checkout -b feature/AmazingFeature`).
2. Make and test your changes. Ensure code style is consistent.
3. Commit your changes with descriptive messages.
4. Open a Pull Request detailing the changes and their impact.

---

## 📄 MIT License

```
MIT License

Copyright (c) 2026 avSaar Developers & KIIT Student Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Crafted with ❤️ by students, for students.

*An independent community initiative for the KIIT placement ecosystem.*

</div>
