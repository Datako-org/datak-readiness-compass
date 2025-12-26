import { Question } from '@/types/diagnostic';

// Step 2 - Data Foundations (Common to all sectors)
export const dataFoundationsQuestions: Question[] = [
  {
    id: 'df_1',
    step: 2,
    axis: 'data_foundations',
    question_text: 'Quelles sont vos principales sources de données aujourd\'hui ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune source structurée', value: 'none', score: 0 },
      { label: 'Fichiers Excel / Google Sheets', value: 'spreadsheets', score: 1 },
      { label: 'ERP ou logiciel métier unique', value: 'single_erp', score: 2 },
      { label: 'Plusieurs systèmes connectés', value: 'multiple_connected', score: 3 },
      { label: 'Data warehouse ou lac de données', value: 'data_warehouse', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'df_2',
    step: 2,
    axis: 'data_foundations',
    question_text: 'Vos données sont-elles centralisées dans un référentiel unique ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, les données sont dispersées', value: 'dispersed', score: 0 },
      { label: 'Partiellement, certaines données sont centralisées', value: 'partial', score: 2 },
      { label: 'Oui, nous avons un référentiel central', value: 'centralized', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'df_3',
    step: 2,
    axis: 'data_foundations',
    question_text: 'Quels outils utilisez-vous pour gérer vos données ?',
    question_type: 'single_choice',
    options: [
      { label: 'Uniquement des tableurs', value: 'spreadsheets', score: 1 },
      { label: 'Un ERP ou CRM standard', value: 'erp_crm', score: 2 },
      { label: 'Des outils BI basiques', value: 'basic_bi', score: 3 },
      { label: 'Une stack data moderne (cloud, ETL, etc.)', value: 'modern_stack', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
  {
    id: 'df_4',
    step: 2,
    axis: 'data_foundations',
    question_text: 'A quelle fréquence produisez-vous des rapports de données ?',
    question_type: 'single_choice',
    options: [
      { label: 'Rarement ou jamais', value: 'never', score: 0 },
      { label: 'Mensuellement', value: 'monthly', score: 1 },
      { label: 'Hebdomadairement', value: 'weekly', score: 2 },
      { label: 'Quotidiennement', value: 'daily', score: 3 },
      { label: 'En temps réel', value: 'realtime', score: 4 },
    ],
    max_score: 4,
    order_index: 4,
  },
  {
    id: 'df_5',
    step: 2,
    axis: 'data_foundations',
    question_text: 'Comment évaluez-vous la qualité de vos données ?',
    question_type: 'single_choice',
    options: [
      { label: 'Mauvaise - beaucoup d\'erreurs', value: 'poor', score: 0 },
      { label: 'Passable - quelques problèmes', value: 'fair', score: 1 },
      { label: 'Correcte - généralement fiable', value: 'good', score: 2 },
      { label: 'Bonne - validation en place', value: 'very_good', score: 3 },
      { label: 'Excellente - gouvernance stricte', value: 'excellent', score: 4 },
    ],
    max_score: 4,
    order_index: 5,
  },
];

export const transportQuestions: Question[] = [
  {
    id: 'tr_1',
    step: 3,
    axis: 'tooling',
    sector: 'transport',
    question_text: 'Disposez-vous d\'un système de suivi de flotte en temps réel ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'no', score: 0 },
      { label: 'Partiellement (quelques véhicules)', value: 'partial', score: 2 },
      { label: 'Oui, toute la flotte est suivie', value: 'yes', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'tr_2',
    step: 3,
    axis: 'tooling',
    sector: 'transport',
    question_text: 'Analysez-vous les coûts par véhicule ou par trajet ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, pas d\'analyse détaillée', value: 'no', score: 0 },
      { label: 'Analyse globale uniquement', value: 'global', score: 1 },
      { label: 'Analyse par véhicule', value: 'per_vehicle', score: 3 },
      { label: 'Analyse détaillée par trajet', value: 'per_trip', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'tr_3',
    step: 3,
    axis: 'governance',
    sector: 'transport',
    question_text: 'Comment gérez-vous les données de maintenance ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucun suivi structuré', value: 'none', score: 0 },
      { label: 'Carnet papier ou Excel', value: 'manual', score: 1 },
      { label: 'Logiciel dédié non intégré', value: 'standalone', score: 2 },
      { label: 'GMAO intégrée au SI', value: 'integrated', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
];

export const retailQuestions: Question[] = [
  {
    id: 'rt_1',
    step: 3,
    axis: 'tooling',
    sector: 'retail',
    question_text: 'Comment suivez-vous vos ventes en temps réel ?',
    question_type: 'single_choice',
    options: [
      { label: 'Pas de suivi temps réel', value: 'none', score: 0 },
      { label: 'Exports manuels réguliers', value: 'manual', score: 1 },
      { label: 'Dashboard quotidien', value: 'daily', score: 2 },
      { label: 'Tableau de bord temps réel', value: 'realtime', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'rt_2',
    step: 3,
    axis: 'tooling',
    sector: 'retail',
    question_text: 'Quelle visibilité avez-vous sur vos stocks ?',
    question_type: 'single_choice',
    options: [
      { label: 'Inventaires manuels', value: 'manual', score: 0 },
      { label: 'Suivi dans un ERP', value: 'erp', score: 2 },
      { label: 'Stocks connectés omnicanal', value: 'omnichannel', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'rt_3',
    step: 3,
    axis: 'governance',
    sector: 'retail',
    question_text: 'Collectez-vous des données clients structurées ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'none', score: 0 },
      { label: 'Email et historique achats', value: 'basic', score: 2 },
      { label: 'CRM avec segmentation', value: 'crm', score: 3 },
      { label: 'CDP vue client 360', value: 'cdp', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
];

export const energyQuestions: Question[] = [
  {
    id: 'en_1',
    step: 3,
    axis: 'tooling',
    sector: 'energy',
    question_text: 'Comment consolidez-vous vos KPIs opérationnels ?',
    question_type: 'single_choice',
    options: [
      { label: 'Manuellement via tableurs', value: 'manual', score: 0 },
      { label: 'Automatisation partielle', value: 'partial', score: 2 },
      { label: 'Consolidation automatique', value: 'automated', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'en_2',
    step: 3,
    axis: 'governance',
    sector: 'energy',
    question_text: 'Utilisez-vous des modèles de prévision ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'no', score: 0 },
      { label: 'Prévisions basiques', value: 'basic', score: 2 },
      { label: 'Modèles statistiques', value: 'statistical', score: 3 },
      { label: 'Machine learning', value: 'ml', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'en_3',
    step: 3,
    axis: 'tooling',
    sector: 'energy',
    question_text: 'Intégrez-vous des données de sources multiples ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, sources isolées', value: 'isolated', score: 0 },
      { label: 'Intégration partielle', value: 'partial', score: 2 },
      { label: 'Plateforme data unifiée', value: 'unified', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
];

export const biAnalyticsQuestions: Question[] = [
  {
    id: 'bi_1',
    step: 4,
    axis: 'bi_analytics',
    question_text: 'Disposez-vous de tableaux de bord pour suivre vos KPIs ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'no', score: 0 },
      { label: 'Oui, dans Excel/Sheets', value: 'spreadsheet', score: 1 },
      { label: 'Oui, outil BI (Power BI, Tableau)', value: 'bi_tool', score: 3 },
      { label: 'Dashboards temps réel', value: 'realtime', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'bi_2',
    step: 4,
    axis: 'bi_analytics',
    question_text: 'Qui accède aux données analytiques ?',
    question_type: 'single_choice',
    options: [
      { label: 'Direction uniquement', value: 'executives', score: 1 },
      { label: 'Quelques managers', value: 'managers', score: 2 },
      { label: 'Responsables département', value: 'department_heads', score: 3 },
      { label: 'Accès self-service', value: 'self_service', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'bi_3',
    step: 4,
    axis: 'bi_analytics',
    question_text: 'Comment les décisions stratégiques sont-elles prises ?',
    question_type: 'single_choice',
    options: [
      { label: 'Intuition et expérience', value: 'intuition', score: 0 },
      { label: 'Mix intuition et données', value: 'mixed', score: 2 },
      { label: 'Principalement data-driven', value: 'data_informed', score: 3 },
      { label: 'Culture data-driven', value: 'data_driven', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
  {
    id: 'bi_4',
    step: 4,
    axis: 'bi_analytics',
    question_text: 'Vos rapports sont-ils automatisés ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'manual', score: 0 },
      { label: 'Partiellement automatisés', value: 'partial', score: 2 },
      { label: 'Entièrement automatisés', value: 'automated', score: 4 },
    ],
    max_score: 4,
    order_index: 4,
  },
];

export const aiAutomationQuestions: Question[] = [
  {
    id: 'ai_1',
    step: 5,
    axis: 'ai_automation',
    question_text: 'Avez-vous des processus automatisés ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non, tout est manuel', value: 'none', score: 0 },
      { label: 'Automatisations simples', value: 'basic', score: 1 },
      { label: 'RPA ou workflows', value: 'rpa', score: 3 },
      { label: 'Automatisation avec IA', value: 'ai_powered', score: 4 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'ai_2',
    step: 5,
    axis: 'ai_automation',
    question_text: 'Quel est votre niveau de maturité IA ?',
    question_type: 'single_choice',
    options: [
      { label: 'Aucune expérience', value: 'none', score: 0 },
      { label: 'Exploration / POC', value: 'exploration', score: 1 },
      { label: 'Projets en production', value: 'production', score: 3 },
      { label: 'IA intégrée aux processus', value: 'integrated', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'ai_3',
    step: 5,
    axis: 'ai_automation',
    question_text: 'Quels cas d\'usage IA vous intéressent ?',
    question_type: 'single_choice',
    options: [
      { label: 'Prédiction et forecasting', value: 'prediction', score: 2 },
      { label: 'Automatisation de tâches', value: 'automation', score: 2 },
      { label: 'Analyse de documents', value: 'document_ai', score: 2 },
      { label: 'Tous ces cas', value: 'all', score: 4 },
    ],
    max_score: 4,
    order_index: 3,
  },
  {
    id: 'ai_4',
    step: 5,
    axis: 'ai_automation',
    question_text: 'Disposez-vous de compétences data/IA en interne ?',
    question_type: 'single_choice',
    options: [
      { label: 'Non', value: 'none', score: 0 },
      { label: 'Compétences IT générales', value: 'it_general', score: 1 },
      { label: 'Data analyst ou BI', value: 'data_analyst', score: 2 },
      { label: 'Data scientist', value: 'data_scientist', score: 4 },
    ],
    max_score: 4,
    order_index: 4,
  },
];

export const constraintsQuestions: Question[] = [
  {
    id: 'cp_1',
    step: 6,
    axis: 'governance',
    question_text: 'Quelles sont vos priorités business principales ?',
    question_type: 'multi_choice',
    options: [
      { label: 'Réduire les coûts', value: 'reduce_costs', score: 1 },
      { label: 'Expérience client', value: 'customer_experience', score: 1 },
      { label: 'Accélérer les décisions', value: 'faster_decisions', score: 1 },
      { label: 'Innovation', value: 'innovation', score: 1 },
    ],
    max_score: 4,
    order_index: 1,
  },
  {
    id: 'cp_2',
    step: 6,
    axis: 'governance',
    question_text: 'Quel budget envisagez-vous pour un projet data/IA ?',
    question_type: 'single_choice',
    options: [
      { label: 'Moins de 10 000 EUR', value: 'under_10k', score: 1 },
      { label: '10 000 - 50 000 EUR', value: '10k_50k', score: 2 },
      { label: '50 000 - 100 000 EUR', value: '50k_100k', score: 3 },
      { label: 'Plus de 100 000 EUR', value: 'over_100k', score: 4 },
    ],
    max_score: 4,
    order_index: 2,
  },
  {
    id: 'cp_3',
    step: 6,
    axis: 'governance',
    question_text: 'Quel est votre horizon de temps souhaité ?',
    question_type: 'single_choice',
    options: [
      { label: 'Immédiat (moins de 3 mois)', value: 'immediate', score: 4 },
      { label: 'Court terme (3-6 mois)', value: 'short_term', score: 3 },
      { label: 'Moyen terme (6-12 mois)', value: 'medium_term', score: 2 },
      { label: 'Long terme (plus de 12 mois)', value: 'long_term', score: 1 },
    ],
    max_score: 4,
    order_index: 3,
  },
];

export const getQuestionsForStep = (step: number, sector?: string): Question[] => {
  switch (step) {
    case 2:
      return dataFoundationsQuestions;
    case 3:
      switch (sector) {
        case 'transport':
          return transportQuestions;
        case 'retail':
          return retailQuestions;
        case 'energy':
          return energyQuestions;
        default:
          return [];
      }
    case 4:
      return biAnalyticsQuestions;
    case 5:
      return aiAutomationQuestions;
    case 6:
      return constraintsQuestions;
    default:
      return [];
  }
};

export const getAllQuestions = (sector?: string): Question[] => {
  return [
    ...dataFoundationsQuestions,
    ...(sector ? getQuestionsForStep(3, sector) : []),
    ...biAnalyticsQuestions,
    ...aiAutomationQuestions,
    ...constraintsQuestions,
  ];
};
