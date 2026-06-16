import fallbackCatalog from "../data/smartPlanCatalog.json";

let activeCatalog = fallbackCatalog;
let cachedCombos = null;

export function getPlanCatalog() {
  return activeCatalog;
}

export function setPlanCatalog(catalog) {
  activeCatalog = catalog;
  cachedCombos = null;
}

export function formatInr(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function findByName(list, name) {
  return list.find((item) => item.name === name) || list[0];
}

function normalizeSpeedName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function findSpeedByName(name) {
  const target = normalizeSpeedName(name);
  return activeCatalog.speeds.find((item) => normalizeSpeedName(item.name) === target);
}

export function getTermOffers(websiteContent) {
  if (websiteContent?.termOffers?.length) return websiteContent.termOffers;
  return activeCatalog.termOffers || [];
}

export function getTermPlanSpeeds(websiteContent) {
  const listed = websiteContent?.termPlanSpeeds || [];
  if (listed.length) {
    return listed.map((name) => findSpeedByName(name)).filter(Boolean);
  }
  return activeCatalog.speeds || [];
}

export function formatTermOfferDisplay(offer) {
  const totalMonths = Number(offer?.totalMonths) || 0;
  const freeMonths = Number(offer?.freeMonths) || 0;
  if (freeMonths > 0) {
    return `Pay For ${totalMonths}M, get ${freeMonths}M Free`;
  }
  return `Pay For ${totalMonths}M`;
}

export function computeTermPlanQuote({ speedName, offer }) {
  const { gstRate, installFee, freeInstallThreshold } = activeCatalog;
  const speed = findSpeedByName(speedName) || findByName(activeCatalog.speeds, speedName);
  const paidMonths = Math.max(1, Number(offer?.totalMonths) || 1);
  const freeMonths = Math.max(0, Number(offer?.freeMonths) || 0);
  const serviceMonths = paidMonths + freeMonths;
  const offerLabel = offer?.label || formatTermOfferDisplay(offer);

  const baseTotal = Math.round(speed.price * paidMonths * 100) / 100;
  const gst = Math.round(baseTotal * gstRate * 100) / 100;
  const planTotal = Math.round((baseTotal + gst) * 100) / 100;
  const installation = planTotal > freeInstallThreshold ? 0 : installFee;
  const totalPayable = Math.round((planTotal + installation) * 100) / 100;

  return {
    planType: "term",
    speed: speed.name,
    iptv: "None",
    ott: "None",
    offerLabel,
    paidMonths,
    totalMonths: paidMonths,
    freeMonths,
    serviceMonths,
    billedMonths: paidMonths,
    months: serviceMonths,
    baseMonthly: speed.price,
    baseTotal,
    gst,
    monthlyInclGst: Math.round((speed.price + speed.price * gstRate) * 100) / 100,
    installation,
    totalPayable,
    description: `${speed.name} — Internet Only — ${formatTermOfferDisplay(offer)}`,
    installNote:
      installation === 0
        ? "Free Installation (Plan > ₹2,500)"
        : "Incl. ₹1,000 Install",
    breakdown: [
      {
        key: "internet",
        label: `${speed.name} × ${paidMonths} mo @ ₹${formatInr(speed.price)}/mo`,
        amount: baseTotal,
      },
    ],
  };
}

export function computeWelcomePlanQuote(plan) {
  const { gstRate, installFee, freeInstallThreshold } = activeCatalog;
  const baseTotal = Math.round(Number(plan.price) * 100) / 100;
  const gst = Math.round(baseTotal * gstRate * 100) / 100;
  const planTotal = Math.round((baseTotal + gst) * 100) / 100;
  const installation = planTotal > freeInstallThreshold ? 0 : installFee;
  const totalPayable = Math.round((planTotal + installation) * 100) / 100;
  const ottApps = plan.ottApps || [];

  return {
    planType: "welcome",
    welcomePlanId: plan.id,
    name: plan.name,
    speed: plan.speed,
    iptv: "None",
    ott: `${plan.ottCount || ottApps.length} OTT Apps`,
    months: plan.months,
    baseMonthly: null,
    baseTotal,
    gst,
    planTotalInclGst: planTotal,
    monthlyInclGst: null,
    installation,
    totalPayable,
    ottApps,
    description: `${plan.name} — ${plan.speed} + ${plan.ottCount || ottApps.length} OTTs — ${plan.months} Months`,
    installNote:
      installation === 0
        ? "Free Installation (Plan > ₹2,500)"
        : "Incl. ₹1,000 Install",
    breakdown: [
      {
        key: "welcome",
        label: plan.name,
        amount: baseTotal,
      },
    ],
  };
}

export function buildTermPlanMatrix(websiteContent) {
  const speeds = getTermPlanSpeeds(websiteContent);
  const offers = getTermOffers(websiteContent);
  return speeds.flatMap((speed) =>
    offers.map((offer) => ({
      speed: speed.name,
      offer,
      quote: computeTermPlanQuote({ speedName: speed.name, offer }),
    }))
  );
}

export function buildPlanDescription(speed, iptv, ott) {
  return `${speed} + ${iptv} + ${ott}`;
}

export function computePlanQuote({ speedName, iptvName, ottName, months }) {
  const { speeds, iptvPlans, ottPlans, gstRate, installFee, freeInstallThreshold } =
    activeCatalog;

  const speed = findByName(speeds, speedName);
  const iptv = findByName(iptvPlans, iptvName);
  const ott = findByName(ottPlans, ottName);
  const monthCount = Math.max(1, Math.min(24, Number(months) || 1));

  const baseMonthly = speed.price + iptv.price + ott.price;
  const gst = Math.round(baseMonthly * gstRate * 100) / 100;
  const monthlyInclGst = Math.round((baseMonthly + gst) * 100) / 100;
  const planTotal = Math.round(monthlyInclGst * monthCount * 100) / 100;
  const installation = planTotal > freeInstallThreshold ? 0 : installFee;
  const totalPayable = Math.round((planTotal + installation) * 100) / 100;

  return {
    speed: speed.name,
    iptv: iptv.name,
    ott: ott.name,
    planType: "custom",
    months: monthCount,
    baseMonthly,
    gst,
    monthlyInclGst,
    installation,
    totalPayable,
    description: buildPlanDescription(speed.name, iptv.name, ott.name),
    installNote:
      installation === 0
        ? "Free Installation (Plan > ₹2,500)"
        : "Incl. ₹1,000 Install",
    breakdown: [
      { key: "speed", label: speed.name, amount: speed.price },
      { key: "iptv", label: iptv.name, amount: iptv.price },
      { key: "ott", label: ott.name, amount: ott.price },
    ],
  };
}

export function getAllPlanCombos() {
  if (cachedCombos) return cachedCombos;

  const { speeds, iptvPlans, ottPlans } = activeCatalog;
  const combos = [];

  for (const speed of speeds) {
    for (const iptv of iptvPlans) {
      for (const ott of ottPlans) {
        for (let months = 1; months <= 12; months += 1) {
          const quote = computePlanQuote({
            speedName: speed.name,
            iptvName: iptv.name,
            ottName: ott.name,
            months,
          });
          combos.push({
            totalPrice: quote.totalPayable,
            description: quote.description,
            internet: quote.speed,
            cable: quote.iptv,
            ott: quote.ott,
            months: quote.months,
            note: quote.installNote,
            monthlyInclGst: quote.monthlyInclGst,
          });
        }
      }
    }
  }

  combos.sort((a, b) => a.totalPrice - b.totalPrice);
  cachedCombos = combos;
  return combos;
}

export function searchPlansByBudget(budget, limit = 20) {
  const amount = Number(budget);
  if (!Number.isFinite(amount) || amount <= 0) return [];

  return getAllPlanCombos()
    .filter((plan) => plan.totalPrice <= amount)
    .sort((a, b) => b.totalPrice - a.totalPrice)
    .slice(0, limit);
}

export function getOttAppsForPlan(ottName) {
  const ottApps = activeCatalog.ottApps || {};
  if (ottName === "10 OTT Apps") return ottApps["10"] || [];
  if (ottName === "26 OTT Apps") return ottApps["26"] || [];
  if (ottName === "SmartPlay TV (Live TV + 16 OTTs)") return ottApps["16"] || [];
  return [];
}

export function getDefaultPlanSelections() {
  const catalog = activeCatalog;
  return {
    speedName:
      catalog.speeds.find((s) => s.name === "100 MBPS")?.name || catalog.speeds[0]?.name || "",
    iptvName:
      catalog.iptvPlans.find((p) => p.name === "Cable Kan,Telugu,Tamil, Hindi HD")?.name ||
      catalog.iptvPlans[0]?.name ||
      "",
    ottName:
      catalog.ottPlans.find((p) => p.name === "26 OTT Apps")?.name ||
      catalog.ottPlans[0]?.name ||
      "",
  };
}

export function syncPlanSelections(selections) {
  const catalog = activeCatalog;
  return {
    speedName: catalog.speeds.some((s) => s.name === selections.speedName)
      ? selections.speedName
      : catalog.speeds[0]?.name || "",
    iptvName: catalog.iptvPlans.some((p) => p.name === selections.iptvName)
      ? selections.iptvName
      : catalog.iptvPlans[0]?.name || "",
    ottName: catalog.ottPlans.some((p) => p.name === selections.ottName)
      ? selections.ottName
      : catalog.ottPlans[0]?.name || "",
  };
}
