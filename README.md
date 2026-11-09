# Aston Campus — Plateforme Moderne de Coordination Pédagogique

Plateforme web interne haut de gamme conçue pour le campus **Aston Informatique**, complémentaire à l'ERP de gestion Nevea.
Elle centralise les promotions, apprenants en alternance, formateurs, entretiens pédagogiques, synchronisations, actions correctives (Kanban), planning consolidé, documents et tableaux de bord.

---

## 1. Stack Technique

### Frontend
- **Framework** : React 18 / 19 avec TypeScript strict.
- **Build Tool** : Vite.
- **Styling** : Tailwind CSS avec palette de design tokens (Bleu nuit `#101828`, Indigo `#635BFF`, Violet `#8B5CF6`, fond `#F8FAFC`).
- **Icons** : Lucide React.
- **Navigation** : React Router v6.
- **State & Cache** : TanStack Query v5 + Context API réactif.
- **Formulaires & Validation** : React Hook Form + Zod.
- **Graphiques** : Recharts.
- **Interactions** : Command Palette (`Cmd+K` / `Ctrl+K`), Kanban interactif, filtres multi-critères.

### Backend
- **Runtime** : Node.js LTS (v24).
- **Framework HTTP** : Fastify (haute performance, typage strict).
- **Validation** : Zod.
- **Sécurité** : Helmet, CORS strict, gestionnaire d'erreurs centralisé avec codes d'erreur normalisés (`ASTON_ERR_*`).
- **Protection Nevea** : Verrouillage strict en écriture sur les séances importées de Nevea.

### Base de données
- **PostgreSQL 16+** via Supabase.
- **Sécurité** : Row Level Security (RLS) avec isolation stricte des formateurs à leurs affectations.
- **Migrations SQL** : 26 tables normalisées sous `supabase/migrations/`.
- **Intégrité** : Clés primaires UUID v4, triggers d'audit et d'immutabilité Nevea.

---

## 2. Structure du Projet

```
/
├── frontend/                     # Application SPA React / Vite / TypeScript
│   ├── src/
│   │   ├── components/layout/   # Sidebar, Header, CommandPalette (Cmd+K)
│   │   ├── context/             # AppContext (State réactif, mutations démo/live)
│   │   ├── data/                # Mock data riche et cohérent (7 cursus Aston)
│   │   ├── pages/               # Dashboard, Promotions, Apprenants, Entretiens, Kanban Actions...
│   │   └── types/               # Typage TypeScript strict
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # API REST Fastify / TypeScript
│   ├── src/
│   │   ├── server.ts            # Fastify instance, routes, gestion d'erreurs
│   │   └── types/
│   ├── tests/                   # Tests automatisés d'API & validation Zod
│   └── package.json
├── supabase/
│   ├── migrations/
│   │   ├── 20261109000001_initial_schema.sql  # 26 tables, ENUMs, triggers Nevea, RLS
│   │   └── 20261109000002_demo_seed.sql       # Cursus Aston, promotions, séances, actions
│   └── tests/
│       └── rls_and_permissions.test.sql       # Tests d'isolation et d'immutabilité
├── docs/
│   ├── ARCHITECTURE.md          # Architecture globale et principes directeurs
│   ├── DATABASE_SCHEMA.md       # Schéma relationnel détaillé
│   ├── PERMISSIONS_MATRIX.md    # Matrice des droits par rôle (Direction, Coordinateur, Formateur)
│   └── DESIGN_SYSTEM.md         # Tokens de couleur, typographie, accessibilité
└── README.md
```

---

## 3. Démarrage Rapide

### Prérequis
- Node.js LTS (v20+) et npm installés.

### 1. Démarrer le Frontend (Mode Démonstration & Connecté)
```bash
cd frontend
npm install
npm run dev
```
L'interface est accessible sur **http://localhost:5173**.
- Raccourci clavier recherche globale : `Cmd + K` ou `Ctrl + K`.
- Sélecteur de rôle instantané dans la sidebar pour tester les habilitations (Direction, Coordinateur, Formateur).

### 2. Démarrer le Backend Fastify
```bash
cd backend
npm install
npm run dev
```
L'API REST est accessible sur **http://localhost:3001**.
Health check : `GET http://localhost:3001/health`.

### 3. Exécuter la Suite de Tests
```bash
# Tests Backend (5/5 passés)
cd backend
npm test

# Build Frontend TypeScript / Vite
cd frontend
npm run build
```

---

## 4. Matrice de Sécurité & Confidentialité
- **Conformité RGPD & Vie Privée** : Aucune donnée médicale, disciplinaire ou confidentielle non autorisée n'est stockée sur les fiches apprenants.
- **Immutabilité Nevea** : Les séances issues de Nevea portent le statut `nevea_readonly` et sont formellement rejetées en modification (`403 Forbidden - ASTON_ERR_READONLY`).
- **Stockage Documentaire** : Les documents sont hébergés dans des buckets privés Supabase avec génération d'URLs signées à durée déterminée.

