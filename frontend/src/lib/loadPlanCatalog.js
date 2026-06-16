import { fetchPlanCatalog } from "../api";
import { fetchPlanCatalogFromGoogleSheet } from "./planCatalogSheet";

/** Load catalog from backend API, then Google Sheet JSONP, or return null to use bundled JSON. */
export async function loadRemotePlanCatalog() {
  try {
    const apiRes = await fetchPlanCatalog();
    if (apiRes?.catalog) {
      return { catalog: apiRes.catalog, source: apiRes.source || "api" };
    }
  } catch (err) {
    console.warn("Plan catalog API unavailable.", err);
  }

  try {
    return await fetchPlanCatalogFromGoogleSheet();
  } catch (err) {
    console.warn("Direct Google Sheet load failed.", err);
  }

  return null;
}
