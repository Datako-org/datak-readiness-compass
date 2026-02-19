export interface AdminDiagnosticRow {
  id: string;
  completed_at: string;
  total_score: number;
  maturity_level: string;
  axis_scores: unknown;
  org_name: string;
  sector: string;
  country: string;
  size: string;
  respondent_name: string;
  email: string;
  role: string;
  phone: string | null;
}

export interface AdminDiagnosticAnswer {
  id: string;
  question_id: string | null;
  answer_value: string;
  score: number;
}

export interface AdminStats {
  total: number;
  avgScore: number;
  sectorCounts: Record<string, number>;
  advancedPercent: number;
}

export interface Organization {
  id?: string;
  name: string;
  sector: string;
  country: string;
  size: string;
}

export interface Respondent {
  id?: string;
  organization_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  consent_given: boolean;
}

export interface DiagnosticAnswer {
  questionId: string;
  value: string;
  score: number;
}

export interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
}

export interface DiagnosticResult {
  id?: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  maturityLevel: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  dimensionScores: DimensionScore[];
  sector: string;
}

export interface DiagnosticFormData {
  organization: Organization;
  respondent: Respondent;
  answers: Record<string, DiagnosticAnswer>;
}

export interface Question {
  id: string;
  step: number;
  dimension: string;
  sector?: string;
  question_text: string;
  question_type: 'single_choice' | 'multi_choice';
  options: QuestionOption[];
  max_score: number;
  order_index: number;
  scoring_mode?: 'default' | 'count';
}

export interface QuestionOption {
  label: string;
  value: string;
  score: number;
}

export interface SectorRecommendation {
  title: string;
  actions: string[];
  impact: string;
  roi?: string;
}

export const SECTORS = [
  { value: 'transport', label: 'Transport & Logistique' },
  { value: 'retail', label: 'Commerce & Distribution' },
  { value: 'energy', label: 'Énergie & Mines' },
  { value: 'autre', label: 'Autre' },
] as const;

export const COMPANY_SIZES = [
  { value: '1-10', label: '1 à 10 employés' },
  { value: '11-50', label: '11 à 50 employés' },
  { value: '51-250', label: '51 à 250 employés' },
  { value: '250+', label: 'Plus de 250 employés' },
] as const;

export const ROLES = [
  { value: 'ceo', label: 'Dirigeant / Gérant' },
  { value: 'ops', label: 'Opérations' },
  { value: 'it', label: 'IT / DSI' },
  { value: 'finance', label: 'Finance / DAF' },
  { value: 'other', label: 'Autre' },
] as const;

export const COUNTRIES = [
  { value: 'guinée', label: 'Guinée' },
  { value: 'france', label: 'France' },
  { value: 'other', label: 'Autre' },
] as const;

export const DIMENSIONS = [
  { id: 'data', label: 'État des données', weight: 0.40 },
  { id: 'pilotage', label: 'Pilotage & Performance', weight: 0.40 },
  { id: 'automation', label: 'Automatisation & IA', weight: 0.20 },
] as const;
