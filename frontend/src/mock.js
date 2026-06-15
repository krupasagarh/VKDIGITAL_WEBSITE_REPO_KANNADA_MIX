// Mock data for VK Digital ISP website

export const brand = {
  name: "VK DIGITAL",
  tagline: "High Speed Internet Services",
  logo: "https://customer-assets.emergentagent.com/job_plant-based-hub-4/artifacts/50iizffb_Screenshot_20260423_010217_Canva.jpg",
  email: "vkdigitaltiptur@gmail.com",
  phone: "+919148287555",
  phoneDisplay: "+91 91482 87555",
  ownerPhone: "+917259326656",
  ownerPhoneDisplay: "+91 72593 26656",
  helpdeskPhone: "+919148287555",
  helpdeskPhoneDisplay: "+91 91482 87555",
  address: "VK DIGITAL, Near: Vijaya Nursing Home, BH Road, Tiptur 572201",
  about: "We believe it has the power to do amazing things.",
  copyright: "\u00a9 2024-2025 VK Digital. All Rights Reserved.",
};

/** WhatsApp + email for plan/contact leads — uses `brand.ownerPhone` and `brand.email` only */
function leadWhatsappE164() {
  return (brand.ownerPhone || "").replace(/\D/g, "");
}

export function whatsappLeadUrl(text) {
  const n = leadWhatsappE164();
  if (!n) return "#";
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function buildPlanRequestMessage(request) {
  const c = request.contact || {};
  const lines = [
    "*VK Digital — Custom plan request*",
    `Ref: ${request.id}`,
    "",
    "*Plan*",
  ];

  if (request.description) {
    lines.push(
      `Plan: ${request.description}`,
      `Internet: ${request.speed || ""}`,
      `IPTV: ${request.iptv || ""}`,
      `OTT: ${request.ott || ""}`,
      `Duration: ${request.months || 1} month(s)`,
      `Monthly (incl. GST): ₹${request.monthlyInclGst ?? ""}`,
      `Installation: ${request.installation === 0 ? "Free" : `₹${request.installation}`}`,
      `Total payable: ₹${request.totalPayable ?? ""}`
    );
  } else {
    lines.push(
      `Type: ${request.segment || "home"}`,
      `Speed: ${request.speed || ""}`,
      `OTT bundle: ${request.ott ? "Yes" : "No"}`,
      `IPTV / Live TV: ${request.iptv ? "Yes" : "No"}`,
      `Est. monthly: ₹${request.estimatedMonthly ?? ""}`
    );
  }

  lines.push(
    "",
    "*Contact*",
    `Name: ${c.name || ""}`,
    `Phone: ${c.phone || ""}`,
    c.email ? `Email: ${c.email}` : null,
    c.locality ? `Area / locality: ${c.locality}` : null,
    c.notes ? `Notes: ${c.notes}` : null
  );

  return lines.filter(Boolean).join("\n");
}

export function buildContactEnquiryMessage(payload) {
  const { name, phone, email, address, message, at } = payload;
  const lines = [
    "*VK Digital — Website enquiry*",
    at ? `Submitted: ${at}` : null,
    "",
    `Name: ${name || ""}`,
    `Phone: ${phone || ""}`,
    email ? `Email: ${email}` : null,
    address ? `Address / locality: ${address}` : null,
    message ? `Message:\n${message}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Home Plans", to: "/home-plans" },
  { label: "Business Plans", to: "/business-plans" },
  { label: "Build Plan", to: "/plan-builder" },
  { label: "Entertainment", to: "/entertainment" },
  { label: "Contact Us", to: "/contact" },
];

/** Custom plan builder: tiers and add-ons (indicative; matches published home/business cards where possible). */
export const planBuilderConfig = {
  disclaimerEn:
    "Indicative monthly estimate only. Final price, feasibility and installation depend on your area and confirmation from VK Digital.",
  disclaimerKn:
    "ಇದು ಅಂದಾಜು ಮಾತ್ರ. ಅಂತಿಮ ಬೆಲೆ, ಲಭ್ಯತೆ ಮತ್ತು ಅಳವಡಿಕೆ ನಿಮ್ಮ ಪ್ರದೇಶದ ಆಧಾರದ ಮೇಲೆ VK ಡಿಜಿಟಲ್ ದೃಢೀಕರಣದ ನಂತರ ನಿಗದಿಯಾಗುತ್ತದೆ.",
  segments: [
    {
      id: "home",
      label: "Home",
      labelKn: "ಮನೆ",
      description: "Residential — unlimited data, free installation & Wi-Fi router*",
      descriptionKn: "ನಿವಾಸ — ಅಮಿತ ಡೇಟಾ, ಉಚಿತ ಅಳವಡಿಕೆ ಮತ್ತು ವೈಫೈ ರೂಟರ್*",
    },
    {
      id: "business",
      label: "Business / Shop",
      labelKn: "ವ್ಯಾಪಾರ / ಅಂಗಡಿ",
      description: "Includes static IP & GST billing as per our business plans",
      descriptionKn: "ನಮ್ಮ ಬಿಸಿನೆಸ್ ಪ್ಲಾನ್‌ಗಳ ಪ್ರಕಾರ ಸ್ಟ್ಯಾಟಿಕ್ ಐಪಿ ಮತ್ತು ಜಿಎಸ್ಟಿ ಬಿಲ್ಲಿಂಗ್",
    },
  ],
  home: {
    tiers: [
      { id: "50", speed: "50 Mbps", base: 399 },
      { id: "100", speed: "100 Mbps", base: 699 },
      { id: "150", speed: "150 Mbps", base: 599 },
      { id: "200", speed: "200 Mbps", base: 699 },
      { id: "300", speed: "300 Mbps", base: 899 },
    ],
    ottAddon: 200,
    iptvAddon: 100,
    ottLabel: "20+ OTT apps",
    ottLabelKn: "20+ OTT ಅಪ್ಲಿಕೇಶನ್‌ಗಳು",
    iptvLabel: "350+ Live TV (IPTV)",
    iptvLabelKn: "350+ ಲೈವ್ ಟಿವಿ (IPTV)",
  },
  business: {
    tiers: [
      { id: "100", speed: "100 Mbps", base: 1199 },
      { id: "200", speed: "200 Mbps", base: 1999 },
      { id: "300", speed: "300 Mbps", base: 4999 },
      { id: "500", speed: "500 Mbps", base: 6999 },
    ],
    ottAddon: 200,
    iptvAddon: 150,
    ottLabel: "20+ OTT apps (add-on)",
    ottLabelKn: "20+ OTT (ಅಡಾನ್)",
    iptvLabel: "350+ Live TV / IPTV (add-on)",
    iptvLabelKn: "350+ ಲೈವ್ ಟಿವಿ / IPTV (ಅಡಾನ್)",
  },
};

/**
 * @param {{ segment: "home" | "business"; tierId: string; ott: boolean; iptv: boolean }} selection
 */
export function computePlanBuilderQuote(selection) {
  const segment = selection.segment === "business" ? "business" : "home";
  const cfg = segment === "business" ? planBuilderConfig.business : planBuilderConfig.home;
  const tier = cfg.tiers.find((t) => t.id === selection.tierId) || cfg.tiers[0];
  let total = tier.base;
  if (selection.ott) total += cfg.ottAddon;
  if (selection.iptv) total += cfg.iptvAddon;
  return {
    segment,
    tier,
    ott: selection.ott,
    iptv: selection.iptv,
    estimatedMonthly: total,
    breakdown: [
      { key: "base", label: `${tier.speed} base`, amount: tier.base },
      ...(selection.ott ? [{ key: "ott", label: cfg.ottLabel, amount: cfg.ottAddon }] : []),
      ...(selection.iptv ? [{ key: "iptv", label: cfg.iptvLabel, amount: cfg.iptvAddon }] : []),
    ],
  };
}

export const heroSlides = [
  {
    id: 1,
    title: "IPTV / Cable TV for just \u20b9159",
    titleKn: "ಕೇವಲ \u20b9159ಕ್ಕೆ IPTV / ಕೇಬಲ್ ಟಿವಿ",
    subtitle: "350+ Live Channels on your Smart TV",
    subtitleKn: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಟಿವಿಯಲ್ಲಿ 350+ ಲೈವ್ ಚಾನೆಲ್‌ಗಳು",
    highlight: "Best Entertainment with Cheapest Plan",
    highlightKn: "ಅಗ್ಗದ ಪ್ಲಾನ್‌ನಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಮನೋರಂಜನೆ",
    price: "Cable TV @ \u20b9423/-",
    extra: "350+ CHANNELS + 20 MBPS",
    extraKn: "350+ ಚಾನೆಲ್‌ಗಳು + 20 MBPS",
    image: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=1600&q=80",
  },
  {
    id: 2,
    title: "Connect with the Most Reliable Broadband",
    titleKn: "ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಬ್ರಾಡ್‌ಬ್ಯಾಂಡ್‌ಗೆ ಸಂಪರ್ಕಿಸಿ",
    subtitle: "Explore Our Exclusive OTT Internet Combo Plan",
    subtitleKn: "ನಮ್ಮ ವಿಶೇಷ OTT ಇಂಟರ್ನೆಟ್ ಕಾಂಬೊ ಪ್ಲಾನ್ ಅನ್ವೇಷಿಸಿ",
    highlight: "Entertainment & Connectivity",
    highlightKn: "ಮನೋರಂಜನೆ ಮತ್ತು ಸಂಪರ್ಕ",
    price: "50 Mbps @ \u20b9499/-",
    extra: "350+ LIVE TV CHANNELS",
    extraKn: "350+ ಲೈವ್ ಟಿವಿ ಚಾನೆಲ್‌ಗಳು",
    image: "https://images.unsplash.com/photo-1692188071339-2825a8a997f1?w=1600&q=80",
  },
  {
    id: 3,
    title: "Blazing Fast Fiber Internet",
    titleKn: "ಅತ್ಯಂತ ವೇಗದ ಫೈಬರ್ ಇಂಟರ್ನೆಟ್",
    subtitle: "Stream. Work. Play. Without Limits.",
    subtitleKn: "ಸ್ಟ್ರೀಮ್. ಕೆಲಸ. ಆಟ. ಮಿತಿಯಿಲ್ಲದೆ.",
    highlight: "Unlimited Data, Zero Buffering",
    highlightKn: "ಅಮಿತ ಡೇಟಾ, ಶೂನ್ಯ ಬಫರಿಂಗ್",
    price: "100 Mbps @ \u20b9699/-",
    extra: "20+ OTT APPS INCLUDED",
    extraKn: "20+ OTT ಅಪ್ಲಿಕೇಶನ್‌ಗಳು ಸೇರಿವೆ",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1600&q=80",
  },
  {
    id: 4,
    title: "Upgrade Your Home Network",
    titleKn: "ನಿಮ್ಮ ಮನೆಯ ನೆಟ್‌ವರ್ಕ್ ಅನ್ನು ಮೇಲ್ದರ್ಜೆಗೇರಿಸಿ",
    subtitle: "Free Installation. Free WiFi Router.",
    subtitleKn: "ಉಚಿತ ಅಳವಡಿಕೆ. ಉಚಿತ ವೈಫೈ ರೂಟರ್.",
    highlight: "Experience The Difference",
    highlightKn: "ವ್ಯತ್ಯಾಸವನ್ನು ಅನುಭವಿಸಿ",
    price: "Starts @ \u20b9399/-",
    extra: "UNLIMITED BROWSING",
    extraKn: "ಅಮಿತ ಬ್ರೌಸಿಂಗ್",
    image: "https://images.pexels.com/photos/29711663/pexels-photo-29711663.jpeg?w=1600&q=80",
  },
  {
    id: 5,
    title: "All In One Plan",
    titleKn: "ಆಲ್ ಇನ್ ಒನ್ ಪ್ಲಾನ್",
    subtitle: "Best Plan for Home and Entertainment",
    subtitleKn: "ಮನೆ ಮತ್ತು ಮನೋರಂಜನೆಗೆ ಅತ್ಯುತ್ತಮ ಪ್ಲಾನ್",
    highlight: "Experience The Difference",
    highlightKn: "ವ್ಯತ್ಯಾಸವನ್ನು ಅನುಭವಿಸಿ",
    price: "Starts @ \u20b9599/-",
    extra: "SPEED + 350 LIVE TV CHANNELS + 10 OTTs",
    extraKn: "ವೇಗ + 350 ಲೈವ್ ಟಿವಿ ಚಾನೆಲ್‌ಗಳು + 10 OTTs",
    image: "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=1600&q=80",
  },
  {
    id: 6,
    title: "As Per Your Need",
    titleKn: "ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ",
    subtitle: "Customisable Plan",
    subtitleKn: "ಕಸ್ಟಮೈಸ್ ಮಾಡಬಹುದಾದ ಪ್ಲಾನ್",
    highlight: "Most Reliable Internet and Best Entertainment",
    highlightKn: "ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಇಂಟರ್ನೆಟ್ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಮನೋರಂಜನೆ",
    price: "Starts @ \u20b9199/-",
    extra: "BEST FOR BILLING & CCTV FOR SHOPS",
    extraKn: "ಅಂಗಡಿಗಳ ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಸಿಸಿಟಿವಿಗೆ ಉತ್ತಮ",
    image: "https://images.pexels.com/photos/32698507/pexels-photo-32698507.jpeg?w=1600&q=80",
  },
];

// Section titles / labels in Kannada for bilingual display
export const i18n = {
  quickPay: { en: "Quick Pay", kn: "ತ್ವರಿತ ಪಾವತಿ" },
  myAccount: { en: "My Account", kn: "ನನ್ನ ಖಾತೆ" },
  viewPlans: { en: "View Plans", kn: "ಪ್ಲಾನ್‌ಗಳನ್ನು ನೋಡಿ" },
  checkAvailability: { en: "Check Availability", kn: "ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ" },
  bestNetwork: { en: "Best Network", kn: "ಉತ್ತಮ ನೆಟ್‌ವರ್ಕ್" },
  findPlans: {
    en: "Find Perfect Network Solutions",
    kn: "ಪರಿಪೂರ್ಣ ನೆಟ್‌ವರ್ಕ್ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕಿ",
  },
  startsFrom: { en: "Starts From", kn: "ಪ್ರಾರಂಭ" },
  popular: { en: "Popular", kn: "ಜನಪ್ರಿಯ" },
  subscribeNow: { en: "Subscribe Now", kn: "ಈಗ ಚಂದಾದಾರರಾಗಿ" },
  enjoyMore: {
    en: "Enjoy Sports, Movies, TV Shows & More.",
    kn: "ಕ್ರೀಡೆ, ಚಲನಚಿತ್ರ, ಟಿವಿ ಶೋಗಳನ್ನು ಆನಂದಿಸಿ.",
  },
  needFast: {
    en: "Need Fast & Secure Internet!",
    kn: "ವೇಗದ ಮತ್ತು ಸುರಕ್ಷಿತ ಇಂಟರ್ನೆಟ್ ಬೇಕೇ!",
  },
  useVk: { en: "Use VK Digital", kn: "VK ಡಿಜಿಟಲ್ ಬಳಸಿ" },
  viewAllPlans: { en: "View All Plans", kn: "ಎಲ್ಲಾ ಪ್ಲಾನ್‌ಗಳು" },
  ottHeading: {
    en: "Popular OTT Services We Offer",
    kn: "ನಾವು ನೀಡುವ ಜನಪ್ರಿಯ OTT ಸೇವೆಗಳು",
  },
  stats: {
    ultraSpeed: { en: "Ultra Fast Speed", kn: "ಅತಿ ವೇಗದ ಸ್ಪೀಡ್" },
    customerSupport: { en: "Customer Support", kn: "ಗ್ರಾಹಕ ಬೆಂಬಲ" },
    liveChannels: { en: "Live TV Channels", kn: "ಲೈವ್ ಟಿವಿ ಚಾನೆಲ್‌ಗಳು" },
    ottApps: { en: "OTT Applications", kn: "OTT ಅಪ್ಲಿಕೇಶನ್‌ಗಳು" },
  },
  features: {
    upTo: { en: "Up to", kn: "ವರೆಗೆ" },
    unlimitedData: { en: "Unlimited Data", kn: "ಅಮಿತ ಡೇಟಾ" },
    freeInstall: { en: "Free Installation", kn: "ಉಚಿತ ಅಳವಡಿಕೆ" },
    freeRouter: { en: "Free WiFi router*", kn: "ಉಚಿತ ವೈಫೈ ರೂಟರ್*" },
    liveTv: { en: "350 Live Channels", kn: "350 ಲೈವ್ ಚಾನೆಲ್‌ಗಳು" },
    ottApps: { en: "22 OTT", kn: "22 OTT ಅಪ್ಲಿಕೇಶನ್‌ಗಳು" },
  },
  footer: {
    quickLinks: { en: "Quick Links", kn: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು" },
    address: { en: "Address:", kn: "ವಿಳಾಸ:" },
    helpdesk: { en: "24/7 Helpdesk", kn: "24/7 ಸಹಾಯವಾಣಿ" },
    owner: { en: "Owner", kn: "ಮಾಲೀಕರು" },
    interested: { en: "Interested in working with us?", kn: "ನಮ್ಮೊಂದಿಗೆ ಕೆಲಸ ಮಾಡಲು ಆಸಕ್ತಿಯಿದೆಯೇ?" },
  },
  contact: {
    getInTouch: { en: "Get In Touch", kn: "ಸಂಪರ್ಕದಲ್ಲಿರಿ" },
    checkArea: {
      en: "Check Availability in Your Area",
      kn: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ",
    },
    ourOffice: { en: "Our Office", kn: "ನಮ್ಮ ಕಚೇರಿ" },
    callUs: { en: "Call Us", kn: "ನಮಗೆ ಕರೆ ಮಾಡಿ" },
    emailUs: { en: "Email Us", kn: "ಇಮೇಲ್ ಮಾಡಿ" },
    supportHours: { en: "Support Hours", kn: "ಬೆಂಬಲದ ಸಮಯ" },
    enquireNow: { en: "Enquire Now", kn: "ಈಗ ವಿಚಾರಿಸಿ" },
    fullName: { en: "Full Name", kn: "ಪೂರ್ಣ ಹೆಸರು" },
    phone: { en: "Phone Number", kn: "ಫೋನ್ ಸಂಖ್ಯೆ" },
    email: { en: "Email Address", kn: "ಇಮೇಲ್ ವಿಳಾಸ" },
    addressField: { en: "Your Address / Locality", kn: "ನಿಮ್ಮ ವಿಳಾಸ / ಪ್ರದೇಶ" },
    message: { en: "How can we help you?", kn: "ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?" },
    submit: { en: "Submit Enquiry", kn: "ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿ" },
  },
};

export const plans = [
  {
    id: "internet",
    title: "Internet",
    popular: false,
    icon: "Wifi",
    features: [
      "Up to 50Mbps",
      "Free Installation",
      "Free WiFi router*",
    ],
    price: "\u20b9399",
    note: "Starts From",
    cycle: "/ Month",
    cta: "View Plans",
    link: "/home-plans",
  },
  {
    id: "internet-ott",
    title: "Internet + OTT",
    popular: false,
    icon: "MonitorPlay",
    features: [
      "Up to 50Mbps",
      "22 OTT",
      "Free Installation",
      "Free WiFi router*",
    ],
    price: "\u20b9599",
    note: "Starts From",
    cycle: "/ Month",
    cta: "View Plans",
    link: "/home-plans",
  },
  {
    id: "internet-ott-iptv",
    title: "Internet + OTT + IPTV",
    popular: true,
    icon: "Tv",
    features: [
      "Up to 50Mbps",
      "22 OTT",
      "350 Live Channels",
      "Free Installation",
      "Free WiFi router*",
    ],
    price: "\u20b9699",
    note: "Starts From",
    cycle: "/ Month",
    cta: "View Plans",
    link: "/home-plans",
  },
  {
    id: "business",
    title: "Internet + OTT + IPTV",
    popular: true,
    icon: "Tv",
    features: [
      "Up to 100Mbps",
      "22 OTT",
      "350 Live Channels",
      "Free Installation",
      "Free WiFi router*",
    ],
    price: "\u20b9899",
    note: "Starts From",
    cycle: "/ Month",
    cta: "View Plans",
    link: "/home-plans",
  },
];

export const homePlans = [
  { id: 1, speed: "50 Mbps", price: 399, validity: "1 Month", data: "Unlimited", ott: false, iptv: false },
  { id: 2, speed: "100 Mbps", price: 699, validity: "1 Month", data: "Unlimited", ott: false, iptv: false },
  { id: 3, speed: "150 Mbps", price: 799, validity: "1 Month", data: "Unlimited", ott: true, iptv: false },
  { id: 4, speed: "200 Mbps", price: 999, validity: "1 Month", data: "Unlimited", ott: true, iptv: true },
  { id: 5, speed: "300 Mbps", price: 1199, validity: "1 Month", data: "Unlimited", ott: true, iptv: true },
];

export const businessPlans = [
  { id: 1, speed: "100 Mbps", price: 1199, validity: "1 Month", data: "Unlimited", staticIp: true, gst: true },
  { id: 2, speed: "200 Mbps", price: 1999, validity: "1 Month", data: "Unlimited", staticIp: true, gst: true },
  { id: 3, speed: "300 Mbps", price: 4999, validity: "1 Month", data: "Unlimited", staticIp: true, gst: true },
  { id: 4, speed: "500 Mbps", price: 6999, validity: "1 Month", data: "Unlimited", staticIp: true, gst: true },
];

export const ottServices = [
  { name: "Aha Telugu", img: "https://veganet.in/assets/images/otts/ahatelugu.png" },
  { name: "Sun NXT", img: "https://veganet.in/assets/images/otts/sunnxt.png" },
  { name: "Zee5", img: "https://veganet.in/assets/images/otts/zee5.jpeg" },
  { name: "Sony LIV", img: "https://veganet.in/assets/images/otts/sonyliv.png" },
  { name: "Hotstar", img: "https://veganet.in/assets/images/otts/hotstar.png" },
  { name: "Prime Video", img: "https://veganet.in/assets/images/otts/primevideo.jpg" },
  { name: "Kanchalanka", img: "https://veganet.in/assets/images/otts/kanchalanka.jpg" },
  { name: "Runn TV", img: "https://veganet.in/assets/images/otts/runntv.png" },
  { name: "Channa Jor", img: "https://veganet.in/assets/images/otts/channajor.png" },
  { name: "Hubhopper", img: "https://veganet.in/assets/images/otts/hubhopper.png" },
  { name: "Om TV", img: "https://veganet.in/assets/images/otts/omtv.png" },
  { name: "Distro TV", img: "https://veganet.in/assets/images/otts/distrotv.png" },
  { name: "Power Kids", img: "https://veganet.in/assets/images/otts/powerkids.png" },
  { name: "iTap", img: "https://veganet.in/assets/images/otts/itap.png" },
  { name: "Playflix", img: "https://veganet.in/assets/images/otts/playflix.png" },
  { name: "Hungama Play", img: "https://veganet.in/assets/images/otts/hungamaplay.png" },
  { name: "Hoichoi", img: "https://veganet.in/assets/images/otts/hoichoi.png" },
  { name: "Fancode", img: "https://veganet.in/assets/images/otts/fancode.png" },
  { name: "Cinema World", img: "https://veganet.in/assets/images/otts/cinemaworld.png" },
  { name: "Alt Balaji", img: "https://veganet.in/assets/images/otts/altbalaji.png" },
  { name: "Namma Flix", img: "https://veganet.in/assets/images/otts/nammaflix.png" },
  { name: "ETV Win", img: "https://veganet.in/assets/images/otts/etvwin.jpeg" },
  { name: "Jio Cinema", img: "https://veganet.in/assets/images/otts/jiocinema.png" },
  { name: "Aha Tamil", img: "https://veganet.in/assets/images/otts/ahatamil.png" },
];

export const subscribeImage =
  "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=1200&q=80";

export const iptvChannels = [
  "Star Plus", "Zee TV", "Sony TV", "Colors", "Star Sports 1", "Star Sports 2",
  "Sony Six", "Sony ESPN", "Discovery", "National Geographic", "Animal Planet",
  "History TV18", "Cartoon Network", "Pogo", "Nick", "Disney", "NDTV 24x7",
  "India Today", "CNN News18", "Times Now", "Aaj Tak", "Republic TV",
  "Zee News", "ABP News", "Star Gold", "Sony Max", "Zee Cinema", "& Pictures",
];

export const testimonials = [
  {
    name: "chromatic_photography_97",
    role: "Photographer/Business Owner",
    quote: "Very good speed connection with wonderful services.A good team with a very fast response I really recommend this service.Thank you.",
  },
  {
    name: "Abhishek Daryani",
    role: "Software Engineer/Gamer",
    quote: "Very good and personalized service. VK digital gives immediate response on queries and issues. Waiting period is way too less and spot services are too very quick. Highly satisfied with the service would recommend 200%. And frequent updates on service addition is commendable. Speed of internet.... no question at all.",
  },
  {
    name: "KRISHNA Iyengar",
    role: "Banker/Business Owner",
    quote: "I have been using the ISP since 2021 when I moved to Tiptur. I get good speeds , hardly 1 downtime once in 6 months but Shri Krupa Sagar attends the complaint even if it is night. I have never seen their office , all my requests are attended over whatsapp.",
  },
  {
    name: "HARSHITHA",
    role: "IT Professional/Home User",
    quote: "Hassle free installation, good service n most important good speed.. prior notice during downtime / maintenance which I appreciate.. very professional. . Any issues u get quick response.. much recommended.",
  },
  {
    name: "BHARATH EV",
    role: "IT Professional/Home User",
    quote: "Very good service and response is quick as well if there is any slowness.. Thanks for providing such a good service here in Tiptur. Happy as a customer..!! Now providing OTT access along with Wifi with same plan is well worthy.",
  },
  {
    name: "SMITHA",
    role: "IT Professional/Home User",
    quote: "VK Digital provides uninterrupted quality network 24/7. Staffs respond quickly in case of any issues or concerns and will address them as soon as possible.",
  },    
];
