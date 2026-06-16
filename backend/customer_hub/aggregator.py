"""Build unified customer dashboard from all providers."""

from __future__ import annotations

import asyncio
import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from .providers.bix42 import lookup_bix42
from .providers.hathway import guess_stb_from_bix42, lookup_hathway
from .providers.mobize import lookup_mobize
from .providers.railtel import lookup_railtel


def _public_audit(audit: Dict[str, Any]) -> Dict[str, Any]:
    """Trim operator-only fields before sending to the customer browser."""
    if not isinstance(audit, dict):
        return {"success": False, "error": "Invalid provider response"}
    allowed = {
        "success",
        "provider",
        "configured",
        "error",
        "search_value",
        "matched_cid",
        "is_online",
        "session_days",
        "downtime",
        "mac",
        "expiry",
        "hathway_tv_status",
        "hathway_plan_name",
        "hathway_valid_upto",
        "hathway_bot_lco_display",
        "customers",
        "count",
        "phone",
        "message",
        "customer_id",
        "name",
        "status",
        "mobile",
        "vc_number",
        "stb_number",
        "area",
        "balance",
        "outstanding",
        "extra_stbs",
    }
    return {k: v for k, v in audit.items() if k in allowed and v not in (None, "")}


async def build_customer_dashboard(
    phone: str,
    *,
    stb_id: Optional[str] = None,
    railtel_account_id: Optional[str] = None,
    hathway_account_id: Optional[str] = None,
) -> Dict[str, Any]:
    railtel_account_id = railtel_account_id or os.getenv("CUSTOMER_RAILTEL_ACCOUNT_ID")
    hathway_account_id = hathway_account_id or os.getenv("CUSTOMER_HATHWAY_ACCOUNT_ID")

    async def _bix42():
        return await asyncio.to_thread(lookup_bix42, phone)

    async def _mobize():
        return await asyncio.to_thread(lookup_mobize, phone)

    bix42_res, mobize_res = await asyncio.gather(_bix42(), _mobize())
    bix42_res = _public_audit(bix42_res)
    mobize_res = _public_audit(mobize_res)

    resolved_stb = (stb_id or "").strip().upper() or guess_stb_from_bix42(bix42_res)

    async def _hathway():
        if resolved_stb:
            return await asyncio.to_thread(lookup_hathway, resolved_stb, hathway_account_id)
        return {
            "success": False,
            "provider": "hathway",
            "configured": True,
            "error": "Add your STB / VC number on login to view cable TV status.",
        }

    async def _railtel():
        return await asyncio.to_thread(
            lookup_railtel,
            phone,
            railtel_account_id,
            bix42_payload=bix42_res,
        )

    hathway_task = asyncio.create_task(_hathway())
    try:
        railtel_res = await asyncio.wait_for(_railtel(), timeout=180)
    except asyncio.TimeoutError:
        railtel_res = {
            "success": False,
            "provider": "railtel",
            "configured": True,
            "error": "Railtel lookup timed out. Try again in a minute.",
        }
    railtel_res = _public_audit(railtel_res)

    hathway_res = _public_audit(await hathway_task)

    return {
        "ok": True,
        "phone": phone,
        "stb_id": resolved_stb,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "services": {
            "internet_railtel": railtel_res,
            "cable_hathway": hathway_res,
            "billing_bix42": bix42_res,
            "billing_mobize": mobize_res,
        },
    }
