import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Lock, Phone, Tv } from "lucide-react";
import { customerLogin, getApiBase } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ phone: "", stb_id: "", password: "" });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      toast({ title: "Enter your mobile number" });
      return;
    }
    if (!getApiBase()) {
      toast({
        title: "Backend not configured",
        description: "Set REACT_APP_API_URL in frontend/.env and enable CUSTOMER_PORTAL_ENABLED on the server.",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);
    try {
      const res = await customerLogin({
        phone: form.phone.trim(),
        stb_id: form.stb_id.trim(),
        password: form.password,
      });
      login({
        token: res.token,
        phone: res.phone,
        stb_id: res.stb_id || "",
      });
      toast({ title: "Welcome back!", description: "Loading your connection details…" });
      nav("/account");
    } catch (err) {
      toast({
        title: "Sign in failed",
        description: err?.response?.data?.detail || err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-[85vh] bg-gradient-to-br from-red-50 via-white to-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">Customer Login</h2>
        <p className="mt-1 text-sm text-slate-500 text-center">
          View Internet (Railtel), Cable TV (Hathway), and billing (Bix42 / Mobize) in one place.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              name="phone"
              inputMode="numeric"
              placeholder="Mobile number (10 digits)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-12 pl-10"
            />
          </div>
          <div className="relative">
            <Tv size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              name="stb_id"
              placeholder="STB / VC number (optional, for Cable TV)"
              value={form.stb_id}
              onChange={(e) => setForm({ ...form, stb_id: e.target.value.toUpperCase() })}
              className="h-12 pl-10"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              name="password"
              type="password"
              placeholder="Password (optional for now)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-12 pl-10"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 btn-shine"
          >
            {busy ? "Signing in…" : "View My Services"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New here? <Link to="/contact" className="text-yellow-600 font-medium hover:underline">Get a new connection</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
