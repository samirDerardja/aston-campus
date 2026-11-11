-- ==============================================================================
-- Migration: 20261111000004_attendance_alerts_and_partners.sql
-- Plateforme: Aston Campus
-- Objectifs:
--   1. Suivi en temps réel des apprenants : retards, absentéisme, alertes critiques.
--   2. Modélisation des alertes automatisées après import de l'export Nevea.
--   3. Partenaires entreprises historiques (Helpline, XEFI) & rythme alternance 1s/3s.
--   4. Formateurs référents officiels (Mourad, Christelle, Mehdi) et rattachement d'équipe.
-- ==============================================================================

-- 1. Table des Partenaires Entreprises Clés (ESN)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'ESN Partenaire Historique',
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des partenaires clés
INSERT INTO partners (id, code, name, type, notes) VALUES
('55555555-0000-0000-0000-000000000001', 'HELPLINE', 'Helpline', 'ESN Partenaire Historique', 'Partenaire historique Aston - Promotions dédiées avec prise en charge alternance directe'),
('55555555-0000-0000-0000-000000000002', 'XEFI', 'XEFI', 'Partenaire Informatique & Services', 'Partenaire IT réseau et infogérance - Promotion dédiée XEFI'),
('55555555-0000-0000-0000-000000000003', 'CAPGEMINI', 'Capgemini', 'ESN Partenaire', 'Pôle Développement & Architecture Cloud'),
('55555555-0000-0000-0000-000000000004', 'SOPRA', 'Sopra Steria', 'ESN Partenaire', 'Pôle Systèmes d''information & Cybersécurité')
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  notes = EXCLUDED.notes;

-- 2. Formateurs Référents Officiels (Mourad, Christelle, Mehdi)
-- Ajout de la hiérarchie de formateurs (formateur référent chapeautant d'autres formateurs)
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS lead_trainer_id UUID REFERENCES trainers(id);
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS is_lead BOOLEAN DEFAULT FALSE;
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS pole_specialty TEXT;

-- Création des profils pour Mourad, Christelle, Mehdi s'ils n'existent pas
INSERT INTO profiles (id, email, first_name, last_name, phone) VALUES
('aaaaaaaa-0000-0000-0000-000000000010', 'mourad.referent@aston.fr', 'Mourad', 'Référent', '+33 6 11 22 33 44'),
('aaaaaaaa-0000-0000-0000-000000000011', 'christelle.referente@aston.fr', 'Christelle', 'Référente', '+33 6 22 33 44 55'),
('aaaaaaaa-0000-0000-0000-000000000012', 'mehdi.referent@aston.fr', 'Mehdi', 'Référent', '+33 6 33 44 55 66')
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- Attribution du rôle formateur
INSERT INTO user_roles (user_id, role_id)
SELECT p.id, r.id FROM profiles p, roles r
WHERE p.email IN ('mourad.referent@aston.fr', 'christelle.referente@aston.fr', 'mehdi.referent@aston.fr')
  AND r.code = 'formateur'
ON CONFLICT DO NOTHING;

-- Enregistrement dans la table des formateurs avec pôle de référence
INSERT INTO trainers (id, specialties, is_lead, pole_specialty) VALUES
('aaaaaaaa-0000-0000-0000-000000000010', ARRAY['Helpline', 'Support Utilisateur', 'Helpdesk N2', 'ITSM'], TRUE, 'Pôle ESN Helpline & Partenaires'),
('aaaaaaaa-0000-0000-0000-000000000011', ARRAY['TSAS', 'Systèmes & Réseaux', 'Linux', 'Virtualisation'], TRUE, 'Pôle Systèmes & TSAS'),
('aaaaaaaa-0000-0000-0000-000000000012', ARRAY['ESD', 'Cybersécurité', 'Pentest', 'Gouvernance Sécurité'], TRUE, 'Pôle Sécurité Digitale & ESD')
ON CONFLICT (id) DO UPDATE SET
  specialties = EXCLUDED.specialties,
  is_lead = EXCLUDED.is_lead,
  pole_specialty = EXCLUDED.pole_specialty;

-- 3. Mise à jour de la table `promotions` avec rattachement Partenaire & Rythme 1s/3s
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES partners(id);
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS schedule_pace TEXT DEFAULT '1 sem. école / 3 sem. entreprise';

-- Insertion / Mise à jour des promotions du planning officiel
-- Helpline 40
INSERT INTO promotions (id, code, name, cursus_id, academic_year, start_date, end_date, coordinator_id, referent_trainer_id, partner_id, status, schedule_pace) VALUES
('33333333-0000-0000-0000-000000000010', 'HELPLINE-40', 'Helpline 40', '22222222-0000-0000-0000-000000000001', '2025-2026', '2025-11-17', '2026-10-23', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000001', 'active', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000011', 'HELPLINE-42', 'Helpline 42', '22222222-0000-0000-0000-000000000001', '2026-2027', '2026-04-13', '2027-03-26', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000001', 'upcoming', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000012', 'HELPLINE-43', 'Helpline 43', '22222222-0000-0000-0000-000000000001', '2026-2027', '2026-11-16', '2027-11-05', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000010', '55555555-0000-0000-0000-000000000001', 'upcoming', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000013', 'XEFI-01', 'Promotion XEFI', '22222222-0000-0000-0000-000000000002', '2025-2027', '2025-09-01', '2027-10-29', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000011', '55555555-0000-0000-0000-000000000002', 'active', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000014', 'TSRS61', 'TSRS 61', '22222222-0000-0000-0000-000000000002', '2025-2027', '2025-09-22', '2027-08-27', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000011', NULL, 'active', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000015', 'TSAS-09', 'TSAS 09', '22222222-0000-0000-0000-000000000002', '2025-2026', '2025-10-27', '2026-12-04', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000011', NULL, 'active', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000016', 'ESD56', 'ESD 56', '22222222-0000-0000-0000-000000000006', '2025-2026', '2025-09-29', '2026-10-30', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000012', NULL, 'active', '1 sem. école / 3 sem. entreprise'),
('33333333-0000-0000-0000-000000000017', 'ESD57', 'ESD 57', '22222222-0000-0000-0000-000000000006', '2026-2027', '2026-05-04', '2027-07-02', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000012', NULL, 'upcoming', '1 sem. école / 3 sem. entreprise')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  cursus_id = EXCLUDED.cursus_id,
  referent_trainer_id = EXCLUDED.referent_trainer_id,
  partner_id = EXCLUDED.partner_id,
  schedule_pace = EXCLUDED.schedule_pace;

-- 4. Table des Présences et Émargements (Alimentée par l'export Nevea)
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  period TEXT DEFAULT 'journee' CHECK (period IN ('matin', 'apres_midi', 'journee')),
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  late_minutes INTEGER DEFAULT 0,
  justified BOOLEAN DEFAULT FALSE,
  justification_reason TEXT,
  justification_document_url TEXT,
  raw_import_source TEXT DEFAULT 'export_nevea_csv',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date, period)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);

-- 5. Table des Alertes Détectées en Temps Réel
CREATE TABLE IF NOT EXISTS student_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'absence_repetition',    -- Absences répétées (ex: >= 2 dans le mois)
    'retard_repetition',     -- Retards répétés (ex: >= 3 retards)
    'absence_longue',        -- Longue absence consécutive (>= 3 jours)
    'justificatif_manquant', -- Absence non justifiée sous 48h
    'decrochage_general'     -- Taux assiduité global < 80%
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed')),
  action_id UUID REFERENCES action_items(id) ON DELETE SET NULL,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_alerts_student ON student_alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON student_alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON student_alerts(severity);

-- RLS sur les tables d'assiduité et alertes
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_alerts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Lecture ouverte authentifiée partners" ON partners FOR SELECT USING (true);
  CREATE POLICY "Lecture ouverte authentifiée attendance" ON attendance_records FOR SELECT USING (true);
  CREATE POLICY "Lecture ouverte authentifiée alerts" ON student_alerts FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN null;
END $$;

-- 6. Insertion d'exemples réalistes d'alertes en temps réel
INSERT INTO student_alerts (student_id, promotion_id, type, severity, title, description, status) VALUES
(
  '44444444-0000-0000-0000-000000000001',
  '33333333-0000-0000-0000-000000000010',
  'retard_repetition',
  'high',
  'Retards répétés : Alexandre M. (Helpline 40)',
  '4 retards enregistrés sur la semaine de cours en centre (cumul 85 min). Contacter le tuteur Helpline.',
  'open'
),
(
  '44444444-0000-0000-0000-000000000002',
  '33333333-0000-0000-0000-000000000013',
  'absence_repetition',
  'critical',
  'Absences répétées non justifiées : Camille G. (XEFI)',
  '3 demi-journées d''absence consécutives sans arrêt de travail ni justificatif sous 48h. Risque rupture contrat.',
  'open'
),
(
  '44444444-0000-0000-0000-000000000003',
  '33333333-0000-0000-0000-000000000016',
  'justificatif_manquant',
  'medium',
  'Justificatif manquant : Youssef B. (ESD 56)',
  'Absence du mardi 10 nov. déclarée pour motif médical mais certificat employeur non transmis.',
  'open'
),
(
  '44444444-0000-0000-0000-000000000004',
  '33333333-0000-0000-0000-000000000014',
  'decrochage_general',
  'high',
  'Alerte assiduité sous le seuil Qualiopi (74%) : Emma D. (TSRS 61)',
  'Baisse continue de la présence sur les deux dernières sessions. Entretien de recadrage recommandé.',
  'in_progress'
)
ON CONFLICT DO NOTHING;

