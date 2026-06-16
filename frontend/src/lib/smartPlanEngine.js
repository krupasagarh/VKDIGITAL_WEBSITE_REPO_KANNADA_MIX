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
