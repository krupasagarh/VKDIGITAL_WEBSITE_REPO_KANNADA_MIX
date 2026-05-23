import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import {
  planBuilderConfig,
  computePlanBuilderQuote,
  buildPlanRequestMessage,
  whatsappLeadUrl,
} from "../mock";
import { postPlanLead, getApiBase } from "../api";
import { Building2, Home, Send, SlidersHorizontal, Sparkles } from "lucide-react";

const LS_KEY = "vk_plan_requests";

const PlanBuilder = () => {
  const { toast } = useToast();
  const [segment, setSegment] = useState("home");
  const defaultTierId =
    planBuilderConfig.home.tiers[0]?.id || "50";
  const [tierId, setTierId] = useState(defaultTierId);
  const [ott, setOtt] = useState(false);
  const [iptv, setIptv] = useState(false);
  const [busy, setBusy] = useState(false);

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    locality: "",
    notes: "",
  });

  const cfg = segment === "business" ? planBuilderConfig.business : planBuilderConfig.home;
  const tiers = cfg.tiers;

  React.useEffect(() => {
    const ids = new Set(tiers.map((t) => t.id));
    if (!ids.has(tierId)) setTierId(tiers[0].id);
  }, [segment, tiers, tierId]);

  const quote = useMemo(
    () => computePlanBuilderQuote({ segment, tierId, ott, iptv }),
    [segment, tierId, ott, iptv]
  );

  const onContactChange = (e) =>
    setContact((c) => ({ ...c, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!contact.name.trim() || !contact.phone.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter your name and phone so we can reach you.",
      });
      return;
    }
    setBusy(true);
    const request = {
      id: `req_${Date.now()}`,
      createdAt: new Date().toISOString(),
      segment: quote.segment,
      speed: quote.tier.speed,
      ott: quote.ott,
      iptv: quote.iptv,
      estimatedMonthly: quote.estimatedMonthly,
      breakdown: quote.breakdown,
      contact: { ...contact },
    };
    try {
      const prev = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      prev.push(request);
      localStorage.setItem(LS_KEY, JSON.stringify(prev));

      let emailSent = false;
      try {
        const res = await postPlanLead(request);
        emailSent = Boolean(res?.email_sent);
      } catch (apiErr) {
        console.error(apiErr);
      }

      const msg = buildPlanRequestMessage(request);
      window.open(whatsappLeadUrl(msg), "_blank", "noopener,noreferrer");

      const hasApi = Boolean(getApiBase());
      if (!hasApi) {
        toast({
          title: "Submitted",
          description:
            "WhatsApp opened. For automatic email to the owner, add REACT_APP_API_URL in frontend/.env and run the backend with SMTP configured.",
        });
      } else if (emailSent) {
        toast({
          title: "Submitted",
          description: "WhatsApp opened. An email was sent to the owner inbox.",
        });
      } else {
        toast({
          title: "Submitted",
          description:
            "WhatsApp opened. Email was not sent — set SMTP in backend/.env (see backend/.env.example).",
          variant: "destructive",
        });
      }
      setContact({ name: "", phone: "", email: "", locality: "", notes: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description: "Please try again or call the number on the site.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Build Your Plan" crumb="Plan Builder" />

      <section className="bg-slate-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase flex items-center justify-center gap-2">
              <SlidersHorizontal size={16} /> Custom plan
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              Pick speed, OTT &amp; TV — get an instant estimate
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-600" lang="kn">
              ಸ್ಪೀಡ್, OTT ಮತ್ತು ಟಿವಿ ಆಯ್ಕೆ ಮಾಡಿ — ತಕ್ಷಣ ಅಂದಾಜು ಪಡೆಯಿರಿ
            </p>
            <p className="mt-3 text-sm text-slate-500">{planBuilderConfig.disclaimerEn}</p>
            <p className="mt-1 text-sm text-slate-500" lang="kn">
              {planBuilderConfig.disclaimerKn}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Builder */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="text-yellow-600" size={22} />
                    Step 1 — Connection type
                  </CardTitle>
                  <CardDescription>Choose home or business billing</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {planBuilderConfig.segments.map((s) => {
                    const active = segment === s.id;
                    const Icon = s.id === "business" ? Building2 : Home;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSegment(s.id)}
                        className={`text-left rounded-2xl border-2 p-5 transition-all ${
                          active
                            ? "border-yellow-500 bg-yellow-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-yellow-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                              active ? "bg-yellow-400 text-slate-900" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon size={22} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{s.label}</p>
                            <p className="text-xs font-semibold text-slate-500" lang="kn">
                              {s.labelKn}
                            </p>
                            <p className="text-sm text-slate-600 mt-2">{s.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Step 2 — Internet speed</CardTitle>
                  <CardDescription>Select the speed tier you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tiers.map((t) => {
                      const sel = tierId === t.id;
                      return (
                        <Button
                          key={t.id}
                          type="button"
                          variant={sel ? "default" : "outline"}
                          onClick={() => setTierId(t.id)}
                          className={`rounded-full h-11 ${
                            sel ? "bg-slate-900 hover:bg-black text-white" : "border-slate-200"
                          }`}
                        >
                          {t.speed}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Step 3 — Add-ons</CardTitle>
                  <CardDescription>Toggle OTT and IPTV if you want them bundled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4">
                    <div>
                      <Label htmlFor="ott" className="text-base font-semibold text-slate-900">
                        {cfg.ottLabel}
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5" lang="kn">{cfg.ottLabelKn}</p>
                      <p className="text-sm text-yellow-700 font-semibold mt-1">
                        + ₹{cfg.ottAddon}/mo
                      </p>
                    </div>
                    <Switch id="ott" checked={ott} onCheckedChange={setOtt} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4">
                    <div>
                      <Label htmlFor="iptv" className="text-base font-semibold text-slate-900">
                        {cfg.iptvLabel}
                      </Label>
                      <p className="text-xs text-slate-500 mt-0.5" lang="kn">{cfg.iptvLabelKn}</p>
                      <p className="text-sm text-yellow-700 font-semibold mt-1">
                        + ₹{cfg.iptvAddon}/mo
                      </p>
                    </div>
                    <Switch id="iptv" checked={iptv} onCheckedChange={setIptv} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Send size={20} className="text-yellow-600" />
                    Step 4 — Your details &amp; request
                  </CardTitle>
                  <CardDescription>
                    We will contact you to confirm feasibility and final pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pb-name">Full name *</Label>
                        <Input
                          id="pb-name"
                          name="name"
                          className="mt-1.5 h-11"
                          placeholder="Name / ಹೆಸರು"
                          value={contact.name}
                          onChange={onContactChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pb-phone">Phone *</Label>
                        <Input
                          id="pb-phone"
                          name="phone"
                          className="mt-1.5 h-11"
                          placeholder="Mobile number"
                          value={contact.phone}
                          onChange={onContactChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pb-email">Email (optional)</Label>
                      <Input
                        id="pb-email"
                        name="email"
                        type="email"
                        className="mt-1.5 h-11"
                        placeholder="you@example.com"
                        value={contact.email}
                        onChange={onContactChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pb-locality">Area / locality</Label>
                      <Input
                        id="pb-locality"
                        name="locality"
                        className="mt-1.5 h-11"
                        placeholder="e.g. Ward, village near Tiptur"
                        value={contact.locality}
                        onChange={onContactChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pb-notes">Notes (optional)</Label>
                      <Textarea
                        id="pb-notes"
                        name="notes"
                        className="mt-1.5 min-h-[100px]"
                        placeholder="e.g. Need connection by next week, shop billing, etc."
                        value={contact.notes}
                        onChange={onContactChange}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 px-8 btn-shine"
                    >
                      {busy ? "Sending…" : "Send plan request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary sticky */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 space-y-4">
                <Card className="border-yellow-200 bg-gradient-to-b from-white to-yellow-50/80 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Your plan summary</CardTitle>
                    <CardDescription>Estimated monthly recurring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-slate-900 text-white p-5 text-center">
                      <p className="text-xs uppercase tracking-widest text-white/70">Estimate</p>
                      <p className="text-4xl font-extrabold text-yellow-300 mt-1">
                        ₹{quote.estimatedMonthly}
                      </p>
                      <p className="text-sm text-white/80 mt-1">per month (indicative)</p>
                    </div>
                    <ul className="text-sm space-y-2 text-slate-700">
                      <li className="flex justify-between gap-2">
                        <span>Type</span>
                        <span className="font-semibold capitalize">{quote.segment}</span>
                      </li>
                      <li className="flex justify-between gap-2">
                        <span>Speed</span>
                        <span className="font-semibold">{quote.tier.speed}</span>
                      </li>
                      <li className="flex justify-between gap-2">
                        <span>OTT bundle</span>
                        <span className="font-semibold">{quote.ott ? "Yes" : "No"}</span>
                      </li>
                      <li className="flex justify-between gap-2">
                        <span>IPTV / Live TV</span>
                        <span className="font-semibold">{quote.iptv ? "Yes" : "No"}</span>
                      </li>
                    </ul>
                    <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                      {quote.breakdown.map((row) => (
                        <div key={row.key} className="flex justify-between">
                          <span>{row.label}</span>
                          <span>₹{row.amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-slate-500 px-1">
                  Submitting sends the details to our server for an automatic email to the owner (when SMTP is configured) and opens WhatsApp with the same summary. A copy is kept in this browser under vk_plan_requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlanBuilder;
