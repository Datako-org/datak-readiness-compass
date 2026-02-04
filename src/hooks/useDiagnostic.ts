import { useState, useCallback } from 'react';
import { 
  DiagnosticFormData, 
  DiagnosticAnswer, 
  DiagnosticResult, 
  AxisScore,
  Organization,
  Respondent 
} from '@/types/diagnostic';
import { getAllQuestions } from '@/data/questions';
import { supabase } from '@/integrations/supabase/client';

const INITIAL_ORGANIZATION: Organization = {
  name: '',
  sector: '',
  country: '',
  size: '',
};

const INITIAL_RESPONDENT: Respondent = {
  name: '',
  email: '',
  phone: '',
  role: '',
  consent_given: false,
};

export const useDiagnostic = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DiagnosticFormData>({
    organization: INITIAL_ORGANIZATION,
    respondent: INITIAL_RESPONDENT,
    answers: {},
  });
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOrganization = useCallback((data: Partial<Organization>) => {
    setFormData(prev => ({
      ...prev,
      organization: { ...prev.organization, ...data },
    }));
  }, []);

  const updateRespondent = useCallback((data: Partial<Respondent>) => {
    setFormData(prev => ({
      ...prev,
      respondent: { ...prev.respondent, ...data },
    }));
  }, []);

  const updateAnswer = useCallback((questionId: string, answer: DiagnosticAnswer) => {
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const calculateResults = useCallback((): DiagnosticResult => {
    const questions = getAllQuestions(formData.organization.sector);
    const answers = formData.answers;

    // Calculate scores per axis
    const axisMap = new Map<string, { total: number; max: number }>();
    
    questions.forEach(q => {
      if (!axisMap.has(q.axis)) {
        axisMap.set(q.axis, { total: 0, max: 0 });
      }
      const axisData = axisMap.get(q.axis)!;
      axisData.max += q.max_score;
      
      const answer = answers[q.id];
      if (answer) {
        axisData.total += answer.score;
      }
    });

    const axisScores: AxisScore[] = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    const axisLabels: Record<string, string> = {
      data_foundations: 'Fondations Data',
      tooling: 'Outillage',
      governance: 'Gouvernance & Processus',
      bi_analytics: 'BI & Analytics',
      ai_automation: 'IA & Automatisation',
    };

    axisMap.forEach((data, axis) => {
      const percentage = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;
      axisScores.push({
        axis: axisLabels[axis] || axis,
        score: data.total,
        maxScore: data.max,
        percentage,
      });
      totalScore += data.total;
      maxPossibleScore += data.max;
    });

    const percentage = maxPossibleScore > 0 
      ? Math.round((totalScore / maxPossibleScore) * 100) 
      : 0;

    let maturityLevel: 'debutant' | 'intermediaire' | 'avance';
    if (percentage < 40) {
      maturityLevel = 'debutant';
    } else if (percentage < 70) {
      maturityLevel = 'intermediaire';
    } else {
      maturityLevel = 'avance';
    }

    return {
      totalScore,
      maxPossibleScore,
      percentage,
      maturityLevel,
      axisScores,
    };
  }, [formData]);

  const submitDiagnostic = useCallback(async () => {
    setIsSubmitting(true);
    console.log('📊 Diagnostic submission started', {
      organization: formData.organization,
      respondent: formData.respondent,
      answersCount: Object.keys(formData.answers).length
    });

    try {
      const calculatedResult = calculateResults();

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.organization.name,
          sector: formData.organization.sector,
          country: formData.organization.country,
          size: formData.organization.size,
        })
        .select()
        .single();

      if (orgError) throw orgError;
      console.log('✅ Organization created:', orgData);

      // Create respondent
      const { data: respondentData, error: respondentError } = await supabase
        .from('respondents')
        .insert({
          organization_id: orgData.id,
          name: formData.respondent.name,
          email: formData.respondent.email,
          phone: formData.respondent.phone || null,
          role: formData.respondent.role,
          consent_given: formData.respondent.consent_given,
        })
        .select()
        .single();

      if (respondentError) throw respondentError;
      console.log('✅ Respondent created:', respondentData);

      // Create diagnostic
      const { data: diagnosticData, error: diagnosticError } = await supabase
        .from('diagnostics')
        .insert([{
          organization_id: orgData.id,
          respondent_id: respondentData.id,
          total_score: calculatedResult.totalScore,
          maturity_level: calculatedResult.maturityLevel,
          axis_scores: JSON.parse(JSON.stringify(calculatedResult.axisScores)),
          status: 'completed',
          completed_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (diagnosticError) throw diagnosticError;
      console.log('✅ Diagnostic created:', diagnosticData);

      // Store answers
      const answersToInsert = Object.entries(formData.answers).map(([questionId, answer]) => ({
        diagnostic_id: diagnosticData.id,
        question_id: questionId,
        answer_value: answer.value,
        score: answer.score,
      }));

      if (answersToInsert.length > 0) {
        const { error: answersError } = await supabase
          .from('answers')
          .insert(answersToInsert);

        if (answersError) throw answersError;
      }

      // Try to send emails via edge function (if available)
      try {
        await supabase.functions.invoke('send-diagnostic-emails', {
          body: {
            diagnosticId: diagnosticData.id,
            organization: formData.organization,
            respondent: formData.respondent,
            result: calculatedResult,
          },
        });
      } catch {
        // Email sending is optional, don't fail the submission
        console.log('Email sending skipped');
      }

      setResult({ ...calculatedResult, id: diagnosticData.id });
      nextStep();
    } catch (error) {
      console.error('❌ Submission failed:', error);
      alert('Erreur lors de l\'envoi. Vérifiez la console.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, calculateResults, nextStep]);

  const resetDiagnostic = useCallback(() => {
    setCurrentStep(0);
    setFormData({
      organization: INITIAL_ORGANIZATION,
      respondent: INITIAL_RESPONDENT,
      answers: {},
    });
    setResult(null);
  }, []);

  return {
    currentStep,
    formData,
    result,
    isSubmitting,
    updateOrganization,
    updateRespondent,
    updateAnswer,
    nextStep,
    prevStep,
    goToStep,
    submitDiagnostic,
    resetDiagnostic,
  };
};
