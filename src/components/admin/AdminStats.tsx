import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStats as AdminStatsType, CrmStats, CRM_STATUS_CONFIG } from '@/types/diagnostic';
import { BarChart3, Building2, TrendingUp, Award, Trophy } from 'lucide-react';

const SECTOR_LABELS: Record<string, string> = {
  transport: 'Transport',
  retail: 'Commerce',
  energy: 'Énergie',
  autre: 'Autre',
};

interface AdminStatsProps {
  stats: AdminStatsType;
  crmStats: CrmStats;
}

const AdminStats = ({ stats, crmStats }: AdminStatsProps) => {
  const sectorEntries = Object.entries(stats.sectorCounts);

  return (
    <div className="space-y-4">
      {/* Diagnostic stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total diagnostics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">diagnostics complétés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Répartition secteurs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {sectorEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              <div className="space-y-1">
                {sectorEntries.map(([sector, count]) => (
                  <div key={sector} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{SECTOR_LABELS[sector] ?? sector}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score moyen global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">sur l'ensemble des diagnostics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Niveau Avancé / Expert</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.advancedPercent}%</div>
            <p className="text-xs text-muted-foreground mt-1">des diagnostics</p>
          </CardContent>
        </Card>
      </div>

      {/* CRM stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(
          [
            { key: 'new',               icon: '🆕', label: 'Nouveaux',    value: crmStats.new },
            { key: 'contacted',         icon: '📞', label: 'Contactés',   value: crmStats.contacted },
            { key: 'meeting_scheduled', icon: '📅', label: 'RDV programmé', value: crmStats.meeting_scheduled },
            { key: 'won',               icon: '✅', label: 'Gagnés',      value: crmStats.won },
          ] as const
        ).map(({ key, icon, label, value }) => (
          <Card key={key} className="relative overflow-hidden">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm">{icon}</span>
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div
                className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${CRM_STATUS_CONFIG[key].className}`}
              >
                {CRM_STATUS_CONFIG[key].label}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="relative overflow-hidden">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Taux de conversion</span>
              <Trophy className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-400">{crmStats.conversionRate}%</div>
            <p className="text-[10px] text-muted-foreground mt-2">
              {crmStats.won} gagné{crmStats.won !== 1 ? 's' : ''} / {stats.total} total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
