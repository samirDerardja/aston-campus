# Design System & Identité Visuelle — Aston Campus

## 1. Philosophie & Esthétique
Aston Campus adopte une identité visuelle **SaaS Premium 2026** :
- **Clarté & Densité Informative** : Inspiré de **Linear** pour sa typographie ciselée, ses bordures subtiles (`border-slate-200/80` et `dark:border-slate-800`), et l'absence totale de fioritures criardes.
- **Sobriété & Ergonomie** : Inspiré de **Notion** et **Vercel** pour la hiérarchie visuelle, l'usage des espaces négatifs et la lisibilité exemplaire des listes et tableaux de données.
- **Fluidité & Réactivité** : Inspiré de **Raycast** avec un champ de recherche global omniprésent, des raccourcis clavier (`Cmd+K` pour la Command Palette) et des transitions d'état douces (150ms ease-out).

---

## 2. Palette Chromatique & Tokens CSS

| Token | Hex | Rôle & Usage |
| :--- | :--- | :--- |
| `--color-brand-midnight` | `#101828` | Bleu nuit profond (Header, sidebar dark, contrastes forts) |
| `--color-brand-indigo` | `#635BFF` | Indigo accent principal (Boutons primaires, sélection active) |
| `--color-brand-violet` | `#8B5CF6` | Violet de nuance (Badges cursus, accents secondaires) |
| `--color-bg-canvas` | `#F8FAFC` | Fond général de l'application (Slate-50 doux et reposant) |
| `--color-surface-card` | `#FFFFFF` | Fond des cartes, modales et conteneurs |
| `--color-text-primary` | `#0F172A` | Texte principal haute lisibilité (Slate-900) |
| `--color-text-secondary` | `#64748B` | Labels, métadonnées, timestamps (Slate-500) |
| `--color-border-subtle` | `#E2E8F0` | Séparateurs fins 1px (Slate-200) |
| `--color-state-success` | `#12B76A` | Vert validation / Action terminée / Promotion active |
| `--color-state-warning` | `#F79009` | Orange attention / Échéance proche (J-2) / Action en attente |
| `--color-state-danger` | `#F04438` | Rouge urgence / Action en retard / Conflit planning |
| `--color-state-nevea` | `#0284C7` | Bleu Nevea distinctif / Indicateur de lecture seule Nevea |

---

## 3. Typographie

- **Police principale** : `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- **Échelle typographique** :
  - **H1 (Page Title)** : `text-2xl font-bold tracking-tight text-slate-900` (24px, 700)
  - **H2 (Section Title)** : `text-lg font-semibold text-slate-900` (18px, 600)
  - **H3 (Card Title)** : `text-base font-medium text-slate-800` (16px, 500)
  - **Body / Standard** : `text-sm font-normal text-slate-700 leading-relaxed` (14px, 400)
  - **Small / Metadata** : `text-xs font-medium text-slate-500` (12px, 500)
  - **Micro / Badges** : `text-[11px] font-semibold uppercase tracking-wider` (11px, 600)

---

## 4. Composants Clés & Micro-Interactions

1. **Cartes Statistiques Métriques (KPIs)** :
   - Fond blanc avec bordure `border-slate-200/80` et ombre légère `shadow-xs hover:shadow-sm`.
   - Indicateur de progression contextuel (ex: flèche verte `+12%` ou badge rouge `3 en retard`).
   - Clic interactif filtrant instantanément la liste cible.

2. **Command Palette (`Cmd+K` / `Ctrl+K`)** :
   - Accès direct au saut vers une promotion, un apprenant, un formateur ou la création d'un entretien en un coup d'œil.

3. **Kanban des Actions Correctives** :
   - 5 colonnes clairement segmentées : *À faire*, *En cours*, *En attente*, *Terminée*, *Annulée*.
   - Déplacement interactif par glisser/déposer ou menu rapide contextuel.
   - Badge de priorité visuel : Basse (gris), Moyenne (bleu), Haute (orange), Urgente (rouge pulsé).
   - Indicateur d'échéance dynamique : affiche automatiquement un avertissement si la date est dépassée.

4. **Calendrier / Planning Multicolore** :
   - Badge cadenas et contour spécifique pour les séances Nevea officielles (lecture seule garantie).
   - Pastilles modulables pour les synchronisations et entretiens locaux.

5. **Accessibilité (WCAG 2.2 AA)** :
   - Ratio de contraste texte/fond minimal de 4.5:1 sur tous les éléments informatifs.
   - Anneau de focus visible `focus-visible:ring-2 focus-visible:ring-indigo-500` pour navigation intégrale au clavier.
   - Rôles ARIA et libellés explicites sur tous les boutons d'action.

