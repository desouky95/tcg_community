export default function LoadingHomepage() {
  return (
    <section
      className="mx-auto max-w-360 px-gutter py-section"
      aria-busy="true"
      aria-label="Loading homepage"
    >
      <div className="h-[clamp(300px,43vw,620px)] rounded-xl bg-primary-500 motion-safe:animate-pulse" />
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="aspect-square rounded-xl bg-paper-200 motion-safe:animate-pulse" />
        ))}
      </div>
    </section>
  );
}
