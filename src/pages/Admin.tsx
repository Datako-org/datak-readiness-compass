import { useState, useEffect, useMemo } from 'react';
import { AdminDiagnosticRow, AdminStats, CrmStats, CrmStatus } from '@/types/diagnostic';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminStats_ from '@/components/admin/AdminStats';
import AdminFilters, { FilterState } from '@/components/admin/AdminFilters';
import AdminTable from '@/components/admin/AdminTable';
import AdminDiagnosticDetail from '@/components/admin/AdminDiagnosticDetail';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, AlertCircle } from 'lucide-react';

// ── Dashboard ─────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  password: string;
  onLogout: () => void;
}

const AdminDashboard = ({ password, onLogout }: AdminDashboardProps) => {
  const [allData, setAllData] = useState<AdminDiagnosticRow[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    sector: '',
    level: '',
    dateFrom: '',
    dateTo: '',
    crmStatus: '',
  });
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<AdminDiagnosticRow | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/.netlify/functions/admin-diagnostics', {
          headers: { 'x-admin-password': password },
        });
        if (res.status === 401) { onLogout(); return; }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setAllData(json.data ?? []);
        setStats(json.stats ?? null);
      } catch (e) {
        setError(`Erreur : ${e instanceof Error ? e.message : 'inconnue'}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [password, onLogout]);

  // CRM stats computed client-side (updates instantly on status change)
  const crmStats = useMemo<CrmStats>(() => {
    const counts = { new: 0, contacted: 0, meeting_scheduled: 0, proposal_sent: 0, won: 0, lost: 0 };
    allData.forEach((d) => {
      const s = d.crm_status ?? 'new';
      if (s in counts) counts[s as keyof typeof counts]++;
    });
    const total = allData.length;
    return { ...counts, conversionRate: total > 0 ? Math.round((counts.won / total) * 100) : 0 };
  }, [allData]);

  // Counts per CRM status (for filter dropdown)
  const crmCounts = useMemo(() => {
    const c: Record<string, number> = {};
    allData.forEach((d) => {
      const s = d.crm_status ?? 'new';
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [allData]);

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (filters.crmStatus && (row.crm_status ?? 'new') !== filters.crmStatus) return false;
      if (filters.sector && row.sector !== filters.sector) return false;
      if (filters.level && row.maturity_level !== filters.level) return false;
      if (filters.dateFrom && row.completed_at < filters.dateFrom) return false;
      if (filters.dateTo && row.completed_at > filters.dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [allData, filters]);

  // Optimistic update after save in detail sheet
  const handleStatusUpdate = (id: string, crm_status: CrmStatus, internal_notes: string | null) => {
    setAllData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, crm_status, internal_notes } : row))
    );
    setSelectedDiagnostic((prev) =>
      prev?.id === id ? { ...prev, crm_status, internal_notes } : prev
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Administration Datakö</h1>
            <p className="text-xs text-muted-foreground">CRM & Diagnostics</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {stats && <AdminStats_ stats={stats} crmStats={crmStats} />}

            <div className="rounded-lg border bg-card p-4">
              <AdminFilters filters={filters} onChange={setFilters} crmCounts={crmCounts} />
            </div>

            <AdminTable data={filteredData} onView={setSelectedDiagnostic} />
          </>
        )}
      </main>

      <AdminDiagnosticDetail
        diagnostic={selectedDiagnostic}
        onClose={() => setSelectedDiagnostic(null)}
        password={password}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
};

// ── Auth gate ─────────────────────────────────────────────────────────────────

const Admin = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin_password') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('admin_password'));

  const handleSuccess = (pwd: string) => { setPassword(pwd); setIsAuthenticated(true); };
  const handleLogout = () => { sessionStorage.removeItem('admin_password'); setPassword(''); setIsAuthenticated(false); };

  if (!isAuthenticated) return <AdminLogin onSuccess={handleSuccess} />;
  return <AdminDashboard password={password} onLogout={handleLogout} />;
};

export default Admin;
