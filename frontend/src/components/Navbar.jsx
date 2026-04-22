import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Mail, Phone, ChevronRight, Menu, X, User } from "lucide-react";
import Logo from "./Logo";
import { brand, navLinks } from "../mock";
import { Button } from "./ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="hidden md:block bg-yellow-400 text-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`mailto:${brand.email}`} className="flex items-center gap-2 hover:text-slate-800 transition-colors">
              <Mail size={14} /> {brand.email}
            </a>
            <a href={`tel:${brand.phone}`} className="flex items-center gap-2 hover:text-slate-800 transition-colors">
              <Phone size={14} /> {brand.phone}
            </a>
          </div>
          <Link to="/quick-pay" className="flex items-center gap-1 hover:text-slate-800 transition-colors font-medium">
            <ChevronRight size={14} /> Quick Pay / ತ್ವರಿತ ಪಾವತಿ
          </Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`bg-white transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 text-[15px] font-medium rounded-md transition-colors ${
                    isActive ? "text-yellow-600" : "text-slate-700 hover:text-yellow-600"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full px-5 btn-shine">
              <Link to="/login">
                <User size={16} className="mr-1" />
                My Account
              </Link>
            </Button>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden text-slate-800 p-2" aria-label="menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-slate-100">
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium ${
                      isActive ? "bg-yellow-50 text-yellow-600" : "text-slate-700"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/login" className="px-3 py-2 rounded-md bg-yellow-400 text-slate-900 font-medium text-center mt-2">
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
