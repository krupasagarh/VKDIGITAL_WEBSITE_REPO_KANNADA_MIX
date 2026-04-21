import React from "react";
import PageHeader from "../components/PageHeader";
import { iptvChannels } from "../mock";
import { CtaSection } from "../components/Sections";
import { Tv, Radio, Film, Trophy } from "lucide-react";

const Iptv = () => {
  const cats = [
    { icon: Film, label: "Movies", count: "80+" },
    { icon: Trophy, label: "Sports", count: "40+" },
    { icon: Radio, label: "News", count: "50+" },
    { icon: Tv, label: "Entertainment", count: "180+" },
  ];
  return (
    <>
      <PageHeader title="IPTV Packages" crumb="IPTV" />
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-red-600 font-bold tracking-[0.25em] text-sm uppercase">IPTV</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">350+ Live TV Channels in HD</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
            {cats.map((c) => (
              <div key={c.label} className="rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mx-auto w-14 h-14 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center">
                  <c.icon size={26} />
                </div>
                <div className="mt-4 text-3xl font-extrabold text-slate-900">{c.count}</div>
                <div className="text-sm text-slate-600 uppercase tracking-widest mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-50 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-5">Featured Channels</h3>
            <div className="flex flex-wrap gap-2">
              {iptvChannels.map((ch) => (
                <span key={ch} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-default">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
};

export default Iptv;
