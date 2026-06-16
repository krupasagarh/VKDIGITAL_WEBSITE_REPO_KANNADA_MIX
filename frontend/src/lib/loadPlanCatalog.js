import { fetchPlanCatalog } from "../api";
import { fetchPlanCatalogFromGoogleSheet } from "./planCatalogSheet";

/** Load catalog from Google Sheet first, then backend API, or return null to use bundled JSON. */
export async function loadRemotePlanCatalog() {
  try {
    return await fetchPlanCatalogFromGoogleSheet();
  } catch (err) {
    console.warn("Direct Google Sheet load failed.", err);
  }

  try {
    const apiRes = await fetchPlanCatalog();
    if (apiRes?.catalog) {
      return { catalog: apiRes.catalog, source: apiRes.source || "api" };
    }
  } catch (err) {
    console.warn("Plan catalog API unavailable.", err);
  }

  return null;
}
