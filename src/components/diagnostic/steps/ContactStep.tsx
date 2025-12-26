import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Respondent } from '@/types/diagnostic';
import { motion } from 'framer-motion';

interface ContactStepProps {
  data: Respondent;
  onUpdate: (data: Partial<Respondent>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const ContactStep = ({
  data,
  onUpdate,
  onSubmit,
  onPrev,
  isSubmitting,
}: ContactStepProps) => {
  const isValid = data.name && data.email && data.consent_given;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const canSubmit = isValid && isValidEmail(data.email);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-3">
          Vos coordonnées
        </h2>
        <p className="text-muted-foreground">
          Recevez votre diagnostic personnalisé et les recommandations de nos experts
        </p>
      </div>

      <div className="space-y-6 bg-card rounded-xl p-8 border border-border">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nom complet *</Label>
          <Input
            id="contact-name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Jean Dupont"
            className="bg-input border-border focus:border-primary"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email professionnel *</Label>
          <Input
            id="contact-email"
            type="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="jean.dupont@entreprise.com"
            className="bg-input border-border focus:border-primary"
          />
          {data.email && !isValidEmail(data.email) && (
            <p className="text-sm text-destructive">
              Veuillez entrer une adresse email valide
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Téléphone (optionnel)</Label>
          <Input
            id="contact-phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="+33 6 12 34 56 78"
            className="bg-input border-border focus:border-primary"
          />
        </div>

        {/* Consent */}
        <div className="flex items-start space-x-3 pt-4">
          <Checkbox
            id="consent"
            checked={data.consent_given}
            onCheckedChange={(checked) => onUpdate({ consent_given: checked as boolean })}
            className="mt-1"
          />
          <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            J'accepte que mes données soient traitées par Datakö pour recevoir mon diagnostic 
            et être recontacté par un conseiller. Ces données sont confidentielles et ne seront 
            pas partagées avec des tiers.
          </Label>
        </div>
      </div>

      {/* Summary note */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground text-center">
          🔒 Vos données sont sécurisées. Un expert Datakö vous recontactera sous 48h 
          avec une analyse détaillée de votre diagnostic.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isSubmitting}
          className="border-border hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="gradient-datako text-primary-foreground hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              Recevoir mon diagnostic
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
