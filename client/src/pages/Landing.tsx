import { ArrowRight, ShieldCheck, Star, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { CardFan } from "../components/interactive/CardFan";
import { PackGallery } from "../components/interactive/PackGallery";
import { Footer } from "../components/layout/Footer";
import { SectionHeading } from "../components/layout/SectionHeading";
import { useStore } from "../store/useStore";
import { PACKS } from "../lib/packs.data";

export default function Landing() {
  const user = useStore((state) => state.user);
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  if (user) return <Navigate to="/dashboard" replace />;

  const features = [
    {
      title: t("landing.features.reviews.title"),
      description: t("landing.features.reviews.desc"),
      icon: <ShieldCheck className="h-9 w-9" aria-hidden="true" />,
      label: "Trust layer",
    },
    {
      title: t("landing.features.checklists.title"),
      description: t("landing.features.checklists.desc"),
      icon: <Star className="h-9 w-9" aria-hidden="true" />,
      label: "Collection index",
      featured: true,
    },
    {
      title: t("landing.features.trading.title"),
      description: t("landing.features.trading.desc"),
      icon: <Users className="h-9 w-9" aria-hidden="true" />,
      label: "Community exchange",
    },
  ];

  return (
    <Layout transparent hideNav>
      <div className="landing-shell relative overflow-hidden selection:bg-primary-500 selection:text-black">
        <div className="landing-wordmark absolute top-24 -left-24 hidden select-none text-[20vw] font-display font-bold leading-none tracking-[-0.05em] pointer-events-none lg:block rtl:left-auto rtl:-right-24">
          {t("nav.checklists")}
        </div>

        <section className="landing-hero relative mt-20 flex min-h-[90vh] flex-col items-center gap-12 lg:mt-0 lg:flex-row lg:gap-0">
          <div className="flex w-full flex-col items-start px-4 lg:w-[52%] lg:pl-8 rtl:items-start">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="landing-title mb-8 max-w-3xl text-5xl font-display font-bold tracking-[-0.04em] sm:text-6xl lg:text-[5.5rem]"
            >
              {t("landing.hero.title_line1")} <br />
              <span className="landing-title-mark">
                {t("landing.hero.title_highlight")}
              </span>{" "}
              <br />
              {t("landing.hero.title_line2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground"
            >
              {t("landing.hero.description")}
            </motion.p>

            <div className="flex flex-col gap-3 sm:flex-row rtl:space-x-reverse">
              <Link
                to="/signup"
                className="landing-primary-action focus-ring flex items-center justify-center gap-3 rounded-xl bg-primary-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/20 transition-all hover:bg-primary-500 active:scale-95 rtl:flex-row-reverse"
              >
                <span>{t("landing.hero.cta_join")}</span>
                <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="focus-ring rounded-xl border border-border bg-card/70 px-7 py-4 text-center text-base font-bold transition-all hover:border-primary-500/70 hover:bg-card active:scale-95"
              >
                {t("landing.hero.cta_signin")}
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[48%]">
            <CardFan />
          </div>
        </section>

        <section className="landing-section py-24 lg:py-32">
          <div className="landing-feature-grid grid grid-cols-1 gap-4 px-4 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ease: "easeOut", delay: index * 0.1 }}
                className={`landing-feature group rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-0.5 hover:border-primary-500/70 ${feature.featured ? "lg:col-span-2 bg-primary-600 text-white border-primary-500" : ""}`}
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="landing-feature-icon w-fit rounded-xl bg-primary-500/10 p-3 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
                    {feature.label}
                  </span>
                </div>
                <h2 className="mb-3 text-2xl font-display font-bold tracking-tight">
                  {feature.title}
                </h2>
                <p className="font-medium leading-relaxed opacity-80">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="landing-shelf relative overflow-hidden py-2">
          <SectionHeading
            title={t("landing.gallery.title")}
            highlight={t("landing.gallery.highlight")}
            subtitle={t("landing.gallery.subtitle")}
          />
          <PackGallery packs={PACKS} />
        </section>

        <section className="landing-section mx-auto max-w-7xl border-t border-border/50 px-4 py-20 lg:py-36">
          <div className="flex flex-col items-center gap-20 lg:flex-row">
            <motion.div
              onViewportLeave={() => setExpandedCard(null)}
              viewport={{ amount: 0.1 }}
              className="landing-checklist-panel relative h-[450px] w-full overflow-hidden rounded-[2rem] border border-white/5 bg-gray-300/50 p-8 dark:bg-zinc-950/50 sm:p-12 lg:w-1/2"
            >
              <div className="pointer-events-none absolute inset-0 m-6 rounded-[2rem] border border-dashed border-white/10 p-12 opacity-20" />

              <div className="grid h-full grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((card) => (
                  <motion.div
                    key={card}
                    layoutId={`skeleton-${card}`}
                    onClick={() => setExpandedCard(card)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setExpandedCard(card);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open checklist preview ${card}`}
                    className="group relative flex cursor-pointer flex-col space-y-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <motion.div
                      layoutId={`progress-bg-${card}`}
                      className="h-2 w-2/3 overflow-hidden rounded-full bg-border group-hover:bg-primary-500/30"
                    >
                      <motion.div
                        layoutId={`progress-fill-${card}`}
                        className={`h-full bg-primary-500 w-${card * 25}`}
                      />
                    </motion.div>
                    <div className="space-y-2">
                      <motion.div layoutId={`line-1-${card}`} className="h-3 w-full rounded-lg bg-border" />
                      <motion.div layoutId={`line-2-${card}`} className="h-3 w-1/2 rounded-lg bg-border" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {expandedCard !== null && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setExpandedCard(null)}
                      className="absolute inset-0 z-40 cursor-zoom-out bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                      layoutId={`skeleton-${expandedCard}`}
                      onClick={(event) => event.stopPropagation()}
                      className="absolute inset-0 z-50 flex cursor-default flex-col rounded-[2rem] border-2 border-primary-500/50 bg-card p-8 sm:p-12"
                    >
                      <button
                        onClick={() => setExpandedCard(null)}
                        aria-label="Close checklist preview"
                        className="focus-ring absolute right-6 top-6 rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rtl:left-6 rtl:right-auto"
                      >
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>

                      <div className="mb-10 flex items-center justify-between">
                        <motion.div layoutId={`progress-bg-${expandedCard}`} className="h-4 w-1/3 overflow-hidden rounded-full bg-border">
                          <motion.div layoutId={`progress-fill-${expandedCard}`} className={`h-full bg-primary-500 w-${expandedCard * 25}`} />
                        </motion.div>
                        <div className="flex gap-2 rtl:flex-row-reverse">
                          <div className="h-4 w-20 animate-pulse rounded-full bg-border" />
                          <div className="h-4 w-20 animate-pulse rounded-full bg-border" />
                        </div>
                      </div>

                      <div className="flex-1 space-y-6 overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 border-b border-border/50 pb-4">
                          <div className="h-3 w-1/2 rounded-lg bg-border" />
                          <div className="h-3 w-full rounded-lg bg-border" />
                          <div className="h-3 w-3/4 rounded-lg bg-border" />
                          <div className="h-3 w-1/2 rounded-lg bg-border" />
                        </div>
                        {[1, 2, 3, 4, 5].map((row) => (
                          <motion.div
                            key={row}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + row * 0.05 }}
                            className="grid grid-cols-4 items-center gap-4"
                          >
                            <div className="h-3 w-1/3 rounded-lg bg-border/40" />
                            <div className="h-3 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-3 w-2/3 rounded-lg bg-border/40" />
                            <div className="ml-auto h-6 w-1/2 rounded-full bg-primary-500/10" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-6">
                        <motion.div layoutId={`line-2-${expandedCard}`} className="h-3 w-32 rounded-lg bg-border" />
                        <div className="h-8 w-32 rounded-xl bg-primary-500/20" />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="lg:w-1/2">
              <h2 className="mb-8 text-5xl font-display font-bold tracking-[-0.04em] lg:text-7xl">
                {t("landing.cta.title")} <br />
                <span className="landing-title-mark tracking-[-0.03em]">
                  {t("landing.cta.highlight")}
                </span>{" "}
                {t("landing.cta.title_end")}
              </h2>
              <p className="mb-10 max-w-xl text-xl font-medium leading-relaxed text-muted-foreground">
                {t("landing.cta.description")}
              </p>
              <Link
                to="/checklists"
                className="focus-ring group inline-flex items-center gap-3 rounded-md text-base font-bold text-primary-600 hover:text-primary-500 rtl:flex-row-reverse"
              >
                <span>{t("landing.cta.button")}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Layout>
  );
}
