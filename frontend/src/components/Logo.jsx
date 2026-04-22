import React from "react";
import { Link } from "react-router-dom";
import { brand } from "../mock";

const Logo = ({ light = false }) => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className={`relative h-12 md:h-14 flex items-center justify-center rounded-xl overflow-hidden ${light ? "bg-white p-1.5" : "bg-white"}`}>
        <img
          src={brand.logo}
          alt="VK Digital"
          className="h-full w-auto object-contain"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
      <div className={`hidden sm:block leading-none ${light ? "text-white" : "text-slate-900"}`}>
        <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">
          High Speed Internet
        </div>
        <div className={`mt-1 text-[13px] font-semibold ${light ? "text-white/90" : "text-slate-600"}`}>
          Tiptur, Karnataka
        </div>
      </div>
    </Link>
  );
};

export default Logo;
