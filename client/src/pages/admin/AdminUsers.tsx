import { useUsers, useBlockUser } from '../../hooks/useUsers';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Ban, CheckCircle, Users, Phone, Award } from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { t } = useTranslation();
  const { data: users = [], isLoading: loading } = useUsers();
  const blockMutation = useBlockUser();
  const navigate = useNavigate();

  const handleBlockUser = async (id: string, currentlyBlocked: boolean) => {
    try {
      await blockMutation.mutateAsync({ id, blocked: !currentlyBlocked });
      toast.success(currentlyBlocked ? 'Member Unblocked' : 'Member Blocked');
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <BackButton to="/admin" />
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center">
              <Users className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-primary-500" /> {t('admin.users.title')}
            </h1>
            <p className="text-muted-foreground font-medium">{t('admin.users.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead className="bg-input/50 backdrop-blur-md">
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.users.info')}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.users.status')}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">{t('admin.users.reputation')}</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right rtl:text-left">{t('admin.users.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 h-20 bg-input/10" />
                  </tr>
                ))
              ) : (
                users.map(u => (
                  <tr onClick={() => navigate(`/profile/${u.id}`)} key={u.id} className={`hover:bg-input/10 transition-colors ${u.blocked ? 'bg-danger-500/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-lg transform -rotate-3 rtl:rotate-3 transition-transform group-hover:rotate-0">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-foreground tracking-tight text-base">
                              {u.fullName}
                            </p>
                            {u.role === 'super_admin' && (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-widest border border-emerald-500/20">{t('admin.users.admin_badge')}</span>
                            )}
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <p className="text-primary-500 text-xs font-bold font-mono">@{u.username}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center">
                              <Phone className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 opacity-50" /> {u.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.blocked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-danger-500/10 text-danger-600">
                          <Ban className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('admin.users.blocked')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                          <CheckCircle className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('admin.users.active')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-black">{u.points}</span>
                        <span className="text-xs text-muted-foreground uppercase font-bold">PT</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockUser(u.id, !!u.blocked);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all active:scale-95 shadow-sm
                            ${u.blocked
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-danger-500 text-white hover:bg-danger-600'}`}
                        >
                          {u.blocked ? t('admin.users.unblock') : t('admin.users.restrict')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
