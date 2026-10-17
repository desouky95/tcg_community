import { DataTable, EmptyState, StatusBadge } from "@tcg/ui-web";
import { Award, Ban, CheckCircle, Phone, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useBlockUser, useUsers } from "../../hooks/useUsers";

export default function AdminUsers() {
  const { t } = useTranslation();
  const { data: users = [], isLoading, isError } = useUsers();
  const blockMutation = useBlockUser();
  const navigate = useNavigate();

  const handleBlockUser = async (id: string, currentlyBlocked: boolean) => {
    try {
      await blockMutation.mutateAsync({ id, blocked: !currentlyBlocked });
      toast.success(currentlyBlocked ? "Member Unblocked" : "Member Blocked");
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="flex items-center text-xl font-black uppercase tracking-tight">
              <Users aria-hidden="true" className="me-3 size-6 text-primary-500" />
              {t("admin.users.title")}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              {t("admin.users.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <DataTable.Root>
        <DataTable.Table className="min-w-180">
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head>{t("admin.users.info")}</DataTable.Head>
              <DataTable.Head>{t("admin.users.status")}</DataTable.Head>
              <DataTable.Head>{t("admin.users.reputation")}</DataTable.Head>
              <DataTable.Head align="end">{t("admin.users.actions")}</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body aria-busy={isLoading}>
            {isLoading && (
              <DataTable.LoadingRows
                columns={4}
                label={t("common.loading")}
              />
            )}

            {!isLoading && isError && (
              <DataTable.StateRow colSpan={4}>
                <EmptyState role="alert">
                  <div className="grid justify-items-center gap-3">
                    <Users aria-hidden="true" className="size-8 text-danger-600" />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.users.error_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.users.error_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <DataTable.StateRow colSpan={4}>
                <EmptyState>
                  <div className="grid justify-items-center gap-3">
                    <Users aria-hidden="true" className="size-8 text-wax-muted" />
                    <div>
                      <p className="font-display text-xl font-bold">
                        {t("admin.users.empty_title")}
                      </p>
                      <p className="mt-1 text-sm text-wax-muted">
                        {t("admin.users.empty_description")}
                      </p>
                    </div>
                  </div>
                </EmptyState>
              </DataTable.StateRow>
            )}

            {!isLoading &&
              !isError &&
              users.map((user) => {
                const profilePath = `/profile/${user.id}`;
                return (
                  <DataTable.Row
                    key={user.id}
                    interactive
                    tone={user.blocked ? "danger" : "default"}
                    onClick={() => navigate(profilePath)}
                  >
                    <DataTable.Cell>
                      <Link
                        to={profilePath}
                        onClick={(event) => event.stopPropagation()}
                        className="focus-ring flex items-center gap-4"
                      >
                        <span className="flex size-12 shrink-0 -rotate-3 items-center justify-center border border-wax-gold bg-primary-500 font-display text-xl font-extrabold text-wax-paper shadow-soft transition-transform group-hover:rotate-0 rtl:rotate-3">
                          {user.fullName.charAt(0)}
                        </span>
                        <span>
                          <span className="flex items-center gap-2">
                            <strong className="text-base font-black tracking-tight text-foreground">
                              {user.fullName}
                            </strong>
                            {user.role === "super_admin" && (
                              <span className="rounded-full border border-success-500/20 bg-success-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-success-600">
                                {t("admin.users.admin_badge")}
                              </span>
                            )}
                          </span>
                          <span className="flex flex-col gap-0.5">
                            <span className="font-mono text-xs font-bold text-primary-500">
                              @{user.username}
                            </span>
                            <span className="flex items-center text-[11px] text-muted-foreground">
                              <Phone aria-hidden="true" className="me-1 size-3 opacity-50" />
                              {user.mobile}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <StatusBadge tone={user.blocked ? "danger" : "success"}>
                        {user.blocked ? (
                          <Ban aria-hidden="true" className="size-3" />
                        ) : (
                          <CheckCircle aria-hidden="true" className="size-3" />
                        )}
                        {t(user.blocked ? "admin.users.blocked" : "admin.users.active")}
                      </StatusBadge>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <div className="flex items-center gap-2">
                        <Award aria-hidden="true" className="size-4 text-amber-500" />
                        <span className="text-sm font-black tabular-nums">{user.points}</span>
                        <span className="text-xs font-bold uppercase text-muted-foreground">PT</span>
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell align="end">
                      {user.role !== "super_admin" && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleBlockUser(String(user.id), Boolean(user.blocked));
                          }}
                          className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
                            user.blocked
                              ? "bg-success-500 hover:bg-success-600"
                              : "bg-danger-500 hover:bg-danger-600"
                          }`}
                          disabled={blockMutation.isPending}
                        >
                          {t(user.blocked ? "admin.users.unblock" : "admin.users.restrict")}
                        </button>
                      )}
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </>
  );
}
