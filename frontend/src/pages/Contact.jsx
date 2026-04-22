import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { brand } from "../mock";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: "Missing details", description: "Please fill your name and phone." });
      return;
    }
    setBusy(true);
    setTimeout(() => {
      // Mock save in localStorage
      const prev = JSON.parse(localStorage.getItem("vk_enquiries") || "[]");
      prev.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("vk_enquiries", JSON.stringify(prev));
      setBusy(false);
      setForm({ name: "", email: "", phone: "", address: "", message: "" });
      toast({ title: "Enquiry submitted!", description: "Our team will reach out shortly." });
    }, 700);
  };

  return (
    <>
      <PageHeader title="Contact Us" crumb="Contact" />

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <p className="text-red-600 font-bold tracking-[0.25em] text-sm uppercase">Get In Touch</p>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900 leading-tight">
              Check Availability in Your Area
            </h2>
            <p className="mt-4 text-slate-600 max-w-md">
              Drop your details and our field team will get in touch within 24 hours with the best
              plan recommendations and feasibility check for your location.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Our Office</h4>
                  <p className="text-sm text-slate-600">{brand.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <a href={`tel:${brand.helpdeskPhone}`} className="block text-sm text-slate-600 hover:text-red-600">
                    Helpdesk: {brand.helpdeskPhoneDisplay}
                  </a>
                  <a href={`tel:${brand.ownerPhone}`} className="block text-sm text-slate-600 hover:text-red-600 mt-0.5">
                    Owner: {brand.ownerPhoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <a href={`mailto:${brand.email}`} className="text-sm text-slate-600 hover:text-red-600">
                    {brand.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Support Hours</h4>
                  <p className="text-sm text-slate-600">24 / 7 Customer Care</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Enquire Now</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="name" placeholder="Full Name" value={form.name} onChange={onChange} className="bg-white h-11" />
              <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={onChange} className="bg-white h-11" />
            </div>
            <Input name="email" type="email" placeholder="Email Address" value={form.email} onChange={onChange} className="bg-white h-11" />
            <Input name="address" placeholder="Your Address / Locality" value={form.address} onChange={onChange} className="bg-white h-11" />
            <Textarea name="message" placeholder="How can we help you?" value={form.message} onChange={onChange} className="bg-white min-h-[120px]" />
            <Button type="submit" disabled={busy} className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-12 btn-shine">
              {busy ? "Submitting..." : (<><Send size={16} className="mr-2" /> Submit Enquiry</>)}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Contact;
