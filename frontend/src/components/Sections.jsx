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
          <div className="absolute -inset-4 bg-yellow-400/10 rounded-3xl -z-10" />
          <img
            src={subscribeImage}
            alt="Smart TV streaming"
            className="w-full rounded-2xl shadow-xl float-slow"
          />
        </div>
        <div>
          <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Subscribe Now / ಈಗ ಚಂದಾದಾರರಾಗಿ</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Enjoy Sports, Movies,<br />TV Shows & More.
          </h2>
          <p className="mt-3 text-lg md:text-xl font-semibold text-slate-600" lang="kn">
            ಕ್ರೀಡೆ, ಚಲನಚಿತ್ರ, ಟಿವಿ ಶೋಗಳನ್ನು ಆನಂದಿಸಿ.
          </p>
          <div className="mt-8 flex items-end gap-2">
            <span className="text-slate-500 text-lg">Starts From</span>
            <span className="text-5xl font-extrabold text-yellow-600 leading-none">₹399</span>
            <span className="text-slate-500 text-lg">Per Month</span>
          </div>
          <Button asChild className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 px-7 btn-shine">
            <Link to="/contact">Check Availability <ArrowRight size={16} className="ml-2" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export const CtaSection = () => {
  return (
    <section className="relative bg-yellow-400 py-16 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <h3 className="text-slate-900 text-3xl md:text-4xl font-extrabold leading-tight max-w-2xl">
          Need Fast & Secure Internet! Use <span className="text-white bg-slate-900 px-2 rounded">VK Digital</span>
          <span className="block mt-2 text-lg md:text-xl font-semibold text-slate-800" lang="kn">
            ವೇಗದ ಮತ್ತು ಸುರಕ್ಷಿತ ಇಂಟರ್ನೆಟ್ ಬೇಕೇ! VK ಡಿಜಿಟಲ್ ಬಳಸಿ
          </span>
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <Button asChild className="bg-slate-900 hover:bg-black text-white rounded-full h-12 px-6">
            <Link to="/home-plans">View All Plans</Link>
          </Button>
          <span className="text-slate-800">or</span>
          <a href={`tel:${brand.helpdeskPhone}`} className="text-slate-900 font-bold text-lg underline underline-offset-4 hover:text-white">
            {brand.helpdeskPhoneDisplay}
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
          Popular <span className="text-yellow-600">OTT Services</span> We Offer
        </h3>
        <p className="mt-2 text-lg md:text-xl font-semibold text-white/80" lang="kn">
          ನಾವು ನೀಡುವ ಜನಪ್ರಿಯ OTT ಸೇವೆಗಳು
        </p>
        <div className="mx-auto mt-4 w-20 h-1 bg-yellow-400 rounded" />
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
    { title: "500+ Mbps", sub: "Ultra Fast Speed", subKn: "ಅತಿ ವೇಗದ ಸ್ಪೀಡ್" },
    { title: "24/7", sub: "Customer Support", subKn: "ಗ್ರಾಹಕ ಬೆಂಬಲ" },
    { title: "350+", sub: "Live TV Channels", subKn: "ಲೈವ್ ಟಿವಿ ಚಾನೆಲ್‌ಗಳು" },
    { title: "20+", sub: "OTT Applications", subKn: "OTT ಅಪ್ಲಿಕೇಶನ್‌ಗಳು" },
  ];
  return (
    <section className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.title} className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-yellow-600">{it.title}</div>
            <div className="mt-1 text-sm text-slate-600 uppercase tracking-wider">{it.sub}</div>
            <div className="text-xs text-slate-500 mt-0.5" lang="kn">{it.subKn}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const CoverageAreasSection = () => {
  const areas = [
    "BH Road Area",
    "Vidhyanagara",
    "Vinayaka Nagar / KR Extension",
    "Gandhinagar",
    "Nearby rural areas within Tiptur Taluk",
    "Surrounding Tiptur extensions & nearby localities",
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Our Coverage Areas</p>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Internet in Tiptur, Tumkur</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Looking for the most reliable local internet service provider in Tiptur, Tumkur?
            VK Digital provides uninterrupted, high-speed fiber broadband straight to your home or office on{" "}
            <span className="font-semibold text-slate-800">BH Road</span> and surrounding Tiptur areas, including{" "}
            <span className="font-semibold text-slate-800">Vidhyanagara</span>,{" "}
            <span className="font-semibold text-slate-800">Vinayaka Nagar / KR Extension</span>, and{" "}
            <span className="font-semibold text-slate-800">Gandhinagar</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {areas.map((a) => (
            <div
              key={a}
              className="rounded-2xl bg-white border border-slate-200 p-6 text-slate-800 shadow-sm flex items-start gap-3"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 mt-2" />
              <div className="text-base font-semibold">{a}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-slate-600">
          Support is local: our on-ground team in Tiptur helps you with installation and issues faster than big corporate providers.
        </p>
      </div>
    </section>
  );
};
