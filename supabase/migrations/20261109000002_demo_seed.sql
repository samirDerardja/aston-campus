-- Migration 20261109000002_demo_seed.sql
-- Jeu de Données de Démonstration Réaliste & Cohérent pour Aston Campus
-- Tous les identifiants et données sont purement fictifs à visée de démonstration.

-- 1. Rôles applicatifs
INSERT INTO roles (id, code, name, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'direction', 'Direction Pédagogique', 'Supervision globale, pilotage stratégique et arbitrage'),
  ('11111111-0000-0000-0000-000000000002', 'coordinateur', 'Coordinateur Pédagogique', 'Suivi quotidien des promotions, entretiens et actions correctives'),
  ('11111111-0000-0000-0000-000000000003', 'formateur', 'Formateur Référent / Intervenant', 'Interventions pédagogiques, émargement et bilans apprenants'),
  ('11111111-0000-0000-0000-000000000004', 'admin_technique', 'Administrateur Technique', 'Gestion technique des habilitations, imports et intégrité')
ON CONFLICT (code) DO NOTHING;

-- 2. Profils fictifs
INSERT INTO profiles (id, email, first_name, last_name, phone) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'claire.dubois@aston-campus.demo', 'Claire', 'Dubois', '01 45 67 89 10'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'marc.lefevre@aston-campus.demo', 'Marc', 'Lefèvre', '01 45 67 89 11'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'sophie.bernard@aston-campus.demo', 'Sophie', 'Bernard', '01 45 67 89 12'),
  ('aaaaaaaa-0000-0000-0000-000000000004', 'thomas.moreau@aston-campus.demo', 'Thomas', 'Moreau', '01 45 67 89 13'),
  ('aaaaaaaa-0000-0000-0000-000000000005', 'julie.roux@aston-campus.demo', 'Julie', 'Roux', '01 45 67 89 14')
ON CONFLICT (email) DO NOTHING;

-- Attribution des rôles
INSERT INTO user_roles (user_id, role_id) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001'), -- Claire = Direction
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002'), -- Marc = Coordinateur
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002'), -- Sophie = Coordinatrice
  ('aaaaaaaa-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003'), -- Thomas = Formateur
  ('aaaaaaaa-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003')  -- Julie = Formatrice
ON CONFLICT DO NOTHING;

-- Formateurs
INSERT INTO trainers (id, specialties, nevea_reference) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000004', ARRAY['Systèmes Linux', 'Réseaux & Sécurité', 'DevOps'], 'NEVEA-TR-04'),
  ('aaaaaaaa-0000-0000-0000-000000000005', ARRAY['No-Code / Low-Code', 'Gestion de Produit', 'PostgreSQL'], 'NEVEA-TR-05')
ON CONFLICT (id) DO NOTHING;

-- 3. Cursus de Référence Aston
INSERT INTO cursus (id, code, title, rncp_level) VALUES
  ('22222222-0000-0000-0000-000000000001', 'TSN', 'Technicien Support en Numérique', 'Niveau 4 (Bac)'),
  ('22222222-0000-0000-0000-000000000002', 'TSRS', 'Technicien Systèmes Réseaux & Sécurité', 'Niveau 5 (Bac+2)'),
  ('22222222-0000-0000-0000-000000000003', 'BTS-CIEL', 'BTS CIEL Cybersécurité, Informatique, Eléctronique', 'Niveau 5 (Bac+2)'),
  ('22222222-0000-0000-0000-000000000004', 'PBNCLC', 'Product builder no code low code', 'Niveau 6 (Bac+3)'),
  ('22222222-0000-0000-0000-000000000005', 'ASRBD', 'Administrateur systèmes, réseaux et bases de données', 'Niveau 6 (Bac+3/4)'),
  ('22222222-0000-0000-0000-000000000006', 'ESD', 'Expert En Sécurité Digitale', 'Niveau 7 (Bac+5)'),
  ('22222222-0000-0000-0000-000000000007', 'DPI', 'Directeur De Projets Informatique', 'Niveau 7 (Bac+5)')
ON CONFLICT (code) DO NOTHING;

-- 4. Promotions de Démonstration
INSERT INTO promotions (id, code, name, cursus_id, academic_year, start_date, end_date, coordinator_id, referent_trainer_id, status, nevea_reference) VALUES
  ('33333333-0000-0000-0000-000000000001', 'PROMO-TSRS-2025-A', 'TSRS 2025/2026 - Groupe A', '22222222-0000-0000-0000-000000000002', '2025-2026', '2025-09-15', '2026-07-31', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000004', 'active', 'NEVEA-PR-901'),
  ('33333333-0000-0000-0000-000000000002', 'PROMO-ESD-2025-P1', 'Expert Sécurité Digitale 2025/2027', '22222222-0000-0000-0000-000000000006', '2025-2027', '2025-10-01', '2027-09-30', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000004', 'active', 'NEVEA-PR-902'),
  ('33333333-0000-0000-0000-000000000003', 'PROMO-PB-2025-NC', 'Product Builder No-Code 2025/2026', '22222222-0000-0000-0000-000000000004', '2025-2026', '2025-11-03', '2026-10-31', 'aaaaaaaa-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000005', 'active', 'NEVEA-PR-903'),
  ('33333333-0000-0000-0000-000000000004', 'PROMO-DPI-2026-A', 'Directeur Projets Informatique 2026', '22222222-0000-0000-0000-000000000007', '2026-2027', '2026-10-01', '2027-09-30', 'aaaaaaaa-0000-0000-0000-000000000003', NULL, 'upcoming', 'NEVEA-PR-904')
ON CONFLICT (code) DO NOTHING;

-- Affectation des Formateurs
INSERT INTO trainer_assignments (trainer_id, promotion_id, is_lead, subject) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000001', TRUE, 'Architecture Systèmes & Réseaux'),
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000002', TRUE, 'Sécurité des Infrastructures'),
  ('aaaaaaaa-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000003', TRUE, 'Product Discovery & Outils No-Code')
ON CONFLICT DO NOTHING;

-- 5. Apprenants fictifs
INSERT INTO students (id, first_name, last_name, email, phone, company_name, company_tutor, nevea_reference) VALUES
  ('44444444-0000-0000-0000-000000000001', 'Alexandre', 'Martin', 'alexandre.martin@apprenant-aston.demo', '06 12 34 56 78', 'Capgemini', 'Laurent Petit', 'NEVEA-ST-101'),
  ('44444444-0000-0000-0000-000000000002', 'Camille', 'Girard', 'camille.girard@apprenant-aston.demo', '06 23 45 67 89', 'Sopra Steria', 'Emilie Renard', 'NEVEA-ST-102'),
  ('44444444-0000-0000-0000-000000000003', 'Youssef', 'Benali', 'youssef.benali@apprenant-aston.demo', '06 34 56 78 90', 'Orange Cyberdefense', 'Karim Saadi', 'NEVEA-ST-103'),
  ('44444444-0000-0000-0000-000000000004', 'Emma', 'Dumont', 'emma.dumont@apprenant-aston.demo', '06 45 67 89 01', 'Thales', 'Nicolas Meyer', 'NEVEA-ST-104'),
  ('44444444-0000-0000-0000-000000000005', 'Lucas', 'Mercier', 'lucas.mercier@apprenant-aston.demo', '06 56 78 90 12', 'Decathlon Digital', 'Sophie Durand', 'NEVEA-ST-105')
ON CONFLICT (email) DO NOTHING;

-- Inscriptions dans les promotions
INSERT INTO enrollments (student_id, promotion_id, status, enrolled_at) VALUES
  ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', 'active', '2025-09-15'),
  ('44444444-0000-0000-0000-000000000002', '33333333-0000-0000-0000-000000000001', 'active', '2025-09-15'),
  ('44444444-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000002', 'active', '2025-10-01'),
  ('44444444-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000002', 'active', '2025-10-01'),
  ('44444444-0000-0000-0000-000000000005', '33333333-0000-0000-0000-000000000003', 'active', '2025-11-03')
ON CONFLICT DO NOTHING;

-- 6. Séances Planning (Nevea en lecture seule vs Locales)
INSERT INTO sessions (id, title, description, start_time, end_time, promotion_id, trainer_id, room, source_type, is_readonly, nevea_reference) VALUES
  ('55555555-0000-0000-0000-000000000001', 'Administration Avancée Linux', 'Cours magistral et TP pratique', '2026-11-10 09:00:00+01', '2026-11-10 12:30:00+01', '33333333-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000004', 'Salle 302 (Lab Réseau)', 'nevea_readonly', TRUE, 'NEVEA-SES-201'),
  ('55555555-0000-0000-0000-000000000002', 'Sécurité des Systèmes d Information', 'Normes ISO 27001 et durcissement', '2026-11-10 14:00:00+01', '2026-11-10 17:30:00+01', '33333333-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000004', 'Salle 204', 'nevea_readonly', TRUE, 'NEVEA-SES-202'),
  ('55555555-0000-0000-0000-000000000003', 'Atelier No-Code : Automatisation Make & Supabase', 'Projet fil rouge en équipe', '2026-11-11 09:30:00+01', '2026-11-11 13:00:00+01', '33333333-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000005', 'Salle Innovation', 'nevea_readonly', TRUE, 'NEVEA-SES-203'),
  ('55555555-0000-0000-0000-000000000004', 'Point Pédagogique Mi-Parcours TSRS', 'Synchronisation coordinateur et délégués', '2026-11-12 11:00:00+01', '2026-11-12 12:00:00+01', '33333333-0000-0000-0000-000000000001', NULL, 'Visioconférence Team B', 'aston_local', FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. Entretiens Pédagogiques & Comptes Rendus
INSERT INTO interviews (id, title, type, status, scheduled_at, conducted_at, coordinator_id, student_id, trainer_id, promotion_id, location) VALUES
  ('66666666-0000-0000-0000-000000000001', 'Bilan Intégration Entreprise - Alexandre M.', 'apprenant_individuel', 'completed', '2026-11-04 10:00:00+01', '2026-11-04 10:45:00+01', 'aaaaaaaa-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', NULL, '33333333-0000-0000-0000-000000000001', 'Bureau Coordination 2'),
  ('66666666-0000-0000-0000-000000000002', 'Point d alerte assiduité - Camille G.', 'urgent', 'scheduled', '2026-11-11 14:00:00+01', NULL, 'aaaaaaaa-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000002', NULL, '33333333-0000-0000-0000-000000000001', 'Bureau Coordination 2'),
  ('66666666-0000-0000-0000-000000000003', 'Point de cadrage pédagogique - Youssef B.', 'apprenant_individuel', 'scheduled', '2026-11-13 16:00:00+01', NULL, 'aaaaaaaa-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000003', NULL, '33333333-0000-0000-0000-000000000002', 'Visio Teams')
ON CONFLICT (id) DO NOTHING;

INSERT INTO interview_reports (id, interview_id, summary, academic_progress, company_integration, difficulties_identified, recommendations, is_finalized, finalized_at, author_id) VALUES
  ('77777777-0000-0000-0000-000000000001', '66666666-0000-0000-0000-000000000001', 'Entretien de bilan très satisfaisant. Bon niveau d engagement.', 'Progression solide en administration système et scripting shell.', 'Excellente intégration chez Capgemini, retour tuteur positif.', 'Légères difficultés de méthodologie sur les comptes rendus techniques.', 'Mettre en place un plan de renforcement sur la rédaction documentaire.', TRUE, '2026-11-04 11:30:00+01', 'aaaaaaaa-0000-0000-0000-000000000002')
ON CONFLICT (interview_id) DO NOTHING;

-- 8. Synchronisations Pédagogiques (Réunions)
INSERT INTO meetings (id, title, promotion_id, organizer_id, scheduled_at, agenda, status) VALUES
  ('88888888-0000-0000-0000-000000000001', 'Comité Pédagogique Trimestriel TSRS', '33333333-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', '2026-11-05 17:00:00+01', '1. Bilan assiduité octobre\n2. Rythme d alternance\n3. Validation des dates d examen blanc', 'published'),
  ('88888888-0000-0000-0000-000000000002', 'Synchronisation Intervenants Expert Sécurité Digitale', '33333333-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', '2026-11-12 18:00:00+01', 'Harmonisation des livrables de projet et ateliers pentest', 'draft')
ON CONFLICT (id) DO NOTHING;

INSERT INTO meeting_notes (meeting_id, topic, content, decision) VALUES
  ('88888888-0000-0000-0000-000000000001', 'Organisation des partiels blancs', 'Les apprenants sollicitent une journée de révision supplémentaire avant les épreuves.', 'Décision validée : aménagement d une demi-journée d étude le 18 décembre.')
ON CONFLICT DO NOTHING;

-- 9. Actions Correctives (Kanban & Table)
INSERT INTO action_items (id, title, description, promotion_id, student_id, assignee_id, creator_id, priority, status, due_date, result_summary, source_meeting_id) VALUES
  ('99999999-0000-0000-0000-000000000001', 'Plan d aide rédactionnelle pour Alexandre M.', 'Fournir le guide méthodologique des rapports de stage et fixer un jalon intermédiaire', '33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'medium', 'in_progress', '2026-11-15', NULL, NULL),
  ('99999999-0000-0000-0000-000000000002', 'Contacter le tuteur Sopra Steria de Camille G.', 'Vérifier la concordance des relevés de présence et organiser un point tripartite d urgence', '33333333-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'urgent', 'todo', '2026-11-08', NULL, NULL), -- Volontairement en retard pour démonstration dashboard
  ('99999999-0000-0000-0000-000000000003', 'Mise en ligne du planning d examen blanc', 'Notifier la promotion TSRS des dates ajustées suite au comité', '33333333-0000-0000-0000-000000000001', NULL, 'aaaaaaaa-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'high', 'in_progress', '2026-11-12', NULL, '88888888-0000-0000-0000-000000000001'),
  ('99999999-0000-0000-0000-000000000004', 'Configuration de l environnement lab pentest', 'Déployer les VM vulnérables pour le module sécurité', '33333333-0000-0000-0000-000000000002', NULL, 'aaaaaaaa-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000002', 'medium', 'waiting', '2026-11-20', NULL, NULL),
  ('99999999-0000-0000-0000-000000000005', 'Validation convention d alternance Youssef B.', 'Dossier administratif complété avec l OPCO', '33333333-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'low', 'completed', '2026-10-25', 'Convention signée et enregistrée', NULL)
ON CONFLICT (id) DO NOTHING;

-- 10. Notifications de Démonstration
INSERT INTO notifications (id, recipient_id, type, title, message, action_url, is_read) VALUES
  ('00000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000002', 'action_overdue', 'Action en retard !', 'L action "Contacter le tuteur Sopra Steria de Camille G." a dépassé son échéance du 08/11/2026.', '/actions', FALSE),
  ('00000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'interview_scheduled', 'Entretien programmé', 'Entretien d alerte assiduité prévu avec Camille Girard le 11/11/2026 à 14h00.', '/entretiens', FALSE),
  ('00000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'meeting_upcoming', 'Réunion pédagogique', 'Synchronisation Intervenants ESD prévue le 12/11/2026 à 18h00.', '/synchronisations', TRUE)
ON CONFLICT (id) DO NOTHING;

