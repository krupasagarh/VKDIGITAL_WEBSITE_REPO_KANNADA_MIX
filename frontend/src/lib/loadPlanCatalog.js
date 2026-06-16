import { fetchPlanCatalog } from "../api";
import { fetchPlanCatalogFromGoogleSheet } from "./planCatalogSheet";
import { fetchWebsiteContentFromGoogleSheet } from "./websiteSheetLoader";
import { getWebsiteFallback, resolveWebsiteContent } from "./websiteSheet";

/** Load Data + Website tabs from Google Sheet, then backend API, or bundled fallbacks. */
export async function loadRemotePlanCatalog() {
  let catalog = null;
  let website = null;
  let source = "bundled";

  try {
    const dataRes = await fetchPlanCatalogFromGoogleSheet();
    catalog = dataRes.catalog;
    source = dataRes.source;
  } catch (err) {
    console.warn("Direct Google Sheet Data tab load failed.", err);
  }

  try {
    const webRes = await fetchWebsiteContentFromGoogleSheet();
    website = webRes.website;
    if (source === "bundled") source = webRes.source;
  } catch (err) {
    console.warn("Direct Google Sheet Website tab load failed.", err);
  }

  if (!catalog || !website) {
    try {
      const apiRes = await fetchPlanCatalog();
      if (apiRes?.catalog && !catalog) catalog = apiRes.catalog;
      if (apiRes?.website && !website) website = apiRes.website;
      if (apiRes?.catalog || apiRes?.website) {
        source = apiRes.source || "api";
      }
    } catch (err) {
      console.warn("Plan catalog API unavailable.", err);
    }
  }

  if (!catalog && !website) return null;

  return {
    catalog,
    website: website || getWebsiteFallback(),
    source,
  };
}
