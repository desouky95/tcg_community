"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function ProductGallery({ title, images }: { title: string; images: string[] }) {
  const [viewportRef, embla] = useEmblaCarousel({
    breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
  });
  const galleryRef = useRef<HTMLElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const [imageSize, setImageSize] = useState<number>();

  const updateSelected = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    updateSelected();
    embla.on("select", updateSelected).on("reInit", updateSelected);
    return () => { embla.off("select", updateSelected).off("reInit", updateSelected); };
  }, [embla, updateSelected]);

  useEffect(() => {
    const strip = thumbnailsRef.current;
    const thumbnail = strip?.children.item(selected) as HTMLElement | null;
    if (!strip || !thumbnail) return;
    const bounds = strip.getBoundingClientRect();
    const item = thumbnail.getBoundingClientRect();
    if (item.left < bounds.left) strip.scrollLeft += item.left - bounds.left;
    else if (item.right > bounds.right) strip.scrollLeft += item.right - bounds.right;
  }, [selected]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const measure = () => {
      // Use the gallery's initial document position so scrolling does not resize it.
      const top = gallery.getBoundingClientRect().top + window.scrollY;
      const stripHeight = thumbnailsRef.current?.offsetHeight ?? 0;
      setImageSize(Math.max(160, Math.floor(window.innerHeight - top - stripHeight - (images.length > 1 ? 16 : 0) - 16)));
    };
    measure();
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(gallery);
    return () => { window.removeEventListener("resize", measure); observer?.disconnect(); };
  }, [images.length]);

  return <section ref={galleryRef} aria-label="Product images" className="min-w-0 lg:max-w-[55%] lg:shrink-0" style={{ width: `min(100%, ${imageSize === undefined ? "55svh" : `${imageSize}px`})` }}>
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-paper-200">
      <span aria-hidden="true" className="absolute start-0 top-0 z-10 size-16 bg-accent-500 [clip-path:polygon(0_0,100%_0,0_100%)]" />
      <span aria-hidden="true" className="absolute end-5 top-5 z-10 size-7 bg-signature-lime-500 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]" />
      {images.length ? <div ref={viewportRef} className="h-full overflow-hidden" aria-roledescription="carousel" aria-label="Product image gallery">
        <div className="flex h-full [touch-action:pan-y_pinch-zoom]">
          {images.map((src, index) => <div key={`${src}-${index}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`} aria-hidden={index !== selected} className="grid h-full min-w-0 flex-[0_0_100%] place-items-center p-6 sm:p-10">
            {!failed.includes(src) ? <img src={src} alt={title} onError={() => setFailed(current => current.includes(src) ? current : [...current, src])} className="h-full w-full object-contain" /> : <p className="text-sm font-semibold text-primary-500">Image unavailable</p>}
          </div>)}
        </div>
      </div> : <div className="grid h-full place-items-center"><p className="text-sm font-semibold text-primary-500">Image unavailable</p></div>}
    </div>
    {images.length > 1 && <div ref={thumbnailsRef} className="relative mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Choose product image">{images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => embla?.scrollTo(index)} aria-label={`Show image ${index + 1} of ${images.length}`} aria-pressed={selected === index} className="focus-ring size-20 shrink-0 overflow-hidden rounded-md border-2 border-transparent bg-paper-200 p-1 aria-pressed:border-accent-500">{!failed.includes(src) && <img src={src} alt="" loading="lazy" className="h-full w-full object-contain" />}</button>)}</div>}
  </section>;
}
