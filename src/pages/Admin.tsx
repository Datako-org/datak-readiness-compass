import { useState, useEffect, useMemo } from 'react';
import { AdminDiagnosticRow, AdminStats } from '@/types/diagnostic';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminStats_ from '@/components/admin/AdminStats';
import AdminFilters, { FilterState } from '@/components/admin/AdminFilters';
import AdminTable from '@/components/admin/AdminTable';
import AdminDiagnosticDetail from '@/components/admin/AdminDiagnosticDetail';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, AlertCircle } from 'lucide-react';

// ── Dashboard (shown after auth) ─────────────────────────────────────────────

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

        if (res.status === 401) {
          onLogout();
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setAllData(json.data ?? []);
        setStats(json.stats ?? null);
      } catch {
        setError('Impossible de charger les données. Vérifiez la configuration Netlify.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [password, onLogout]);

  const filteredData = useMemo(() => {
    return allData.filter((row) => {
      if (filters.sector && row.sector !== filters.sector) return false;
      if (filters.level && row.maturity_level !== filters.level) return false;
      if (filters.dateFrom && row.completed_at < filters.dateFrom) return false;
      if (filters.dateTo && row.completed_at > filters.dateTo + 'T23:59:59') return false;
      return true;
    });
  }, [allData, filters]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Administration Datakö</h1>
            <p className="text-xs text-muted-foreground">Tableau de bord des diagnostics</p>
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
            {/* Stats */}
            {stats && <AdminStats_ stats={stats} />}

            {/* Filters */}
            <div className="rounded-lg border bg-card p-4">
              <AdminFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Table */}
            <AdminTable data={filteredData} onView={setSelectedDiagnostic} />
          </>
        )}
      </main>

      {/* Detail Sheet */}
      <AdminDiagnosticDetail
        diagnostic={selectedDiagnostic}
        onClose={() => setSelectedDiagnostic(null)}
        password={password}
      />
    </div>
  );
};

// ── Page principale (auth gate) ───────────────────────────────────────────────

const Admin = () => {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem('admin_password') || ''
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!sessionStorage.getItem('admin_password')
  );

  const handleSuccess = (pwd: string) => {
    setPassword(pwd);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    setPassword('');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleSuccess} />;
  }

  return <AdminDashboard password={password} onLogout={handleLogout} />;
};

export default Admin;
