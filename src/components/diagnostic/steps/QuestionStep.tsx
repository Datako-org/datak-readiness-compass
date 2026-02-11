import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, DiagnosticAnswer } from '@/types/diagnostic';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuestionStepProps {
  title: string;
  subtitle?: string;
  questions: Question[];
  answers: Record<string, DiagnosticAnswer>;
  onAnswer: (questionId: string, answer: DiagnosticAnswer) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep?: boolean;
}

export const QuestionStep = ({
  title,
  subtitle,
  questions,
  answers,
  onAnswer,
  onNext,
  onPrev,
  isLastStep = false,
}: QuestionStepProps) => {
  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSingleChoice = (question: Question, value: string) => {
    const option = question.options.find((o) => o.value === value);
    if (option) {
      onAnswer(question.id, {
        questionId: question.id,
        value,
        score: option.score,
      });
    }
  };

  const handleMultiChoice = (question: Question, value: string, checked: boolean) => {
    const currentAnswer = answers[question.id];
    let selectedValues: string[] = currentAnswer
      ? currentAnswer.value.split(',').filter(Boolean)
      : [];

    // Count-based scoring mode (for Q10-style questions)
    if (question.scoring_mode === 'count') {
      const isExclusiveOption = value === 'not_relevant';

      if (isExclusiveOption && checked) {
        // Selecting "not relevant" deselects all others
        selectedValues = ['not_relevant'];
      } else if (!isExclusiveOption && checked) {
        // Selecting a regular option removes "not relevant"
        selectedValues = selectedValues.filter(v => v !== 'not_relevant');
        selectedValues.push(value);
      } else {
        // Unchecking
        selectedValues = selectedValues.filter(v => v !== value);
      }

      // Count non-exclusive selections
      const count = selectedValues.filter(v => v !== 'not_relevant').length;
      let score: number;
      if (count >= 4) score = 100;
      else if (count >= 2) score = 70;
      else if (count === 1) score = 40;
      else score = 10;

      onAnswer(question.id, {
        questionId: question.id,
        value: selectedValues.join(','),
        score,
      });
      return;
    }

    // Default sum-based scoring
    if (checked) {
      selectedValues.push(value);
    } else {
      selectedValues = selectedValues.filter((v) => v !== value);
    }

    let totalScore = 0;
    selectedValues.forEach((v) => {
      const option = question.options.find((o) => o.value === v);
      if (option) totalScore += option.score;
    });
    totalScore = Math.min(totalScore, question.max_score);

    onAnswer(question.id, {
      questionId: question.id,
      value: selectedValues.join(','),
      score: totalScore,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-3">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <h3 className="text-lg font-medium mb-4">{question.question_text}</h3>

              {question.question_type === 'single_choice' ? (
                <RadioGroup
                  value={answers[question.id]?.value || ''}
                  onValueChange={(value) => handleSingleChoice(question, value)}
                  className="space-y-3"
                >
                  {question.options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                        answers[question.id]?.value === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-secondary"
                      )}
                      onClick={() => handleSingleChoice(question, option.value)}
                    >
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label
                        htmlFor={`${question.id}-${option.value}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const selectedValues = answers[question.id]?.value.split(',') || [];
                    const isChecked = selectedValues.includes(option.value);

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                          isChecked
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-secondary"
                        )}
                        onClick={() => handleMultiChoice(question, option.value, !isChecked)}
                      >
                        <Checkbox
                          id={`${question.id}-${option.value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleMultiChoice(question, option.value, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`${question.id}-${option.value}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          className="border-border hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={onNext}
          disabled={!allAnswered}
          className="gradient-datako text-primary-foreground hover:opacity-90"
        >
          {isLastStep ? 'Finaliser' : 'Continuer'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
