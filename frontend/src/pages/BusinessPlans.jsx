import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Check, Briefcase } from "lucide-react";
import { businessPlans } from "../mock";
import { Button } from "../components/ui/button";
import { CtaSection } from "../components/Sections";

const BusinessPlans = () => {
  return (
    <>
      <PageHeader title="Business Plans" />
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Business Internet</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">For SME & SOHO</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Dedicated business-grade fiber with Static IP, B2B GST Billing and 24/7 priority support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessPlans.map((p) => (
              <div key={p.id} className="plan-card bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                  <Briefcase size={22} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">{p.speed}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-yellow-600">₹{p.price}</span>
                  <span className="text-slate-500 mb-1 text-sm">/ month</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> {p.data} Data</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Free Static IP</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> B2B GST Billing</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Auto Renewal</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-yellow-600" /> Priority Support</li>
                </ul>
                <Button asChild className="mt-6 w-full bg-slate-900 hover:bg-black text-white rounded-full h-11 btn-shine">
                  <Link to="/contact">Enquire Now</Link>
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

export default BusinessPlans;
