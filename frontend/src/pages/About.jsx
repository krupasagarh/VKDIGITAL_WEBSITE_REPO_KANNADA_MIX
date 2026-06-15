import React from "react";
import PageHeader from "../components/PageHeader";
import { CtaSection } from "../components/Sections";
import { Target, Eye, Award, Users, ShieldCheck, Zap, Phone, Wrench } from "lucide-react";
import { testimonials, technicians } from "../mock";

const About = () => {
  const values = [
    { icon: Zap, title: "Speed", text: "Lightning fast fiber connectivity with consistent speeds, always." },
    { icon: ShieldCheck, title: "Reliability", text: "99.9% uptime and a robust network that keeps you connected." },
    { icon: Users, title: "Customer First", text: "24/7 priority support with local technicians you can trust." },
    { icon: Award, title: "Value", text: "Affordable plans that bundle Internet, OTT and IPTV without compromise." },
  ];
  return (
    <>
      <PageHeader title="About Us" crumb="About" />

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1601944177325-f8867652837f?w=1200&q=80"
            alt="About VK Digital"
            className="rounded-2xl shadow-xl"
          />
          <div>
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">About VK Digital</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900 leading-tight">
              Bringing Reliable, High-Speed Internet to Every Home & Business
            </h2>
            <p className="mt-5 text-slate-600">
              VK Digital is a next-generation ISP focused on delivering uncompromised broadband,
              rich OTT content and 350+ live TV channels — all on a single, reliable network. We
              believe connectivity has the power to do amazing things, and our mission is to make it
              accessible to everyone.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-100 p-5">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                  <Target size={18} />
                </div>
                <h3 className="mt-3 font-bold text-slate-900">Our Mission</h3>
                <p className="text-sm text-slate-600 mt-1">Connect every home with world-class internet.</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-5">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                  <Eye size={18} />
                </div>
                <h3 className="mt-3 font-bold text-slate-900">Our Vision</h3>
                <p className="text-sm text-slate-600 mt-1">Lead the digital transformation of India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-900">Our Core Values</h2>
            <div className="mx-auto mt-4 w-20 h-1 bg-yellow-400 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-7 text-center shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform">
                <div className="mx-auto w-14 h-14 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                  <v.icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase flex items-center gap-2">
              <Wrench size={16} /> Field support
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Technicians</h2>
            <p className="mt-2 text-slate-600">
              For installation, repairs, or on-site support in your area, contact our technicians directly.
            </p>
            <ul className="mt-6 space-y-4">
              {technicians.map((tech) => (
                <li
                  key={tech.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"
                >
                  <span className="font-semibold text-slate-900">{tech.name}</span>
                  <a
                    href={`tel:${tech.phone}`}
                    className="inline-flex items-center gap-2 text-yellow-700 font-bold hover:text-yellow-600 transition-colors"
                  >
                    <Phone size={16} />
                    {tech.phoneDisplay}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-yellow-600 font-bold tracking-[0.25em] text-sm uppercase">Testimonials</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">What Our Customers Says On Google</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-100 p-7 bg-slate-50">
                <p className="text-slate-700 italic">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
};

export default About;
