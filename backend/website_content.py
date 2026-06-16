"""Load website display content from Google Sheet (Website tab)."""

from __future__ import annotations

import csv
import io
import logging
import os
import time
from typing import Any, Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

DEFAULT_SHEET_ID = "13rxiHFP9pTHyznLafZ3Ep4FK7Jz-D1lHf10wL10tYUI"
DEFAULT_WEBSITE_TAB = "Website"
CACHE_TTL_SECONDS = 60

_cache: Dict[str, Any] = {"website": None, "fetched_at": 0.0}


def _parse_price(raw: str) -> Optional[float]:
    if raw is None:
        return None
    text = str(raw).strip().replace("₹", "").replace(",", "")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def _parse_bool(raw: str) -> bool:
    value = str(raw or "").strip().lower()
    return value in {"yes", "true", "1", "y"}


def _split_features(raw: str) -> List[str]:
    return [part.strip() for part in str(raw or "").split("|") if part.strip()]


def _slugify_id(text: str) -> str:
    import re

    slug = str(text or "").lower().replace("+", " ")
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def _infer_setting_key(key: str, value: str) -> str:
    key = str(key or "").strip()
    value = str(value or "").strip()
    if key:
        return key
    if not value:
        return ""
    digits_only = value.replace(".", "").replace(",", "")
    if value.replace(".", "", 1).isdigit() or (digits_only.isdigit() and "." in value):
        if len(value.replace(".", "").replace(",", "")) >= 10:
            return ""
        return "subscribe_start_price"
    if "mbps" in value.lower():
        return "feature_top_speed"
    if "ott" in value.lower():
        return "ott_display_label"
    if any(token in value.lower() for token in ("live", "channel", "iptv")):
        return "iptv_display_label"
    return ""


PHONE_ROLE_ORDER = ["main", "helpdesk", "owner", "whatsapp"]
TECHNICIAN_NAME_FALLBACKS = ["Dilip", "Shivu"]


def _is_phone_number(raw: str) -> bool:
    return len(str(raw or "").replace(" ", "").replace("-", "").replace("+", "")) >= 10


def _parse_phone_row(row: List[str], phones: Dict[str, Any]) -> None:
    role = row[1].strip().lower() if len(row) > 1 else ""
    number = row[2].strip() if len(row) > 2 else ""
    display = row[3].strip() if len(row) > 3 else ""

    if not number and _is_phone_number(role):
        number = role
        role = ""
        display = row[2].strip() if len(row) > 2 else ""

    if not number or not _is_phone_number(number):
        return

    if not role:
        assigned = [r for r in PHONE_ROLE_ORDER if r not in phones]
        role = assigned[0] if assigned else "all"

    entry = {"number": number, "display": display or number}

    if role == "all":
        for phone_role in PHONE_ROLE_ORDER:
            phones[phone_role] = dict(entry)
        return

    phones[role] = entry


def _parse_technician_row(row: List[str], technicians: List[Dict[str, Any]]) -> None:
    name = row[1].strip() if len(row) > 1 else ""
    phone = row[2].strip() if len(row) > 2 else ""
    phone_display = row[3].strip() if len(row) > 3 else ""

    if not phone and _is_phone_number(name):
        phone = name
        name = ""
        phone_display = row[2].strip() if len(row) > 2 else ""

    if not phone or not _is_phone_number(phone):
        return

    if not name:
        name = (
            TECHNICIAN_NAME_FALLBACKS[len(technicians)]
            if len(technicians) < len(TECHNICIAN_NAME_FALLBACKS)
            else f"Technician {len(technicians) + 1}"
        )

    technicians.append(
        {
            "name": name,
            "phone": phone,
            "phoneDisplay": phone_display or phone,
        }
    )


def _parse_homepage_card_row(row: List[str], index: int) -> Optional[Dict[str, Any]]:
    card_id = row[1].strip() if len(row) > 1 else ""
    title = row[2].strip() if len(row) > 2 else ""
    if not title:
        return None
    if not card_id:
        features_text = row[4] if len(row) > 4 else ""
        import re

        speed_match = re.search(r"(\d+)\s*Mbps", str(features_text), re.IGNORECASE)
        suffix = f"-{speed_match.group(1)}" if speed_match else f"-{index + 1}"
        card_id = f"{_slugify_id(title)}{suffix}"
    return {
        "id": card_id,
        "title": title,
        "icon": row[3].strip() if len(row) > 3 and row[3].strip() else "Wifi",
        "features": _split_features(row[4]) if len(row) > 4 else [],
        "price": row[5].strip() if len(row) > 5 else "",
        "note": row[6].strip() if len(row) > 6 and row[6].strip() else "Starts From",
        "popular": _parse_bool(row[7]) if len(row) > 7 else False,
        "link": row[8].strip() if len(row) > 8 and row[8].strip() else "/home-plans",
        "cta": row[9].strip() if len(row) > 9 and row[9].strip() else "View Plans",
        "cycle": row[10].strip() if len(row) > 10 and row[10].strip() else "/ Month",
    }


def parse_website_sheet_csv(csv_text: str) -> Dict[str, Any]:
    rows = list(csv.reader(io.StringIO(csv_text)))
    result: Dict[str, Any] = {
        "homePlans": [],
        "businessPlans": [],
        "homepageCards": [],
        "heroSlides": [],
        "phones": {},
        "technicians": [],
        "settings": {},
    }
    if not rows:
        return result

    data_rows = rows[1:] if str(rows[0][0]).strip().lower() == "section" else rows

    for row in data_rows:
        if not row:
            continue
        section = str(row[0]).strip().lower()
        if not section:
            continue

        if section == "home_plan":
            speed = row[2].strip() if len(row) > 2 else ""
            price = _parse_price(row[3]) if len(row) > 3 else None
            if not speed or price is None:
                continue
            result["homePlans"].append(
                {
                    "id": int(row[1]) if len(row) > 1 and str(row[1]).strip().isdigit() else len(result["homePlans"]) + 1,
                    "speed": speed,
                    "price": price,
                    "validity": row[4].strip() if len(row) > 4 and row[4].strip() else "1 Month",
                    "data": row[5].strip() if len(row) > 5 and row[5].strip() else "Unlimited",
                    "ott": _parse_bool(row[6]) if len(row) > 6 else False,
                    "iptv": _parse_bool(row[7]) if len(row) > 7 else False,
                }
            )
        elif section == "business_plan":
            speed = row[2].strip() if len(row) > 2 else ""
            price = _parse_price(row[3]) if len(row) > 3 else None
            if not speed or price is None:
                continue
            result["businessPlans"].append(
                {
                    "id": int(row[1]) if len(row) > 1 and str(row[1]).strip().isdigit() else len(result["businessPlans"]) + 1,
                    "speed": speed,
                    "price": price,
                    "validity": row[4].strip() if len(row) > 4 and row[4].strip() else "1 Month",
                    "data": row[5].strip() if len(row) > 5 and row[5].strip() else "Unlimited",
                    "staticIp": _parse_bool(row[6]) if len(row) > 6 else True,
                    "gst": _parse_bool(row[7]) if len(row) > 7 else True,
                }
            )
        elif section == "homepage_card":
            card = _parse_homepage_card_row(row, len(result["homepageCards"]))
            if card:
                result["homepageCards"].append(card)
        elif section == "phone":
            _parse_phone_row(row, result["phones"])
        elif section == "technician":
            _parse_technician_row(row, result["technicians"])
        elif section == "hero_slide":
            title = row[2].strip() if len(row) > 2 else ""
            if not title:
                continue
            slide_id = int(row[1]) if len(row) > 1 and str(row[1]).strip().isdigit() else len(result["heroSlides"]) + 1
            result["heroSlides"].append(
                {
                    "id": slide_id,
                    "title": title,
                    "titleKn": row[3].strip() if len(row) > 3 else "",
                    "subtitle": row[4].strip() if len(row) > 4 else "",
                    "subtitleKn": row[5].strip() if len(row) > 5 else "",
                    "highlight": row[6].strip() if len(row) > 6 else "",
                    "highlightKn": row[7].strip() if len(row) > 7 else "",
                    "price": row[8].strip() if len(row) > 8 else "",
                    "extra": row[9].strip() if len(row) > 9 else "",
                    "extraKn": row[10].strip() if len(row) > 10 else "",
                    "image": row[11].strip() if len(row) > 11 else "",
                }
            )
        elif section == "setting":
            key = row[1].strip() if len(row) > 1 else ""
            value = row[2].strip() if len(row) > 2 else ""
            if not key and not value and len(row) > 3:
                value = row[3].strip()
            key = _infer_setting_key(key, value)
            if key:
                result["settings"][key] = value

    result["heroSlides"].sort(key=lambda slide: slide["id"])
    return result


def _fetch_sheet_csv(sheet_id: str, sheet_tab: str) -> str:
    url = (
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq"
        f"?tqx=out:csv&sheet={requests.utils.quote(sheet_tab)}"
    )
    response = requests.get(url, timeout=20)
    response.raise_for_status()
    return response.text


def has_website_content(website: Dict[str, Any]) -> bool:
    return bool(
        website.get("homePlans")
        or website.get("businessPlans")
        or website.get("homepageCards")
        or website.get("heroSlides")
        or website.get("phones")
        or website.get("technicians")
        or website.get("settings")
    )


def load_website_content(*, force_refresh: bool = False) -> Optional[Dict[str, Any]]:
    now = time.time()
    if (
        not force_refresh
        and _cache["website"] is not None
        and now - _cache["fetched_at"] < CACHE_TTL_SECONDS
    ):
        return _cache["website"]

    sheet_id = (os.environ.get("GOOGLE_SHEETS_ID") or DEFAULT_SHEET_ID).strip()
    sheet_tab = (os.environ.get("GOOGLE_SHEETS_WEBSITE_TAB") or DEFAULT_WEBSITE_TAB).strip()

    try:
        csv_text = _fetch_sheet_csv(sheet_id, sheet_tab)
        website = parse_website_sheet_csv(csv_text)
        if not has_website_content(website):
            logger.warning("Website tab loaded but contained no usable rows")
            return None
        _cache["website"] = website
        _cache["fetched_at"] = now
        logger.info("Website content loaded from Google Sheet %s (%s)", sheet_id, sheet_tab)
        return website
    except Exception:
        logger.exception("Failed to load website content from Google Sheets")
        return _cache["website"]
