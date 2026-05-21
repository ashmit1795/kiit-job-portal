# Avsaar — Project Context & Design Decisions

> This document captures the **why** behind implementation choices. Read the [README](./readme.md) for setup & usage.

---

## Product Vision & Positioning

### What Avsaar Is

Avsaar is an **independent, student-built placement information platform** for the KIIT community. It is **not** an official KIIT University product, not operated by the T&P department, and not affiliated with any institutional body.

**Core purpose:** Centralize placement-related information — circulars, internship notices, hackathons, deadlines — into one clean, searchable, eligibility-aware platform. Students discover opportunities here, then apply through the company's own process.

**What it is NOT:** A job application platform, an official T&P portal, or a university-sanctioned system.

### The Problem We're Solving

Placement information at KIIT is fragmented. Circulars arrive through multiple WhatsApp groups, forwarded PDFs, Telegram channels, and emails — with no central record, no search, no eligibility filtering, and no deadline tracking. Students miss opportunities because of information chaos, not lack of qualification.

Avsaar solves this by providing a clean, permanent home for every placement opportunity — organized, filtered to each student's eligibility profile, and always accessible.

### Community Model

Avsaar runs on a **community contribution model**:
- **Volunteers** (trusted students) post circulars and keep information current
- **Admins** review volunteer content before it goes live
- **Students** access a curated, eligibility-filtered feed

Information is best-effort and community-maintained. The platform explicitly encourages users to cross-reference critical details with official KIIT T&P communications.

### Long-term Vision

The long-term vision is a smoother, more organized placement experience for everyone in the KIIT ecosystem. As an independent initiative, we hope the work here contributes positively — and if it resonates with stakeholders at KIIT's T&P department in the future, we'd genuinely welcome a conversation about how we can work together toward an even better placement ecosystem. Until then, we're building independently and openly.

---

## System Purpose

Avsaar is a **placement opportunity aggregator** — NOT a job application platform.

Students discover opportunities here, then apply through the company's own process. The portal provides:
- Opportunity discovery with eligibility filtering
- Circular PDF archive with signed, expiring download URLs
- Deadline visibility and tracking
- Centralized record replacing scattered WhatsApp/Telegram groups
- Email notification system for new matching opportunities

---

## Key Design Decisions

### 1. Custom `placement` Schema
All tables live under `placement.*` instead of the default `public` schema. This keeps application data separate from Supabase's internal tables and provides a clean namespace.

### 2. Circular Number + Role Title Uniqueness
Jobs are uniquely identified by `(circular_number, role_title)` because a single circular often contains multiple roles (e.g., SDE, Data Analyst). Each role becomes a separate job record.

### 3. Backend User Sync (not Supabase triggers)
User records are created/updated in the auth middleware via `userService.syncUser()` rather than using Supabase database triggers. This gives the backend full control over:
- Email domain validation (`@kiit.ac.in`)
- Role assignment (checking `ADMIN_EMAILS`)
- Roll number extraction from email

### 4. Service Role Key on Backend
The backend uses the Supabase **service role key** (not anon key) because it needs to:
- Verify JWT tokens via `supabase.auth.getUser(token)`
- Access storage buckets for circular/resume uploads
- Run RPC functions and query all tables without RLS restrictions

### 5. No RLS on `placement` Tables
All database access goes through the Express backend, which enforces auth + role checks via middleware. RLS is not applied on the `placement` schema — the backend acts as the security boundary.

### 6. RPC Functions for Complex Operations
- `create_job_v3` — wraps job insertion + branch/batch/location linking in a single DB transaction
- `get_job_feed` — performs the eligibility join (branch ∩ batch ∩ CGPA) at the database level, and handles the "ALL" branch case by expanding to all branches under the same program
- `get_eligible_subscribers` — returns opted-in users eligible for a specific job posting (used by Inngest job alert function)
- `admin_dashboard_stats` — aggregates user/job counts in one query (8 metrics)

### 7. "ALL" Branch Support
For jobs that apply to every branch within a program, an "ALL" sentinel branch is used when posting. Both the `get_job_feed` RPC and the `get_eligible_subscribers` RPC handle this by expanding "ALL" to include all specific branches under the same program — so students only see what's actually relevant to them, and job posters don't need to manually select every branch.

### 8. Inngest + Brevo Email Architecture
Background email workflows are handled by [Inngest](https://inngest.com) for reliable background job execution:
- **Welcome email** — fires on `avsaar/user.created` event
- **Profile reminder** — fires on `avsaar/user.created` with a 48h delay (dev: immediate) for users who haven't completed their profile
- **Job alert emails** — fires on `avsaar/job.approved` event; queries eligible opted-in subscribers via `get_eligible_subscribers` RPC, then sends batched emails via Brevo SMTP

The job alert function includes a 2-minute delay in production to allow for any last-minute job edits before notifications go out.

### 9. Job Alert Subscription Model
- On onboarding, users are opted-in by default (checkbox, pre-ticked)
- Subscription is stored in `job_alert_subscriptions` with `email_alerts: true/false`
- Users can change their preference at any time from the Notifications tab in their profile

### 10. Frontend Auth Token Management
The token lifecycle is centralized in `AuthProvider`:
- `onAuthStateChange` is the **single source of truth** — no duplicate `getSession()` calls
- Token is passed to `api.ts` via `setAccessToken()` — the Axios interceptor reads from a module-level variable (zero-latency, no async)
- The 401 interceptor auto-redirects to `/login` on token expiry

### 11. Profile Completion Guard
The `profileGuard` middleware blocks students/volunteers from accessing core features (jobs, feed) until they complete their profile (branch, batch, CGPA, percentages). Admins bypass this requirement.

### 12. Admin Dashboard Architecture
The admin dashboard is a **6-tab SPA** at `/admin` with tab state synced to the URL (`?tab=<name>`), making each tab directly shareable and deep-linkable:
- Each tab is a **self-contained lazy-loaded component** — data only fetches when the tab is first visited
- All destructive actions go through a **confirmation dialog** before executing
- Every mutation automatically writes to `placement.admin_logs` via the backend
- `date-utils.ts` provides zero-dependency date formatting to avoid adding `date-fns` to the bundle

---

## Roles & Permissions

| Capability | Student | Volunteer | Admin |
|-----------|:-------:|:---------:|:-----:|
| View approved jobs | ✅ | ✅ | ✅ |
| View personalized feed | ✅ | ✅ | ✅ |
| Download circulars | ✅ | ✅ | ✅ |
| Upload resume | ✅ | ✅ | ✅ |
| Manage notification preferences | ✅ | ✅ | ✅ |
| Create job postings | ❌ | ✅ (pending review) | ✅ (auto-approved) |
| Approve/reject jobs | ❌ | ❌ | ✅ |
| View all job statuses | ❌ | ❌ | ✅ |
| Manage users (search, filter, role change, delete) | ❌ | ❌ | ✅ |
| Promote student → volunteer / admin | ❌ | ❌ | ✅ |
| Demote volunteer → student | ❌ | ❌ | ✅ |
| View volunteer job stats | ❌ | ❌ | ✅ |
| Create / delete programs, branches, batches | ❌ | ❌ | ✅ |
| View admin audit log | ❌ | ❌ | ✅ |
| Skip profile completion | ❌ | ❌ | ✅ |

---

## Development Guidelines

1. **Keep business logic in services** — controllers only parse requests and send responses
2. **Keep repositories database-only** — no business rules, just queries
3. **Never put logic in controllers** — they should be thin wrappers
4. **Normalize API responses** — always use `AppResponse` for success, `AppError` for errors
5. **Validate early** — use Zod schemas via `validate` middleware before reaching controllers
6. **Use RPC for complex queries** — multi-table inserts and filtered feeds belong in Postgres functions
7. **Inngest for all background work** — never do async side-effects inline in controllers

---

## Storage Structure

```
Supabase Storage
├── job-circulars/
│   └── circulars/{circular_number}.pdf
└── resumes/
    └── resumes/{user_id}.pdf
```

Signed URLs (60s expiry) are generated on-demand for downloads — files are never publicly accessible.

---

## Environment-Specific Behavior

### Dev Auth Mode
When `DEV_AUTH_ENABLED=true` and `NODE_ENV !== production`, the auth middleware accepts an `x-dev-email` header instead of a JWT token. This allows API testing without going through the OAuth flow.

### Admin Detection
Admins are identified by the `ADMIN_EMAILS` environment variable (comma-separated). Non-KIIT emails in this list are also allowed to authenticate (exception to the domain restriction).

### Email Delay
Job alert emails have a 2-minute delay in production (`NODE_ENV === 'production'`) and fire immediately in development for easy testing.

---

## Admin Audit Logging

Every admin mutation writes a record to `placement.admin_logs`. This is handled by `AdminRepository.insertLog()` called from the service layer. Logged actions include:

| Action | Triggered by |
|--------|----|
| `approve_job` / `reject_job` | `jobService.approveJob()` / `rejectJob()` |
| `promote_user` / `demote_user` | `adminService.updateUserRole()` |
| `change_user_role` | `adminService.updateUserRole()` |
| `delete_user` | `adminService.deleteUser()` |
| `create_program` / `delete_program` | `academicService.createProgram()` / `deleteProgram()` |
| `create_branch` / `delete_branch` | `academicService.createBranch()` / `deleteBranch()` |
| `create_batch` / `delete_batch` | `academicService.createBatch()` / `deleteBatch()` |

---

## Disclaimer

Avsaar is an independent student initiative. This codebase and platform are **not affiliated with, endorsed by, or operated by KIIT University**. All institutional names and trademarks belong to their respective owners. Information on the platform is community-contributed and best-effort.
