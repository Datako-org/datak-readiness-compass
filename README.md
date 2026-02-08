# Datako Diagnostic - Data & IA Readiness Compass

Outil de diagnostic en ligne permettant aux organisations d'evaluer leur maturite data et IA. Developpe par Datako.

## Stack technique

- **Frontend** : React + TypeScript + Vite
- **UI** : shadcn/ui + Tailwind CSS
- **Backend** : Supabase (base de donnees, authentification, edge functions)
- **Animations** : Framer Motion

## Installation

```sh
git clone <REPO_URL>
cd datak-readiness-compass
npm install
npm run dev
```

Le serveur de developpement demarre sur `http://localhost:8080`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run build:dev` | Build en mode developpement |
| `npm run preview` | Preview du build |
| `npm run lint` | Linting ESLint |

## Structure du projet

```
src/
  components/diagnostic/  # Composants du diagnostic (formulaires, resultats)
  data/                   # Questions et donnees statiques
  hooks/                  # Hooks React (useDiagnostic)
  integrations/supabase/  # Client et types Supabase
  types/                  # Types TypeScript
supabase/
  migrations/             # Migrations SQL
```

## Variables d'environnement

Creer un fichier `.env` a la racine :

```
VITE_SUPABASE_URL=<votre_url_supabase>
VITE_SUPABASE_ANON_KEY=<votre_cle_anon>
```
