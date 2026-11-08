"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

export interface HeroSlideItem {
  web_image: string;
  mobile_image: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface HeroSliderProps {
  slides: HeroSlideItem[];
  interval?: number;
}

export function HeroSlider({ slides, interval = 6000 }: HeroSliderProps) {
  const [viewportRef, embla] = useEmblaCarousel({ loop: slides.length > 1 });
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [paused, setPaused] = useState(false);

  const updateSelected = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    updateSelected();
    embla.on("select", updateSelected).on("reInit", updateSelected);
    return () => {
      embla.off("select", updateSelected).off("reInit", updateSelected);
    };
  }, [embla, updateSelected]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!embla || slides.length < 2 || !playing || paused || reducedMotion)
      return;
    const timer = window.setInterval(() => embla.scrollNext(), interval);
    return () => window.clearInterval(timer);
  }, [embla, interval, paused, playing, reducedMotion, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="relative overflow-hidden bg-primary-500 text-white [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-offset-3 [&_:focus-visible]:outline-signature-lime-500"
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex [touch-action:pan-y_pinch-zoom]">
          {slides.map((slide, index) => (
            <div
              className="relative flex min-h-[clamp(500px,43vw,750px)] min-w-0 flex-[0_0_100%] items-center max-[640px]:min-h-[620px] max-[640px]:items-end"
              key={`${slide.url}-${index}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-hidden={index !== selected}
              inert={index !== selected}
            >
              <picture className="absolute inset-0">
                <source
                  media="(max-width: 640px)"
                  srcSet={slide.mobile_image}
                />
                <img
                  src={slide.web_image}
                  className="h-full w-full object-cover object-[center_38%]"
                  alt=""
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#101b2d_0%,rgba(16,27,45,0.94)_30%,rgba(16,27,45,0.28)_100%)] max-[640px]:bg-[linear-gradient(0deg,#101b2d_5%,rgba(16,27,45,0.92)_40%,rgba(16,27,45,0.15)_100%)]" />
              <div className="relative z-1 mx-auto w-full max-w-[1450px] px-[clamp(24px,6vw,96px)] pt-20 pb-[130px] max-[640px]:px-6 max-[640px]:pt-[200px] max-[640px]:pb-[120px]">
                <h1 className="m-0 max-w-[12ch] text-balance font-display text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[1.04] tracking-[-0.035em] max-[640px]:text-[clamp(2.5rem,11vw,3.5rem)]">
                  {slide.title}
                </h1>
                <p className="mt-[22px] mb-0 max-w-[42ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.6] text-[#e7ebf2]">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.url}
                  className="mt-[30px] inline-flex min-h-control items-center gap-5 rounded-md bg-signature-lime-500 px-5 font-bold text-primary-500 no-underline hover:bg-[#ddff79]"
                >
                  Explore <ArrowRight size={19} aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div
          className="absolute inset-x-0 bottom-0 z-2 mx-auto flex max-w-[1450px] items-center justify-between gap-5 px-[clamp(24px,6vw,96px)] pb-[30px] max-[640px]:px-6 max-[640px]:pb-[22px]"
          aria-label="Slide controls"
        >
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.url}-${index}`}
                className="h-11 w-[30px] cursor-pointer border-0 bg-transparent p-0 after:block after:h-[3px] after:bg-white/50 after:content-[''] aria-[current=true]:after:bg-signature-lime-500"
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === selected ? "true" : undefined}
                onClick={() => embla?.scrollTo(index)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!reducedMotion && (
              <button
                className="grid size-11 cursor-pointer place-items-center rounded-md border border-white/55 bg-primary-500 text-white hover:bg-[#29405e]"
                type="button"
                aria-label={
                  playing
                    ? "Pause automatic slide rotation"
                    : "Start automatic slide rotation"
                }
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
            )}
            <button
              className="grid size-11 cursor-pointer place-items-center rounded-md border border-white/55 bg-primary-500 text-white hover:bg-[#29405e]"
              type="button"
              aria-label="Previous slide"
              onClick={() => embla?.scrollPrev()}
            >
              <ArrowLeft size={19} />
            </button>
            <button
              className="grid size-11 cursor-pointer place-items-center rounded-md border border-white/55 bg-primary-500 text-white hover:bg-[#29405e]"
              type="button"
              aria-label="Next slide"
              onClick={() => embla?.scrollNext()}
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
