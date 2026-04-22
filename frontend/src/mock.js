// Mock data for VK Digital ISP website

export const brand = {
  name: "VK DIGITAL",
  tagline: "High Speed Internet Services",
  logo: "https://customer-assets.emergentagent.com/job_plant-based-hub-4/artifacts/50iizffb_Screenshot_20260423_010217_Canva.jpg",
  email: "info@vkdigital.in",
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

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Home Plans", to: "/home-plans" },
  { label: "Business Plans", to: "/business-plans" },
  { label: "OTT", to: "/ott" },
  { label: "IPTV", to: "/iptv" },
  { label: "Contact Us", to: "/contact" },
];

export const heroSlides = [
  {
    id: 1,
    title: "Connect with the Most Reliable Broadband",
    subtitle: "Explore Our Exclusive OTT Internet Combo Plan",
    highlight: "Entertainment & Connectivity",
    price: "50 Mbps @ \u20b9599/-",
    extra: "350+ LIVE TV CHANNELS",
    image: "https://images.unsplash.com/photo-1692188071339-2825a8a997f1?w=1600&q=80",
  },
  {
    id: 2,
    title: "Blazing Fast Fiber Internet",
    subtitle: "Stream. Work. Play. Without Limits.",
    highlight: "Unlimited Data, Zero Buffering",
    price: "100 Mbps @ \u20b9699/-",
    extra: "20+ OTT APPS INCLUDED",
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1600&q=80",
  },
  {
    id: 3,
    title: "Upgrade Your Home Network",
    subtitle: "Free Installation. Free WiFi Router.",
    highlight: "Experience The Difference",
    price: "Starts @ \u20b9399/-",
    extra: "UNLIMITED BROWSING",
    image: "https://images.pexels.com/photos/29711663/pexels-photo-29711663.jpeg?w=1600&q=80",
  },
];

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
    title: "For SME & SOHO",
    subtitle: "Business Internet",
    popular: true,
    icon: "Briefcase",
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
    link: "/business-plans",
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
    name: "Ramesh Kumar",
    role: "Home User, Bangalore",
    quote: "VK Digital's fiber has been rock-solid for my work-from-home setup. Consistent speeds and quick support.",
  },
  {
    name: "Priya Sharma",
    role: "Small Business Owner",
    quote: "We upgraded to the business plan with static IP and GST billing. Best decision we made this year.",
  },
  {
    name: "Arjun Reddy",
    role: "Gamer & Streamer",
    quote: "Low latency, zero buffering on 4K streams. The OTT combo saves me so much money each month.",
  },
];
