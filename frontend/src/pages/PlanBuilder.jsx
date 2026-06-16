import React, { useMemo, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useToast } from "../hooks/use-toast";
import { planBuilderConfig } from "../mock";
import { postPlanLead, getApiBase } from "../api";
import { usePlanCatalog } from "../context/PlanCatalogContext";
import {
  getPlanCatalog,
  getDefaultPlanSelections,
  syncPlanSelections,
  computePlanQuote,
  computeTermPlanQuote,
  computeWelcomePlanQuote,
  getTermOffers,
  getTermPlanSpeeds,
  formatInr,
  formatTermOfferDisplay,
  getOttAppsForPlan,
  searchPlansByBudget,
} from "../lib/smartPlanEngine";
import { ArrowDown, Gift, IndianRupee, Search, Send, SlidersHorizontal, Sparkles, Timer } from "lucide-react";

function BillBreakdownCard({ quote, onBookPlan, showBookButton = false }) {
  const isTerm = quote.planType === "term";
  const isWelcome = quote.planType === "welcome";
  const planTotalInclGst =
    quote.planTotalInclGst ??
    Math.round(((Number(quote.baseTotal) || 0) + (Number(quote.gst) || 0)) * 100) / 100;

  return (
    <Card className="border-yellow-200 bg-gradient-to-b from-white to-yellow-50/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Bill breakdown</CardTitle>
        <CardDescription>{quote.description}</CardDescription>
        {isTerm && quote.freeMonths > 0 && (
          <p className="text-xs font-medium text-green-700 mt-1">
            {formatTermOfferDisplay({
              totalMonths: quote.paidMonths ?? quote.totalMonths,
              freeMonths: quote.freeMonths,
            })}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-slate-900 text-white p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/70">Total payable</p>
          <p className="text-4xl font-extrabold text-yellow-300 mt-1">
            ₹{formatInr(quote.totalPayable)}
          </p>
          <p className="text-sm text-white/80 mt-1">
            for {quote.months} month{quote.months > 1 ? "s" : ""}
            {isTerm && quote.freeMonths > 0 ? ` (${quote.freeMonths} free)` : ""}
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
          {isWelcome ? (
            <>
              <div className="flex justify-between">
                <span>Plan price (ex GST)</span>
                <span className="font-semibold">₹{formatInr(quote.baseTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold">₹{formatInr(quote.gst)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span>Plan total (incl. GST)</span>
                <span className="font-semibold">₹{formatInr(planTotalInclGst)}</span>
              </div>
            </>
          ) : isTerm ? (
            <>
              <div className="flex justify-between">
                <span>Plan price (ex GST)</span>
                <span className="font-semibold">₹{formatInr(quote.baseTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold">₹{formatInr(quote.gst)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Base monthly price</span>
                <span className="font-semibold">₹{formatInr(quote.baseMonthly)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold">₹{formatInr(quote.gst)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span>Monthly rental (incl. GST)</span>
                <span className="font-semibold">₹{formatInr(quote.monthlyInclGst)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>One-time installation</span>
            <span className="font-semibold">
              {quote.installation === 0 ? "Free" : `₹${formatInr(quote.installation)}`}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500">{quote.installNote}</p>

        {isWelcome && quote.ottApps?.length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900 mb-2">Included OTT apps</p>
            <div className="flex flex-wrap gap-1.5">
              {quote.ottApps.map((app) => (
                <span
                  key={app}
                  className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
          {quote.breakdown.map((row) => (
            <div key={row.key} className="flex justify-between">
              <span>{row.label}</span>
              <span>₹{formatInr(row.amount)}</span>
            </div>
          ))}
        </div>

        {showBookButton && onBookPlan && (
          <Button
            type="button"
            onClick={onBookPlan}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 btn-shine"
          >
            <ArrowDown size={18} className="mr-2" />
            Click to book plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

const LS_KEY = "vk_plan_requests";

const initialSelections = getDefaultPlanSelections();

const PlanBuilder = () => {
  const { toast } = useToast();
  const { catalogSource, catalogLoading, refreshCatalog, website, termOffers, welcomePlans, welcomePlansEnabled } =
    usePlanCatalog();
  const [tab, setTab] = useState("build");
  const [speedName, setSpeedName] = useState(initialSelections.speedName);
  const [iptvName, setIptvName] = useState(initialSelections.iptvName);
  const [ottName, setOttName] = useState(initialSelections.ottName);
  const [months, setMonths] = useState(6);
  const [termSpeedName, setTermSpeedName] = useState(initialSelections.speedName);
  const [termOfferId, setTermOfferId] = useState(1);
  const [welcomePlanId, setWelcomePlanId] = useState(1);
  const [budget, setBudget] = useState(10000);
  const [busy, setBusy] = useState(false);
  const bookingFormRef = useRef(null);
  const selectionRef = useRef({ speedName, iptvName, ottName });

  selectionRef.current = { speedName, iptvName, ottName };

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    locality: "",
    notes: "",
  });

  const quote = useMemo(
    () => computePlanQuote({ speedName, iptvName, ottName, months }),
    [speedName, iptvName, ottName, months, catalogSource]
  );

  const catalog = getPlanCatalog();
  const resolvedTermOffers = useMemo(
    () => (termOffers.length ? termOffers : getTermOffers(website)),
    [termOffers, website, catalogSource]
  );
  const termSpeeds = useMemo(
    () => getTermPlanSpeeds(website),
    [website, catalogSource]
  );
  const selectedTermOffer = useMemo(
    () =>
      resolvedTermOffers.find((offer) => offer.id === Number(termOfferId)) ||
      resolvedTermOffers[0],
    [resolvedTermOffers, termOfferId]
  );
  const termQuote = useMemo(() => {
    if (!selectedTermOffer || !termSpeedName) return null;
    return computeTermPlanQuote({ speedName: termSpeedName, offer: selectedTermOffer });
  }, [termSpeedName, selectedTermOffer, catalogSource]);
  const selectedWelcomePlan = useMemo(
    () =>
      welcomePlans.find((plan) => plan.id === Number(welcomePlanId)) || welcomePlans[0],
    [welcomePlans, welcomePlanId]
  );
  const welcomeQuote = useMemo(() => {
    if (!selectedWelcomePlan) return null;
    return computeWelcomePlanQuote(selectedWelcomePlan);
  }, [selectedWelcomePlan, catalogSource]);
  const activeQuote = useMemo(() => {
    if (tab === "term" && termQuote) return termQuote;
    if (tab === "welcome" && welcomeQuote) return welcomeQuote;
    return quote;
  }, [tab, termQuote, welcomeQuote, quote]);
  const budgetResults = useMemo(() => searchPlansByBudget(budget, 20), [budget, catalogSource]);
  const ottApps = useMemo(() => getOttAppsForPlan(ottName), [ottName, catalogSource]);

  React.useEffect(() => {
    if (!welcomePlansEnabled && tab === "welcome") setTab("build");
  }, [welcomePlansEnabled, tab]);

  React.useEffect(() => {
    if (termSpeeds.length && !termSpeeds.some((s) => s.name === termSpeedName)) {
      setTermSpeedName(termSpeeds[0].name);
    }
  }, [termSpeeds, termSpeedName]);

  React.useEffect(() => {
    if (resolvedTermOffers.length && !resolvedTermOffers.some((o) => o.id === Number(termOfferId))) {
      setTermOfferId(resolvedTermOffers[0].id);
    }
  }, [resolvedTermOffers, termOfferId]);

  React.useEffect(() => {
    if (welcomePlans.length && !welcomePlans.some((p) => p.id === Number(welcomePlanId))) {
      setWelcomePlanId(welcomePlans[0].id);
    }
  }, [welcomePlans, welcomePlanId]);

  React.useEffect(() => {
    const synced = syncPlanSelections(selectionRef.current);
    setSpeedName(synced.speedName);
    setIptvName(synced.iptvName);
    setOttName(synced.ottName);
  }, [catalogSource]);

  const onContactChange = (e) =>
    setContact((c) => ({ ...c, [e.target.name]: e.target.value }));

  const scrollToBookingForm = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      document.getElementById("pb-name")?.focus({ preventScroll: true });
    }, 400);
  };

  const applyBudgetPlan = (plan) => {
    setSpeedName(plan.internet);
    setIptvName(plan.cable);
    setOttName(plan.ott);
    setMonths(plan.months);
    setTab("build");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      planType: activeQuote.planType || "custom",
      speed: activeQuote.speed,
      iptv: activeQuote.iptv,
      ott: activeQuote.ott,
      months: activeQuote.months,
      baseMonthly: activeQuote.baseMonthly,
      baseTotal: activeQuote.baseTotal,
      monthlyInclGst: activeQuote.monthlyInclGst,
      installation: activeQuote.installation,
      totalPayable: activeQuote.totalPayable,
      description: activeQuote.description,
      breakdown: activeQuote.breakdown,
      offerLabel: activeQuote.offerLabel,
      welcomePlanId: activeQuote.welcomePlanId,
      contact: { ...contact },
    };
    try {
      const prev = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      prev.push(request);
      localStorage.setItem(LS_KEY, JSON.stringify(prev));

      let emailSent = false;
      let apiReachable = false;
      try {
        const res = await postPlanLead(request);
        apiReachable = true;
        emailSent = Boolean(res?.email_sent);
      } catch (apiErr) {
        console.error(apiErr);
      }

      const hasApi = Boolean(getApiBase());
      if (!hasApi) {
        toast({
          title: "Request saved",
          description:
            "To email VK Digital automatically, set REACT_APP_API_URL in frontend/.env and run the backend with SMTP configured.",
        });
      } else if (!apiReachable) {
        toast({
          title: "Could not reach server",
          description:
            "Start the backend: cd backend && python -m uvicorn server:app --port 8002 (must match REACT_APP_API_URL in frontend/.env).",
          variant: "destructive",
        });
      } else if (emailSent) {
        toast({
          title: "Plan request sent!",
          description: "Thanks! Your plan request has been emailed to VK Digital. We will contact you soon.",
        });
      } else {
        toast({
          title: "Request saved (email not sent)",
          description:
            "Server responded but email failed. Check SMTP settings in backend/.env and restart the backend.",
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
              <SlidersHorizontal size={16} /> Smart plan selector
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              Build your plan or find the best fit for your budget
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-600" lang="kn">
              ನಿಮ್ಮ ಪ್ಲಾನ್ ರಚಿಸಿ ಅಥವಾ ಬಜೆಟ್‌ಗೆ ಸರಿಹೊಂದುವ ಪ್ಲಾನ್ ಹುಡುಕಿ
            </p>
            <p className="mt-3 text-sm text-slate-500">{planBuilderConfig.disclaimerEn}</p>
            {catalogLoading ? (
              <p className="mt-2 text-xs font-medium text-slate-500">Loading latest prices…</p>
            ) : catalogSource === "google_sheets" || catalogSource === "api" ? (
              <p className="mt-2 text-xs font-medium text-green-700">
                Live prices loaded from Google Sheet
              </p>
            ) : (
              <p className="mt-2 text-xs font-medium text-amber-700">
                Showing saved prices — click Refresh prices if sheet was updated
              </p>
            )}
            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={catalogLoading}
                onClick={async () => {
                  await refreshCatalog();
                  const synced = syncPlanSelections(selectionRef.current);
                  setSpeedName(synced.speedName);
                  setIptvName(synced.iptvName);
                  setOttName(synced.ottName);
                }}
                className="rounded-full"
              >
                {catalogLoading ? "Refreshing…" : "Refresh prices"}
              </Button>
            </div>
            <p className="mt-1 text-sm text-slate-500" lang="kn">
              {planBuilderConfig.disclaimerKn}
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="space-y-8">
            <TabsList
              className={`grid w-full max-w-3xl mx-auto h-auto md:h-12 bg-white border border-slate-200 p-1 gap-1 ${
                welcomePlansEnabled ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              <TabsTrigger value="build" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900 text-xs sm:text-sm">
                Custom Builder
              </TabsTrigger>
              <TabsTrigger value="term" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900 text-xs sm:text-sm">
                Term Plans
              </TabsTrigger>
              {welcomePlansEnabled ? (
                <TabsTrigger value="welcome" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900 text-xs sm:text-sm">
                  Welcome Plans
                </TabsTrigger>
              ) : null}
              <TabsTrigger value="budget" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900 text-xs sm:text-sm">
                Budget Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="build">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="text-yellow-600" size={22} />
                        Build your own plan
                      </CardTitle>
                      <CardDescription>
                        Select speed, IPTV and OTT — prices include 18% GST in the total breakdown
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Label>Internet speed</Label>
                        <Select value={speedName} onValueChange={setSpeedName}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select speed" />
                          </SelectTrigger>
                          <SelectContent>
                            {catalog.speeds.map((s) => (
                              <SelectItem key={s.name} value={s.name}>
                                {s.name} — ₹{formatInr(s.price)}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>IPTV / Cable TV package</Label>
                        <Select value={iptvName} onValueChange={setIptvName}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select IPTV" />
                          </SelectTrigger>
                          <SelectContent>
                            {catalog.iptvPlans.map((p) => (
                              <SelectItem key={p.name} value={p.name}>
                                {p.name} — ₹{formatInr(p.price)}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>OTT package</Label>
                        <Select value={ottName} onValueChange={setOttName}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select OTT" />
                          </SelectTrigger>
                          <SelectContent>
                            {catalog.ottPlans.map((p) => (
                              <SelectItem key={p.name} value={p.name}>
                                {p.name} — ₹{formatInr(p.price)}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="pb-months">Duration (months)</Label>
                        <Input
                          id="pb-months"
                          type="number"
                          min={1}
                          max={24}
                          className="mt-1.5 h-11"
                          value={months}
                          onChange={(e) => setMonths(e.target.value)}
                        />
                      </div>

                      {ottApps.length > 0 && (
                        <div className="md:col-span-2 rounded-xl border border-slate-100 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-900 mb-2">Included OTT apps</p>
                          <div className="flex flex-wrap gap-2">
                            {ottApps.map((app) => (
                              <span
                                key={app}
                                className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="lg:hidden">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>

                  <Card ref={bookingFormRef} id="plan-booking-form" className="border-slate-200 shadow-sm scroll-mt-28">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Send size={20} className="text-yellow-600" />
                        Your details &amp; request
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
                            placeholder="e.g. Need connection by next week"
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

                <div className="hidden lg:block lg:col-span-1">
                  <div className="lg:sticky lg:top-28">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="term">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Timer className="text-yellow-600" size={22} />
                        Internet-only term plans
                      </CardTitle>
                      <CardDescription>
                        Choose speed and term offer — pay for fewer months, get extra months free
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label>Internet speed</Label>
                        <Select value={termSpeedName} onValueChange={setTermSpeedName}>
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select speed" />
                          </SelectTrigger>
                          <SelectContent>
                            {termSpeeds.map((s) => (
                              <SelectItem key={s.name} value={s.name}>
                                {s.name} — ₹{formatInr(s.price)}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Term offer</Label>
                        <Select
                          value={String(termOfferId)}
                          onValueChange={(value) => setTermOfferId(Number(value))}
                        >
                          <SelectTrigger className="mt-1.5 h-11">
                            <SelectValue placeholder="Select offer" />
                          </SelectTrigger>
                          <SelectContent>
                            {resolvedTermOffers.map((offer) => (
                              <SelectItem key={offer.id} value={String(offer.id)}>
                                {formatTermOfferDisplay(offer)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="lg:hidden">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>

                  <Card ref={bookingFormRef} id="plan-booking-form" className="border-slate-200 shadow-sm scroll-mt-28">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Send size={20} className="text-yellow-600" />
                        Your details &amp; request
                      </CardTitle>
                      <CardDescription>
                        We will contact you to confirm feasibility and final pricing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pb-name-term">Full name *</Label>
                            <Input
                              id="pb-name-term"
                              name="name"
                              className="mt-1.5 h-11"
                              placeholder="Name / ಹೆಸರು"
                              value={contact.name}
                              onChange={onContactChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="pb-phone-term">Phone *</Label>
                            <Input
                              id="pb-phone-term"
                              name="phone"
                              className="mt-1.5 h-11"
                              placeholder="Mobile number"
                              value={contact.phone}
                              onChange={onContactChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="pb-email-term">Email (optional)</Label>
                          <Input
                            id="pb-email-term"
                            name="email"
                            type="email"
                            className="mt-1.5 h-11"
                            placeholder="you@example.com"
                            value={contact.email}
                            onChange={onContactChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pb-locality-term">Area / locality</Label>
                          <Input
                            id="pb-locality-term"
                            name="locality"
                            className="mt-1.5 h-11"
                            placeholder="e.g. Ward, village near Tiptur"
                            value={contact.locality}
                            onChange={onContactChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pb-notes-term">Notes (optional)</Label>
                          <Textarea
                            id="pb-notes-term"
                            name="notes"
                            className="mt-1.5 min-h-[100px]"
                            placeholder="e.g. Need connection by next week"
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

                <div className="hidden lg:block lg:col-span-1">
                  <div className="lg:sticky lg:top-28">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {welcomePlansEnabled ? (
            <TabsContent value="welcome">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Gift className="text-yellow-600" size={22} />
                        Special welcome plans
                      </CardTitle>
                      <CardDescription>
                        Fixed bundle pricing — internet + OTT apps. Offer prices are ex GST; GST is added in the bill breakdown.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {welcomePlans.map((plan) => {
                          const selected = Number(welcomePlanId) === plan.id;
                          return (
                            <button
                              key={plan.id}
                              type="button"
                              onClick={() => setWelcomePlanId(plan.id)}
                              className={`text-left rounded-xl border p-4 transition ${
                                selected
                                  ? "border-yellow-400 bg-yellow-50 shadow-sm"
                                  : "border-slate-200 bg-white hover:border-yellow-200"
                              }`}
                            >
                              <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
                                Welcome Offer
                              </p>
                              <p className="mt-1 font-extrabold text-slate-900">{plan.name}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {plan.speed} · {plan.months} mo · {plan.ottCount} OTTs
                              </p>
                              <p className="mt-3 text-lg font-extrabold text-slate-900">
                                ₹{formatInr(plan.price)}
                              </p>
                              <p className="text-xs text-slate-500">+ GST</p>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="lg:hidden">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>

                  <Card className="border-slate-200 shadow-sm scroll-mt-28">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Send size={20} className="text-yellow-600" />
                        Your details &amp; request
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pb-name-welcome">Full name *</Label>
                            <Input
                              id="pb-name-welcome"
                              name="name"
                              className="mt-1.5 h-11"
                              value={contact.name}
                              onChange={onContactChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="pb-phone-welcome">Phone *</Label>
                            <Input
                              id="pb-phone-welcome"
                              name="phone"
                              className="mt-1.5 h-11"
                              value={contact.phone}
                              onChange={onContactChange}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="pb-email-welcome">Email (optional)</Label>
                          <Input
                            id="pb-email-welcome"
                            name="email"
                            type="email"
                            className="mt-1.5 h-11"
                            value={contact.email}
                            onChange={onContactChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pb-locality-welcome">Area / locality</Label>
                          <Input
                            id="pb-locality-welcome"
                            name="locality"
                            className="mt-1.5 h-11"
                            value={contact.locality}
                            onChange={onContactChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pb-notes-welcome">Notes (optional)</Label>
                          <Textarea
                            id="pb-notes-welcome"
                            name="notes"
                            className="mt-1.5 min-h-[100px]"
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

                <div className="hidden lg:block lg:col-span-1">
                  <div className="lg:sticky lg:top-28">
                    <BillBreakdownCard
                      quote={activeQuote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            ) : null}

            <TabsContent value="budget">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Search className="text-yellow-600" size={22} />
                    Find plans within your budget
                  </CardTitle>
                  <CardDescription>
                    Enter your total budget — we show the best matching combinations (up to 20)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end max-w-md">
                    <div className="flex-1 w-full">
                      <Label htmlFor="budget-input">Enter your budget (₹)</Label>
                      <div className="relative mt-1.5">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                          id="budget-input"
                          type="number"
                          min={500}
                          className="h-11 pl-9"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 pb-1">
                      {budgetResults.length} plan{budgetResults.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  {budgetResults.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
                      No plans found within ₹{formatInr(budget)}. Try a higher budget.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Total</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead className="hidden md:table-cell">Internet</TableHead>
                            <TableHead className="hidden lg:table-cell">IPTV</TableHead>
                            <TableHead className="hidden lg:table-cell">OTT</TableHead>
                            <TableHead>Months</TableHead>
                            <TableHead className="hidden sm:table-cell">Note</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetResults.map((plan) => (
                            <TableRow key={`${plan.description}-${plan.months}-${plan.totalPrice}`}>
                              <TableCell className="font-semibold whitespace-nowrap">
                                ₹{formatInr(plan.totalPrice)}
                              </TableCell>
                              <TableCell className="max-w-[220px]">{plan.description}</TableCell>
                              <TableCell className="hidden md:table-cell">{plan.internet}</TableCell>
                              <TableCell className="hidden lg:table-cell max-w-[160px]">{plan.cable}</TableCell>
                              <TableCell className="hidden lg:table-cell">{plan.ott}</TableCell>
                              <TableCell>{plan.months}</TableCell>
                              <TableCell className="hidden sm:table-cell text-xs text-slate-500 max-w-[140px]">
                                {plan.note}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="whitespace-nowrap"
                                  onClick={() => applyBudgetPlan(plan)}
                                >
                                  Use plan
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default PlanBuilder;
