import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

export interface FilterState {
  sector: string;
  level: string;
  dateFrom: string;
  dateTo: string;
}

interface AdminFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const AdminFilters = ({ filters, onChange }: AdminFiltersProps) => {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const reset = () => {
    onChange({ sector: '', level: '', dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters =
    filters.sector || filters.level || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <Select
          value={filters.sector || 'all'}
          onValueChange={(v) => update('sector', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les secteurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            <SelectItem value="transport">Transport & Logistique</SelectItem>
            <SelectItem value="retail">Commerce & Distribution</SelectItem>
            <SelectItem value="energy">Énergie & Mines</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[160px]">
        <Select
          value={filters.level || 'all'}
          onValueChange={(v) => update('level', v === 'all' ? '' : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="debutant">Débutant</SelectItem>
            <SelectItem value="intermediaire">Intermédiaire</SelectItem>
            <SelectItem value="avance">Avancé</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Du</span>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update('dateFrom', e.target.value)}
          className="w-[150px]"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Au</span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update('dateTo', e.target.value)}
          className="w-[150px]"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
          <X className="h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
};

export default AdminFilters;
