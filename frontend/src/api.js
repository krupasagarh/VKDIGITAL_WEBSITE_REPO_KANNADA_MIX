import axios from "axios";

const base = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export function getApiBase() {
  return base;
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
