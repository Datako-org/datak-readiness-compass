import { useDiagnostic } from '@/hooks/useDiagnostic';
import { getQuestionsForStep } from '@/data/questions';
import { LandingPage } from '@/components/diagnostic/LandingPage';
import { ProgressBar } from '@/components/diagnostic/ProgressBar';
import { CompanyProfileStep } from '@/components/diagnostic/steps/CompanyProfileStep';
import { QuestionStep } from '@/components/diagnostic/steps/QuestionStep';
import { ContactStep } from '@/components/diagnostic/steps/ContactStep';
import { ResultsPage } from '@/components/diagnostic/ResultsPage';

const STEP_TITLES: Record<number, { title: string; subtitle?: string }> = {
  2: { title: 'Fondations Data', subtitle: 'Évaluons la maturité de vos données' },
  3: { title: 'Module Sectoriel', subtitle: 'Questions spécifiques à votre secteur' },
  4: { title: 'BI & Analytics', subtitle: 'Vos pratiques analytiques' },
  5: { title: 'IA & Automatisation', subtitle: 'Votre niveau d\'automatisation' },
  6: { title: 'Contraintes & Priorités', subtitle: 'Vos objectifs et budget' },
};

const Index = () => {
  const {
    currentStep,
    formData,
    result,
    isSubmitting,
    updateOrganization,
    updateRespondent,
    updateAnswer,
    nextStep,
    prevStep,
    submitDiagnostic,
    resetDiagnostic,
  } = useDiagnostic();

  // Total steps: landing (0) + company profile (1) + 5 question steps (2-6) + contact (7)
  const totalSteps = 7;

  // Step 0: Landing page
  if (currentStep === 0) {
    return <LandingPage onStart={nextStep} />;
  }

  // Results page (after submission)
  if (result) {
    return <ResultsPage result={result} onRestart={resetDiagnostic} />;
  }

  // Step 1: Company Profile
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={1} totalSteps={totalSteps} />
        <CompanyProfileStep
          data={formData.organization}
          role={formData.respondent.role}
          onUpdate={updateOrganization}
          onUpdateRole={(role) => updateRespondent({ role })}
          onNext={nextStep}
          onPrev={prevStep}
        />
      </div>
    );
  }

  // Contact step (step 7)
  if (currentStep === 7) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <ContactStep
          data={formData.respondent}
          onUpdate={updateRespondent}
          onSubmit={submitDiagnostic}
          onPrev={prevStep}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // Question steps (2-6)
  const stepQuestions = getQuestionsForStep(currentStep, formData.organization.sector);
  const stepInfo = STEP_TITLES[currentStep];

  // Skip sector-specific step if no sector selected or no questions
  if (currentStep === 3 && stepQuestions.length === 0) {
    // Auto-advance to next step
    nextStep();
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (stepQuestions.length > 0 && stepInfo) {
    return (
      <div className="min-h-screen bg-background">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <QuestionStep
          title={stepInfo.title}
          subtitle={stepInfo.subtitle}
          questions={stepQuestions}
          answers={formData.answers}
          onAnswer={updateAnswer}
          onNext={nextStep}
          onPrev={prevStep}
          isLastStep={currentStep === 6}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  );
};

export default Index;
