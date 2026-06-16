"""Load plan builder catalog from a published Google Sheet (Data tab)."""

from __future__ import annotations

import csv
import io
import logging
import os
import time
from typing import Any, Dict, List, Optional, Tuple

import requests

logger = logging.getLogger(__name__)

DEFAULT_SHEET_ID = "13rxiHFP9pTHyznLafZ3Ep4FK7Jz-D1lHf10wL10tYUI"
DEFAULT_SHEET_TAB = "Data"
CACHE_TTL_SECONDS = 60

_cache: Dict[str, Any] = {"catalog": None, "fetched_at": 0.0, "source": "fallback"}


def _parse_price(raw: str) -> Optional[float]:
    if raw is None:
        return None
    text = str(raw).strip()
    if not text:
        return None
    text = text.replace("₹", "").replace(",", "").strip()
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def _row_pairs(rows: List[List[str]], name_col: int, price_col: int) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    seen = set()
    for row in rows[1:]:
        if len(row) <= max(name_col, price_col):
            continue
        name = (row[name_col] or "").strip()
        if not name or name in seen:
            continue
        price = _parse_price(row[price_col])
        if price is None:
            continue
        items.append({"name": name, "price": price})
        seen.add(name)
    return items


def _row_list(rows: List[List[str]], col: int) -> List[str]:
    items: List[str] = []
    seen = set()
    for row in rows[1:]:
        if len(row) <= col:
            continue
        value = (row[col] or "").strip()
        if not value or value in seen:
            continue
        items.append(value)
        seen.add(value)
    return items


def parse_data_sheet_csv(csv_text: str) -> Dict[str, Any]:
    rows = list(csv.reader(io.StringIO(csv_text)))
    if not rows:
        raise ValueError("Sheet is empty")

    return {
        "speeds": _row_pairs(rows, 0, 1),
        "iptvPlans": _row_pairs(rows, 3, 4),
        "ottPlans": _row_pairs(rows, 6, 7),
        "ottApps": {
            "10": _row_list(rows, 9),
            "16": _row_list(rows, 10),
            "26": _row_list(rows, 11),
        },
        "gstRate": float(os.environ.get("PLAN_GST_RATE", "0.18")),
        "installFee": float(os.environ.get("PLAN_INSTALL_FEE", "1000")),
        "freeInstallThreshold": float(os.environ.get("PLAN_FREE_INSTALL_THRESHOLD", "2500")),
    }


def _fetch_sheet_csv(sheet_id: str, sheet_tab: str) -> str:
    url = (
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq"
        f"?tqx=out:csv&sheet={requests.utils.quote(sheet_tab)}"
    )
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.text


def _validate_catalog(catalog: Dict[str, Any]) -> None:
    if not catalog.get("speeds"):
        raise ValueError("No internet speeds found in sheet")
    if not catalog.get("iptvPlans"):
        raise ValueError("No IPTV plans found in sheet")
    if not catalog.get("ottPlans"):
        raise ValueError("No OTT plans found in sheet")


def load_plan_catalog(*, force_refresh: bool = False) -> Tuple[Dict[str, Any], str]:
    now = time.time()
    if (
        not force_refresh
        and _cache["catalog"] is not None
        and now - _cache["fetched_at"] < CACHE_TTL_SECONDS
    ):
        return _cache["catalog"], _cache["source"]

    sheet_id = (os.environ.get("GOOGLE_SHEETS_ID") or DEFAULT_SHEET_ID).strip()
    sheet_tab = (os.environ.get("GOOGLE_SHEETS_DATA_TAB") or DEFAULT_SHEET_TAB).strip()

    try:
        csv_text = _fetch_sheet_csv(sheet_id, sheet_tab)
        catalog = parse_data_sheet_csv(csv_text)
        _validate_catalog(catalog)
        _cache["catalog"] = catalog
        _cache["fetched_at"] = now
        _cache["source"] = "google_sheets"
        logger.info("Plan catalog loaded from Google Sheet %s (%s)", sheet_id, sheet_tab)
        return catalog, "google_sheets"
    except Exception:
        logger.exception("Failed to load plan catalog from Google Sheets")
        if _cache["catalog"] is not None:
            return _cache["catalog"], "cache_stale"
        raise
