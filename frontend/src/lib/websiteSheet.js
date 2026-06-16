import fallbackWebsite from "../data/websiteContentFallback.json";

export function parseBool(raw) {
  const v = String(raw || "")
    .trim()
    .toLowerCase();
  return v === "yes" || v === "true" || v === "1" || v === "y";
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

function slugifyId(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferSettingKey(key, value) {
  if (key) return key;
  if (!value) return "";
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
        result.heroSlides.push({
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
        });
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
        let key = String(row[1] || "").trim();
        let value = String(row[2] || "").trim();
        if (!key && !value && row[3]) {
          value = String(row[3] || "").trim();
        }
        key = inferSettingKey(key, value);
        if (key) result.settings[key] = value;
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
    heroSlides: sheetContent.heroSlides?.length ? sheetContent.heroSlides : fallback.heroSlides,
    phones: { ...fallback.phones, ...(sheetContent.phones || {}) },
    technicians: sheetContent.technicians?.length
      ? sheetContent.technicians
      : fallback.technicians,
    settings: { ...fallback.settings, ...(sheetContent.settings || {}) },
    source: "google_sheets",
  };
}
