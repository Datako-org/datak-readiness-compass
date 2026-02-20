-- Migration: Add CRM fields to diagnostics table
ALTER TABLE diagnostics
  ADD COLUMN IF NOT EXISTS crm_status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS internal_notes text;

-- Optional constraint for valid values (uncomment if desired)
-- ALTER TABLE diagnostics
--   ADD CONSTRAINT diagnostics_crm_status_check
--   CHECK (crm_status IN ('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'won', 'lost'));
