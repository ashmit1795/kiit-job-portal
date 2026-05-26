# Avsaar — Technical Context & Architectural Design Decisions

> This document details the **architectural design patterns, engineering context, database choices, and system design decisions** behind the Avsaar placement aggregator platform. For developer installation instructions, see the [README](./readme.md).

---

## 🌟 Product Vision & Technical Positioning

Avsaar was conceived to solve the problem of highly fragmented placement communications at KIIT University. Rather than attempting to replace official University systems, it functions as a highly targeted **placement information index and discovery engine**.

### What It Is & What It Is Not
*   **Discoverability vs. Application:** Avsaar does **not** host active job application forms or store official submission records. It acts as an aggregator. The student discovers opportunities matching their profile, downloads verified PDF circulars, and uses the provided redirect links to submit applications on official portals (e.g. Superset, Cocubes, or direct company forms).
*   **Independent Ecosystem:** Built as a volunteer-driven student aggregator, Avsaar separates operational security boundaries from university servers. Security is enforced by the application layer, using Google OAuth to restrict access exclusively to users with `@kiit.ac.in` email addresses.

---

## 🏗️ Core Architectural Design Decisions

### 1. Isolated `placement` Schema (PostgreSQL Namespace Separation)
To prevent collision with Supabase's default tables, all application-specific tables, types, and procedures exist inside a dedicated `placement` schema:
*   **Benefits:** Clear database boundaries, easy migration exports, and isolated query logs.
*   **Implementation:** All migration files use the `placement.table_name` prefix. Row Level Security (RLS) is bypassed at the database level because queries are managed through the backend using a secure `service_role` connection.

### 2. Composite Uniqueness: `(circular_number, role_title)`
A single university placement circular often lists multiple positions with varying compensation packages, eligibility criteria, and joining dates (e.g. a company hiring both Software Engineers and Data Analysts in one document).
*   **Decision:** Jobs are uniquely identified by a composite key of `(circular_number, role_title)`.
*   **Rationale:** Allows a single circular to map to multiple roles in the database. When the backend receives a PDF, it processes it as distinct job listings, ensuring students see precise role eligibility requirements (e.g. B.Tech CSE for the SDE role, and B.Tech ALL for the Analyst role).

### 3. Decoupled Express Auth Sync (Avoiding Database Triggers)
When a student authenticates via Google OAuth, their record is synced to the `placement.users` table through backend logic in the `userService.syncUser()` middleware, rather than using automated Supabase database triggers.
*   **Rationale:**
    *   **Control over Domain Verification:** Allows the Express server to intercept and reject non-`@kiit.ac.in` logins with clean `403 Forbidden` JSON responses before database writes occur.
    *   **Automated Administrative Role Binding:** On new registrations, the backend checks the user's email against the environment's `ADMIN_EMAILS` list, automatically granting admin privileges where appropriate.
    *   **Roll Number Extraction:** The backend programmatically parses the numerical prefix from the student's KIIT email (e.g. `2205001@kiit.ac.in` -> `2205001`) and saves it as their official roll number automatically during sync.

### 4. Express Security Boundary & RLS Bypassing
Row Level Security (RLS) is disabled for the `placement` database schema. The Express backend acts as the sole access controller and security boundary:
*   **Backend Connection:** Enforced using Supabase's high-privilege `service_role` key.
*   **Security Stack:** Every incoming HTTP request must pass through the `authenticate` middleware, which verifies the JWT using `supabase.auth.getUser()`.
*   **Role-Based Access Control (RBAC):** Express route layers use the `roleGuard` middleware (`roleGuard("admin", "volunteer")`) to restrict write and update operations, keeping database tables clean and performant.

### 5. Atomic Operations via Stored Procedures (RPCs)
To prevent partial data writes during network issues, complex multi-table mutations are wrapped in database-level transactional stored procedures:

#### `placement.create_job_v3(...)`
Executes atomic inserts across four tables:
```sql
CREATE OR REPLACE FUNCTION placement.create_job_v3(
  p_circular_number text, p_company_name text, ... p_branch_ids uuid[], p_batch_ids uuid[], p_locations text[]
) RETURNS uuid AS $$
DECLARE v_job_id uuid;
BEGIN
  INSERT INTO placement.jobs (...) VALUES (...) RETURNING id INTO v_job_id;
  
  -- Insert Work Locations
  INSERT INTO placement.job_locations (job_id, location)
  SELECT v_job_id, unnest(p_locations);
  
  -- Insert Target Branches
  INSERT INTO placement.job_eligible_branches (job_id, branch_id)
  SELECT v_job_id, unnest(p_branch_ids);
  
  -- Insert Target Batches
  INSERT INTO placement.job_eligible_batches (job_id, batch_id)
  SELECT v_job_id, unnest(p_batch_ids);
  
  RETURN v_job_id;
END;
$$ LANGUAGE plpgsql;
```
*   **Benefit:** Guarantees that job metadata, locations, targeted branches, and eligible batches are written successfully as a single transaction.

#### `placement.update_job(...)`
Handles updates by cleaning up old relation trees and inserting updated associations:
*   **Logic:** Updates core job metadata in `placement.jobs`, deletes old records in `job_eligible_branches`, `job_eligible_batches`, and `job_locations` matching the job ID, and inserts the updated relations. This approach keeps queries fast and simple.

---

## 📢 Targeted Announcements Architecture

To prevent students from seeing unrelated announcements (e.g. B.Tech Computer Science students seeing updates meant for Mechanical Engineering students), the Announcements system was redesigned with targeted filtering:

```
                            ┌────────────────────────┐
                            │    job_announcements   │
                            └───────────┬────────────┘
                                        │
                                        ▼ Is Job-Linked?
                                       / \
                                     YES  NO
                                     /      \
           ┌────────────────────────┐        ┌────────────────────────┐
           │   Inherits Job Targets │        │ Evaluates Direct Joint │
           │  (Branch/Batch Cutoff) │        │  Targeting Databases   │
           └────────────────────────┘        └────────────────────────┘
```

### 1. Junction Tables
Standalone announcements use dedicated junction tables to filter visibility:
*   `placement.announcement_eligible_branches` — `(announcement_id, branch_id)` Composite Primary Key.
*   `placement.announcement_eligible_batches` — `(announcement_id, batch_id)` Composite Primary Key.

### 2. High-Performance SQL Engine: `get_announcement_feed`
The `placement.get_announcement_feed(p_branch_id, p_batch_id)` RPC function handles announcement filtering at the database layer:
*   **Case 1: Job-Linked Updates:** If an announcement is linked to a job ID, it inherits and evaluates the eligibility criteria defined for that job (`job_eligible_branches` and `job_eligible_batches`).
*   **Case 2: Standalone Updates:** If there is no linked job ID, the function checks the announcement targeting tables. If both targeting tables are empty, the announcement is treated as a **global broadcast** and is visible to all students.
*   **Case 3: Targeted Standalone:** If targeting configurations exist, the function ensures the announcement is only returned if the student's branch and batch IDs match the targeted lists.
*   **Wildcard Program Matching:** Recognizes the `ALL` wildcard branch ID, matching all branches belonging to the same academic program to simplify targeting for organizers.

---

## ✉️ Transactional Notifications & On-Demand Dispatch

Avsaar balances real-time student updates with system safety using Inngest background workers and manual confirmation overrides:

```
                  ┌──────────────────────────────────────────┐
                  │   Administrative Core Dispatch Request   │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │    Trigger Double-Confirm Safety Modal   │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼ Confirmed
                  ┌──────────────────────────────────────────┐
                  │  Execute `POST /:id/send-alert` Endpoint  │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼
                  ┌──────────────────────────────────────────┐
                  │ Emit Inngest Event Queue (`job/posted`)   │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼ Runs Asynchronously
                  ┌──────────────────────────────────────────┐
                  │      `sendAnnouncementAlertEmails`       │
                  └──────────────────────────────────────────┘
```

### 1. Inngest Background Workers
*   **Welcome Flow (`user/signed_up`):** Triggers on registration to send a welcome email and set up initial profile details.
*   **Profile Setup Reminder:** Schedules an automated reminder 48 hours after registration for users who haven't completed their profiles.
*   **Opportunity and Announcement Alerts:** Queries targeted student email addresses and schedules batched dispatches.

### 2. Manual On-Demand Dispatch
To allow admins to choose when notifications are sent, the system provides **Manual Dispatch Triggers**:
*   **Verification Indicators:** Renders an *"Email Alerts Dispatched"* badge on details pages once notifications are sent, or a *"Send Email Alerts"* button if the alert queue has not been run.
*   **Accidental Mail Protection:** Both manual actions are guarded by a premium UI modal (`SendAlertConfirmationModal`), preventing accidental notification blasts to thousands of students.

### 3. Stored Procedure Cardinality Patch
We patched `placement.get_eligible_subscribers` to handle selective targeting combinations:
```sql
AND (cardinality(p_branch_ids) = 0 OR u.branch_id = ANY(p_branch_ids))
AND (cardinality(p_batch_ids) = 0 OR u.batch_id = ANY(p_batch_ids))
```
*   **Why it Matters:** Allows announcements or jobs to target all branches of a specific batch (or all batches of a specific branch) without failing when one of the target arrays is empty.

---

## ⚡ Platform Performance & Optimization Policies

### 1. Lazy-Tab TanStack Query Optimization
On the student opportunities feed, the platform separated the tab query logic to improve page response times:
*   **Previous Behavior:** Navigating to `/jobs` triggered simultaneous API fetches for all listings, eligible matches, and active deadlines. This caused database connection spikes and slowed page loads.
*   **Optimized Behavior:** Queries are bound to the `activeTab` value:
    *   `allJobs` queries only run when the active tab is `all`.
    *   `feedJobs` queries only run when the active tab is `feed`.
*   **Refresh Scoping:** Clicking the page's refresh button only refetches the active tab's query context, cutting database and network load in half.

### 2. Double-Pass Chronological Sorting
To ensure students see relevant posts first, the `job.service.js` uses a double-pass sorting strategy:
*   **Active Opportunities:** Items with future deadlines are grouped and sorted by creation date (`created_at DESC`).
*   **Closed Opportunities:** Items with past deadlines are sorted and displayed below the active listings.
*   **Benefit:** Prioritizes active opportunities while keeping closed postings accessible as historical references.

### 3. Pagination Range Parsing Fix
Fixed a type coercion bug where backend page parameters from string queries were concatenated instead of added mathematically, causing incorrect row queries:
*   **Fix:** Enforced strict base-10 integer parsing (`parseInt(page, 10)`) at the controller level.
*   **Result:** Ensures the database processes range offsets correctly (e.g. `.range(10, 19)` instead of fetching thousands of rows), keeping response times fast as the database grows.

### 4. Chronological Backdating
The database RPC supports an optional `p_created_at` timestamp. This allows administrators to backdate postings, ensuring historical circular archives remain chronologically accurate.

---

## 🎨 Premium User Interface Design Decisions

### 1. Dark Mode Aesthetic
Avsaar features a premium, responsive dark interface inspired by glassmorphic design principles:
*   **harmonized Palette:** Uses deep charcoal backgrounds (`from-emerald-950/20 via-zinc-950 to-emerald-950/20`) combined with emerald green accents to create a cohesive, modern visual experience.
*   **Typography:** Google Fonts' *Outfit* serves as the primary font family, providing clean readability for dense data tables and markdown text.

### 2. Client Hydration Guards in Beta Banner
The cycler beta banner uses local storage to save its dismissal state across page reloads. To prevent React server-side rendering (SSR) mismatch errors during initialization, the component uses hydration state checks:
```tsx
const [isMounted, setIsMounted] = useState(false);
useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) return null; // Prevents SSR/Client mismatch
```
*   **Benefit:** Guarantees clean, error-free browser rendering while preserving the banner's visual state.

---

## 👥 Capabilities Matrix

| Action / Permission | Student | Volunteer | Admin | Backend Policy |
| :--- | :---: | :---: | :---: | :--- |
| **View Active Opportunities Feed** | ✅ | ✅ | ✅ | Session validation verified. |
| **Download Official PDF Circulars**| ✅ | ✅ | ✅ | Expiring download URL generation policy. |
| **Upload Resume PDF** | ✅ | ✅ | ✅ | Restricted to `resumes/{user_id}.pdf`. |
| **Post Opportunities & Announcements**| ❌ | ✅ | ✅ | Requires `roleGuard("admin", "volunteer")`. |
| **Approve / Reject Opportunities** | ❌ | ❌ | ✅ | Requires `roleGuard("admin")`. |
| **Promote / Demote User Roles** | ❌ | ❌ | ✅ | Requires `roleGuard("admin")`. |
| **Configure Academic Structures** | ❌ | ❌ | ✅ | Requires `roleGuard("admin")`. |
| **Audit Admin Logs** | ❌ | ❌ | ✅ | Requires `roleGuard("admin")`. |

---

## 🛠️ Development & Rationale Rules

1.  **Isolated Business Logic:** Keep business logic inside service classes. Controllers should remain thin wrappers that parse queries and construct responses.
2.  **Isolated Repository Queries:** Repositories should handle database interactions and RPC queries exclusively. Keep business rules and permission checks out of this layer.
3.  **Strict Schema Validation:** Use Zod schemas at the routing layer to validate all incoming data payloads before hitting controller logic.
4.  **Decoupled Async Work:** Offload heavy or time-consuming tasks (like email dispatches) to background workers using Inngest event triggers.
5.  **Audit Trail Compliance:** Every administrative mutation must log an entry in `placement.admin_logs` to maintain clear system accountability.
