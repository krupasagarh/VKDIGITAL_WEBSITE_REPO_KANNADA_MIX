import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ light = false }) => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative w-11 h-11 flex items-center justify-center">
        {/* WiFi arc logo */}
        <svg viewBox="0 0 64 64" className="w-11 h-11">
          <defs>
            <linearGradient id="vkarc" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <path d="M10 40 Q32 12 54 40" stroke="url(#vkarc)" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M18 46 Q32 28 46 46" stroke="url(#vkarc)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85" />
          <circle cx="32" cy="50" r="3.2" fill="#dc2626" />
        </svg>
      </div>
      <div className="leading-none">
        <div className={`font-extrabold tracking-tight text-[22px] ${light ? "text-white" : "text-slate-900"}`}>
          VK <span className="text-red-600">DIGITAL</span>
        </div>
        <div className={`text-[10px] uppercase tracking-[0.25em] ${light ? "text-white/70" : "text-slate-500"}`}>
          High Speed Internet
        </div>
      </div>
    </Link>
  );
};

export default Logo;
