import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { subscribeImage, brand } from "../mock";

export const SubscribeSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-red-600/5 rounded-3xl -z-10" />
          <img
            src={subscribeImage}
            alt="Smart TV streaming"
            className="w-full rounded-2xl shadow-xl float-slow"
          />
        </div>
        <div>
          <p className="text-red-600 font-bold tracking-[0.25em] text-sm uppercase">Subscribe Now</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Enjoy Sports, Movies,<br />TV Shows & More.
          </h2>
          <div className="mt-8 flex items-end gap-2">
            <span className="text-slate-500 text-lg">Starts From</span>
            <span className="text-5xl font-extrabold text-red-600 leading-none">₹399</span>
            <span className="text-slate-500 text-lg">Per Month</span>
          </div>
          <Button asChild className="mt-8 bg-red-600 hover:bg-red-700 text-white rounded-full h-12 px-7 btn-shine">
            <Link to="/contact">Check Availability <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export const CtaSection = () => {
  return (
    <section className="relative bg-red-600 py-16 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <h3 className="text-white text-3xl md:text-4xl font-extrabold leading-tight max-w-2xl">
          Need Fast & Secure Internet! Use <span className="text-yellow-300">VK Digital</span>
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Button asChild className="bg-slate-900 hover:bg-black text-white rounded-full h-12 px-6">
            <Link to="/home-plans">View All Plans</Link>
          </Button>
          <span className="text-white/80">or</span>
          <a href={`tel:${brand.phone}`} className="text-white font-bold text-lg underline underline-offset-4 hover:text-yellow-300">
            {brand.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
};

export const OttMarquee = () => {
  // Import dynamically to avoid circular deps noise
  const { ottServices } = require("../mock");
  const doubled = [...ottServices, ...ottServices];
  const row1 = doubled.slice(0, Math.ceil(doubled.length / 2) * 2);

  return (
    <section className="bg-[#0b0b0d] py-16">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h3 className="text-white text-3xl md:text-4xl font-extrabold">
          Popular <span className="text-red-500">OTT Services</span> We Offer
        </h3>
        <div className="mx-auto mt-4 w-20 h-1 bg-red-600 rounded" />
      </div>

      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex items-center gap-6 w-max">
          {row1.map((o, i) => (
            <div
              key={`r1-${i}`}
              className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-3 shadow-md hover:scale-105 transition-transform"
            >
              <img src={o.img} alt={o.name} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-mask overflow-hidden mt-6">
        <div className="marquee-track-reverse flex items-center gap-6 w-max">
          {row1.slice().reverse().map((o, i) => (
            <div
              key={`r2-${i}`}
              className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-3 shadow-md hover:scale-105 transition-transform"
            >
              <img src={o.img} alt={o.name} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeatureStrip = () => {
  const items = [
    { title: "500+ Mbps", sub: "Ultra Fast Speed" },
    { title: "24/7", sub: "Customer Support" },
    { title: "350+", sub: "Live TV Channels" },
    { title: "20+", sub: "OTT Applications" },
  ];
  return (
    <section className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.title} className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-red-600">{it.title}</div>
            <div className="mt-1 text-sm text-slate-600 uppercase tracking-wider">{it.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
