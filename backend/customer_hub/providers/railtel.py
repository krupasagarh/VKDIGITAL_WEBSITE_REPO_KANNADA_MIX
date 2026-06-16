"""Railtel (Railwire) internet lookup via operator portal."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from ..agent_import import format_agent_error, isolated_agent_import, log_agent_trace
from ..config import railtel_agent_path
from ..portal_runner import maybe_run_portal_lookup


def _ka_ids_from_bix42(bix42_payload: Optional[Dict[str, Any]]) -> List[str]:
    if not bix42_payload or not bix42_payload.get("success"):
        return []
    blob_parts: List[str] = []
    for customer in bix42_payload.get("customers") or []:
        blob_parts.extend(
            [
                str(customer.get("customer_id") or ""),
                str(customer.get("name") or ""),
            ]
        )
        for entry in customer.get("recent_entries") or []:
            blob_parts.append(str(entry.get("bill_name") or ""))
    blob = " ".join(blob_parts)
    found = []
    for match in re.finditer(r"ka\.[a-z0-9_.\-]+", blob, re.I):
        val = match.group(0).strip()
        if val.lower().startswith("ka.") and val not in found:
            found.append(val)
    return found


def _lookup_railtel_inprocess(
    phone: str,
    account_id: str | None,
    bix42_payload: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    agent_path = railtel_agent_path()
    with isolated_agent_import(agent_path):
        try:
            from portal import check_railtel_portal  # type: ignore
        except Exception as exc:
            log_agent_trace("[railtel] import failed:", exc)
            return {
                "success": False,
                "provider": "railtel",
                "error": f"Railtel import failed — {format_agent_error(exc)}",
                "configured": False,
            }

        extra = _ka_ids_from_bix42(bix42_payload)
        audit = check_railtel_portal(phone, account_id=account_id, extra_candidates=extra)
        audit["provider"] = "railtel"
        audit["configured"] = True
        return audit


def lookup_railtel(
    phone: str,
    account_id: str | None = None,
    *,
    bix42_payload: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    agent_path = railtel_agent_path()
    if not agent_path.is_dir():
        return {
            "success": False,
            "provider": "railtel",
            "error": f"Railtel agent not found at {agent_path}",
            "configured": False,
        }

    try:
        result = maybe_run_portal_lookup(
            agent_path,
            import_module="portal",
            call_name="check_railtel_portal",
            args=[phone],
            kwargs={
                "account_id": account_id,
                "extra_candidates": _ka_ids_from_bix42(bix42_payload),
            },
            inprocess=lambda: _lookup_railtel_inprocess(phone, account_id, bix42_payload),
            timeout_sec=300,
        )
        result["provider"] = "railtel"
        result.setdefault("configured", True)
        return result
    except Exception as exc:
        log_agent_trace("[railtel] lookup failed:", exc)
        return {
            "success": False,
            "provider": "railtel",
            "error": f"Railtel lookup failed — {format_agent_error(exc)}",
            "configured": True,
        }
