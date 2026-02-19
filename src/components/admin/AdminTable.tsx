import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminDiagnosticRow } from '@/types/diagnostic';
import { getMaturityColor, getMaturityLabel } from '@/data/recommendations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

type MaturityLevel = 'debutant' | 'intermediaire' | 'avance' | 'expert';

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport',
  retail: 'Commerce',
  energy: 'Énergie',
  autre: 'Autre',
};

interface AdminTableProps {
  data: AdminDiagnosticRow[];
  onView: (row: AdminDiagnosticRow) => void;
}

const MaturityBadge = ({ level }: { level: string }) => {
  const colors = getMaturityColor(level as MaturityLevel);
  const label = getMaturityLabel(level as MaturityLevel);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${colors.text} ${colors.bg} ${colors.border}`}
    >
      {label}
    </span>
  );
};

const exportCSV = (data: AdminDiagnosticRow[]) => {
  const headers = [
    'Date',
    'Entreprise',
    'Secteur',
    'Pays',
    'Taille',
    'Nom contact',
    'Email',
    'Poste',
    'Score (%)',
    'Niveau',
  ];

  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const rows = data.map((d) => [
    d.completed_at ? format(new Date(d.completed_at), 'dd/MM/yyyy') : '',
    escape(d.org_name),
    escape(SECTOR_LABELS[d.sector] ?? d.sector),
    escape(d.country),
    escape(d.size),
    escape(d.respondent_name),
    escape(d.email),
    escape(d.role),
    d.total_score,
    d.maturity_level,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagnostics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const AdminTable = ({ data, onView }: AdminTableProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data.length} diagnostic{data.length !== 1 ? 's' : ''}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCSV(data)}
          disabled={data.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead className="hidden md:table-cell">Secteur</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucun diagnostic trouvé
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView(row)}
                >
                  <TableCell className="whitespace-nowrap text-sm">
                    {row.completed_at
                      ? format(new Date(row.completed_at), 'dd/MM/yyyy', { locale: fr })
                      : '—'}
                  </TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {row.org_name || '—'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {SECTOR_LABELS[row.sector] ?? (row.sector || '—')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {row.total_score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MaturityBadge level={row.maturity_level} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                    {row.email || '—'}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onView(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTable;
