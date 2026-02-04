-- Migration: Insert all questions from questions.ts
-- Date: 2026-02-04

-- Step 1: Drop foreign key constraint on answers table
ALTER TABLE public.answers DROP CONSTRAINT IF EXISTS answers_question_id_fkey;

-- Step 2: Change questions.id from UUID to TEXT
ALTER TABLE public.questions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.questions ALTER COLUMN id TYPE TEXT;

-- Step 3: Change answers.question_id from UUID to TEXT
ALTER TABLE public.answers ALTER COLUMN question_id TYPE TEXT;

-- Step 4: Clear existing questions (if any)
DELETE FROM public.questions;

-- Step 5: Insert Data Foundations questions (Step 2 - Common to all sectors)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('df_1', 2, 'data_foundations', NULL, 'Quelles sont vos principales sources de données aujourd''hui ?', 'single_choice',
  '[{"label": "Aucune source structurée", "value": "none", "score": 0}, {"label": "Fichiers Excel / Google Sheets", "value": "spreadsheets", "score": 1}, {"label": "ERP ou logiciel métier unique", "value": "single_erp", "score": 2}, {"label": "Plusieurs systèmes connectés", "value": "multiple_connected", "score": 3}, {"label": "Data warehouse ou lac de données", "value": "data_warehouse", "score": 4}]'::jsonb,
  4, 1),

('df_2', 2, 'data_foundations', NULL, 'Vos données sont-elles centralisées dans un référentiel unique ?', 'single_choice',
  '[{"label": "Non, les données sont dispersées", "value": "dispersed", "score": 0}, {"label": "Partiellement, certaines données sont centralisées", "value": "partial", "score": 2}, {"label": "Oui, nous avons un référentiel central", "value": "centralized", "score": 4}]'::jsonb,
  4, 2),

('df_3', 2, 'data_foundations', NULL, 'Quels outils utilisez-vous pour gérer vos données ?', 'single_choice',
  '[{"label": "Uniquement des tableurs", "value": "spreadsheets", "score": 1}, {"label": "Un ERP ou CRM standard", "value": "erp_crm", "score": 2}, {"label": "Des outils BI basiques", "value": "basic_bi", "score": 3}, {"label": "Une stack data moderne (cloud, ETL, etc.)", "value": "modern_stack", "score": 4}]'::jsonb,
  4, 3),

('df_4', 2, 'data_foundations', NULL, 'A quelle fréquence produisez-vous des rapports de données ?', 'single_choice',
  '[{"label": "Rarement ou jamais", "value": "never", "score": 0}, {"label": "Mensuellement", "value": "monthly", "score": 1}, {"label": "Hebdomadairement", "value": "weekly", "score": 2}, {"label": "Quotidiennement", "value": "daily", "score": 3}, {"label": "En temps réel", "value": "realtime", "score": 4}]'::jsonb,
  4, 4),

('df_5', 2, 'data_foundations', NULL, 'Comment évaluez-vous la qualité de vos données ?', 'single_choice',
  '[{"label": "Mauvaise - beaucoup d''erreurs", "value": "poor", "score": 0}, {"label": "Passable - quelques problèmes", "value": "fair", "score": 1}, {"label": "Correcte - généralement fiable", "value": "good", "score": 2}, {"label": "Bonne - validation en place", "value": "very_good", "score": 3}, {"label": "Excellente - gouvernance stricte", "value": "excellent", "score": 4}]'::jsonb,
  4, 5);

-- Step 6: Insert Transport sector questions (Step 3)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('tr_1', 3, 'tooling', 'transport', 'Disposez-vous d''un système de suivi de flotte en temps réel ?', 'single_choice',
  '[{"label": "Non", "value": "no", "score": 0}, {"label": "Partiellement (quelques véhicules)", "value": "partial", "score": 2}, {"label": "Oui, toute la flotte est suivie", "value": "yes", "score": 4}]'::jsonb,
  4, 1),

('tr_2', 3, 'tooling', 'transport', 'Analysez-vous les coûts par véhicule ou par trajet ?', 'single_choice',
  '[{"label": "Non, pas d''analyse détaillée", "value": "no", "score": 0}, {"label": "Analyse globale uniquement", "value": "global", "score": 1}, {"label": "Analyse par véhicule", "value": "per_vehicle", "score": 3}, {"label": "Analyse détaillée par trajet", "value": "per_trip", "score": 4}]'::jsonb,
  4, 2),

('tr_3', 3, 'governance', 'transport', 'Comment gérez-vous les données de maintenance ?', 'single_choice',
  '[{"label": "Aucun suivi structuré", "value": "none", "score": 0}, {"label": "Carnet papier ou Excel", "value": "manual", "score": 1}, {"label": "Logiciel dédié non intégré", "value": "standalone", "score": 2}, {"label": "GMAO intégrée au SI", "value": "integrated", "score": 4}]'::jsonb,
  4, 3);

-- Step 7: Insert Retail sector questions (Step 3)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('rt_1', 3, 'tooling', 'retail', 'Comment suivez-vous vos ventes en temps réel ?', 'single_choice',
  '[{"label": "Pas de suivi temps réel", "value": "none", "score": 0}, {"label": "Exports manuels réguliers", "value": "manual", "score": 1}, {"label": "Dashboard quotidien", "value": "daily", "score": 2}, {"label": "Tableau de bord temps réel", "value": "realtime", "score": 4}]'::jsonb,
  4, 1),

('rt_2', 3, 'tooling', 'retail', 'Quelle visibilité avez-vous sur vos stocks ?', 'single_choice',
  '[{"label": "Inventaires manuels", "value": "manual", "score": 0}, {"label": "Suivi dans un ERP", "value": "erp", "score": 2}, {"label": "Stocks connectés omnicanal", "value": "omnichannel", "score": 4}]'::jsonb,
  4, 2),

('rt_3', 3, 'governance', 'retail', 'Collectez-vous des données clients structurées ?', 'single_choice',
  '[{"label": "Non", "value": "none", "score": 0}, {"label": "Email et historique achats", "value": "basic", "score": 2}, {"label": "CRM avec segmentation", "value": "crm", "score": 3}, {"label": "CDP vue client 360", "value": "cdp", "score": 4}]'::jsonb,
  4, 3);

-- Step 8: Insert Energy sector questions (Step 3)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('en_1', 3, 'tooling', 'energy', 'Comment consolidez-vous vos KPIs opérationnels ?', 'single_choice',
  '[{"label": "Manuellement via tableurs", "value": "manual", "score": 0}, {"label": "Automatisation partielle", "value": "partial", "score": 2}, {"label": "Consolidation automatique", "value": "automated", "score": 4}]'::jsonb,
  4, 1),

('en_2', 3, 'governance', 'energy', 'Utilisez-vous des modèles de prévision ?', 'single_choice',
  '[{"label": "Non", "value": "no", "score": 0}, {"label": "Prévisions basiques", "value": "basic", "score": 2}, {"label": "Modèles statistiques", "value": "statistical", "score": 3}, {"label": "Machine learning", "value": "ml", "score": 4}]'::jsonb,
  4, 2),

('en_3', 3, 'tooling', 'energy', 'Intégrez-vous des données de sources multiples ?', 'single_choice',
  '[{"label": "Non, sources isolées", "value": "isolated", "score": 0}, {"label": "Intégration partielle", "value": "partial", "score": 2}, {"label": "Plateforme data unifiée", "value": "unified", "score": 4}]'::jsonb,
  4, 3);

-- Step 9: Insert BI & Analytics questions (Step 4 - Common)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('bi_1', 4, 'bi_analytics', NULL, 'Disposez-vous de tableaux de bord pour suivre vos KPIs ?', 'single_choice',
  '[{"label": "Non", "value": "no", "score": 0}, {"label": "Oui, dans Excel/Sheets", "value": "spreadsheet", "score": 1}, {"label": "Oui, outil BI (Power BI, Tableau)", "value": "bi_tool", "score": 3}, {"label": "Dashboards temps réel", "value": "realtime", "score": 4}]'::jsonb,
  4, 1),

('bi_2', 4, 'bi_analytics', NULL, 'Qui accède aux données analytiques ?', 'single_choice',
  '[{"label": "Direction uniquement", "value": "executives", "score": 1}, {"label": "Quelques managers", "value": "managers", "score": 2}, {"label": "Responsables département", "value": "department_heads", "score": 3}, {"label": "Accès self-service", "value": "self_service", "score": 4}]'::jsonb,
  4, 2),

('bi_3', 4, 'bi_analytics', NULL, 'Comment les décisions stratégiques sont-elles prises ?', 'single_choice',
  '[{"label": "Intuition et expérience", "value": "intuition", "score": 0}, {"label": "Mix intuition et données", "value": "mixed", "score": 2}, {"label": "Principalement data-driven", "value": "data_informed", "score": 3}, {"label": "Culture data-driven", "value": "data_driven", "score": 4}]'::jsonb,
  4, 3),

('bi_4', 4, 'bi_analytics', NULL, 'Vos rapports sont-ils automatisés ?', 'single_choice',
  '[{"label": "Non, tout est manuel", "value": "manual", "score": 0}, {"label": "Partiellement automatisés", "value": "partial", "score": 2}, {"label": "Entièrement automatisés", "value": "automated", "score": 4}]'::jsonb,
  4, 4);

-- Step 10: Insert AI & Automation questions (Step 5 - Common)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('ai_1', 5, 'ai_automation', NULL, 'Avez-vous des processus automatisés ?', 'single_choice',
  '[{"label": "Non, tout est manuel", "value": "none", "score": 0}, {"label": "Automatisations simples", "value": "basic", "score": 1}, {"label": "RPA ou workflows", "value": "rpa", "score": 3}, {"label": "Automatisation avec IA", "value": "ai_powered", "score": 4}]'::jsonb,
  4, 1),

('ai_2', 5, 'ai_automation', NULL, 'Quel est votre niveau de maturité IA ?', 'single_choice',
  '[{"label": "Aucune expérience", "value": "none", "score": 0}, {"label": "Exploration / POC", "value": "exploration", "score": 1}, {"label": "Projets en production", "value": "production", "score": 3}, {"label": "IA intégrée aux processus", "value": "integrated", "score": 4}]'::jsonb,
  4, 2),

('ai_3', 5, 'ai_automation', NULL, 'Quels cas d''usage IA vous intéressent ?', 'single_choice',
  '[{"label": "Prédiction et forecasting", "value": "prediction", "score": 2}, {"label": "Automatisation de tâches", "value": "automation", "score": 2}, {"label": "Analyse de documents", "value": "document_ai", "score": 2}, {"label": "Tous ces cas", "value": "all", "score": 4}]'::jsonb,
  4, 3),

('ai_4', 5, 'ai_automation', NULL, 'Disposez-vous de compétences data/IA en interne ?', 'single_choice',
  '[{"label": "Non", "value": "none", "score": 0}, {"label": "Compétences IT générales", "value": "it_general", "score": 1}, {"label": "Data analyst ou BI", "value": "data_analyst", "score": 2}, {"label": "Data scientist", "value": "data_scientist", "score": 4}]'::jsonb,
  4, 4);

-- Step 11: Insert Constraints & Priorities questions (Step 6 - Common)
INSERT INTO public.questions (id, step, axis, sector, question_text, question_type, options, max_score, order_index) VALUES
('cp_1', 6, 'governance', NULL, 'Quelles sont vos priorités business principales ?', 'multi_choice',
  '[{"label": "Réduire les coûts", "value": "reduce_costs", "score": 1}, {"label": "Expérience client", "value": "customer_experience", "score": 1}, {"label": "Accélérer les décisions", "value": "faster_decisions", "score": 1}, {"label": "Innovation", "value": "innovation", "score": 1}]'::jsonb,
  4, 1),

('cp_2', 6, 'governance', NULL, 'Quel budget envisagez-vous pour un projet data/IA ?', 'single_choice',
  '[{"label": "Moins de 10 000 EUR", "value": "under_10k", "score": 1}, {"label": "10 000 - 50 000 EUR", "value": "10k_50k", "score": 2}, {"label": "50 000 - 100 000 EUR", "value": "50k_100k", "score": 3}, {"label": "Plus de 100 000 EUR", "value": "over_100k", "score": 4}]'::jsonb,
  4, 2),

('cp_3', 6, 'governance', NULL, 'Quel est votre horizon de temps souhaité ?', 'single_choice',
  '[{"label": "Immédiat (moins de 3 mois)", "value": "immediate", "score": 4}, {"label": "Court terme (3-6 mois)", "value": "short_term", "score": 3}, {"label": "Moyen terme (6-12 mois)", "value": "medium_term", "score": 2}, {"label": "Long terme (plus de 12 mois)", "value": "long_term", "score": 1}]'::jsonb,
  4, 3);

-- Step 12: Re-create foreign key constraint (optional - remove if not needed)
-- ALTER TABLE public.answers ADD CONSTRAINT answers_question_id_fkey
--   FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Verify insertion
-- SELECT COUNT(*) as total_questions FROM public.questions;
-- Expected: 22 questions
