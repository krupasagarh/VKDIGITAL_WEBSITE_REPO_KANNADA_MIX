import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Lock, User } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { toast } = useToast();
  const nav = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast({ title: "Please enter credentials" });
      return;
    }
    localStorage.setItem("vk_user", JSON.stringify({ username: form.username, at: Date.now() }));
    toast({ title: "Welcome back!", description: `Logged in as ${form.username}` });
    nav("/");
  };
  return (
    <section className="min-h-[85vh] bg-gradient-to-br from-red-50 via-white to-slate-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">Customer Login</h2>
        <p className="mt-1 text-sm text-slate-500 text-center">Pay bills, manage plans, raise tickets.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input name="username" placeholder="Username or Phone" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} className="h-12 pl-10" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input name="password" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="h-12 pl-10" />
          </div>
          <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 btn-shine">
            Sign In
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
