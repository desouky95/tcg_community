import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Users, Table2, ShieldCheck, ArrowRight, LayoutGrid } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { StatCard } from '../../components/common/StatCard';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { categories, collections, isLoading: loading, users } = useDashboardStats()


  const stats = useMemo(() => {

    const usersCount = users?.length || 0;
    const blockedCount = users?.filter(u => u.blocked).length || 0;
    const collectionsCount = collections?.length || 0;
    const categoriesCount = categories?.length || 0;

    return {
      usersCount,
      blockedCount,
      collectionsCount,
      categoriesCount
    };
  }, [users, collections, categories])


  return (
    <Layout>
      <div className="mb-8 group">
        <div className="flex items-center space-x-3 text-emerald-500 mb-2 rtl:space-x-reverse">
          <ShieldCheck className="w-10 h-10 transform group-hover:rotate-12 transition-transform" />
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Center</h1>
        </div>
        <p className="text-muted-foreground font-medium">Command and control your community taxonomy and permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Users Card */}
        <button
          onClick={() => navigate('/admin/users')}
          className="group relative bg-card hover:bg-input/20 border border-border rounded-3xl p-8 text-left transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden rtl:text-right"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all" />
          <div className="flex items-start justify-between mb-8">
            <div className="p-4 bg-primary-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary-500 transition-colors rtl:rotate-180" />
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-4 uppercase">Members</h2>

          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Registered" value={loading ? '...' : stats.usersCount} />
            <StatCard label="Restricted" value={loading ? '...' : stats.blockedCount} highlightColor="text-danger-500" />
          </div>
        </button>

        {/* Collections Card */}
        <button
          onClick={() => navigate('/admin/collections')}
          className="group relative bg-card hover:bg-input/20 border border-border rounded-3xl p-8 text-left transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden rtl:text-right"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-start justify-between mb-8">
            <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <Table2 className="w-8 h-8 text-emerald-500" />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-emerald-500 transition-colors rtl:rotate-180" />
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-4 uppercase">Checklists</h2>

          <StatCard label="Published Sets" value={loading ? '...' : stats.collectionsCount} highlightColor="text-emerald-500" />
        </button>

        {/* Categories Card */}
        <button
          onClick={() => navigate('/admin/categories')}
          className="group relative bg-card hover:bg-input/20 border border-border rounded-3xl p-8 text-left transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden rtl:text-right"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-start justify-between mb-8">
            <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-8 h-8 text-amber-500" />
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-amber-500 transition-colors rtl:rotate-180" />
          </div>

          <h2 className="text-2xl font-black tracking-tight mb-4 uppercase">Taxonomy</h2>

          <StatCard label="Parent Categories" value={loading ? '...' : stats.categoriesCount} highlightColor="text-amber-500" />
        </button>
      </div>
    </Layout>
  );
}
