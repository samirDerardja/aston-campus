-- Migration 20261109000001_initial_schema.sql
-- Plateforme Aston Campus - Schéma Initial PostgreSQL Supabase
-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Types Énumérés (ENUMs)
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('direction', 'coordinateur', 'formateur', 'admin_technique');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE promotion_status AS ENUM ('active', 'upcoming', 'completed', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE student_status AS ENUM ('active', 'resigned', 'interrupted', 'graduated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE interview_type AS ENUM ('apprenant_individuel', 'formateur_point', 'point_pedagogique', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'postponed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE action_status AS ENUM ('todo', 'in_progress', 'waiting', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE action_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE event_source_type AS ENUM ('nevea_readonly', 'aston_local');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'action_assigned', 'due_date_warning', 'action_overdue', 
    'interview_scheduled', 'meeting_upcoming', 'report_pending'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Tables Applicatives

-- 2.1 Profils & Rôles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code user_role_type UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id),
  UNIQUE(user_id, role_id)
);

-- 2.2 Référentiel Cursus & Promotions
CREATE TABLE IF NOT EXISTS cursus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  rncp_level TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cursus_id UUID NOT NULL REFERENCES cursus(id) ON DELETE RESTRICT,
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  coordinator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referent_trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status promotion_status DEFAULT 'active',
  nevea_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Apprenants & Formateurs
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company_name TEXT,
  company_tutor TEXT,
  nevea_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  status student_status DEFAULT 'active',
  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,
  exit_date DATE,
  UNIQUE(student_id, promotion_id)
);

CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  nevea_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainer_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  is_lead BOOLEAN DEFAULT FALSE,
  subject TEXT,
  assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(trainer_id, promotion_id, subject)
);

-- 2.4 Cours & Séances Planning
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cursus_id UUID REFERENCES cursus(id) ON DELETE SET NULL,
  nevea_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
  room TEXT,
  source_type event_source_type DEFAULT 'aston_local',
  is_readonly BOOLEAN DEFAULT FALSE,
  nevea_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Entretiens Pédagogiques & Comptes Rendus
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type interview_type NOT NULL,
  status interview_status DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ NOT NULL,
  conducted_at TIMESTAMPTZ,
  coordinator_id UUID NOT NULL REFERENCES profiles(id),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID UNIQUE NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  academic_progress TEXT,
  company_integration TEXT,
  difficulties_identified TEXT,
  recommendations TEXT,
  is_finalized BOOLEAN DEFAULT FALSE,
  finalized_at TIMESTAMPTZ,
  author_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Synchronisations Pédagogiques (Réunions)
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  agenda TEXT,
  status sync_status DEFAULT 'draft',
  next_meeting_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(meeting_id, user_id)
);

CREATE TABLE IF NOT EXISTS meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  decision TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Actions Correctives & Historique
CREATE TABLE IF NOT EXISTS action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  assignee_id UUID NOT NULL REFERENCES profiles(id),
  creator_id UUID NOT NULL REFERENCES profiles(id),
  priority action_priority DEFAULT 'medium',
  status action_status DEFAULT 'todo',
  due_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  result_summary TEXT,
  source_meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL,
  source_interview_id UUID REFERENCES interviews(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS action_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES action_items(id) ON DELETE CASCADE,
  previous_status action_status,
  new_status action_status NOT NULL,
  comment TEXT,
  changed_by UUID NOT NULL REFERENCES profiles(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Gestion Documentaire Sécurisée
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  can_download BOOLEAN DEFAULT TRUE,
  UNIQUE(document_id, user_id)
);

-- 2.9 Notifications & Préférences
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  email_urgent_only BOOLEAN DEFAULT TRUE,
  in_app_all BOOLEAN DEFAULT TRUE,
  reminder_days_before INT DEFAULT 2
);

-- 2.10 Traçabilité, Imports & Audit
CREATE TABLE IF NOT EXISTS external_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  internal_id UUID NOT NULL,
  external_system TEXT DEFAULT 'nevea',
  external_id TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, external_system, external_id)
);

CREATE TABLE IF NOT EXISTS import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  imported_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  rows_processed INT DEFAULT 0,
  rows_inserted INT DEFAULT 0,
  rows_updated INT DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_name TEXT DEFAULT 'nevea_direct',
  status TEXT NOT NULL,
  details JSONB,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  ip_address TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  payload_diff JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index d'Optimisation
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_coordinator ON promotions(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_promo ON enrollments(promotion_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_trainer ON trainer_assignments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_promo ON trainer_assignments(promotion_id);
CREATE INDEX IF NOT EXISTS idx_sessions_promo_time ON sessions(promotion_id, start_time);
CREATE INDEX IF NOT EXISTS idx_interviews_coordinator ON interviews(coordinator_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_actions_assignee_status ON action_items(assignee_id, status);
CREATE INDEX IF NOT EXISTS idx_actions_promotion ON action_items(promotion_id);
CREATE INDEX IF NOT EXISTS idx_actions_due_date ON action_items(due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at);

-- 4. Fonctions et Triggers de Protection & Audit

-- Règle Nevea : Rejeter formellement toute modification des sessions en lecture seule Nevea
CREATE OR REPLACE FUNCTION check_session_readonly()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.source_type = 'nevea_readonly' OR OLD.is_readonly = TRUE THEN
    RAISE EXCEPTION 'ASTON_ERR_READONLY: Les cours officiels synchronisés depuis Nevea sont strictement en lecture seule.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_nevea_sessions ON sessions;
CREATE TRIGGER trg_protect_nevea_sessions
BEFORE UPDATE OR DELETE ON sessions
FOR EACH ROW EXECUTE FUNCTION check_session_readonly();

-- Trigger automatique pour horodatage updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_promotions_updated_at ON promotions;
CREATE TRIGGER trg_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_action_items_updated_at ON action_items;
CREATE TRIGGER trg_action_items_updated_at BEFORE UPDATE ON action_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

