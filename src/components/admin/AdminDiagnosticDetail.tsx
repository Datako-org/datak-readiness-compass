import { useEffect, useState } from 'react';
import { AdminDiagnosticRow, AdminDiagnosticAnswer, DimensionScore } from '@/types/diagnostic';
import { getAllQuestions } from '@/data/questions';
import { getRecommendations, getMaturityLabel, getMaturityColor } from '@/data/recommendations';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

interface DetailData {
  organizations: { name: string; sector: string; country: string; size: string } | null;
  respondents: { name: string; email: string; phone: string | null; role: string } | null;
  axis_scores: DimensionScore[];
  answers: AdminDiagnosticAnswer[];
  maturity_level: string;
  total_score: number;
}

interface AdminDiagnosticDetailProps {
  diagnostic: AdminDiagnosticRow | null;
  onClose: () => void;
  password: string;
}

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport & Logistique',
  retail: 'Commerce & Distribution',
  energy: 'Énergie & Mines',
  autre: 'Autre',
};

const SIZE_LABELS: Record<string, string> = {
  '1-10': '1 à 10 employés',
  '11-50': '11 à 50 employés',
  '51-250': '51 à 250 employés',
  '250+': 'Plus de 250 employés',
};

const ROLE_LABELS: Record<string, string> = {
  ceo: 'Dirigeant / Gérant',
  ops: 'Opérations',
  it: 'IT / DSI',
  finance: 'Finance / DAF',
  other: 'Autre',
};

const getAnswerLabel = (
  questionId: string | null,
  answerValue: string,
  sector: string
): { questionText: string; answerLabel: string } => {
  if (!questionId) return { questionText: questionId ?? '—', answerLabel: answerValue };

  const questions = getAllQuestions(sector);
  const question = questions.find((q) => q.id === questionId);

  if (!question) return { questionText: questionId, answerLabel: answerValue };

  const questionText = question.question_text;

  if (question.question_type === 'multi_choice') {
    const values = answerValue.split(',').map((v) => v.trim());
    const labels = values.map(
      (v) => question.options.find((o) => o.value === v)?.label ?? v
    );
    return { questionText, answerLabel: labels.join(', ') };
  }

  const optionLabel = question.options.find((o) => o.value === answerValue)?.label ?? answerValue;
  return { questionText, answerLabel: optionLabel };
};

const AdminDiagnosticDetail = ({ diagnostic, onClose, password }: AdminDiagnosticDetailProps) => {
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!diagnostic) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(
          `/.netlify/functions/admin-diagnostics?id=${diagnostic.id}`,
          { headers: { 'x-admin-password': password } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const raw = json.data;
        setDetail({
          organizations: raw.organizations,
          respondents: raw.respondents,
          axis_scores: Array.isArray(raw.axis_scores) ? raw.axis_scores : [],
          answers: Array.isArray(raw.answers) ? raw.answers : [],
          maturity_level: raw.maturity_level,
          total_score: raw.total_score,
        });
      } catch {
        setError('Impossible de charger les détails');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [diagnostic, password]);

  const sector = detail?.organizations?.sector ?? diagnostic?.sector ?? '';
  const maturityLevel = (detail?.maturity_level ?? diagnostic?.maturity_level ?? 'debutant') as MaturityLevel;
  const maturityColors = getMaturityColor(maturityLevel);
  const recommendation = getRecommendations(sector, maturityLevel);

  return (
    <Sheet open={!!diagnostic} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SheetTitle className="text-lg leading-tight">
              {diagnostic?.org_name || 'Diagnostic'}
            </SheetTitle>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${maturityColors.text} ${maturityColors.bg} ${maturityColors.border}`}
            >
              {diagnostic?.total_score}% — {getMaturityLabel(maturityLevel)}
            </span>
          </div>
        </SheetHeader>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive py-4">{error}</p>
        )}

        {!isLoading && !error && detail && (
          <Tabs defaultValue="profil">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="profil" className="flex-1">Profil</TabsTrigger>
              <TabsTrigger value="scores" className="flex-1">Scores</TabsTrigger>
              <TabsTrigger value="reponses" className="flex-1">Réponses</TabsTrigger>
              <TabsTrigger value="recommandations" className="flex-1">Conseils</TabsTrigger>
            </TabsList>

            {/* ── PROFIL ── */}
            <TabsContent value="profil" className="space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Entreprise
                </h3>
                <dl className="space-y-2">
                  <InfoRow label="Nom" value={detail.organizations?.name} />
                  <InfoRow
                    label="Secteur"
                    value={SECTOR_LABELS[detail.organizations?.sector ?? ''] ?? detail.organizations?.sector}
                  />
                  <InfoRow label="Pays" value={detail.organizations?.country} />
                  <InfoRow
                    label="Taille"
                    value={SIZE_LABELS[detail.organizations?.size ?? ''] ?? detail.organizations?.size}
                  />
                </dl>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Contact
                </h3>
                <dl className="space-y-2">
                  <InfoRow label="Nom" value={detail.respondents?.name} />
                  <InfoRow label="Email" value={detail.respondents?.email} />
                  <InfoRow label="Téléphone" value={detail.respondents?.phone ?? '—'} />
                  <InfoRow
                    label="Poste"
                    value={ROLE_LABELS[detail.respondents?.role ?? ''] ?? detail.respondents?.role}
                  />
                </dl>
              </div>
            </TabsContent>

            {/* ── SCORES ── */}
            <TabsContent value="scores" className="space-y-5 mt-0">
              <div className="space-y-4">
                {detail.axis_scores.map((dim) => (
                  <div key={dim.dimension} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{dim.label}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {dim.percentage}%
                      </Badge>
                    </div>
                    <Progress value={dim.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Pondération : {Math.round(dim.weight * 100)}%
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Score global</span>
                <span className="text-xl font-bold">{detail.total_score}%</span>
              </div>
            </TabsContent>

            {/* ── RÉPONSES ── */}
            <TabsContent value="reponses" className="space-y-3 mt-0">
              {detail.answers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Aucune réponse enregistrée</p>
              ) : (
                detail.answers.map((answer, i) => {
                  const { questionText, answerLabel } = getAnswerLabel(
                    answer.question_id,
                    answer.answer_value,
                    sector
                  );
                  return (
                    <div key={answer.id} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Q{i + 1} — {questionText}
                      </p>
                      <p className="text-sm font-medium">{answerLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        Score : {answer.score} pts
                      </p>
                    </div>
                  );
                })
              )}
            </TabsContent>

            {/* ── RECOMMANDATIONS ── */}
            <TabsContent value="recommandations" className="space-y-4 mt-0">
              <div
                className={`rounded-lg p-4 border ${maturityColors.bg} ${maturityColors.border}`}
              >
                <h3 className={`font-semibold text-base ${maturityColors.text}`}>
                  {recommendation.title}
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Actions prioritaires</h4>
                <ul className="space-y-2">
                  {recommendation.actions.map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Impact attendu</h4>
                <p className="text-sm text-muted-foreground">{recommendation.impact}</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex gap-2">
    <dt className="text-sm text-muted-foreground w-24 shrink-0">{label}</dt>
    <dd className="text-sm font-medium">{value || '—'}</dd>
  </div>
);

export default AdminDiagnosticDetail;
