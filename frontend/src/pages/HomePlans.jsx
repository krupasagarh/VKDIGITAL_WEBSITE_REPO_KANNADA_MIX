import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Check, Gift, Wifi } from "lucide-react";
import { Button } from "../components/ui/button";
import { CtaSection } from "../components/Sections";
import { usePlanCatalog } from "../context/PlanCatalogContext";
import { buildTermPlanMatrix, computeWelcomePlanQuote, formatInr, formatTermOfferDisplay } from "../lib/smartPlanEngine";

const HomePlans = () => {
  const { homePlans, website, termOffers, welcomePlans, welcomePlansEnabled } = usePlanCatalog();

  const termMatrix = useMemo(() => buildTermPlanMatrix(website), [website]);

  const welcomeQuotes = useMemo(
    () => welcomePlans.map((plan) => ({ plan, quote: computeWelcomePlanQuote(plan) })),
    [welcomePlans]
  );

  return (
    <>
      <PageHeader title="Home Plans" />
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Choose Your Plan</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Blazing Fast Home Internet</h2>
            <p className="mt-4 text-slate-600">
              Need a different mix of speed, OTT, or TV?{" "}
              <Link to="/plan-builder" className="font-semibold text-yellow-700 hover:underline">
                Build your own plan
              </Link>{" "}
              and send us a request.
            </p>
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

      {termMatrix.length > 0 && (
        <section className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Internet Only</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">Term Plans</h2>
              <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
                Pay for the full term and get extra months free. Prices shown are ex GST.
              </p>
              {termOffers.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {termOffers.map((offer) => (
                    <span
                      key={offer.id}
                      className="text-sm font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 px-4 py-1.5 rounded-full"
                    >
                      {formatTermOfferDisplay(offer)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Speed</th>
                    {termOffers.map((offer) => (
                      <th key={offer.id} className="text-left px-4 py-3 font-semibold">
                        {formatTermOfferDisplay(offer)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...new Set(termMatrix.map((row) => row.speed))].map((speed) => (
                    <tr key={speed} className="border-t border-slate-100 even:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-900">{speed}</td>
                      {termOffers.map((offer) => {
                        const entry = termMatrix.find(
                          (row) => row.speed === speed && row.offer.id === offer.id
                        );
                        if (!entry) {
                          return (
                            <td key={offer.id} className="px-4 py-3 text-slate-400">
                              —
                            </td>
                          );
                        }
                        return (
                          <td key={offer.id} className="px-4 py-3">
                            <p className="font-extrabold text-slate-900 text-lg">
                              ₹{formatInr(entry.quote.baseTotal)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">+ GST</p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-11 px-8 btn-shine">
                <Link to="/plan-builder">Select a term plan</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {welcomePlansEnabled && welcomeQuotes.length > 0 && (
        <section className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase flex items-center justify-center gap-2">
                <Gift size={16} /> Special Offers
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">Welcome Plans</h2>
              <p className="mt-3 text-slate-600">Offer prices are ex GST; GST is added in Plan Builder bill breakdown.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {welcomeQuotes.map(({ plan, quote }) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm flex flex-col"
                >
                  <p className="text-xs uppercase tracking-widest text-yellow-700 font-bold">Welcome Offer</p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {plan.speed} · {plan.months} months · {plan.ottCount} OTT apps
                  </p>
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{formatInr(plan.price)}
                    </span>
                    <span className="text-slate-500 mb-1 text-sm">+ GST</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Total incl. GST: ₹{formatInr(quote.totalPayable)}
                  </p>
                  <ul className="mt-5 space-y-1.5 text-sm text-slate-600 flex-1">
                    {plan.ottApps.slice(0, 6).map((app) => (
                      <li key={app} className="flex items-center gap-2">
                        <Check size={14} className="text-yellow-600 shrink-0" /> {app}
                      </li>
                    ))}
                    {plan.ottApps.length > 6 && (
                      <li className="text-xs text-slate-500">+ {plan.ottApps.length - 6} more OTT apps</li>
                    )}
                  </ul>
                  <Button asChild className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-11 btn-shine">
                    <Link to="/plan-builder">Choose this plan</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
};

export default HomePlans;
