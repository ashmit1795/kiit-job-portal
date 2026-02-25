# 📌 PROJECT CONTEXT DOCUMENT

## KIIT Placement Portal (Student-Driven)

---

# 1️⃣ PROJECT IDENTITY

**Name (Working):** KIIT Placement Portal
**Type:** Web Application
**Scope:** KIIT University Only
**Users:** KIIT students + approved volunteers + admins
**Phase:** MVP → Scalable SaaS-grade Architecture

This is NOT:

* A social media platform
* A general job portal
* A multi-college system (for now)

It is a **structured placement intelligence system** for KIIT.

---

# 2️⃣ CORE PROBLEM STATEMENT

Currently:

* Placement circulars are posted in WhatsApp/Telegram
* Students miss deadlines
* No centralized tracking
* No structured eligibility filtering
* No reminder automation

We are solving:

> Centralization + Eligibility Filtering + Deadline Reminders + Structured Volunteer Posting

---

# 3️⃣ PRODUCT PRINCIPLES

All future design decisions must follow these rules:

### 🔹 1. Academic Database Perfection

* Fully normalized schema
* Strict referential integrity
* ENUM usage for domain control
* Composite uniqueness constraints
* No free-text inconsistencies

### 🔹 2. Backend Controls Business Logic

Frontend never talks directly to DB.

All:

* Eligibility filtering
* Role enforcement
* Volunteer validation
* Reminder scheduling
* Approval logic

Must pass through backend.

### 🔹 3. Strong Separation of Concerns

Frontend:

* UI
* Authentication session handling
* User interaction

Backend:

* Business rules
* DB interaction
* Workflow triggering
* Role validation

Supabase:

* Auth provider
* PostgreSQL DB
* Storage only

Inngest:

* Event-driven async system
* Reminder scheduling
* Workflow management

### 🔹 4. Security First

* Only `@kiit.ac.in` login allowed
* Role-based access control
* No trust in frontend role
* JWT verification in backend
* No direct DB exposure


### 🔹 5. Scalable by Design

System must support:

* 10,000+ students
* 500+ jobs per semester
* Thousands of reminders
* High concurrent reads

Architecture must avoid:

* N+1 queries
* Redundant joins
* Unindexed filtering

---

# 4️⃣ TECH STACK (FINALIZED)

Frontend:

* Next.js
* Tailwind CSS

Backend:

* Node.js
* Express

Database:

* Supabase PostgreSQL

Auth:

* Supabase Google OAuth
* Domain restricted to @kiit.ac.in

Async Workflow:

* Inngest

Deployment:

* Frontend → Vercel
* Backend → AWS / Render

Monorepo:

* Yes

Language:

* JavaScript (strict structure, potential TS migration later)


# 5️⃣ USER ROLES (Strict Hierarchy)

### 🔹 1. Student

* View eligible jobs
* Set reminders

### 🔹 2. Volunteer

* Post jobs
* Only for assigned branch + batch
* Cannot self-approve

### 🔹 3. Admin

* Approve/reject jobs
* Manage volunteers
* Full system control

No other roles exist in MVP.

---

# 6️⃣ DATA MODEL CONTRACT

Entities:

* users
* branches
* batches
* jobs
* job_eligibility
* reminders
* volunteer_permissions

Design rules:

* No arrays in relational columns
* All foreign keys enforced
* ENUM types used for controlled domains
* Composite uniqueness constraints applied
* ON DELETE behavior explicitly defined

System is in 3NF.

---

# 7️⃣ AUTHENTICATION FLOW (FINAL)

1. User logs in via Supabase Google OAuth
2. Supabase validates identity
3. Backend verifies Supabase JWT
4. Backend checks:

   * Domain restriction
   * User existence
   * Role
5. If first login:

   * Force profile completion (roll no, branch, batch, cgpa)

Backend never trusts frontend role value.

---

# 8️⃣ ELIGIBILITY ENGINE PRINCIPLE

Eligibility depends on:

* branch_id
* batch_id
* min_cgpa
* approval_status
* deadline
* is_active

Eligibility query must always include:

* approval_status = 'approved'
* is_active = true
* deadline > NOW()

No job shown otherwise.

---

# 9️⃣ REMINDER SYSTEM PRINCIPLE

When user sets reminder:

* Backend validates job eligibility
* Backend creates reminder rows
* Backend emits Inngest event

Inngest:

* Schedules 48h, 24h, 3h triggers
* Sends email via Nodemailer
* Marks email_sent = true
* Handles retries safely

If:

* Job deadline changes → reschedule
* Job deactivated → cancel reminders

Reminders must be idempotent.

---

# 🔟 VOLUNTEER PERMISSION RULES

Volunteer can post job ONLY if:

EXISTS (
volunteer_permissions
WHERE user_id = current_user
AND branch_id IN job_eligibility
AND batch_id IN job_eligibility
)

This must be validated in backend.

---

# 1️⃣1️⃣ WHAT THIS SYSTEM IS NOT (Important)

* Not real-time chat system
* Not social discussion forum
* Not resume builder
* Not company review platform
* Not AI suggestion engine (yet)

We build core first.

---

# 1️⃣2️⃣ FUTURE EXTENSION READINESS

Schema supports:

* Application tracking (can add later)
* Company history
* Analytics dashboards
* Multi-college expansion
* Mobile app
* Notification channels (SMS/WhatsApp)

Without restructuring DB.

---

# 1️⃣3️⃣ DEVELOPMENT PHILOSOPHY

We optimize for:

* Clean architecture
* Long-term maintainability
* Clear modular separation
* Professional-grade backend patterns
* Resume-quality engineering

We do NOT optimize for:

* Quick hacks
* Overengineering
* Unnecessary microservices

---

# 1️⃣4️⃣ MY INTERNAL OPERATING RULES FOR THIS PROJECT

From now on:

When you ask anything related to this portal, I will:

1. Think in relational database first
2. Respect normalization decisions
3. Enforce role-based backend logic
4. Avoid shortcuts that break integrity
5. Keep scalability in mind
6. Keep architecture professional

I will not:

* Suggest direct frontend-to-Supabase writes
* Suggest breaking normalization
* Suggest skipping constraints for speed

---

# 🏁 PROJECT STATE

Architecture: Defined
Database Schema: Academically Strong
Tech Stack: Finalized
Scope: Controlled MVP
System Philosophy: Professional


