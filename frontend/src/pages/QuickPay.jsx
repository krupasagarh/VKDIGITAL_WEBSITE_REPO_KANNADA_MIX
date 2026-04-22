import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { CreditCard, IndianRupee, CheckCircle2 } from "lucide-react";

const QuickPay = () => {
  const [form, setForm] = useState({ userId: "", amount: "" });
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!form.userId || !form.amount) {
      toast({ title: "Please fill all fields" });
      return;
    }
    setDone(true);
  };
  return (
    <>
      <PageHeader title="Quick Pay" crumb="Quick Pay" />
      <section className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            {!done ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">Pay Your Bill</h2>
                    <p className="text-sm text-slate-500">Fast, secure and hassle-free.</p>
                  </div>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  <Input placeholder="Customer ID / Registered Phone" value={form.userId} onChange={(e)=>setForm({...form, userId: e.target.value})} className="h-12" />
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="number" placeholder="Amount" value={form.amount} onChange={(e)=>setForm({...form, amount: e.target.value})} className="h-12 pl-10" />
                  </div>
                  <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full h-12 btn-shine">
                    Proceed to Pay
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 size={56} className="text-green-600 mx-auto" />
                <h3 className="mt-4 text-2xl font-extrabold text-slate-900">Payment Successful!</h3>
                <p className="mt-2 text-slate-600">₹{form.amount} paid for customer {form.userId}.</p>
                <Button onClick={()=>{ setDone(false); setForm({userId:"", amount:""}); }} className="mt-6 bg-slate-900 hover:bg-black text-white rounded-full h-11 px-6">
                  Make Another Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickPay;
