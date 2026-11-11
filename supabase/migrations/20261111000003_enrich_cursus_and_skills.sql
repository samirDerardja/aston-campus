-- ==============================================================================
-- Migration: 20261111000003_enrich_cursus_and_skills.sql
-- Plateforme: Aston Campus (École d'informatique)
-- Objectif: Enrichissement structurel des cursus académiques (heures, jours, RNCP,
--           statut "gelé / prochainement", tags) et normalisation des Blocs de compétences.
-- Réduction de la dette technique: Modélisation 3NF, indexation, contraintes CHECK et vues agrégées.
-- ==============================================================================

-- 1. Évolution de la table `cursus` avec colonnes analytiques
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS short_name TEXT;
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Cursus Diplômant';
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS modality TEXT DEFAULT 'Alternance';
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS total_hours INTEGER DEFAULT 0;
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS total_days INTEGER DEFAULT 0;
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE cursus ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Contrainte de validation sur le statut du cursus
DO $$ BEGIN
  ALTER TABLE cursus DROP CONSTRAINT IF EXISTS chk_cursus_status;
  ALTER TABLE cursus ADD CONSTRAINT chk_cursus_status CHECK (status IN ('active', 'upcoming', 'frozen', 'archived'));
EXCEPTION WHEN OTHERS THEN null;
END $$;

-- 2. Création de la table normalisée des Blocs de Compétences (France Compétences / RNCP)
CREATE TABLE IF NOT EXISTS cursus_skill_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cursus_id UUID NOT NULL REFERENCES cursus(id) ON DELETE CASCADE,
  block_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cursus_id, block_number)
);

-- Index pour accélérer les jointures pédagogiques
CREATE INDEX IF NOT EXISTS idx_cursus_skill_blocks_cursus_id ON cursus_skill_blocks(cursus_id);
CREATE INDEX IF NOT EXISTS idx_cursus_status ON cursus(status);

-- Activation de Row Level Security (RLS)
ALTER TABLE cursus_skill_blocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Lecture accessible à tous les profils authentifiés" ON cursus_skill_blocks;
  CREATE POLICY "Lecture accessible à tous les profils authentifiés" 
    ON cursus_skill_blocks FOR SELECT 
    USING (true);
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Service role bypass complet" ON cursus_skill_blocks;
  CREATE POLICY "Service role bypass complet" 
    ON cursus_skill_blocks FOR ALL 
    USING (auth.jwt()->>'role' = 'service_role' OR auth.role() = 'service_role');
EXCEPTION WHEN OTHERS THEN null;
END $$;

-- 3. Mise à jour des 7 Cursus Officiels d'Aston Informatique
-- 3.1 Technicien Support en Numérique (TSN)
UPDATE cursus SET
  short_name = 'Technicien Support',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 4 (Bac)',
  total_hours = 420,
  total_days = 60,
  status = 'active',
  description = 'Le cursus de Technicien support en numérique a pour objectif de vous permettre d''acquérir l''ensemble des compétences nécessaires pour assurer le support des utilisateurs en assurant l''installation et le support technique d''équipement numérique, ainsi que la mise en fonction de logiciels.',
  tags = ARRAY['#Support', '#Helpdesk', '#Hardware', '#AssistanceUtilisateurs'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000001' OR code = 'TSN';

-- 3.2 Technicien Systèmes Réseaux & Sécurité (TSRS)
UPDATE cursus SET
  short_name = 'TSRS',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 5 (Bac+2)',
  total_hours = 910,
  total_days = 130,
  status = 'active',
  description = 'Le titulaire du titre est acteur principal quant à la formation des utilisateurs sur l''ensemble de leur poste de travail et sur les risques engendrés dans un environnement connecté. Pour ce faire, il doit disposer de solides compétences techniques dans son domaine, ainsi que d''un bon relationnel.',
  tags = ARRAY['#Déploiement', '#Installation', '#Configuration', '#Sécurisation', '#Scripting'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000002' OR code = 'TSRS';

-- 3.3 BTS CIEL Cybersécurité, Informatique, Électronique
UPDATE cursus SET
  short_name = 'BTS CIEL',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 5 (Bac+2)',
  total_hours = 1351,
  total_days = 219,
  status = 'active',
  description = 'Vous souhaitez participer au déploiement de l''industrie 4.0, en intervenant sur les réseaux, la cybersécurité et la valorisation des données ? Les métiers de l''informatique, des réseaux et de l''électronique se déploient aujourd''hui dans la plupart des secteurs d''activité.',
  tags = ARRAY['#BTS', '#CIEL', '#Cybersécurité', '#Informatique'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000003' OR code = 'BTS-CIEL';

-- 3.4 Product Builder No Code Low Code (GELÉ / PROCHAINEMENT)
UPDATE cursus SET
  short_name = 'Product Builder',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 6 (Bac+3/4)',
  total_hours = 402,
  total_days = 58,
  status = 'upcoming', -- Marqué Prochainement / Gelé pour révision pédagogique annuelle
  description = 'Le Product Builder No Code / Low Code conçoit des applications, des outils digitaux et des automatisations pour répondre aux besoins des entreprises, sans développement informatique traditionnel. (Programme actuellement gelé et en révision pédagogique pour la prochaine rentrée).',
  tags = ARRAY['#NoCode', '#LowCode', '#ProductBuilder', '#Automatisation', '#InnovationDigitale'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000004' OR code = 'PBNCLC' OR code = 'PB-NCLC';

-- 3.5 Administrateur Systèmes, Réseaux et Bases de Données (ASRBD)
UPDATE cursus SET
  short_name = 'Admin Systèmes & BD',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 6 (Bac+3/4)',
  total_hours = 910,
  total_days = 130,
  status = 'active',
  description = 'Les compétences acquises au cours de la formation: administrer le système d''information, gérer les systèmes d''information et définir la politique de sécurisation du système d''information.',
  tags = ARRAY['#Architecture', '#Cloud', '#SI', '#Basesdedonnées', '#Infrastructure'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000005' OR code = 'ASRBD';

-- 3.6 Expert en Sécurité Digitale (ESD)
UPDATE cursus SET
  short_name = 'Expert Sécurité Digitale',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 7 - Mastère II',
  total_hours = 560,
  total_days = 80,
  status = 'active',
  description = 'Les compétences développées lors de la formation: prévenir et anticiper les menaces cyber, auditer la sécurité du SI, analyser et sécuriser le SI après cyber-attaque, et piloter la sécurité organisationnelle.',
  tags = ARRAY['#Cybersécurité', '#Cyberdéfense'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000006' OR code = 'ESD';

-- 3.7 Directeur de Projets Informatique (DPI)
UPDATE cursus SET
  short_name = 'Directeur de Projets',
  type = 'Cursus Diplômant',
  modality = 'Alternance',
  rncp_level = 'Titre RNCP Niveau 7 - Mastère II',
  total_hours = 490,
  total_days = 70,
  status = 'active',
  description = 'Le cursus de Directeur de projets informatique a pour objectif de vous faire acquérir les compétences de gouvernance des projets, pilotage des ressources, management des risques, processus qualité et communication parties prenantes.',
  tags = ARRAY['#Digital', '#Agilité', '#UX/UI', '#DesignThinking', '#Chefferie de Projet'],
  updated_at = NOW()
WHERE id = '22222222-0000-0000-0000-000000000007' OR code = 'DPI';

-- 4. Insertion des Blocs de Compétences Officiels
DELETE FROM cursus_skill_blocks;

-- TSN
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000001', 1, 'BLOC 1 - Assistance utilisateurs', 'Assurer l''assistance auprès des utilisateurs des équipements numériques et logiciels associés'),
('22222222-0000-0000-0000-000000000001', 2, 'BLOC 2 - Déploiement matériels', 'Déploiement de matériels numériques et logiciels associés'),
('22222222-0000-0000-0000-000000000001', 3, 'BLOC 3 - Exploitation équipements', 'Exploitation d''équipements numériques et logiciels associés');

-- TSRS
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000002', 1, 'BLOC 1 - Déploiement matériels & réseau', 'Déployer les matériels, les systèmes et le réseau'),
('22222222-0000-0000-0000-000000000002', 2, 'BLOC 2 - Administration serveurs', 'Administrer des serveurs hétérogènes et un réseau multi-sites'),
('22222222-0000-0000-0000-000000000002', 3, 'BLOC 3 - Sécurisation environnement', 'Sécuriser l''environnement numérique d''exploitation'),
('22222222-0000-0000-0000-000000000002', 4, 'BLOC 4 - Entretien parc informatique', 'Entretenir un parc informatique et diagnostiquer les pannes matérielles/logicielles'),
('22222222-0000-0000-0000-000000000002', 5, 'BLOC 5 - Support technique utilisateurs', 'Assurer le support technique auprès des utilisateurs et rédiger les procédures');

-- BTS CIEL
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000003', 1, 'BLOC 1 - Étude et conception réseaux', 'Étude et conception de réseaux informatiques et architectures distribuées'),
('22222222-0000-0000-0000-000000000003', 2, 'BLOC 2 - Exploitation et maintenance', 'Exploitation et maintenance de réseaux informatiques'),
('22222222-0000-0000-0000-000000000003', 3, 'BLOC 3 - Valorisation données & cybersécurité', 'Valorisation de la donnée et cybersécurité');

-- Product Builder (Programme gelé / Prochainement)
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000004', 1, 'BLOC 1 - Cadrage & pilotage No Code', 'Cadrer et piloter les projets de développement No code / Low Code'),
('22222222-0000-0000-0000-000000000004', 2, 'BLOC 2 - Développement & intégration', 'Développer et intégrer des applications No code et automatiser les flux métiers'),
('22222222-0000-0000-0000-000000000004', 3, 'BLOC 3 - Qualité, sécurité & déploiement', 'Garantir la qualité, la sécurité et le déploiement des applications en environnement de production'),
('22222222-0000-0000-0000-000000000004', 4, 'BLOC 4 - Conduite du changement & maintenance', 'Accompagner les utilisateurs et assurer la maintenance évolutive des solutions');

-- ASRBD
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000005', 1, 'BLOC 1 - Administration SI', 'Administrer le système d''information et services cloud'),
('22222222-0000-0000-0000-000000000005', 2, 'BLOC 2 - Gestion des systèmes', 'Gérer les systèmes d''information, sauvegardes et haute disponibilité'),
('22222222-0000-0000-0000-000000000005', 3, 'BLOC 3 - Politique de sécurisation', 'Définir la politique de sécurisation du système d''information');

-- ESD
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000006', 1, 'BLOC 1 - Anticipation menaces cyber', 'Prévenir et anticiper les menaces cyber pesant sur les systèmes d''information'),
('22222222-0000-0000-0000-000000000006', 2, 'BLOC 2 - Audit & déploiement défenses', 'Auditer la sécurité des systèmes d''information et conduire le déploiement des mesures de défenses'),
('22222222-0000-0000-0000-000000000006', 3, 'BLOC 3 - Analyse & remédiation post-attaque', 'Analyser et sécuriser les systèmes d''information après une cyber-attaque'),
('22222222-0000-0000-0000-000000000006', 4, 'BLOC 4 - Sécurité organisationnelle', 'Piloter la sécurité organisationnelle et la gouvernance RSSI');

-- DPI
INSERT INTO cursus_skill_blocks (cursus_id, block_number, title, description) VALUES
('22222222-0000-0000-0000-000000000007', 1, 'BLOC 1 - Gouvernance projets IT', 'Gouvernance des projets informatiques et alignement stratégique'),
('22222222-0000-0000-0000-000000000007', 2, 'BLOC 2 - Pilotage des ressources', 'Piloter les ressources financières, humaines et techniques des projets informatiques'),
('22222222-0000-0000-0000-000000000007', 3, 'BLOC 3 - Management des risques', 'Manager les risques des Projets Informatiques et plans de mitigation'),
('22222222-0000-0000-0000-000000000007', 4, 'BLOC 4 - Qualité et processus', 'Manager les processus et la qualité dans le périmètre des projets informatiques'),
('22222222-0000-0000-0000-000000000007', 5, 'BLOC 5 - Communication parties prenantes', 'Communiquer avec les acteurs des projets informatiques et négociation');

-- 5. Synchronisation de la promotion Product Builder en statut "upcoming" (Prochainement)
UPDATE promotions 
SET status = 'upcoming' 
WHERE cursus_id = '22222222-0000-0000-0000-000000000004' OR code LIKE '%PB%';

-- 6. Vue analytique avec agrégation JSON des Blocs de compétences (Performance sans dette technique)
CREATE OR REPLACE VIEW v_cursus_detailed AS
SELECT 
  c.id,
  c.code,
  c.title,
  c.short_name,
  c.type,
  c.modality,
  c.rncp_level,
  c.total_hours,
  c.total_days,
  c.status,
  c.description,
  c.tags,
  c.is_active,
  c.created_at,
  c.updated_at,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object(
          'id', csb.id,
          'blockNumber', csb.block_number,
          'title', csb.title,
          'description', csb.description
        ) ORDER BY csb.block_number ASC
      )
      FROM cursus_skill_blocks csb
      WHERE csb.cursus_id = c.id
    ),
    '[]'::json
  ) AS skill_blocks
FROM cursus c;

