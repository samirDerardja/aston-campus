# Architecture Technique — Aston Campus

## 1. Vision Générale
**Aston Campus** est une plateforme web moderne de coordination pédagogique, conçue pour les équipes du campus Aston Informatique (direction pédagogique, coordinateurs pédagogiques, formateurs et administrateurs techniques).
Elle fonctionne en complémentarité avec Nevea (ERP administratif et de planification) :
- Nevea reste la source officielle de vérité pour les promotions, étudiants inscrits, formateurs et cours officiels (lecture seule).
- Aston Campus est le cockpit décisionnel et collaboratif pour le suivi de proximité : entretiens pédagogiques, synchronisations/réunions, actions correctives traçables, documents confidentiels et reporting.

## 2. Principes Fondamentaux d'Architecture
1. **Séparation Stricte des Responsabilités** :
   - Frontend SPA React/TypeScript ultra-réactif (Vite, Tailwind, Radix UI / shadcn style, TanStack Query).
   - Backend API REST Fastify TypeScript haut débit, validant scrupuleusement les entrées (Zod) et auditant les opérations critiques.
   - Base de données PostgreSQL via Supabase avec Row Level Security (RLS) et intégrité relationnelle stricte.
2. **Immutabilité des Données Administratives Référentes** :
   - Les cours et séances provenant de Nevea sont injectés avec le statut `external_source = 'nevea'` et sont formellement verrouillés en lecture seule côté backend et RLS.
3. **Sécurité Défensive & Zéro Confiance** :
   - Aucun secret ni clé `service_role` dans le frontend.
   - RLS appliquée à toutes les tables Supabase exposées.
   - Cloisonnement strict des données formateurs : un formateur n'a visibilité que sur les promotions et étudiants qui lui sont expressément assignés.
4. **Indépendance & Portabilité** :
   - Ne dépend d'aucun environnement propriétaire bloquant (aucun vendor-lockin Emergent).
   - Déployable sur n'importe quel hébergement cloud standard (Vercel/Netlify/Node/Docker + Supabase instance managée ou auto-hébergée).

## 3. Schéma Global d'Architecture

```
+----------------------------------------------------------------------------------+
|                            ASTON CAMPUS - CLIENT WEB                             |
|  React 19 / Vite + TypeScript + Tailwind CSS + Radix UI + Lucide + FullCalendar  |
|  - Mode Connecté (API Fastify / Supabase Client)                                 |
|  - Mode Démonstration Isolé (Mock Store Réactif Type-Safe)                       |
+----------------------------------------------------------------------------------+
                                  |
                                  v
+----------------------------------------------------------------------------------+
|                             FASTIFY BACKEND API (Node.js)                         |
|  - Auth Middleware & Session Validator                                           |
|  - Zod Request Validators                                                        |
|  - Module Coordinations (Interviews, Synchronisations, Actions Kanban)           |
|  - Module Import Nevea (CSV Parser, Mapping, Validation, Doublons)              |
|  - Module Audit Log & Notifications Dispatcher                                   |
+----------------------------------------------------------------------------------+
                                  |
                   +--------------+--------------+
                   |                             |
                   v                             v
+----------------------------------+   +---------------------------------------+
|      SUPABASE POSTGRESQL         |   |         SUPABASE STORAGE (S3)         |
|  - 25+ Tables Normalisées        |   |  - Buckets Privés Chiffrés            |
|  - RLS Policies (Allow/Deny)     |   |  - URLs Signées à Durée Déterminée    |
|  - Triggers d'Audit & Timestamp  |   |  - Contrôle Strict Types MIME         |
+----------------------------------+   +---------------------------------------+
```

## 4. Composants Détaillés

### Frontend (`/frontend`)
- **Framework** : React avec TypeScript strict (`noImplicitAny`, `strictNullChecks`).
- **Build tool** : Vite pour des HMR quasi-instantanés.
- **Styling** : Tailwind CSS avec design tokens inspirés de Linear, Vercel et Raycast (Bleu nuit `#101828`, Indigo `#635BFF`, Violet `#8B5CF6`, fond `#F8FAFC`).
- **Composants d'interface** : primitives accessibles basées sur Radix UI / headless, stylisées avec Tailwind (Boutons, Modales, Drawers, Dropdowns, Tabs, Skeletons, Toasts).
- **Gestion d'état serveur** : TanStack Query v5 pour mise en cache optimiste, invalidation automatique et rechargement en arrière-plan.
- **Icônes & Visuels** : Lucide React (icônes fines 1.5px / 2px).
- **Planning** : Calendrier interactif avec vues Jour / Semaine / Mois, coloration sémantique et verrouillage visuel Nevea.

### Backend (`/backend`)
- **Runtime** : Node.js LTS (v24).
- **Framework HTTP** : Fastify pour sa légèreté, son typage natif TypeScript et sa vitesse (2x plus rapide qu'Express).
- **Validation** : Zod pour schémas stricts sur payload, query params et path params.
- **Sécurité** : `@fastify/helmet`, `@fastify/cors`, rate-limiting et gestion centralisée des erreurs avec codes d'erreur normalisés (`ASTON_ERR_*`).
- **Connecteur Nevea (Isolé)** :
  - Module CSV avec analyse heuristique des en-têtes, détection des conflits de clé Nevea ID, prévisualisation sans persistance.
  - Interface API Nevea déclarée sous forme d'adaptateur abstrait `INeveaConnector` désactivée par défaut tant que les contrats d'API officiels ne sont pas validés par la direction.

### Base de données (`/supabase`)
- **PostgreSQL 16+** hébergé sur Supabase.
- **Authentification** : Supabase Auth (`auth.users`) mappé 1:1 à `public.profiles`.
- **Politiques RLS** : Définies sur chaque table pour garantir que même en cas de requête directe depuis le client Supabase, aucun formateur ne puisse inspecter des dossiers non affectés.
- **Migrations SQL** : Versionnées sous `supabase/migrations/` avec structure idempotente et reproductible.
