"""Mobize / MobiCable billing lookup via operator portal."""

from __future__ import annotations

from typing import Any, Dict

from ..agent_import import format_agent_error, isolated_agent_import, log_agent_trace
from ..config import hathway_agent_path
from ..portal_runner import maybe_run_portal_lookup


def _lookup_mobize_inprocess(phone: str) -> Dict[str, Any]:
    agent_path = hathway_agent_path()
    with isolated_agent_import(agent_path):
        from mobize_portal import check_mobize_portal  # type: ignore

        audit = check_mobize_portal(phone)
        audit["provider"] = "mobize"
        audit["configured"] = audit.get("configured", True)
        return audit


def lookup_mobize(phone: str) -> Dict[str, Any]:
    agent_path = hathway_agent_path()
    if not agent_path.is_dir():
        return {
            "success": False,
            "provider": "mobize",
            "error": f"Mobize agent path not found at {agent_path}",
            "configured": False,
        }

    try:
        result = maybe_run_portal_lookup(
            agent_path,
            import_module="mobize_portal",
            call_name="check_mobize_portal",
            args=[phone],
            inprocess=lambda: _lookup_mobize_inprocess(phone),
            timeout_sec=180,
        )
        result["provider"] = "mobize"
        result.setdefault("configured", True)
        return result
    except Exception as exc:
        log_agent_trace("[mobize] lookup failed:", exc)
        return {
            "success": False,
            "provider": "mobize",
            "error": f"Mobize lookup failed — {format_agent_error(exc)}",
            "configured": False,
        }
