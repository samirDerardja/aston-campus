# Schéma Relationnel Supabase PostgreSQL — Aston Campus

## 1. Vue d'Ensemble
Le schéma relationnel d'Aston Campus est entièrement conçu sous PostgreSQL avec identifiants UUID v4 (`gen_random_uuid()`), horodatages stricts UTC (`TIMESTAMPTZ`), contraintes d'intégrité référentielle, index composites pour le requêtage de masse, et conformité totale avec Supabase Auth et Storage.

---

## 2. Types Énumérés (ENUMs)

```sql
CREATE TYPE user_role_type AS ENUM ('direction', 'coordinateur', 'formateur', 'admin_technique');
CREATE TYPE promotion_status AS ENUM ('active', 'upcoming', 'completed', 'archived');
CREATE TYPE student_status AS ENUM ('active', 'resigned', 'interrupted', 'graduated');
CREATE TYPE interview_type AS ENUM ('apprenant_individuel', 'formateur_point', 'point_pedagogique', 'urgent');
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'postponed', 'cancelled');
CREATE TYPE action_status AS ENUM ('todo', 'in_progress', 'waiting', 'completed', 'cancelled');
CREATE TYPE action_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE event_source_type AS ENUM ('nevea_readonly', 'aston_local');
CREATE TYPE sync_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE notification_type AS ENUM ('action_assigned', 'due_date_warning', 'action_overdue', 'interview_scheduled', 'meeting_upcoming', 'report_pending');
```

---

## 3. Définition des Tables Clés

### 3.1 Gestion des Utilisateurs & Rôles
1. **`profiles`** : Profil utilisateur enrichi synchronisé avec `auth.users`.
   - `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
   - `email TEXT NOT NULL UNIQUE`
   - `first_name TEXT NOT NULL`
   - `last_name TEXT NOT NULL`
   - `avatar_url TEXT`
   - `phone TEXT`
   - `is_active BOOLEAN DEFAULT TRUE`
   - `created_at / updated_at TIMESTAMPTZ`

2. **`roles`** : Référentiel des rôles applicatifs.
   - `id UUID PRIMARY KEY`
   - `code user_role_type UNIQUE NOT NULL`
   - `name TEXT NOT NULL`
   - `description TEXT`

3. **`user_roles`** : Table de liaison N-N pour affectation des rôles.
   - `id UUID PRIMARY KEY`
   - `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
   - `role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT`
   - `granted_at TIMESTAMPTZ DEFAULT NOW()`
   - `granted_by UUID REFERENCES profiles(id)`
   - `UNIQUE(user_id, role_id)`

### 3.2 Référentiel Pédagogique (Cursus, Promotions, Étudiants, Formateurs)
4. **`cursus`** : Catalogue des cursus d'Aston (RNCP / Diplômes).
   - `id UUID PRIMARY KEY`
   - `code TEXT UNIQUE NOT NULL` (ex: `TSR_2026`)
   - `title TEXT NOT NULL` (ex: `Technicien Systèmes Réseaux & Sécurité`)
   - `rncp_level TEXT` (ex: `Niveau 5 (Bac+2)`, `Niveau 6 (Bac+3/4)`, `Niveau 7 (Bac+5)`)
   - `is_active BOOLEAN DEFAULT TRUE`

5. **`promotions`** : Promotions concrètes d'étudiants.
   - `id UUID PRIMARY KEY`
   - `code TEXT UNIQUE NOT NULL` (ex: `PROMO-TSR-2025-A`)
   - `name TEXT NOT NULL` (ex: `TSR 2025/2026 - Groupe A`)
   - `cursus_id UUID NOT NULL REFERENCES cursus(id)`
   - `academic_year TEXT NOT NULL` (ex: `2025-2026`)
   - `start_date DATE NOT NULL`
   - `end_date DATE NOT NULL`
   - `coordinator_id UUID REFERENCES profiles(id)`
   - `referent_trainer_id UUID REFERENCES profiles(id)`
   - `status promotion_status DEFAULT 'active'`
   - `nevea_reference TEXT UNIQUE` (identifiant distant Nevea)

6. **`students`** : Fiche individuelle apprenant (sans données médicales ni disciplinaires sensibles).
   - `id UUID PRIMARY KEY`
   - `first_name TEXT NOT NULL`
   - `last_name TEXT NOT NULL`
   - `email TEXT NOT NULL UNIQUE`
   - `phone TEXT`
   - `company_name TEXT` (Entreprise d'alternance)
   - `company_tutor TEXT` (Tuteur en entreprise)
   - `nevea_reference TEXT UNIQUE`
   - `created_at / updated_at TIMESTAMPTZ`

7. **`enrollments`** : Inscription d'un apprenant dans une promotion (historisable).
   - `id UUID PRIMARY KEY`
   - `student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE`
   - `promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE`
   - `status student_status DEFAULT 'active'`
   - `enrolled_at DATE NOT NULL`
   - `exit_date DATE`
   - `UNIQUE(student_id, promotion_id)`

8. **`trainers`** : Profil étendu du formateur.
   - `id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE`
   - `specialties TEXT[]` (ex: `['Docker', 'PostgreSQL', 'Cybersécurité']`)
   - `nevea_reference TEXT UNIQUE`

9. **`trainer_assignments`** : Affectation des formateurs aux promotions.
   - `id UUID PRIMARY KEY`
   - `trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE`
   - `promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE`
   - `is_lead BOOLEAN DEFAULT FALSE` (Formateur référent)
   - `subject TEXT` (Matière/module enseigné)
   - `assigned_at DATE NOT NULL DEFAULT CURRENT_DATE`
   - `UNIQUE(trainer_id, promotion_id, subject)`

### 3.3 Calendrier & Séances (Dualité Nevea vs Local)
10. **`courses`** : Modules de cours.
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `cursus_id UUID REFERENCES cursus(id)`
    - `nevea_reference TEXT`

11. **`sessions`** : Séances de calendrier (Cours Nevea OU Réunions locales).
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `description TEXT`
    - `start_time TIMESTAMPTZ NOT NULL`
    - `end_time TIMESTAMPTZ NOT NULL`
    - `promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE`
    - `trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL`
    - `room TEXT`
    - `source_type event_source_type DEFAULT 'aston_local'`
    - `is_readonly BOOLEAN DEFAULT FALSE` -- VRAI si Nevea
    - `nevea_reference TEXT UNIQUE`

### 3.4 Entretiens & Comptes Rendus
12. **`interviews`** : Entretiens pédagogiques planifiés.
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `type interview_type NOT NULL`
    - `status interview_status DEFAULT 'scheduled'`
    - `scheduled_at TIMESTAMPTZ NOT NULL`
    - `conducted_at TIMESTAMPTZ`
    - `coordinator_id UUID NOT NULL REFERENCES profiles(id)`
    - `student_id UUID REFERENCES students(id) ON DELETE CASCADE`
    - `trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE`
    - `promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE`
    - `location TEXT`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

13. **`interview_reports`** : Compte rendu structuré d'entretien.
    - `id UUID PRIMARY KEY`
    - `interview_id UUID UNIQUE NOT NULL REFERENCES interviews(id) ON DELETE CASCADE`
    - `summary TEXT NOT NULL`
    - `academic_progress TEXT`
    - `company_integration TEXT`
    - `difficulties_identified TEXT`
    - `recommendations TEXT`
    - `is_finalized BOOLEAN DEFAULT FALSE`
    - `finalized_at TIMESTAMPTZ`
    - `author_id UUID NOT NULL REFERENCES profiles(id)`

### 3.5 Synchronisations Pédagogiques (Réunions d'équipe)
14. **`meetings`** : Synchronisations pédagogiques (comités de promo, bilans intermédiaires).
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE`
    - `organizer_id UUID NOT NULL REFERENCES profiles(id)`
    - `scheduled_at TIMESTAMPTZ NOT NULL`
    - `agenda TEXT`
    - `status sync_status DEFAULT 'draft'`
    - `next_meeting_at TIMESTAMPTZ`

15. **`meeting_participants`** : Émargement et convocation des participants.
    - `id UUID PRIMARY KEY`
    - `meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE`
    - `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
    - `attended BOOLEAN DEFAULT FALSE`
    - `UNIQUE(meeting_id, user_id)`

16. **`meeting_notes`** : Points abordés et décisions prises.
    - `id UUID PRIMARY KEY`
    - `meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE`
    - `topic TEXT NOT NULL`
    - `content TEXT NOT NULL`
    - `decision TEXT`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

### 3.6 Actions Correctives & Traçabilité (Cœur de coordination)
17. **`action_items`** : Tâches et actions correctives.
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `description TEXT NOT NULL`
    - `promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE`
    - `student_id UUID REFERENCES students(id) ON DELETE SET NULL`
    - `assignee_id UUID NOT NULL REFERENCES profiles(id)`
    - `creator_id UUID NOT NULL REFERENCES profiles(id)`
    - `priority action_priority DEFAULT 'medium'`
    - `status action_status DEFAULT 'todo'`
    - `due_date DATE NOT NULL`
    - `completed_at TIMESTAMPTZ`
    - `result_summary TEXT`
    - `source_meeting_id UUID REFERENCES meetings(id) ON DELETE SET NULL`
    - `source_interview_id UUID REFERENCES interviews(id) ON DELETE SET NULL`
    - `created_at / updated_at TIMESTAMPTZ`

18. **`action_history`** : Journal d'audit des transitions d'état d'une action.
    - `id UUID PRIMARY KEY`
    - `action_id UUID NOT NULL REFERENCES action_items(id) ON DELETE CASCADE`
    - `previous_status action_status`
    - `new_status action_status NOT NULL`
    - `comment TEXT`
    - `changed_by UUID NOT NULL REFERENCES profiles(id)`
    - `changed_at TIMESTAMPTZ DEFAULT NOW()`

### 3.7 Gestion Documentaire Sécurisée
19. **`documents`** : Métadonnées des fichiers stockés dans Supabase Storage (bucket privé).
    - `id UUID PRIMARY KEY`
    - `title TEXT NOT NULL`
    - `file_path TEXT NOT NULL` (chemin dans le bucket S3 privé)
    - `file_size_bytes BIGINT NOT NULL`
    - `mime_type TEXT NOT NULL`
    - `promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE`
    - `student_id UUID REFERENCES students(id) ON DELETE CASCADE`
    - `interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE`
    - `uploaded_by UUID NOT NULL REFERENCES profiles(id)`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

20. **`document_permissions`** : Autorisations spécifiques au document si dérogation RLS.
    - `id UUID PRIMARY KEY`
    - `document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE`
    - `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
    - `can_download BOOLEAN DEFAULT TRUE`

### 3.8 Notifications, Intégrations & Audit
21. **`notifications`** : Flux des notifications utilisateur in-app.
    - `id UUID PRIMARY KEY`
    - `recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
    - `type notification_type NOT NULL`
    - `title TEXT NOT NULL`
    - `message TEXT NOT NULL`
    - `action_url TEXT`
    - `is_read BOOLEAN DEFAULT FALSE`
    - `read_at TIMESTAMPTZ`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

22. **`notification_preferences`** : Préférences de canaux par utilisateur.
    - `user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE`
    - `email_urgent_only BOOLEAN DEFAULT TRUE`
    - `in_app_all BOOLEAN DEFAULT TRUE`
    - `reminder_days_before INT DEFAULT 2`

23. **`external_references`** : Table de correspondance d'identifiants (Nevea -> Aston).
    - `id UUID PRIMARY KEY`
    - `entity_type TEXT NOT NULL` ('student', 'trainer', 'promotion', 'session')
    - `internal_id UUID NOT NULL`
    - `external_system TEXT DEFAULT 'nevea'`
    - `external_id TEXT NOT NULL`
    - `last_synced_at TIMESTAMPTZ DEFAULT NOW()`
    - `UNIQUE(entity_type, external_system, external_id)`

24. **`import_jobs`** : Historique et traçabilité des imports CSV Nevea.
    - `id UUID PRIMARY KEY`
    - `filename TEXT NOT NULL`
    - `imported_by UUID NOT NULL REFERENCES profiles(id)`
    - `status TEXT NOT NULL` ('pending', 'processing', 'completed', 'failed')
    - `rows_processed INT DEFAULT 0`
    - `rows_inserted INT DEFAULT 0`
    - `rows_updated INT DEFAULT 0`
    - `errors JSONB DEFAULT '[]'::jsonb`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

25. **`sync_runs`** : Traçabilité des passes de synchronisation automatisée Nevea.
    - `id UUID PRIMARY KEY`
    - `connector_name TEXT DEFAULT 'nevea_direct'`
    - `status TEXT NOT NULL`
    - `details JSONB`
    - `executed_at TIMESTAMPTZ DEFAULT NOW()`

26. **`audit_logs`** : Journal inviolable d'audit de sécurité et de conformité.
    - `id UUID PRIMARY KEY`
    - `actor_id UUID REFERENCES profiles(id)`
    - `ip_address TEXT`
    - `action TEXT NOT NULL` (ex: `UPDATE_ACTION_STATUS`, `DOWNLOAD_DOCUMENT`)
    - `resource_type TEXT NOT NULL`
    - `resource_id UUID`
    - `payload_diff JSONB`
    - `created_at TIMESTAMPTZ DEFAULT NOW()`

