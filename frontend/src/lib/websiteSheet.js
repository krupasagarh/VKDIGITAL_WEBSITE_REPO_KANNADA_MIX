import fallbackWebsite from "../data/websiteContentFallback.json";

export function parseBool(raw) {
  const v = String(raw || "")
    .trim()
    .toLowerCase();
  return v === "yes" || v === "true" || v === "1" || v === "y";
}

/** Welcome plan rows stay loaded; this controls whether they appear on the site. */
export function isWelcomePlansEnabled(settings) {
  return parseBool(settings?.welcome_plans_enabled);
}

export function parsePrice(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/₹/g, "")
    .replace(/,/g, "");
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function splitFeatures(raw) {
  return String(raw || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasKannadaScript(text) {
  return /[\u0C80-\u0CFF]/.test(String(text || ""));
}

function mergeKnText(sheetValue, fallbackValue) {
  const sheet = String(sheetValue || "").trim();
  if (sheet) return sheet;
  return String(fallbackValue || "").trim();
}

function extractRupeeAmount(text) {
  const match = String(text || "").match(/₹\s*(\d+)/);
  return match ? match[1] : null;
}

/** When Kannada is taken from fallback, keep ₹ price in sync with the English sheet cell. */
function syncKnPriceFromEnglish(knText, englishText) {
  const kn = String(knText || "").trim();
  if (!kn) return kn;
  const amount = extractRupeeAmount(englishText);
  if (!amount) return kn;
  return kn.replace(/₹\s*\d+/, `₹${amount}`);
}

function mergeHeroKnText(sheetValue, fallbackValue, englishReference) {
  const sheet = String(sheetValue || "").trim();
  if (sheet) return sheet;
  const fallback = String(fallbackValue || "").trim();
  if (!fallback) return "";
  return syncKnPriceFromEnglish(fallback, englishReference);
}

function swapBilingualPair(primary, secondary) {
  const a = String(primary || "").trim();
  const b = String(secondary || "").trim();
  if (!hasKannadaScript(b) && hasKannadaScript(a)) {
    return { primary: b, secondary: a };
  }
  return { primary: a, secondary: b };
}

export function normalizeHeroSlide(slide) {
  if (!slide) return slide;
  const title = swapBilingualPair(slide.title, slide.titleKn);
  const subtitle = swapBilingualPair(slide.subtitle, slide.subtitleKn);
  const highlight = swapBilingualPair(slide.highlight, slide.highlightKn);
  const extra = swapBilingualPair(slide.extra, slide.extraKn);
  return {
    ...slide,
    title: title.primary,
    titleKn: title.secondary,
    subtitle: subtitle.primary,
    subtitleKn: subtitle.secondary,
    highlight: highlight.primary,
    highlightKn: highlight.secondary,
    extra: extra.primary,
    extraKn: extra.secondary,
  };
}

function mergeHeroSlides(sheetSlides, fallbackSlides) {
  if (!sheetSlides?.length) return fallbackSlides || [];
  const fallbackById = new Map((fallbackSlides || []).map((slide) => [slide.id, slide]));
  return sheetSlides.map((slide) => {
    const normalized = normalizeHeroSlide(slide);
    const fallback = fallbackById.get(normalized.id);
    if (!fallback) return normalized;
    return normalizeHeroSlide({
      ...fallback,
      ...normalized,
      titleKn: mergeHeroKnText(normalized.titleKn, fallback.titleKn, normalized.title),
      subtitleKn: mergeKnText(normalized.subtitleKn, fallback.subtitleKn),
      highlightKn: mergeKnText(normalized.highlightKn, fallback.highlightKn),
      extraKn: mergeKnText(normalized.extraKn, fallback.extraKn),
    });
  });
}

function slugifyId(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferSettingKey(key, value) {
  key = String(key || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (key) return key;
  if (!value) return "";
  if (/^(yes|no|true|false|y|n)$/i.test(String(value).trim())) {
    return "welcome_plans_enabled";
  }
  const digitsOnly = value.replace(/\D/g, "");
  if (/^\d+(\.\d+)?$/.test(value)) {
    if (digitsOnly.length >= 10) return "";
    return "subscribe_start_price";
  }
  if (/mbps/i.test(value)) return "feature_top_speed";
  if (/ott/i.test(value)) return "ott_display_label";
  if (/live|channel|iptv/i.test(value)) return "iptv_display_label";
  return "";
}

const KNOWN_SETTING_KEYS = new Set([
  "welcome_plans_enabled",
  "subscribe_start_price",
  "feature_top_speed",
  "ott_display_label",
  "iptv_display_label",
]);

function parseSettingRow(row) {
  let key = String(row[1] || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  let value = String(row[2] || "").trim();
  if (!key && !value && row[3]) {
    value = String(row[3] || "").trim();
  }
  const columnCKey = String(row[2] || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (!key && KNOWN_SETTING_KEYS.has(columnCKey)) {
    key = columnCKey;
    value = String(row[3] || "").trim();
  }
  key = inferSettingKey(key, value);
  if (!key) return null;
  return { key, value };
}

const PHONE_ROLE_ORDER = ["main", "helpdesk", "owner", "whatsapp"];
const TECHNICIAN_NAME_FALLBACKS = ["Dilip", "Shivu"];

function isPhoneNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits.length >= 10;
}

function parsePhoneRow(row, phones) {
  let role = String(row[1] || "")
    .trim()
    .toLowerCase();
  let number = String(row[2] || "").trim();
  let display = String(row[3] || "").trim();

  if (!number && isPhoneNumber(role)) {
    number = role;
    role = "";
    display = String(row[2] || "").trim();
  }

  if (!number || !isPhoneNumber(number)) return;

  if (!role) {
    role = PHONE_ROLE_ORDER[Object.keys(phones).filter((k) => k !== "all").length] || "all";
  }

  const entry = { number, display: display || number };

  if (role === "all") {
    for (const r of PHONE_ROLE_ORDER) {
      phones[r] = { ...entry };
    }
    return;
  }

  phones[role] = entry;
}

function parseHomepageCardRow(row, index) {
  let id = String(row[1] || "").trim();
  const title = String(row[2] || "").trim();
  if (!title) return null;

  if (!id) {
    const speedMatch = String(row[4] || "").match(/(\d+)\s*Mbps/i);
    const suffix = speedMatch ? `-${speedMatch[1]}` : `-${index + 1}`;
    id = `${slugifyId(title)}${suffix}`;
  }

  return {
    id,
    title,
    icon: String(row[3] || "Wifi").trim(),
    features: splitFeatures(row[4]),
    price: String(row[5] || "").trim(),
    note: String(row[6] || "Starts From").trim(),
    popular: parseBool(row[7]),
    link: String(row[8] || "/home-plans").trim(),
    cta: String(row[9] || "View Plans").trim(),
    cycle: String(row[10] || "/ Month").trim(),
    titleKn: String(row[11] || "").trim(),
  };
}

export function parseWebsiteSheetMatrix(matrix) {
  const result = {
    homePlans: [],
    businessPlans: [],
    homepageCards: [],
    heroSlides: [],
    phones: {},
    technicians: [],
    settings: {},
    termOffers: [],
    termPlanSpeeds: [],
    welcomePlans: [],
  };

  if (!matrix?.length) return result;

  const rows =
    String(matrix[0]?.[0] || "")
      .trim()
      .toLowerCase() === "section"
      ? matrix.slice(1)
      : matrix;

  for (const row of rows) {
    const section = String(row[0] || "")
      .trim()
      .toLowerCase();
    if (!section) continue;

    switch (section) {
      case "home_plan": {
        const price = parsePrice(row[3]);
        const speed = String(row[2] || "").trim();
        if (!speed || price === null) break;
        result.homePlans.push({
          id: Number(row[1]) || result.homePlans.length + 1,
          speed,
          price,
          validity: String(row[4] || "1 Month").trim(),
          data: String(row[5] || "Unlimited").trim(),
          ott: parseBool(row[6]),
          iptv: parseBool(row[7]),
        });
        break;
      }
      case "business_plan": {
        const price = parsePrice(row[3]);
        const speed = String(row[2] || "").trim();
        if (!speed || price === null) break;
        result.businessPlans.push({
          id: Number(row[1]) || result.businessPlans.length + 1,
          speed,
          price,
          validity: String(row[4] || "1 Month").trim(),
          data: String(row[5] || "Unlimited").trim(),
          staticIp: parseBool(row[6] ?? "yes"),
          gst: parseBool(row[7] ?? "yes"),
        });
        break;
      }
      case "homepage_card": {
        const card = parseHomepageCardRow(row, result.homepageCards.length);
        if (card) result.homepageCards.push(card);
        break;
      }
      case "hero_slide": {
        const id = Number(row[1]) || result.heroSlides.length + 1;
        const title = String(row[2] || "").trim();
        if (!title) break;
        result.heroSlides.push(
          normalizeHeroSlide({
            id,
            title,
            titleKn: String(row[3] || "").trim(),
            subtitle: String(row[4] || "").trim(),
            subtitleKn: String(row[5] || "").trim(),
            highlight: String(row[6] || "").trim(),
            highlightKn: String(row[7] || "").trim(),
            price: String(row[8] || "").trim(),
            extra: String(row[9] || "").trim(),
            extraKn: String(row[10] || "").trim(),
            image: String(row[11] || "").trim(),
          })
        );
        break;
      }
      case "phone":
        parsePhoneRow(row, result.phones);
        break;
      case "technician": {
        let name = String(row[1] || "").trim();
        let phone = String(row[2] || "").trim();
        let phoneDisplay = String(row[3] || "").trim();

        if (!phone && isPhoneNumber(name)) {
          phone = name;
          name = "";
          phoneDisplay = String(row[2] || "").trim();
        }

        if (!phone || !isPhoneNumber(phone)) break;

        if (!name) {
          name =
            TECHNICIAN_NAME_FALLBACKS[result.technicians.length] ||
            `Technician ${result.technicians.length + 1}`;
        }

        result.technicians.push({
          name,
          phone,
          phoneDisplay: phoneDisplay || phone,
        });
        break;
      }
      case "setting": {
        const parsed = parseSettingRow(row);
        if (parsed) result.settings[parsed.key] = parsed.value;
        break;
      }
      case "term_offer": {
        const totalMonths = Number(row[2]);
        const freeMonths = Number(row[3]);
        const label = String(row[4] || "").trim();
        if (!Number.isFinite(totalMonths) || !Number.isFinite(freeMonths) || !label) break;
        result.termOffers.push({
          id: Number(row[1]) || result.termOffers.length + 1,
          totalMonths,
          freeMonths,
          label,
        });
        break;
      }
      case "term_plan": {
        const speed = String(row[2] || "").trim();
        if (!speed) break;
        result.termPlanSpeeds.push(speed);
        break;
      }
      case "welcome_plan": {
        const name = String(row[2] || "").trim();
        const speed = String(row[3] || "").trim();
        const months = Number(row[4]);
        const price = parsePrice(row[5]);
        if (!name || !speed || !Number.isFinite(months) || price === null) break;
        const ottApps = splitFeatures(row[7]);
        result.welcomePlans.push({
          id: Number(row[1]) || result.welcomePlans.length + 1,
          name,
          speed,
          months,
          price,
          ottCount: Number(row[6]) || ottApps.length,
          ottApps,
        });
        break;
      }
      default:
        break;
    }
  }

  result.heroSlides.sort((a, b) => a.id - b.id);
  return result;
}

export function hasWebsiteContent(content) {
  if (!content) return false;
  return Boolean(
    content.homePlans?.length ||
      content.businessPlans?.length ||
      content.homepageCards?.length ||
      content.heroSlides?.length ||
      Object.keys(content.phones || {}).length ||
      content.technicians?.length ||
      content.termOffers?.length ||
      content.welcomePlans?.length ||
      Object.keys(content.settings || {}).length
  );
}

export function getWebsiteFallback() {
  return fallbackWebsite;
}

export function resolveWebsiteContent(sheetContent) {
  const fallback = getWebsiteFallback();
  if (!hasWebsiteContent(sheetContent)) return { ...fallback, source: "bundled" };

  return {
    homePlans: sheetContent.homePlans?.length ? sheetContent.homePlans : fallback.homePlans,
    businessPlans: sheetContent.businessPlans?.length
      ? sheetContent.businessPlans
      : fallback.businessPlans,
    homepageCards: sheetContent.homepageCards?.length
      ? sheetContent.homepageCards
      : fallback.homepageCards,
    heroSlides: sheetContent.heroSlides?.length
      ? mergeHeroSlides(sheetContent.heroSlides, fallback.heroSlides)
      : fallback.heroSlides,
    phones: { ...fallback.phones, ...(sheetContent.phones || {}) },
    technicians: sheetContent.technicians?.length
      ? sheetContent.technicians
      : fallback.technicians,
    settings: { ...fallback.settings, ...(sheetContent.settings || {}) },
    termOffers: sheetContent.termOffers?.length ? sheetContent.termOffers : fallback.termOffers || [],
    termPlanSpeeds: sheetContent.termPlanSpeeds?.length
      ? sheetContent.termPlanSpeeds
      : fallback.termPlanSpeeds || [],
    welcomePlans: sheetContent.welcomePlans?.length
      ? sheetContent.welcomePlans
      : fallback.welcomePlans || [],
    source: "google_sheets",
  };
}
