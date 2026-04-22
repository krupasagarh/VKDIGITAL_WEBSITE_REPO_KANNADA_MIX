import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PageHeader = ({ title, crumb }) => {
  return (
    <section className="relative bg-gradient-to-r from-yellow-400 to-yellow-300 text-slate-900 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
        <div className="mt-3 flex items-center gap-2 text-slate-800/85 text-sm">
          <Link to="/" className="hover:text-slate-900 font-medium">Home</Link>
          <ChevronRight size={14} />
          <span className="font-bold">{crumb || title}</span>
        </div>
      </div>
      <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute -left-10 -top-10 w-52 h-52 rounded-full bg-slate-900/10 blur-3xl" />
    </section>
  );
};

export default PageHeader;
