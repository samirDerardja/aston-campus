# Matrice des Droits et Politiques de Sécurité (RLS)

## 1. Rôles Définis
1. **Direction Pédagogique (`direction`)** : Accès global en lecture et écriture sur l'ensemble des campus, promotions, reporting transversal, audits et arbitrages.
2. **Coordinateur Pédagogique (`coordinateur`)** : Gestion active des promotions qui lui sont affectées ou de son pool. Création/modification des entretiens, réunions, actions correctives, téléversement de documents, import CSV.
3. **Formateur (`formateur`)** : Accès restreint strictement à ses affectations.
   - Ne voit que les promotions où il enseigne (`trainer_assignments`).
   - Ne voit que les étudiants inscrits dans ces promotions.
   - Ne peut modifier que ses propres comptes rendus d'entretien ou mettre à jour le statut des actions qui lui sont assignées.
   - **Interdiction formelle** de voir ou modifier des dossiers hors périmètre via manipulation d'URL ou d'identifiant.
4. **Administrateur Technique (`admin_technique`)** : Gestion technique des comptes, attribution des rôles, journal d'audit, configuration des connecteurs et connectivité de base de données. N'a pas vocation à altérer les appréciations pédagogiques.

---

## 2. Matrice d'Habilitation par Ressource

| Ressource / Opération | Direction | Coordinateur | Formateur | Admin Technique |
| :--- | :---: | :---: | :---: | :---: |
| **Promotions (Lecture)** | Toute | Affectées + Pool | Affectées uniquement | Toute |
| **Promotions (Création/Édition)** | Oui | Oui (locales) | Non | Non |
| **Apprenants (Lecture)** | Tout | Tous (ou promo) | Inscrits dans ses promos | Audit |
| **Séances Nevea (Lecture)** | Tout | Tout | Ses séances | Tout |
| **Séances Nevea (Écriture)** | ❌ VERROUILLÉ | ❌ VERROUILLÉ | ❌ VERROUILLÉ | ❌ VERROUILLÉ |
| **Séances Locales (Écriture)** | Oui | Oui | Sur ses modules | Non |
| **Entretiens (Planification)** | Oui | Oui | Demande/Consultation | Non |
| **Entretiens (Compte Rendu)** | Oui | Oui | Si participant/référent | Non |
| **Synchronisations Pédagogiques** | Oui | Organisateur / Membre | Si participant | Non |
| **Actions Correctives (Création)** | Oui | Oui | Oui (signalement) | Non |
| **Actions Correctives (Kanban)** | Tout | Sa promotion / assignées | Ses actions assignées | Non |
| **Documents Privés (Téléversement)**| Oui | Oui | Si autorisé | Non |
| **Documents Privés (Téléchargement)**| Oui | Promotion liée | Promotion liée | Audit |
| **Import CSV Nevea** | Oui | Oui | ❌ INTERDIT | Oui |
| **Reporting Global** | Oui (Complet) | Oui (Ses promos) | ❌ INTERDIT | Stats techniques |
| **Gestion Utilisateurs / Rôles** | Validation | Non | ❌ INTERDIT | Oui |
| **Journal d'Audit** | Consultation | ❌ INTERDIT | ❌ INTERDIT | Consultation |

---

## 3. Implémentation Row Level Security (RLS) PostgreSQL

Exemple d'isolation stricte pour la table `promotions` :
```sql
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Les membres Direction et Admin ont un accès universel
CREATE POLICY "Direction & Admin can view all promotions"
ON promotions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.code IN ('direction', 'admin_technique')
  )
);

-- Les Coordinateurs voient leurs promotions ou celles sans coordinateur assigné
CREATE POLICY "Coordinators view assigned promotions"
ON promotions FOR SELECT
USING (
  coordinator_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid() AND r.code = 'coordinateur'
  )
);

-- Les Formateurs ne voient STRICTEMENT que les promotions où ils sont assignés
CREATE POLICY "Trainers view only assigned promotions"
ON promotions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trainer_assignments ta
    WHERE ta.promotion_id = promotions.id
    AND ta.trainer_id = auth.uid()
  )
);
```

Règle d'inviolabilité Nevea :
```sql
-- Interdiction formelle d'altérer des cours d'origine Nevea
CREATE POLICY "Prevent modification of Nevea readonly sessions"
ON sessions FOR UPDATE
USING (source_type != 'nevea_readonly' AND is_readonly = false);
```
