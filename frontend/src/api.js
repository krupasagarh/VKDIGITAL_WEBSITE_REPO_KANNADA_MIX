import axios from "axios";

function resolveApiBase() {
  const fromEnv = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    return window.location.origin.replace(/\/$/, "");
  }
  return "";
}

const base = resolveApiBase();

export function getApiBase() {
  return base;
}

export async function fetchPlanCatalog() {
  if (!base) return null;
  const { data } = await axios.get(`${base}/api/plans/catalog`, {
    timeout: 20000,
  });
  return data;
}

export async function postPlanLead(payload) {
  if (!base) return { ok: true, email_sent: false, skipped: true };
  const { data } = await axios.post(`${base}/api/leads/plan-request`, payload, {
    timeout: 20000,
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function postContactLead(payload) {
  if (!base) return { ok: true, email_sent: false, skipped: true };
  const { data } = await axios.post(`${base}/api/leads/contact`, payload, {
    timeout: 20000,
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function customerLogin(payload) {
  if (!base) throw new Error("API URL not configured");
  const { data } = await axios.post(`${base}/api/customer/login`, payload, {
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function fetchCustomerDashboard(token) {
  if (!base) throw new Error("API URL not configured");
  const { data } = await axios.get(`${base}/api/customer/dashboard`, {
    timeout: 240000,
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function fetchCustomerPortalStatus() {
  if (!base) return { enabled: false };
  const { data } = await axios.get(`${base}/api/customer/portal-status`, { timeout: 10000 });
  return data;
}
