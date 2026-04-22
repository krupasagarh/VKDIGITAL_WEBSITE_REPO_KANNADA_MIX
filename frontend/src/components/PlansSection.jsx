import React from "react";
import { Link } from "react-router-dom";
import { Check, Wifi, MonitorPlay, Tv, Briefcase } from "lucide-react";
import { plans } from "../mock";
import { Button } from "./ui/button";

const ICONS = { Wifi, MonitorPlay, Tv, Briefcase };

const PlansSection = () => {
  return (
    <section className="relative bg-[#0b0b0d] text-white py-20">
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Best Network / ಉತ್ತಮ ನೆಟ್‌ವರ್ಕ್</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold">
            Find Perfect Network Solutions
          </h2>
          <p className="mt-2 text-xl md:text-2xl font-semibold text-white/80" lang="kn">
            ಪರಿಪೂರ್ಣ ನೆಟ್‌ವರ್ಕ್ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕಿ
          </p>
          <div className="mx-auto mt-5 w-24 h-1 rounded bg-yellow-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const Icon = ICONS[p.icon] || Wifi;
            const isBusiness = p.id === "business";
            return (
              <div
                key={p.id}
                className={`plan-card relative rounded-2xl p-8 flex flex-col ${
                  p.popular
                    ? "bg-white text-slate-900"
                    : isBusiness
                    ? "bg-gradient-to-b from-slate-900 to-[#1a1a1d] border border-white/10"
                    : "bg-[#15151a] border border-white/10"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-5 right-[-3px] bg-yellow-400 text-slate-900 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-l-md">
                    Popular
                  </div>
                )}
                {p.subtitle && (
                  <p className={`text-xs uppercase tracking-[0.2em] font-semibold ${p.popular ? "text-yellow-600" : "text-yellow-600"}`}>
                    {p.subtitle}
                  </p>
                )}
                <h3 className={`${p.subtitle ? "mt-2" : ""} text-2xl font-extrabold`}>
                  {p.title}
                </h3>

                <div className={`mt-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
                  p.popular ? "bg-yellow-100 text-yellow-600" : "bg-yellow-400/20 text-yellow-600"
                }`}>
                  <Icon size={36} />
                </div>

                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                      <span className={p.popular ? "text-slate-700" : "text-slate-300"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-dashed border-white/15">
                  <p className={`text-xs ${p.popular ? "text-slate-500" : "text-slate-400"}`}>
                    {p.note}
                  </p>
                  <div className="flex items-end gap-1 mt-1">
                    <span className={`text-4xl font-extrabold ${p.popular ? "text-yellow-600" : "text-white"}`}>
                      {p.price}
                    </span>
                    <span className={`text-sm mb-1 ${p.popular ? "text-slate-500" : "text-slate-400"}`}>
                      {p.cycle}
                    </span>
                  </div>
                </div>

                <Button asChild className={`mt-6 rounded-full h-11 btn-shine ${
                  p.popular
                    ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900"
                    : "bg-white text-slate-900 hover:bg-yellow-500 hover:text-white"
                }`}>
                  <Link to={p.link}>{p.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
