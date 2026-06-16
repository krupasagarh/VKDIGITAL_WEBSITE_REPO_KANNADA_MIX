import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadRemotePlanCatalog } from "../lib/loadPlanCatalog";
import { formatRupee, getHighestSpeedLabel, getLowestSpeedPrice, applyHeroSlidesFromSpeeds } from "../lib/internetPlans";
import { buildContacts } from "../lib/contacts";
import { getWebsiteFallback, parsePrice, resolveWebsiteContent, isWelcomePlansEnabled } from "../lib/websiteSheet";
import { getPlanCatalog, setPlanCatalog } from "../lib/smartPlanEngine";

const PlanCatalogContext = createContext(null);

function settingsNumber(settings, key, fallback) {
  const parsed = parsePrice(settings?.[key]);
  return parsed ?? fallback;
}

export function PlanCatalogProvider({ children }) {
  const [catalog, setCatalogState] = useState(() => getPlanCatalog());
  const [website, setWebsiteState] = useState(() => getWebsiteFallback());
  const [catalogSource, setCatalogSource] = useState("bundled");
  const [catalogLoading, setCatalogLoading] = useState(true);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const remote = await loadRemotePlanCatalog();
      if (remote?.catalog) {
        setPlanCatalog(remote.catalog);
        setCatalogState(remote.catalog);
      }
      if (remote?.website) {
        setWebsiteState(remote.website);
      }
      if (remote?.source) {
        setCatalogSource(remote.source);
      }
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const speeds = catalog?.speeds || [];

  const value = useMemo(() => {
    const content = resolveWebsiteContent(website);
    const heroSlides = applyHeroSlidesFromSpeeds(content.heroSlides, speeds);
    const lowestFromPlans = content.homePlans.length
      ? content.homePlans.reduce(
          (min, p) => (p.price < min ? p.price : min),
          content.homePlans[0].price
        )
      : null;

    return {
      catalog,
      speeds,
      website: content,
      contacts: buildContacts(content),
      catalogSource,
      catalogLoading,
      refreshCatalog,
      homePlans: content.homePlans,
      businessPlans: content.businessPlans,
      homepagePlans: content.homepageCards,
      heroSlides,
      termOffers: content.termOffers || [],
      termPlanSpeeds: content.termPlanSpeeds || [],
      welcomePlans: content.welcomePlans || [],
      welcomePlansEnabled: isWelcomePlansEnabled(content.settings),
      lowestSpeedPrice: settingsNumber(
        content.settings,
        "subscribe_start_price",
        lowestFromPlans ?? getLowestSpeedPrice(speeds)
      ),
      highestSpeedLabel:
        content.settings?.feature_top_speed || getHighestSpeedLabel(speeds),
      formatRupee,
    };
  }, [catalog, speeds, website, catalogSource, catalogLoading, refreshCatalog]);

  return <PlanCatalogContext.Provider value={value}>{children}</PlanCatalogContext.Provider>;
}

export function usePlanCatalog() {
  const ctx = useContext(PlanCatalogContext);
  if (!ctx) {
    throw new Error("usePlanCatalog must be used within PlanCatalogProvider");
  }
  return ctx;
}
