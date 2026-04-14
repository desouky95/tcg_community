import { Users, ShieldCheck, ArrowRight, Star, X } from "lucide-react";
import { useStore } from "../store/useStore";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { SectionHeading } from "../components/layout/SectionHeading";
import { CardFan } from "../components/interactive/CardFan";
import { PackGallery } from "../components/interactive/PackGallery";
import { Footer } from "../components/layout/Footer";
import { PACKS } from "../lib/packs.data";
export default function Landing() {
  const user = useStore((state) => state.user);
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <Layout transparent hideNav>
      <div className="relative overflow-hidden selection:bg-primary-500 selection:text-black">
        {/* Large Background Typography */}
        <div className="absolute top-20 -left-20 text-[20vw] font-black tracking-tighter text-gray-200 dark:text-zinc-900 leading-none select-none pointer-events-none opacity-40 hidden lg:block uppercase rtl:left-auto rtl:-right-20">
          {t("nav.checklists")}
        </div>

        {/* Asymmetric Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-0 mt-20 lg:mt-0">
          <div className="lg:w-1/2 flex flex-col items-start px-4 rtl:items-start">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl lg:text-[5.5rem] font-black tracking-tighter mb-8 uppercase"
            >
              {t("landing.hero.title_line1")} <br />
              <span className="text-primary-600 dark:text-primary-400">
                {t("landing.hero.title_highlight")}
              </span>{" "}
              <br />
              {t("landing.hero.title_line2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-muted-foreground max-w-md font-medium leading-relaxed mb-10"
            >
              {t("landing.hero.description")}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 rtl:space-x-reverse">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <span>{t("landing.hero.cta_enter")}</span>
                  <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black text-xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <span>{t("landing.hero.cta_join")}</span>
                    <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-5 bg-card border border-border rounded-2xl font-black text-xl hover:border-primary-500/50 transition-all active:scale-95"
                  >
                    {t("landing.hero.cta_signin")}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <CardFan />
          </div>
        </section>
        {/* Unique Feature Ticker (Masonry Style) */}
        <section className="py-32">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-4 overflow-hidden">
            {[
              {
                t: t("landing.features.reviews.title"),
                desc: t("landing.features.reviews.desc"),
                icon: <ShieldCheck className="w-10 h-10" />,
              },
              {
                t: t("landing.features.checklists.title"),
                desc: t("landing.features.checklists.desc"),
                icon: <Star className="w-10 h-10" />,
                span: "lg:col-span-2 bg-primary-600 text-white border-none",
              },
              {
                t: t("landing.features.trading.title"),
                desc: t("landing.features.trading.desc"),
                icon: <Users className="w-10 h-10" />,
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ ease: "linear", delay: i * 0.1 }}
                className={`p-8 rounded-4xl border border-border bg-card group transition-all hover:border-primary-500 ${f.span || ""}`}
              >
                <div className="p-3 mb-4 bg-primary-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black mb-3 italic">{f.t}</h3>
                <p className="opacity-80 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="py-2 relative overflow-hidden dark:bg-zinc-950/20">
          <SectionHeading
            // badge={t('landing.gallery.badge')}
            title={t("landing.gallery.title")}
            highlight={t("landing.gallery.highlight")}
            subtitle={t("landing.gallery.subtitle")}
          />

          <PackGallery packs={PACKS} />
        </section>

        {/* Checklist Section */}
        <section className="max-w-7xl mx-auto px-4  lg:py-36 border-t border-border/50">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              onViewportLeave={() => setExpandedCard(null)}
              viewport={{ amount: 0.1 }}
              className="lg:w-1/2 w-full relative h-[450px] bg-gray-300/50 dark:bg-zinc-950/50 rounded-[3rem] border border-white/5 p-12 overflow-hidden"
            >
              <div className="absolute inset-0 p-12 pointer-events-none opacity-20 border-2 border-white/10 rounded-[3rem] m-8 border-dashed" />

              <div className="grid grid-cols-2 gap-6 h-full">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    layoutId={`skeleton-${i}`}
                    onClick={() => setExpandedCard(i)}
                    className="bg-card border border-border rounded-2xl p-6 flex flex-col space-y-4 hover:border-primary-500 transition-colors cursor-pointer group relative"
                  >
                    <motion.div
                      layoutId={`progress-bg-${i}`}
                      className="h-2 w-2/3 bg-border rounded-full group-hover:bg-primary-500/30 overflow-hidden"
                    >
                      <motion.div
                        layoutId={`progress-fill-${i}`}
                        className={`h-full bg-primary-500 w-${i * 25}`}
                      />
                    </motion.div>
                    <div className="space-y-2">
                      <motion.div
                        layoutId={`line-1-${i}`}
                        className="h-3 w-full bg-border rounded-lg"
                      />
                      <motion.div
                        layoutId={`line-2-${i}`}
                        className="h-3 w-1/2 bg-border rounded-lg"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {expandedCard !== null && (
                  <>
                    {/* Click Outside Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setExpandedCard(null)}
                      className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm cursor-zoom-out"
                    />

                    <motion.div
                      layoutId={`skeleton-${expandedCard}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-0 z-50 bg-card border-2 border-primary-500/50 rounded-[3rem] p-12 flex flex-col cursor-default"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCard(null);
                        }}
                        className="absolute top-6 right-6 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors rtl:right-auto rtl:left-6 z-10"
                      >
                        <X className="w-6 h-6" />
                      </button>

                      <div className="flex items-center justify-between mb-10">
                        <motion.div
                          layoutId={`progress-bg-${expandedCard}`}
                          className="h-4 w-1/3 bg-border rounded-full overflow-hidden"
                        >
                          <motion.div
                            layoutId={`progress-fill-${expandedCard}`}
                            className={`h-full bg-primary-500 w-${expandedCard * 25}`}
                          />
                        </motion.div>
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <div className="h-4 w-20 bg-border rounded-full animate-pulse" />
                          <div className="h-4 w-20 bg-border rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-6 flex-1 overflow-hidden">
                        {/* Table Header Skeleton */}
                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-border/50">
                          <div className="h-3 bg-border rounded-lg w-1/2" />
                          <div className="h-3 bg-border rounded-lg w-full" />
                          <div className="h-3 bg-border rounded-lg w-3/4" />
                          <div className="h-3 bg-border rounded-lg w-1/2 text-right" />
                        </div>

                        {/* Table Row Skeletons */}
                        {[1, 2, 3, 4, 5].map((row) => (
                          <motion.div
                            key={row}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + row * 0.05 }}
                            className="grid grid-cols-4 gap-4 items-center"
                          >
                            <div className="h-3 bg-border/40 rounded-lg w-1/3" />
                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full" />
                            <div className="h-3 bg-border/40 rounded-lg w-2/3" />
                            <div className="h-6 bg-primary-500/10 rounded-full w-1/2 ml-auto" />
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                        <motion.div
                          layoutId={`line-2-${expandedCard}`}
                          className="h-3 w-32 bg-border rounded-lg"
                        />
                        <div className="h-8 w-32 bg-primary-500/20 rounded-xl" />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="lg:w-1/2">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">
                {t("landing.cta.title")} <br />
                <span className="text-primary-600 tracking-tighter italic uppercase">
                  {t("landing.cta.highlight")}
                </span>{" "}
                {t("landing.cta.title_end")}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-10">
                {t("landing.cta.description")}
              </p>
              <Link
                to="/checklists"
                className="inline-flex items-center space-x-3 rtl:space-x-reverse text-lg font-black text-primary-600 hover:text-primary-500 group"
              >
                <span>{t("landing.cta.button")}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </Layout>
  );
}
