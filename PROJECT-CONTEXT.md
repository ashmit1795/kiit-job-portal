# Avsaar — Project Context & Design Decisions

> This document captures the **why** behind implementation choices. Read the [README](./readme.md) for setup & usage.

---

## System Purpose

Avsaar is a **placement opportunity aggregator** — NOT a job application platform.

Students discover opportunities here, then apply through the company's own process. The portal provides:
- Opportunity discovery with eligibility filtering
- Official circular PDF archive
- Deadline visibility
- Centralized record replacing scattered WhatsApp/Telegram groups

---

## Key Design Decisions

### 1. Custom `placement` Schema
All tables live under `placement.*` instead of the default `public` schema. This keeps the application data separate from Supabase's internal tables and provides a clean namespace.

### 2. Circular Number + Role Title Uniqueness
Jobs are uniquely identified by `(circular_number, role_title)` because a single T&P circular (e.g., `KIIT-DU/T&P/26/210`) often contains multiple roles (SDE, Data Analyst). Each role becomes a separate job record.

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

### 5. No RLS (Row Level Security) on placement tables
Since all database access goes through the Express backend (which enforces auth + role checks via middleware), RLS is not applied on the `placement` schema. The backend acts as the security boundary.

### 6. RPC Functions for Complex Operations
- `create_job_v3` — wraps job insertion + branch/batch/location linking in a single DB transaction
- `get_job_feed` — performs the eligibility join (branch ∩ batch ∩ CGPA) at the database level for performance
- `admin_dashboard_stats` — aggregates user/job counts in one query

### 7. Frontend Auth Token Management
The token lifecycle is centralized in `AuthProvider`:
- `onAuthStateChange` is the **single source of truth** — no duplicate `getSession()` calls
- Token is passed to `api.ts` via `setAccessToken()` — the Axios interceptor reads from a module-level variable (zero-latency, no async)
- The 401 interceptor auto-redirects to `/login` on token expiry

### 8. Profile Completion Guard
The `profileGuard` middleware blocks students/volunteers from accessing core features (jobs, feed) until they complete their profile (branch, batch, CGPA, percentages). Admins bypass this requirement.

---

## Roles & Permissions

| Capability | Student | Volunteer | Admin |
|-----------|:-------:|:---------:|:-----:|
| View approved jobs | ✅ | ✅ | ✅ |
| View personalized feed | ✅ | ✅ | ✅ |
| Download circulars | ✅ | ✅ | ✅ |
| Upload resume | ✅ | ✅ | ✅ |
| Create job postings | ❌ | ✅ (pending) | ✅ (auto-approved) |
| Approve/reject jobs | ❌ | ❌ | ✅ |
| View all job statuses | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Skip profile completion | ❌ | ❌ | ✅ |

---

## Development Guidelines

1. **Keep business logic in services** — controllers only parse requests and send responses
2. **Keep repositories database-only** — no business rules, just queries
3. **Never put logic in controllers** — they should be thin wrappers
4. **Normalize API responses** — always use `AppResponse` for success, `AppError` for errors
5. **Validate early** — use Zod schemas via `validate` middleware before reaching controllers
6. **Use RPC for complex queries** — multi-table inserts and filtered feeds belong in Postgres functions

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
