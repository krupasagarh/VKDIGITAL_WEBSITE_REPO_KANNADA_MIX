import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Check, Wifi } from "lucide-react";
import { homePlans } from "../mock";
import { Button } from "../components/ui/button";
import { CtaSection } from "../components/Sections";

const HomePlans = () => {
  return (
    <>
      <PageHeader title="Home Plans" />
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Choose Your Plan</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Blazing Fast Home Internet</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homePlans.map((p) => (
              <div key={p.id} className="plan-card bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                    <Wifi size={22} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">Broadband</p>
                    <h3 className="text-xl font-extrabold text-slate-900">{p.speed}</h3>
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹{p.price}</span>
                  <span className="text-slate-500 mb-1">/ month</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> {p.data} Data</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Validity: {p.validity}</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Free Installation</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Free WiFi Router*</li>
                  {p.ott && <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> 20+ OTT Apps</li>}
                  {p.iptv && <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> 350+ Live TV Channels</li>}
                </ul>
                <Button asChild className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-11 btn-shine">
                  <Link to="/contact">Subscribe Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
};

export default HomePlans;
