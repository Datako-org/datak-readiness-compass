import { Button } from '@/components/ui/button';
import { DiagnosticResult } from '@/types/diagnostic';
import { motion } from 'framer-motion';
import { RotateCcw, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ResultsPageProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

const MATURITY_LEVELS = {
  debutant: {
    label: 'Débutant',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    description: 'Votre organisation est au début de son parcours data. Des fondations solides sont à construire pour exploiter pleinement le potentiel de vos données.',
    recommendation: 'Atelier découverte',
    recommendationDesc: 'Un atelier pour identifier vos quick wins et définir votre feuille de route data.',
  },
  intermediaire: {
    label: 'Intermédiaire',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    description: 'Votre organisation dispose de bases solides. Il est temps d\'accélérer et d\'optimiser vos processus pour maximiser la valeur de vos données.',
    recommendation: 'Audit approfondi',
    recommendationDesc: 'Un audit complet pour identifier les leviers d\'amélioration et les opportunités IA.',
  },
  avance: {
    label: 'Avancé',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    description: 'Félicitations ! Votre maturité data est élevée. L\'étape suivante consiste à exploiter l\'IA avancée et l\'automatisation pour créer un avantage compétitif durable.',
    recommendation: 'Roadmap stratégique',
    recommendationDesc: 'Une feuille de route IA sur mesure pour transformer votre avance en avantage concurrentiel.',
  },
};

export const ResultsPage = ({ result, onRestart }: ResultsPageProps) => {
  const maturity = MATURITY_LEVELS[result.maturityLevel];

  const handleContactEmail = () => {
    const subject = encodeURIComponent('Demande de rendez-vous - Diagnostic Data & IA');
    const body = encodeURIComponent(
      `Bonjour,\n\nSuite à mon diagnostic Data & IA, je souhaite prendre rendez-vous avec un expert Datakö.\n\n` +
      `Résultats du diagnostic :\n` +
      `- Score global : ${result.percentage}%\n` +
      `- Niveau de maturité : ${maturity.label}\n\n` +
      `Cordialement`
    );
    window.open(`mailto:contact@datako.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour,\n\nSuite à mon diagnostic Data & IA sur Datakö, je souhaite prendre rendez-vous.\n\n` +
      `Résultats :\n` +
      `- Score : ${result.percentage}%\n` +
      `- Niveau : ${maturity.label}`
    );
    window.open(`https://wa.me/00224000000?text=${message}`, '_blank');
  };

  const handleLearnMore = () => {
    window.open('https://datakö.com', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-display font-bold gradient-datako-text">
            Datakö
          </div>
          <Button variant="outline" onClick={onRestart} className="border-border">
            <RotateCcw className="mr-2 h-4 w-4" />
            Nouveau diagnostic
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Score Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Votre diagnostic Data & IA
            </h1>
            <p className="text-muted-foreground mb-8">
              Analyse complète de votre maturité data
            </p>

            {/* Score Circle */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-48 h-48 rounded-full border-gradient-datako flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-datako-text">
                    {result.percentage}%
                  </div>
                  <div className="text-muted-foreground text-sm mt-1">
                    Score global
                  </div>
                </div>
              </div>
            </div>

            {/* Maturity Level Badge */}
            <div className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full border",
              maturity.bgColor,
              maturity.borderColor
            )}>
              <span className={cn("text-lg font-semibold", maturity.color)}>
                Niveau : {maturity.label}
              </span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-8 border border-border mb-8"
          >
            <p className="text-lg text-center leading-relaxed">
              {maturity.description}
            </p>
          </motion.div>

          {/* Axis Scores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-8 border border-border mb-8"
          >
            <h2 className="text-xl font-semibold mb-6">Détail par axe</h2>
            <div className="space-y-6">
              {result.axisScores.map((axis, index) => (
                <motion.div
                  key={axis.axis}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{axis.axis}</span>
                    <span className="text-muted-foreground">
                      {axis.score}/{axis.maxScore} ({axis.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${axis.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                      className="absolute left-0 top-0 h-full progress-gradient rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-8 border border-primary/30 glow-datako"
          >
            <h2 className="text-xl font-semibold mb-4 gradient-datako-text">
              Prochaine étape recommandée
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{maturity.recommendation}</h3>
                <p className="text-muted-foreground">{maturity.recommendationDesc}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  className="gradient-datako text-primary-foreground hover:opacity-90"
                  onClick={handleContactEmail}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Prendre rendez-vous (Email)
                </Button>
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-500/10"
                  onClick={handleContactWhatsApp}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Additional CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Un expert Datakö vous contactera sous 48h avec une analyse détaillée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-border"
                onClick={() => window.open("https://datakö.com", "_blank")}>
                <FileText className="mr-2 h-4 w-4" />
                En savoir plus sur Datakö
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Datakö. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};
