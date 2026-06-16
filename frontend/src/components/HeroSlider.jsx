import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { usePlanCatalog } from "../context/PlanCatalogContext";

const HeroSlider = () => {
  const { heroSlides } = usePlanCatalog();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!heroSlides.length) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  useEffect(() => {
    if (idx >= heroSlides.length) setIdx(0);
  }, [heroSlides.length, idx]);

  if (!heroSlides.length) return null;

  const go = (dir) =>
    setIdx((i) => (i + dir + heroSlides.length) % heroSlides.length);

  const slide = heroSlides[idx];

  return (
    <section className="relative w-full h-[560px] md:h-[640px] overflow-hidden bg-yellow-400">
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      <div className="absolute inset-0 dot-pattern opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center">
        <div key={slide.id} className="fade-in-up max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs uppercase tracking-wider">
            <Wifi size={14} /> {slide.subtitle}
          </div>
          {slide.subtitleKn ? (
            <p className="mt-2 text-sm md:text-base font-medium text-white/85" lang="kn">
              {slide.subtitleKn}
            </p>
          ) : null}

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {slide.title}
          </h1>
          {slide.titleKn ? (
            <p className="mt-2 text-xl md:text-2xl font-semibold text-white/90" lang="kn">
              {slide.titleKn}
            </p>
          ) : null}

          <p className="mt-4 text-2xl md:text-3xl font-bold text-yellow-300">
            {slide.highlight}
          </p>
          {slide.highlightKn ? (
            <p className="mt-1 text-lg md:text-xl font-semibold text-yellow-200/90" lang="kn">
              {slide.highlightKn}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="bg-slate-900 border-2 border-yellow-300 rounded-md px-5 py-3">
              <div className="text-yellow-300 text-2xl md:text-3xl font-extrabold">
                {slide.price}
              </div>
            </div>
            <div className="text-white font-bold text-lg md:text-xl">+</div>
            <div>
              <div className="text-white font-extrabold text-xl md:text-2xl">{slide.extra}</div>
              {slide.extraKn ? (
                <div className="text-white/90 font-semibold text-base md:text-lg mt-1" lang="kn">
                  {slide.extraKn}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-slate-900 hover:bg-black text-white rounded-full px-7 h-12 btn-shine">
              <Link to="/home-plans">View Plans / ಪ್ಲಾನ್‌ಗಳು</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-yellow-600 rounded-full px-7 h-12">
              <Link to="/contact">
                <Play size={16} className="mr-2" /> Check Availability
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur border border-white/30 text-white flex items-center justify-center transition-colors"
        aria-label="prev"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur border border-white/30 text-white flex items-center justify-center transition-colors"
        aria-label="next"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${
              i === idx ? "w-8 bg-yellow-300" : "w-2 bg-white/50"
            }`}
            aria-label={`go ${i}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
