import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, LibraryBig, Tags, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "../../hooks/useDashboard";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { categories, collections, isLoading, users } = useDashboardStats();

  const stats = useMemo(
    () => ({
      users: users?.length ?? 0,
      restricted: users?.filter((user) => user.blocked).length ?? 0,
      collections: collections?.length ?? 0,
      categories: categories?.length ?? 0,
    }),
    [categories, collections, users],
  );

  const destinations = [
    {
      to: "/admin/users",
      icon: Users,
      title: t("admin.navigation.users"),
      description: t("admin.dashboard.users_description"),
      value: stats.users,
      detail: t("admin.dashboard.restricted", { count: stats.restricted }),
    },
    {
      to: "/admin/collections",
      icon: LibraryBig,
      title: t("admin.navigation.collections"),
      description: t("admin.dashboard.collections_description"),
      value: stats.collections,
      detail: t("admin.dashboard.published"),
    },
    {
      to: "/admin/categories",
      icon: Tags,
      title: t("admin.navigation.categories"),
      description: t("admin.dashboard.categories_description"),
      value: stats.categories,
      detail: t("admin.dashboard.parent_categories"),
    },
  ];

  return (
    <div>
      <div className="max-w-3xl border-b border-wax-line pb-6">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">
          {t("admin.dashboard.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-muted-foreground">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>

      <section className="mt-8" aria-labelledby="admin-areas-heading">
        <h2 id="admin-areas-heading" className="mb-3 text-sm font-bold text-foreground">
          {t("admin.dashboard.management_areas")}
        </h2>
        <div className="divide-y divide-wax-line border-y border-wax-line bg-card">
          {destinations.map(
            ({ to, icon: Icon, title, description, value, detail }) => (
            <Link
              key={to}
              to={to}
              className="group grid gap-4 px-4 py-5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center md:px-6"
            >
              <span className="grid size-11 place-items-center bg-primary-500 text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-base font-bold text-foreground">{title}</strong>
                <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
              </span>
              <span className="sm:text-end">
                {isLoading ? (
                  <span role="status" className="block">
                    <span
                      className="block h-7 w-16 animate-pulse bg-muted"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{t("common.loading")}</span>
                  </span>
                ) : (
                  <strong className="block font-display text-3xl font-extrabold tabular-nums text-foreground">
                    {value}
                  </strong>
                )}
                <small className="font-mono text-utility uppercase tracking-wider text-muted-foreground">{detail}</small>
              </span>
              <ArrowRight
                className="hidden size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 sm:block rtl:rotate-180 rtl:group-hover:-translate-x-1 rtl:group-focus-visible:-translate-x-1"
                aria-hidden="true"
              />
            </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
