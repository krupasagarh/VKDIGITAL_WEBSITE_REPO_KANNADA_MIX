"""Hathway cable TV / STB lookup via operator portal."""

from __future__ import annotations

import re
from typing import Any, Dict, Optional

from ..agent_import import format_agent_error, isolated_agent_import, log_agent_trace
from ..config import hathway_agent_path
from ..portal_runner import maybe_run_portal_lookup


def looks_like_hathway_stb_id(text: str) -> bool:
    t = (text or "").strip().upper()
    return bool(re.fullmatch(r"N\d{11}", t) or re.fullmatch(r"T\d{12}", t))


def _lookup_hathway_inprocess(stb: str, account_id: str | None) -> Dict[str, Any]:
    agent_path = hathway_agent_path()
    with isolated_agent_import(agent_path):
        from hathway_portal import check_hathway_portal  # type: ignore

        audit = check_hathway_portal(stb, account_id=account_id)
        audit["provider"] = "hathway"
        audit["configured"] = True
        return audit


def lookup_hathway(stb_id: str, account_id: str | None = None) -> Dict[str, Any]:
    stb = (stb_id or "").strip().upper()
    if not looks_like_hathway_stb_id(stb):
        return {
            "success": False,
            "provider": "hathway",
            "configured": True,
            "error": "Valid Hathway STB / VC id required (N########### or T############)",
        }

    agent_path = hathway_agent_path()
    if not agent_path.is_dir():
        return {
            "success": False,
            "provider": "hathway",
            "error": f"Hathway agent not found at {agent_path}",
            "configured": False,
        }

    try:
        result = maybe_run_portal_lookup(
            agent_path,
            import_module="hathway_portal",
            call_name="check_hathway_portal",
            args=[stb],
            kwargs={"account_id": account_id},
            inprocess=lambda: _lookup_hathway_inprocess(stb, account_id),
            timeout_sec=300,
        )
        result["provider"] = "hathway"
        result.setdefault("configured", True)
        return result
    except Exception as exc:
        log_agent_trace("[hathway] lookup failed:", exc)
        return {
            "success": False,
            "provider": "hathway",
            "error": f"Hathway lookup failed — {format_agent_error(exc)}",
            "configured": False,
        }


def guess_stb_from_bix42(bix42_payload: Dict[str, Any]) -> Optional[str]:
    """Try to find an Hathway STB id inside Bix42 customer/history text."""
    if not bix42_payload.get("success"):
        return None
    blob_parts: list[str] = []
    for customer in bix42_payload.get("customers") or []:
        blob_parts.extend(
            [
                str(customer.get("customer_id") or ""),
                str(customer.get("name") or ""),
            ]
        )
        for entry in customer.get("recent_entries") or []:
            blob_parts.append(str(entry.get("bill_name") or ""))
    blob = " ".join(blob_parts).upper()
    for pattern in (r"N\d{11}", r"T\d{12}"):
        match = re.search(pattern, blob)
        if match:
            return match.group(0)
    return None
