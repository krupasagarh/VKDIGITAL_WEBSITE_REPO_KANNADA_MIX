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
  formatInr,
  getOttAppsForPlan,
  searchPlansByBudget,
} from "../lib/smartPlanEngine";
import { ArrowDown, IndianRupee, Search, Send, SlidersHorizontal, Sparkles } from "lucide-react";

function BillBreakdownCard({ quote, onBookPlan, showBookButton = false }) {
  return (
    <Card className="border-yellow-200 bg-gradient-to-b from-white to-yellow-50/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Bill breakdown</CardTitle>
        <CardDescription>{quote.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-slate-900 text-white p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-white/70">Total payable</p>
          <p className="text-4xl font-extrabold text-yellow-300 mt-1">
            ₹{formatInr(quote.totalPayable)}
          </p>
          <p className="text-sm text-white/80 mt-1">
            for {quote.months} month{quote.months > 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-700">
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
          <div className="flex justify-between">
            <span>One-time installation</span>
            <span className="font-semibold">
              {quote.installation === 0 ? "Free" : `₹${formatInr(quote.installation)}`}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500">{quote.installNote}</p>

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
  const { catalogSource, catalogLoading, refreshCatalog } = usePlanCatalog();
  const [tab, setTab] = useState("build");
  const [speedName, setSpeedName] = useState(initialSelections.speedName);
  const [iptvName, setIptvName] = useState(initialSelections.iptvName);
  const [ottName, setOttName] = useState(initialSelections.ottName);
  const [months, setMonths] = useState(6);
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

  const budgetResults = useMemo(() => searchPlansByBudget(budget, 20), [budget, catalogSource]);
  const ottApps = useMemo(() => getOttAppsForPlan(ottName), [ottName, catalogSource]);
  const catalog = getPlanCatalog();

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
      speed: quote.speed,
      iptv: quote.iptv,
      ott: quote.ott,
      months: quote.months,
      baseMonthly: quote.baseMonthly,
      monthlyInclGst: quote.monthlyInclGst,
      installation: quote.installation,
      totalPayable: quote.totalPayable,
      description: quote.description,
      breakdown: quote.breakdown,
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12 bg-white border border-slate-200 p-1">
              <TabsTrigger value="build" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900">
                Custom Builder
              </TabsTrigger>
              <TabsTrigger value="budget" className="rounded-lg data-[state=active]:bg-yellow-400 data-[state=active]:text-slate-900">
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
                      quote={quote}
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
                      quote={quote}
                      onBookPlan={scrollToBookingForm}
                      showBookButton
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

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
