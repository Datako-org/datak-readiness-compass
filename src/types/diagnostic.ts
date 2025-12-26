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

export interface AxisScore {
  axis: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface DiagnosticResult {
  id?: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  maturityLevel: 'debutant' | 'intermediaire' | 'avance';
  axisScores: AxisScore[];
}

export interface DiagnosticFormData {
  organization: Organization;
  respondent: Respondent;
  answers: Record<string, DiagnosticAnswer>;
}

export interface Question {
  id: string;
  step: number;
  axis: string;
  sector?: string;
  question_text: string;
  question_type: 'single_choice' | 'multi_choice';
  options: QuestionOption[];
  max_score: number;
  order_index: number;
}

export interface QuestionOption {
  label: string;
  value: string;
  score: number;
}

export const SECTORS = [
  { value: 'transport', label: 'Transport & Logistique' },
  { value: 'retail', label: 'Retail & Commerce' },
  { value: 'energy', label: 'Énergie & Utilities' },
] as const;

export const COMPANY_SIZES = [
  { value: '1-10', label: '1 à 10 employés' },
  { value: '11-50', label: '11 à 50 employés' },
  { value: '51-250', label: '51 à 250 employés' },
  { value: '250+', label: 'Plus de 250 employés' },
] as const;

export const ROLES = [
  { value: 'ceo', label: 'Direction Générale (CEO)' },
  { value: 'ops', label: 'Opérations' },
  { value: 'it', label: 'IT / DSI' },
  { value: 'finance', label: 'Finance / DAF' },
  { value: 'other', label: 'Autre' },
] as const;

export const COUNTRIES = [
  { value: 'france', label: 'France' },
  { value: 'belgique', label: 'Belgique' },
  { value: 'suisse', label: 'Suisse' },
  { value: 'canada', label: 'Canada' },
  { value: 'luxembourg', label: 'Luxembourg' },
  { value: 'other', label: 'Autre' },
] as const;

export const AXES = [
  { id: 'data_foundations', label: 'Fondations Data', maxScore: 20 },
  { id: 'tooling', label: 'Outillage', maxScore: 20 },
  { id: 'governance', label: 'Gouvernance & Processus', maxScore: 20 },
  { id: 'bi_analytics', label: 'BI & Analytics', maxScore: 20 },
  { id: 'ai_automation', label: 'IA & Automatisation', maxScore: 20 },
] as const;
