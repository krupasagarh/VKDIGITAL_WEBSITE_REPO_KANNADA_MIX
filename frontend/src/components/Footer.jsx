import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import Logo from "./Logo";
import { brand } from "../mock";

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0b0b0d] text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="inline-block"><Logo light /></div>
          <p className="mt-5 text-sm text-slate-400 max-w-xs">
            {brand.about}
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-5">Quick Links <span className="text-sm font-normal text-slate-400" lang="kn">/ ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು</span></h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-red-500 transition-colors">About Company</Link></li>
            <li><Link to="/ott" className="hover:text-red-500 transition-colors">OTT Packages</Link></li>
            <li><Link to="/iptv" className="hover:text-red-500 transition-colors">IPTV Packages</Link></li>
            <li><Link to="/home-plans" className="hover:text-red-500 transition-colors">Home Plans</Link></li>
            <li><Link to="/business-plans" className="hover:text-red-500 transition-colors">Business Plans</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-lg mb-5">Address: <span className="text-sm font-normal text-slate-400" lang="kn">/ ವಿಳಾಸ</span></h4>
          <div className="flex gap-3 text-sm text-slate-400">
            <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p>{brand.address}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-400">Interested in working with us?</p>
          <a href={`mailto:${brand.email}`} className="block text-white font-medium mt-1 hover:text-red-500 transition-colors">
            <Mail size={14} className="inline mr-2" />{brand.email}
          </a>
          <p className="text-sm text-slate-400 mt-6">24/7 Helpdesk <span lang="kn">/ ಸಹಾಯವಾಣಿ</span></p>
          <a href={`tel:${brand.helpdeskPhone}`} className="text-red-500 font-bold text-xl mt-1 inline-flex items-center gap-2">
            <Phone size={18} />{brand.helpdeskPhoneDisplay}
          </a>
          <p className="text-sm text-slate-400 mt-4">Owner <span lang="kn">/ ಮಾಲೀಕರು</span></p>
          <a href={`tel:${brand.ownerPhone}`} className="text-white font-semibold text-base mt-1 inline-flex items-center gap-2 hover:text-red-500 transition-colors">
            <Phone size={16} />{brand.ownerPhoneDisplay}
          </a>
        </div>
      </div>

      <button
        onClick={scrollTop}
        className="mx-auto -mb-5 relative z-10 w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white shadow-lg block"
        aria-label="scroll top"
      >
        <ArrowUp size={18} />
      </button>

      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>Copyright {brand.copyright}</p>
          <div className="flex items-center gap-5">
            <Link to="/terms" className="hover:text-yellow-200">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-yellow-200">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-yellow-200">Refund Policy</Link>
            <Link to="/contact" className="hover:text-yellow-200">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
