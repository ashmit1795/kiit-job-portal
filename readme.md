# KIIT Placement Portal

A centralized platform for KIIT University students to track placement, internship, hackathon, and webinar opportunities shared by the Training & Placement (T&P) Cell.

Currently, most opportunities are shared via WhatsApp or Telegram groups, making them scattered and easy to miss. This platform solves that problem by aggregating all opportunities in a structured portal with reminders and eligibility filtering.

---

# Problem Statement

The KIIT Training & Placement Cell shares job circulars through messaging groups.

Problems with the current system:

• Circulars get lost in chats  
• Students miss deadlines  
• Eligibility filtering is manual  
• No centralized record of opportunities  

This portal solves these issues by providing a **centralized placement opportunity feed**.

---

# Core Features (MVP)

### Authentication
- Google OAuth using Supabase Auth
- Only `@kiit.ac.in` emails allowed
- Automatic user sync with backend database

### User Profiles
Students must complete profile with:

- Branch
- Batch
- CGPA
- 10th percentage
- 12th percentage
- Resume upload

Profile completion enforced before accessing core features.

---

### Job Posting

Jobs can be created by:

- **Admins**
- **Volunteers**

Rules:

| Role | Behavior |
|-----|------|
Admin | Job auto-approved |
Volunteer | Requires admin approval |

---

### Job Types

Supported opportunity types:

- Placement
- Internship
- Internship + Fulltime
- Hackathon
- Webinar

---

### Job Information Stored

Each job contains:

- Circular number
- Company name
- Role title
- Job type
- Stipend / CTC
- Minimum CGPA
- Deadline
- Joining date
- Job locations
- Eligible branches
- Eligible batches
- Circular PDF

Circular PDF is uploaded to **Supabase Storage**.

---

### Eligibility Filtering

Jobs are mapped to:

- Eligible branches
- Eligible batches

This allows future implementation of a **personalized job feed**.

---

### Circular Storage

Circular PDFs are stored in:
- Supabase Storage
- bucket: `job-circulars`
- path: `circulars/{circular_number}.pdf`


---

# Tech Stack

### Backend

- Node.js
- Express.js

### Database

- Supabase PostgreSQL
- Supabase Storage

### Authentication

- Supabase Auth
- Google OAuth

### Validation
- Zod

### File Upload
- Multer

### Frontend (Future)
- React.js
- Tailwind CSS
- Axios
- React Router

---

# Architecture

Backend follows a **layered architecture**

Controller
----↓----
Service
----↓----
Repository
----↓----
Database


---

### Controllers

Handle:

- HTTP requests
- responses
- validation middleware

---

### Services

Contain business logic such as:

- job approval rules
- circular upload
- profile completion

---

### Repositories

Responsible for:

- database queries
- RPC calls
- Supabase interaction

---

# Database Design

Key tables:
- `users`
- `branches`
- `batches`
- `programs`
- `jobs`
- `job_locations`
- `job_eligible_branches`
- `job_eligible_batches`

---

### Job Relations

`jobs`
├── `job_eligible_branches`
├── `job_eligible_batches`
└── `job_locations`

---

### Job Circular Uniqueness

Jobs are uniquely identified using:

`(circular_number, role_title)`

This allows:

Example:

- Circular: KIIT-DU/T&P/26/210

- Roles:
  - SDE
  - Data Analyst

# Authentication Flow

1. User logs in with Google
2. Supabase creates auth user
3. Frontend receives access token
4. Frontend calls backend with: `Authorization: Bearer <token>`
5. Backend verifies token using Supabase
6. Backend syncs user into `placement.users`

# Storage Buckets

### Resume Upload

bucket: `resumes`

path: `resumes/{userld}.pdf`

### Job Circulars

bucket: `job-circulars`
path: `circulars/{circular_number}.pdf`

---

# Current Modules Implemented

- health
- academics
- users
- jobs

# APIs Implemented

### Auth

GET `/api/auth/me`

### Profile

POST `/api/profile/complete`
PATCH `/api/profile/update`
POST `/api/profile/resume`
GET `/api/profile/resume`

### Jobs

POST `/api/jobs`
GET `/api/jobs`
GET `/api/jobs/:id`
PATCH `/api/jobs/:id/approve`
PATCH `/api/jobs/:id/reject`

---

# Security

- Role-based access control
- Profile completion guard
- Domain-restricted login
- Centralized error handling

---

# Current Status

Backend core features are implemented.

Working components:

✅ Google OAuth
✅ User sync
✅ Profile system
✅ Resume upload
✅ Job creation
✅ Job approval flow
✅ Circular upload
✅ Eligibility mapping

---

# Next Steps



### 1️⃣ Job Feed Logic
Implement personalized job feed:
GET `/jobs/feed`

Filter by:

- branch
- batch
- cgpa
- approval_status
- deadline

### 2️⃣ Deadline Reminder System

Students should be able to:

- subscribe to jobs
- receive reminder alerts before deadline

Possible implementation:

- background cron
- notification queue

### 3️⃣ Volunteer Management

Admin should be able to:

`promote student -> volunteer`



### 4️⃣ Admin Dashboard

Features:
- pending job approvals
- job analytics
- volunteer management

### 5️⃣ Frontend

Build UI:

- job feed
- job details
- circular viewer
- profile dashboard

### 6️⃣ AI Circular Parsing (Future)

Use LLM to extract from circular:

- company
- role
- stipend
- CGPA
- deadline

Autofill job creation form.

---
Crafting with ❤️ by **Team UdaanX🚀**

