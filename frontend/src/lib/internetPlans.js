/** Helpers to map Google Sheet Data tab columns A (speed) & B (price) onto site UI. */

export function parseSpeedMbps(name) {
  const match = String(name || "").match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export function formatSpeedLabel(name) {
  const mbps = parseSpeedMbps(name);
  return mbps ? `${mbps} Mbps` : String(name || "");
}

export function findSpeedByMbps(speeds, mbps) {
  return speeds.find((s) => parseSpeedMbps(s.name) === mbps);
}

export function getLowestSpeedEntry(speeds) {
  if (!speeds?.length) return null;
  return speeds.reduce((min, s) => (s.price < min.price ? s : min), speeds[0]);
}

export function getLowestSpeedPrice(speeds) {
  return getLowestSpeedEntry(speeds)?.price ?? null;
}

export function getHighestSpeedLabel(speeds) {
  if (!speeds?.length) return "500+ Mbps";
  const top = speeds.reduce((max, s) => {
    const n = parseSpeedMbps(s.name) ?? 0;
    const maxN = parseSpeedMbps(max.name) ?? 0;
    return n > maxN ? s : max;
  }, speeds[0]);
  const mbps = parseSpeedMbps(top.name);
  return mbps ? `${mbps}+ Mbps` : formatSpeedLabel(top.name);
}

export function formatRupee(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "₹0";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function buildHomePlansFromSpeeds(speeds, templates = []) {
  if (!speeds?.length) return templates;

  const templateByMbps = new Map(templates.map((t) => [parseSpeedMbps(t.speed), t]));

  return speeds.map((s, i) => {
    const mbps = parseSpeedMbps(s.name);
    const tpl = templateByMbps.get(mbps);
    return {
      id: tpl?.id ?? i + 1,
      speed: formatSpeedLabel(s.name),
      price: s.price,
      validity: tpl?.validity ?? "1 Month",
      data: tpl?.data ?? "Unlimited",
      ott: tpl?.ott ?? false,
      iptv: tpl?.iptv ?? false,
    };
  });
}

export function buildBusinessPlansFromSpeeds(speeds, templates = []) {
  if (!speeds?.length) return templates;

  return templates.map((t) => {
    const fromSheet = findSpeedByMbps(speeds, parseSpeedMbps(t.speed));
    if (!fromSheet) return t;
    return {
      ...t,
      speed: formatSpeedLabel(fromSheet.name),
      price: fromSheet.price,
    };
  });
}

function replaceUpToSpeedFeature(features, mbps) {
  if (!mbps) return features;
  return features.map((f) =>
    /^Up to \d+\s*Mbps$/i.test(f) ? `Up to ${mbps}Mbps` : f
  );
}

export function applyHomepagePlansFromSpeeds(plans, speeds) {
  if (!speeds?.length) return plans;

  const lowest = getLowestSpeedEntry(speeds);
  const speed100 = findSpeedByMbps(speeds, 100);

  return plans.map((p) => {
    const next = { ...p, features: [...p.features] };

    if (p.id === "internet" && lowest) {
      next.price = formatRupee(lowest.price);
      next.features = replaceUpToSpeedFeature(next.features, parseSpeedMbps(lowest.name));
    } else if ((p.id === "internet-ott" || p.id === "internet-ott-iptv") && lowest) {
      next.features = replaceUpToSpeedFeature(next.features, parseSpeedMbps(lowest.name));
    } else if (p.id === "business" && speed100) {
      next.price = formatRupee(speed100.price);
      next.features = replaceUpToSpeedFeature(next.features, parseSpeedMbps(speed100.name));
    }

    return next;
  });
}

export function applyHeroSlidesFromSpeeds(slides, speeds) {
  if (!speeds?.length) return slides;

  const lowest = getLowestSpeedEntry(speeds);
  const s20 = findSpeedByMbps(speeds, 20);
  const s50 = findSpeedByMbps(speeds, 50);
  const s100 = findSpeedByMbps(speeds, 100);

  return slides.map((slide) => {
    const next = { ...slide };

    if (slide.id === 1 && s20) {
      const label = formatSpeedLabel(s20.name).toUpperCase();
      next.extra = slide.extra.replace(/\d+\s*MBPS/i, label);
      if (slide.extraKn) {
        next.extraKn = slide.extraKn.replace(/\d+\s*MBPS/i, label);
      }
    }

    if (slide.id === 2 && s50) {
      next.price = `${formatSpeedLabel(s50.name)} @ ${formatRupee(s50.price)}/-`;
    }

    if (slide.id === 3 && s100) {
      next.price = `${formatSpeedLabel(s100.name)} @ ${formatRupee(s100.price)}/-`;
    }

    if ((slide.id === 4 || slide.id === 6) && lowest) {
      next.price = `Starts @ ${formatRupee(lowest.price)}/-`;
    }

    return next;
  });
}
