# Contexte Projet Diagnostic Datakö

## Vue d'ensemble
Application web de diagnostic Data & IA pour qualifier les leads et démontrer l'expertise sectorielle de Datakö.

**Objectif commercial :** 
- Qualifier les prospects avant RDV commercial
- Démontrer la compréhension des enjeux métier par secteur
- Générer des leads qualifiés pour les services de consulting Data/AI

**Stack technique :**
- Frontend : React 18 + TypeScript + Vite
- Styling : Tailwind CSS + shadcn-ui
- Backend : Supabase (BaaS - auth, database, storage)
- Déploiement : Netlify
- Version control : Git + GitHub

---

## Architecture de l'application

### Flow utilisateur (5 étapes)
1. **Profil** : Informations entreprise + sélection secteur
2. **Fondations Data** : 4 questions sur l'état des données (Q1-Q4)
3. **BI & Analytics** : 4 questions sur le pilotage & performance (Q5-Q8)
4. **IA & Automation** : 2 questions sur l'automatisation (Q9-Q10)
5. **Contact** : Capture email pour débloquer résultats
→ **Résultats** : Score + niveau de maturité + recommandations personnalisées

### Système de scoring
- **Pondération :** Data 40%, Pilotage 40%, Automatisation 20%
- **Calcul :** Score global = (scoreData × 0.40) + (scorePilotage × 0.40) + (scoreAuto × 0.20)
- **Niveaux de maturité :**
  - Débutant : 0-30 points
  - Intermédiaire : 31-60 points
  - Avancé : 61-85 points
  - Expert : 86-100 points

---

## Secteurs implémentés

### ✅ 1. Transport & Logistique
**Thématiques :**
- Gestion de flotte (véhicules, maintenance, carburant)
- Suivi des coûts par véhicule/trajet
- Optimisation des routes
- Maintenance prédictive

**État :** 100% complet et testé
- 10 questions sectorielles avec scoring
- 4 niveaux de recommandations
- Tests validés (scores 4% et 53%)

### ✅ 2. Commerce & Distribution
**Thématiques :**
- Gestion ventes et stocks multi-sites
- Suivi marges par produit/point de vente
- Prévision de la demande
- Optimisation pricing

**État :** 100% complet

### ✅ 3. Énergie / Mines
**Thématiques :**
- Production et distribution (énergie) / Extraction (mines)
- Gestion équipements et infrastructures
- Maintenance prédictive
- Monitoring environnemental et compliance
- Optimisation performance réseau/sites

**État :** 100% complet

### ⚪ 4. Autre
**Fallback :** Pour secteurs non couverts
Message : "Diagnostic détaillé bientôt disponible pour votre secteur"

---

## État actuel

### ✅ Complété (Février 2026)

#### 1. Diagnostic sectoriel
- **3 secteurs opérationnels** : Transport & Logistique, Commerce & Distribution, Énergie / Mines
- 10 questions sectorielles par secteur
- Scoring pondéré 40/40/20
- 4 niveaux de maturité (Débutant → Expert)
- Recommandations personnalisées par niveau
- Tests validés pour Transport (scores 4% et 53%)

#### 2. Page Admin (/admin)
- Authentification par mot de passe (sessionStorage)
- Liste complète des diagnostics avec filtres :
  - Par secteur
  - Par niveau de maturité
  - Par plage de dates
- Stats globales :
  - Total diagnostics
  - Répartition par secteur
  - Score moyen global
- Détail complet de chaque diagnostic (modal Sheet)
- Export CSV des diagnostics

#### 3. Mini CRM intégré
- Système de statuts commerciaux :
  - Nouveau (par défaut)
  - Contacté
  - RDV programmé
  - Proposition envoyée
  - Gagné
  - Perdu
- Notes internes par lead
- Badges colorés par statut dans la table
- Filtres par statut
- Stats CRM :
  - Nombre de nouveaux leads
  - Nombre en cours de traitement
  - Nombre de RDV programmés
  - Nombre de deals gagnés
  - Taux de conversion
- Mise à jour temps réel (optimistic update)

### 🔄 En cours / À faire

#### Priorité 1 : Automation & Nurturing
1. **Email automatique (N8N)**
   - Webhook Supabase → N8N
   - Email personnalisé selon niveau de maturité
   - PDF résultats en pièce jointe
   - Ajout automatique dans CRM

#### Priorité 2 : Démos commerciales
2. **Démo Transport & Logistique**
   - Excel flotte bordélique → Dashboard Streamlit/Looker
   - Workflow N8N (alertes maintenance)
   
3. **Démo Commerce & Distribution**
   - Excel ventes multi-sites → Dashboard marges
   - Workflow N8N (alertes rupture stock)
   
4. **Démo Énergie / Mines**
   - Excel production → Dashboard opérationnel
   - Workflow N8N (incidents/maintenance)

#### Priorité 3 : Optimisations
5. **Export PDF des résultats**
   - Rapport branded avec logo Datakö
   - Scores + visualisations
   - Recommandations détaillées

6. **Prospection active**
   - Messages personnalisés par secteur
   - LinkedIn + Email outreach
   - 20-30 entreprises cibles par secteur

## Structure du code

### Fichiers clés
```
/src
  /components
    /diagnostic
      - StepProfile.tsx          # Étape 1 : Profil + secteur
      - StepDataFoundations.tsx  # Étape 2 : Questions Q1-Q4
      - StepBIAnalytics.tsx      # Étape 3 : Questions Q5-Q8
      - StepAIAutomation.tsx     # Étape 4 : Questions Q9-Q10
      - StepContact.tsx          # Étape 5 : Capture contact
      - ResultsPage.tsx          # Résultats + recommandations
      
  /data
    - questionsBySector.ts       # Questions mappées par secteur
    - recommendations.ts         # Recommandations par niveau/secteur
    
  /hooks
    - useDiagnostic.ts          # Logique métier (scoring, navigation)
    
  /types
    - diagnostic.types.ts        # Interfaces TypeScript
    
  /pages
    - Index.tsx                  # Router principal
```

### Base de données Supabase

**Table : `diagnostics`**
```sql
- id (uuid, PK)
- created_at (timestamp)
- company_name (text)
- contact_name (text)
- email (text)
- position (text)
- company_size (text)
- country (text)
- sector (text)
- q1 à q10 (text / text[])
- score_data (numeric)
- score_pilotage (numeric)
- score_automatisation (numeric)
- score_global (numeric)
- maturity_level (text)
- completed (boolean)
```

---

## Décisions importantes

### ✅ Approche sectorielle (pas générique)
- Questions 100% adaptées au métier de chaque secteur
- Langage terrain, exemples concrets
- Positionnement expert (pas consultant généraliste)

### ✅ Impact sans montants en euros
- Contexte guinéen : éviter les montants qui peuvent paraître irréalistes
- Focus sur : pourcentages, gains de temps, bénéfices qualitatifs
- Exemple : "10-15% de réduction" au lieu de "50K€ d'économies"

### ✅ UX/UI
- Design dark premium
- Progress bars pour chaque dimension (Data, Pilotage, Auto)
- Badge coloré pour niveau de maturité
- CTAs clairs : Email, WhatsApp, En savoir plus

### ✅ Validation commerciale
- Email capturé AVANT résultats (lead magnet)
- Recommandations actionnables par niveau
- CTAs vers audit gratuit / RDV

---

## Technologies et patterns

### State management
- React hooks (useState, useEffect)
- Custom hook `useDiagnostic` pour logique métier
- Pas de Redux/Zustand (pas nécessaire pour cette app)

### Routing
- Routing manuel via state `currentStep`
- Navigation Suivant/Précédent avec validation
- Sauvegarde auto en local (localStorage) pour éviter perte données

### Styling
- Tailwind utility-first
- shadcn-ui pour composants (Select, Button, Progress, etc.)
- Design tokens cohérents (couleurs, espacements)

### API Supabase
- Insert diagnostic à la fin du parcours
- Auth optionnel (pas encore implémenté)
- RLS policies à configurer si multi-tenant

---

## Prochaines étapes

### 🔄 En cours / priorité immédiate
1. **Page Admin** : Interface pour voir tous les diagnostics
   - Liste avec filtres (secteur, score, date)
   - Détail d'un diagnostic
   - Stats globales
   - Export CSV

2. **Email automatique (N8N)** : Nurturing des leads
   - Webhook Supabase → N8N
   - Email personnalisé selon niveau
   - PDF résultats en PJ
   - Ajout auto dans CRM

### 📅 Court terme (1-2 semaines)
3. **Démos sectorielles** : Exemples concrets à montrer
   - Transport : Excel flotte → Dashboard
   - Commerce : Excel ventes → Dashboard marges
   - Énergie/Mines : Excel production → Dashboard opérationnel

4. **Export PDF** : Rapport branded
   - Logo Datakö
   - Scores + visualisations
   - Recommandations détaillées

### 🚀 Moyen terme (2-4 semaines)
5. **Prospection active** : Acquisition de leads
   - Messages personnalisés par secteur
   - LinkedIn + Email outreach
   - Suivi et nurturing

6. **Optimisations** :
   - A/B testing questions
   - Amélioration UX selon feedback
   - Analytics (tracking conversions)

---

## Tests et validation

### Parcours testés
- ✅ Transport & Logistique niveau Débutant (score ~4%)
- ✅ Transport & Logistique niveau Intermédiaire (score ~53%)
- ⚪ Autres secteurs à tester
- ⚪ Parcours complets pour niveaux Avancé et Expert

### À vérifier régulièrement
- Sauvegarde Supabase complète
- Calcul des scores correct
- Affichage conditionnel des recommandations
- CTAs fonctionnels
- Responsive mobile

---

## Notes contextuelles

### Positionnement Datakö
- **Premium Data & AI consultancy** (pas agence web généraliste)
- **Focus Guinée** mais positionnement universel
- **Secteurs prioritaires :** Transport, Commerce, Énergie/Mines
- **Valeur :** Expertise métier + exécution technique

### Philosophie produit
- **Simple > Complexe** : éviter over-engineering
- **Sectoriel > Générique** : crédibilité par la spécialisation
- **Action > Théorie** : recommandations concrètes et actionnables
- **Mesurable > Flou** : ROI chiffré (%, temps, bénéfices)

---

## Commandes utiles

### Développement
```bash
npm run dev              # Lancer en local (port 5173)
npm run build           # Build production
npm run preview         # Preview du build
```

### Git
```bash
git status              # État des fichiers
git add .               # Ajouter tous les changements
git commit -m "message" # Commit
git push origin main    # Push vers GitHub
```

### Supabase (si CLI installé)
```bash
supabase start          # Lancer Supabase local
supabase status         # Voir les services actifs
supabase db reset       # Reset database locale
```

---

## Contacts & ressources

**Projet :** Diagnostic Datakö
**Owner :** Abdou (Founder Datakö)
**Repo Git :** [URL du repo GitHub]
**Déploiement :** [URL Netlify]
**Supabase project :** [ID projet Supabase]

**Documentation technique :**
- React : https://react.dev
- Vite : https://vitejs.dev
- Tailwind : https://tailwindcss.com
- shadcn-ui : https://ui.shadcn.com
- Supabase : https://supabase.com/docs

---

*Dernière mise à jour : [Date]*
*Version : 1.0 - MVP complet 3 secteurs*