const DEFAULT_SHEET_ID = "13rxiHFP9pTHyznLafZ3Ep4FK7Jz-D1lHf10wL10tYUI";
const DEFAULT_SHEET_TAB = "Data";

function sheetConfig() {
  return {
    sheetId: (process.env.REACT_APP_GOOGLE_SHEETS_ID || DEFAULT_SHEET_ID).trim(),
    sheetTab: (process.env.REACT_APP_GOOGLE_SHEETS_TAB || DEFAULT_SHEET_TAB).trim(),
  };
}

function cellValue(cell) {
  if (!cell) return "";
  if (cell.v !== undefined && cell.v !== null) return String(cell.v);
  if (cell.f !== undefined && cell.f !== null) return String(cell.f);
  return "";
}

function gvizRowsToMatrix(response) {
  const rows = response?.table?.rows || [];
  return rows.map((row) => (row.c || []).map(cellValue));
}

function parsePrice(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/₹/g, "")
    .replace(/,/g, "");
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function rowPairs(matrix, nameCol, priceCol) {
  const items = [];
  const seen = new Set();
  for (const row of matrix.slice(1)) {
    const name = (row[nameCol] || "").trim();
    if (!name || seen.has(name)) continue;
    const price = parsePrice(row[priceCol]);
    if (price === null) continue;
    items.push({ name, price });
    seen.add(name);
  }
  return items;
}

function rowList(matrix, col) {
  const items = [];
  const seen = new Set();
  for (const row of matrix.slice(1)) {
    const value = (row[col] || "").trim();
    if (!value || seen.has(value)) continue;
    items.push(value);
    seen.add(value);
  }
  return items;
}

export function parseDataSheetMatrix(matrix) {
  return {
    speeds: rowPairs(matrix, 0, 1),
    iptvPlans: rowPairs(matrix, 3, 4),
    ottPlans: rowPairs(matrix, 6, 7),
    ottApps: {
      10: rowList(matrix, 9),
      16: rowList(matrix, 10),
      26: rowList(matrix, 11),
    },
    gstRate: 0.18,
    installFee: 1000,
    freeInstallThreshold: 2500,
  };
}

function loadGvizSheetJsonp(sheetId, sheetTab) {
  return new Promise((resolve, reject) => {
    const callbackName = `vkSheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    window[callbackName] = (response) => {
      cleanup();
      if (!response?.table) {
        reject(new Error("Google Sheet response missing table data"));
        return;
      }
      resolve(response);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Failed to load Google Sheet"));
    };

    const params = new URLSearchParams({
      tqx: `responseHandler:${callbackName}`,
      sheet: sheetTab,
      _: String(Date.now()),
    });
    script.src = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${params.toString()}`;
    document.head.appendChild(script);
  });
}

export async function fetchPlanCatalogFromGoogleSheet() {
  const { sheetId, sheetTab } = sheetConfig();
  const response = await loadGvizSheetJsonp(sheetId, sheetTab);
  const matrix = gvizRowsToMatrix(response);
  const catalog = parseDataSheetMatrix(matrix);

  if (!catalog.speeds.length || !catalog.iptvPlans.length || !catalog.ottPlans.length) {
    throw new Error("Google Sheet Data tab is missing required plan rows");
  }

  return { catalog, source: "google_sheets" };
}
