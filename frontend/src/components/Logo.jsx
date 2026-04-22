import React from "react";
import { Link } from "react-router-dom";
import { brand } from "../mock";

const Logo = ({ light = false, size = "md" }) => {
  const heightClass = size === "lg" ? "h-16 md:h-20" : "h-12 md:h-14";
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className={`relative ${heightClass} flex items-center justify-center rounded-xl overflow-hidden bg-white ${light ? "p-2" : "p-1"}`}>
        <img
          src={brand.logo}
          alt="VK Digital | RailWire"
          className="h-full w-auto object-contain"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>
    </Link>
  );
};

export default Logo;
