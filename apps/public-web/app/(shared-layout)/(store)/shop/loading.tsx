export default function LoadingShop() {
  return <section className="mx-auto max-w-360 px-gutter py-section" aria-busy="true" aria-label="Loading shop"><p className="font-display text-2xl font-semibold">Loading shop…</p><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-hidden="true">{[0, 1, 2, 3].map(item => <div key={item} className="aspect-square rounded-xl bg-paper-200 motion-safe:animate-pulse" />)}</div></section>;
}
