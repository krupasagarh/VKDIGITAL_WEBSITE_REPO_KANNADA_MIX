import { brand, technicians as defaultTechnicians } from "../mock";

export function normalizePhoneTel(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return String(raw || "").trim().startsWith("+") ? String(raw).trim() : `+${digits}`;
}

export function formatPhoneDisplay(raw, tel) {
  const text = String(raw || "").trim();
  if (text) return text;
  const digits = (tel || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) return digits;
  return tel || "";
}

function phoneEntry(number, display, fallbackTel, fallbackDisplay) {
  const tel = normalizePhoneTel(number || fallbackTel);
  return {
    tel,
    display: formatPhoneDisplay(display, tel) || fallbackDisplay || tel,
    waDigits: tel.replace(/\D/g, ""),
  };
}

function rolePhone(phones, settings, role, fallbackTel, fallbackDisplay) {
  const entry = phones?.[role];
  const settingNumber = settings?.[`${role}_phone`];
  const settingDisplay = settings?.[`${role}_phone_display`];
  return phoneEntry(
    entry?.number || settingNumber,
    entry?.display || settingDisplay,
    fallbackTel,
    fallbackDisplay
  );
}

export function buildContacts(website, fallbackBrand = brand, fallbackTechnicians = defaultTechnicians) {
  const phones = website?.phones || {};
  const settings = website?.settings || {};
  const techs = website?.technicians?.length ? website.technicians : fallbackTechnicians;

  const main = rolePhone(phones, settings, "main", fallbackBrand.phone, fallbackBrand.phoneDisplay);
  const helpdesk = rolePhone(
    phones,
    settings,
    "helpdesk",
    fallbackBrand.helpdeskPhone,
    fallbackBrand.helpdeskPhoneDisplay
  );
  const owner = rolePhone(
    phones,
    settings,
    "owner",
    fallbackBrand.ownerPhone,
    fallbackBrand.ownerPhoneDisplay
  );
  const whatsapp = rolePhone(
    phones,
    settings,
    "whatsapp",
    fallbackBrand.ownerPhone,
    fallbackBrand.helpdeskPhoneDisplay
  );

  return {
    main,
    helpdesk,
    owner,
    whatsapp,
    technicians: techs.map((tech) => {
      const tel = normalizePhoneTel(tech.phone || tech.number);
      return {
        name: tech.name,
        tel,
        display: formatPhoneDisplay(tech.phoneDisplay || tech.display, tel),
      };
    }),
  };
}

export function whatsappChatUrl(contacts, message = "") {
  const digits =
    contacts?.whatsapp?.waDigits ||
    contacts?.owner?.waDigits ||
    contacts?.main?.waDigits ||
    "";
  if (!digits) return "#";
  if (!message) return `https://wa.me/${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
