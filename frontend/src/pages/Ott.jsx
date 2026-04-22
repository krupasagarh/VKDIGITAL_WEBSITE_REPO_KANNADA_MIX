import React from "react";
import PageHeader from "../components/PageHeader";
import { ottServices } from "../mock";
import { CtaSection } from "../components/Sections";

const Ott = () => {
  return (
    <>
      <PageHeader title="OTT Packages" crumb="OTT" />
      <section className="bg-white py-20">
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
              <div key={o.name} className="group bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-24 h-24 bg-slate-50 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                  <img src={o.img} alt={o.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs text-slate-700 font-medium text-center">{o.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
};

export default Ott;
