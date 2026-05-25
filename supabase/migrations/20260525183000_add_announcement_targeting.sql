-- 1. Create junction table for standalone announcement branch targets
CREATE TABLE IF NOT EXISTS placement.announcement_eligible_branches (
    announcement_id uuid REFERENCES placement.job_announcements(id) ON DELETE CASCADE,
    branch_id uuid REFERENCES placement.branches(id) ON DELETE CASCADE,
    PRIMARY KEY (announcement_id, branch_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_branches_announcement_id 
ON placement.announcement_eligible_branches(announcement_id);

-- 2. Create junction table for standalone announcement batch targets
CREATE TABLE IF NOT EXISTS placement.announcement_eligible_batches (
    announcement_id uuid REFERENCES placement.job_announcements(id) ON DELETE CASCADE,
    batch_id uuid REFERENCES placement.batches(id) ON DELETE CASCADE,
    PRIMARY KEY (announcement_id, batch_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_batches_announcement_id 
ON placement.announcement_eligible_batches(announcement_id);

-- 3. High-performance filtering function for the student's feed
CREATE OR REPLACE FUNCTION placement.get_announcement_feed(
    p_branch_id uuid,
    p_batch_id uuid
)
RETURNS TABLE (
    id uuid,
    subject text,
    description text,
    job_id uuid,
    circular_file_path text,
    circular_number text,
    announcement_type placement.announcement_type,
    is_pinned boolean,
    announcement_priority integer,
    created_by uuid,
    created_at timestamptz,
    updated_at timestamptz,
    alert_sent boolean,
    created_by_user jsonb,
    job jsonb,
    eligible_branches jsonb,
    eligible_batches jsonb
)
LANGUAGE sql STABLE AS $$
SELECT 
    a.id,
    a.subject,
    a.description,
    a.job_id,
    a.circular_file_path,
    a.circular_number,
    a.announcement_type,
    a.is_pinned,
    a.announcement_priority,
    a.created_by,
    a.created_at,
    a.updated_at,
    a.alert_sent,
    
    -- Populate creator info
    (
        SELECT jsonb_build_object(
            'id', u.id,
            'full_name', u.full_name,
            'avatar_url', u.avatar_url,
            'role', u.role
        )
        FROM placement.users u
        WHERE u.id = a.created_by
    ) AS created_by_user,
    
    -- Populate linked job info
    (
        SELECT jsonb_build_object(
            'id', j.id,
            'company_name', j.company_name,
            'role_title', j.role_title,
            'circular_number', j.circular_number
        )
        FROM placement.jobs j
        WHERE j.id = a.job_id
    ) AS job,

    -- Populate standalone eligible branches
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', br.id,
                'code', br.code,
                'name', br.name
            )
        )
        FROM placement.announcement_eligible_branches aeb
        JOIN placement.branches br ON br.id = aeb.branch_id
        WHERE aeb.announcement_id = a.id
    ) AS eligible_branches,

    -- Populate standalone eligible batches
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', b.id,
                'year', b.year
            )
        )
        FROM placement.announcement_eligible_batches aebb
        JOIN placement.batches b ON b.id = aebb.batch_id
        WHERE aebb.announcement_id = a.id
    ) AS eligible_batches

FROM placement.job_announcements a
LEFT JOIN placement.jobs j ON j.id = a.job_id
WHERE a.is_active = true
  AND (
      -- CASE 1: Linked to a Job (inherits job eligibility)
      (a.job_id IS NOT NULL 
       AND j.is_active = true 
       AND j.approval_status = 'approved'
       AND EXISTS (
           SELECT 1 FROM placement.job_eligible_branches jeb
           WHERE jeb.job_id = j.id
             AND (jeb.branch_id = p_branch_id OR jeb.branch_id IN (
                 SELECT id FROM placement.branches 
                 WHERE code = 'ALL' 
                   AND program_id = (
                       SELECT program_id FROM placement.branches WHERE id = p_branch_id LIMIT 1
                   )
             ))
       )
       AND EXISTS (
           SELECT 1 FROM placement.job_eligible_batches jbt
           WHERE jbt.job_id = j.id AND jbt.batch_id = p_batch_id
       )
      )
      OR
      -- CASE 2: Standalone Announcement
      (a.job_id IS NULL
       AND (
           -- Truly Global (no branch AND no batch targeting specified)
           (NOT EXISTS (SELECT 1 FROM placement.announcement_eligible_branches aeb WHERE aeb.announcement_id = a.id)
            AND NOT EXISTS (SELECT 1 FROM placement.announcement_eligible_batches abb WHERE abb.announcement_id = a.id))
           OR
           -- Targeted Standalone
           (
               (NOT EXISTS (SELECT 1 FROM placement.announcement_eligible_branches aeb WHERE aeb.announcement_id = a.id)
                OR EXISTS (
                    SELECT 1 FROM placement.announcement_eligible_branches aeb
                    WHERE aeb.announcement_id = a.id
                      AND (aeb.branch_id = p_branch_id OR aeb.branch_id IN (
                          SELECT id FROM placement.branches 
                          WHERE code = 'ALL' 
                            AND program_id = (
                                SELECT program_id FROM placement.branches WHERE id = p_branch_id LIMIT 1
                            )
                      ))
                ))
               AND
               (NOT EXISTS (SELECT 1 FROM placement.announcement_eligible_batches abb WHERE abb.announcement_id = a.id)
                OR EXISTS (
                    SELECT 1 FROM placement.announcement_eligible_batches abb
                    WHERE abb.announcement_id = a.id AND abb.batch_id = p_batch_id
                ))
           )
       )
      )
  );
$$;
