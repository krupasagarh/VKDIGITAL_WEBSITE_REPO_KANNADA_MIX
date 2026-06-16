import { fetchSheetMatrix, sheetConfig } from "./planCatalogSheet";
import { hasWebsiteContent, parseWebsiteSheetMatrix } from "./websiteSheet";

export async function fetchWebsiteContentFromGoogleSheet() {
  const { websiteTab } = sheetConfig();
  const matrix = await fetchSheetMatrix(websiteTab);
  const website = parseWebsiteSheetMatrix(matrix);

  if (!hasWebsiteContent(website)) {
    throw new Error("Google Sheet Website tab is empty or missing content");
  }

  return { website, source: "google_sheets" };
}
