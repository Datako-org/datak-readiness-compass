import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStats as AdminStatsType } from '@/types/diagnostic';
import { BarChart3, Building2, TrendingUp, Award } from 'lucide-react';

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport',
  retail: 'Commerce',
  energy: 'Énergie',
  autre: 'Autre',
};

interface AdminStatsProps {
  stats: AdminStatsType;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const sectorEntries = Object.entries(stats.sectorCounts);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total diagnostics
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground mt-1">diagnostics complétés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Répartition secteurs
          </CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {sectorEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">—</p>
          ) : (
            <div className="space-y-1">
              {sectorEntries.map(([sector, count]) => (
                <div key={sector} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {SECTOR_LABELS[sector] ?? sector}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Score moyen global
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.avgScore}%</div>
          <p className="text-xs text-muted-foreground mt-1">sur l'ensemble des diagnostics</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Niveau Avancé / Expert
          </CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.advancedPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">des diagnostics</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
