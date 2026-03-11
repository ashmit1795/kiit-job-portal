# KIIT Placement Portal – Project Context

This project is a backend system for a university placement portal built specifically for KIIT University.

The goal is to centralize placement opportunities that are currently shared in WhatsApp/Telegram groups.

---

# System Purpose

The Training & Placement cell shares circulars in chat groups.

Students often:

- miss opportunities
- forget deadlines
- lose circulars in chats

This portal aggregates those opportunities.

---

# Core Concepts

Jobs are not applied through the portal.

Instead the portal provides:

- opportunity discovery
- eligibility filtering
- deadline reminders
- centralized circular repository

---

# Roles

The system currently supports:

### Student
Default user role.

Capabilities:

- view approved jobs
- upload resume
- complete profile

---

### Volunteer

Students promoted by admins.

Capabilities:

- create jobs
- jobs require approval

---

### Admin

Capabilities:

- create jobs
- approve/reject volunteer jobs
- manage system

---

# Authentication

Authentication uses Supabase Auth.

Flow:

1. User logs in with Google
2. Only `@kiit.ac.in` emails allowed
3. Backend verifies token
4. Backend syncs user to database

---

# Profile Completion

Users must complete profile before using portal.

Required fields:

- `branch`
- `batch`
- `cgpa`
- `tenth_percentage`
- `twelfth_percentage`

This is enforced using: `profileGaurd` middleware.


---

# Job Model

Jobs represent placement opportunities.

Each job contains:

- `circular_number`
- `company_name`
- `role_title`
- `job_type`
- `stipend`
- `ctc`
- `min_cgpa`
- `deadline`
- `joining_date`
- `description`
- `circular_file_path`

---

# Job Eligibility

Jobs are mapped to:
- job_eligible_branches
- job_eligible_batches

This enables eligibility filtering.

---

# Circular Handling

Circulars are uploaded as PDFs.

- Storage: Supabase Storage
-bucket: `job-circulars`
-File path: `circulars/{circular_number}.pdf`


---

# Backend Architecture

Layered architecture.

`Controller → Service → Repository → Database`


---

# Important Design Decisions

### Circular number uniqueness

Jobs are unique by: `(circular_number, role_title)`

Because a single circular may contain multiple roles.

---

### Locations

Jobs can have multiple locations.

Stored in: `job_locations`


---

# Future Plans

### Job Feed

Students should see only jobs they are eligible for.

Filter conditions:

- branch match
- batch match
- cgpa eligibility
- approved jobs
- deadline not passed

---

### Reminder System

Students can set reminders before deadline.

---

### AI Circular Parsing

Future feature:

Automatically extract job details from circular PDFs.

---

# Development Guidelines

When modifying this system:

- keep business logic inside services
- keep repositories database-only
- avoid putting logic inside controllers
- keep responses normalized for frontend

---

# Technologies

- Backend:
    - Node.js  
    - Express.js  

- Database:
    - Supabase PostgreSQL

- Storage:
    - Supabase Storage

- Validation:
    - Zod

- File Upload:
    - Multer

- Frontend (Future)
    - React.js
    - Tailwind CSS
    - Axios
    - React Router

---

# Key Principle

This system is not a job application platform.

It is a **placement opportunity aggregator and reminder system**.

