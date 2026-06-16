import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { fetchCustomerDashboard } from "../api";
import { Loader2, RefreshCw, Tv, Wifi, Receipt, Database } from "lucide-react";

function ServiceCard({ title, icon: Icon, data }) {
  const ok = data?.success;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-yellow-400/20 text-yellow-600 flex items-center justify-center">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className={`text-sm ${ok ? "text-green-700" : "text-amber-700"}`}>
            {ok ? "Connected" : data?.configured === false ? "Not configured" : "Needs attention"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-700">
        {!ok && data?.error && <p>{data.error}</p>}
        {ok && data.provider === "railtel" && (
          <>
            <p><strong>Status:</strong> {data.is_online ? "Online" : "Offline"}</p>
            <p><strong>User ID:</strong> {data.matched_cid || data.search_value}</p>
            <p><strong>MAC:</strong> {data.mac || "—"}</p>
            <p><strong>Expiry:</strong> {data.expiry || "—"}</p>
            {data.downtime && <p><strong>Details:</strong> {data.downtime}</p>}
          </>
        )}
        {ok && data.provider === "hathway" && (
          <>
            <p><strong>STB / VC:</strong> {data.matched_cid || data.search_value}</p>
            <p><strong>Status:</strong> {data.hathway_tv_status || (data.is_online ? "Active" : "Inactive")}</p>
            <p><strong>Plan:</strong> {data.hathway_plan_name || "—"}</p>
            <p><strong>Valid upto:</strong> {data.hathway_valid_upto || data.expiry || "—"}</p>
            {data.downtime && <p><strong>Customer:</strong> {data.downtime}</p>}
          </>
        )}
        {ok && data.provider === "bix42" && (
          <>
            {(data.customers || []).map((c) => (
              <div key={c.customer_id} className="rounded-xl bg-slate-50 p-3">
                <p><strong>{c.name}</strong> ({c.customer_id})</p>
                <p>Phone: {c.phone || "—"} · Status: {c.status || "—"}</p>
              </div>
            ))}
          </>
        )}
        {ok && data.provider === "mobize" && (
          <>
            {(data.customers || []).map((c) => (
              <div key={`${c.customer_id}-${c.mobile}`} className="rounded-xl bg-slate-50 p-3">
                <p><strong>{c.name}</strong> ({c.customer_id})</p>
                <p>Mobile: {c.mobile || "—"} · Status: {c.status || "—"}</p>
                <p>VC: {c.vc_number || "—"} · STB: {c.stb_number || "—"}</p>
                <p>Area: {c.area || "—"}</p>
                <p>Balance: ₹{c.balance || "0"} · Outstanding: ₹{c.outstanding || "0"}</p>
                {c.extra_stbs ? <p>Other STBs: {c.extra_stbs}</p> : null}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const Account = () => {
  const { isLoggedIn, phone, stbId, logout, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchCustomerDashboard(token);
      setDashboard(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Could not load your services");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const services = dashboard?.services || {};

  return (
    <>
      <PageHeader title="My Account" crumb="Account" />
      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Your VK Digital services</h2>
              <p className="mt-2 text-slate-600">
                Mobile: <strong>{phone}</strong>
                {stbId ? <> · STB/VC: <strong>{stbId}</strong></> : null}
              </p>
              {dashboard?.fetched_at && (
                <p className="text-xs text-slate-500 mt-1">Last updated: {new Date(dashboard.fetched_at).toLocaleString()}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={loadDashboard} disabled={loading} className="rounded-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
              <Button onClick={logout} className="rounded-full bg-slate-900 hover:bg-black text-white">
                Sign out
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !dashboard ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Fetching live status from Railtel, Hathway, Bix42, Mobize…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceCard title="Internet (Railtel)" icon={Wifi} data={services.internet_railtel} />
              <ServiceCard title="Cable TV (Hathway)" icon={Tv} data={services.cable_hathway} />
              <ServiceCard title="Billing (Bix42)" icon={Database} data={services.billing_bix42} />
              <ServiceCard title="Billing (Mobize)" icon={Receipt} data={services.billing_mobize} />
            </div>
          )}

          <p className="mt-8 text-sm text-slate-500">
            Need help? <Link to="/contact" className="text-yellow-700 font-semibold hover:underline">Contact support</Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Account;
