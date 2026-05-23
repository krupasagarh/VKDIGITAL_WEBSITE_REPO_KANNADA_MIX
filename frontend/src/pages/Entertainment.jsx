import React from "react";
import PageHeader from "../components/PageHeader";
import { ottServices, iptvChannels } from "../mock";
import { CtaSection, FeatureStrip } from "../components/Sections";
import { Tv, Radio, Film, Trophy } from "lucide-react";

const Entertainment = () => {
  const cats = [
    { icon: Film, label: "Movies", count: "80+" },
    { icon: Trophy, label: "Sports", count: "40+" },
    { icon: Radio, label: "News", count: "50+" },
    { icon: Tv, label: "Entertainment", count: "180+" },
  ];

  return (
    <>
      <PageHeader title="OTT + IPTV Packages" crumb="Entertainment" />

      {/* OTT */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Streaming</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Popular OTT Services We Offer</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Get access to 20+ OTT applications bundled with your VK Digital broadband plan.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
            {ottServices.map((o) => (
              <div
                key={o.name}
                className="group bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={o.img}
                    alt={o.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <p className="text-xs text-slate-700 font-medium text-center">{o.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IPTV */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">IPTV</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">350+ Live TV Channels in HD</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
            {cats.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="mx-auto w-14 h-14 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                  <c.icon size={26} />
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">{c.count}</div>
                <div className="text-sm text-slate-600 uppercase tracking-widest mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-5">Featured Channels</h3>
            <div className="flex flex-wrap gap-2">
              {iptvChannels.map((ch) => (
                <span
                  key={ch}
                  className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-slate-700 hover:bg-yellow-500 hover:text-white hover:border-yellow-400 transition-colors cursor-default"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureStrip />
      <CtaSection />
    </>
  );
};

export default Entertainment;

