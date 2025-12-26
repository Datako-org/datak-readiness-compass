import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Organization, SECTORS, COMPANY_SIZES, ROLES, COUNTRIES } from '@/types/diagnostic';
import { motion } from 'framer-motion';

interface CompanyProfileStepProps {
  data: Organization;
  role: string;
  onUpdate: (data: Partial<Organization>) => void;
  onUpdateRole: (role: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CompanyProfileStep = ({
  data,
  role,
  onUpdate,
  onUpdateRole,
  onNext,
  onPrev,
}: CompanyProfileStepProps) => {
  const isValid = data.name && data.sector && data.country && data.size && role;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold mb-3">
          Profil de votre entreprise
        </h2>
        <p className="text-muted-foreground">
          Ces informations nous permettent d'adapter le diagnostic à votre contexte
        </p>
      </div>

      <div className="space-y-6 bg-card rounded-xl p-8 border border-border">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company-name">Nom de l'entreprise *</Label>
          <Input
            id="company-name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Ex: Acme Industries"
            className="bg-input border-border focus:border-primary"
          />
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label>Secteur d'activité *</Label>
          <Select value={data.sector} onValueChange={(value) => onUpdate({ sector: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre secteur" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label>Pays / Région *</Label>
          <Select value={data.country} onValueChange={(value) => onUpdate({ country: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label>Taille de l'entreprise *</Label>
          <Select value={data.size} onValueChange={(value) => onUpdate({ size: value })}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Nombre d'employés" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label>Votre fonction *</Label>
          <Select value={role} onValueChange={onUpdateRole}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sélectionnez votre rôle" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
          disabled={!isValid}
          className="gradient-datako text-primary-foreground hover:opacity-90"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
