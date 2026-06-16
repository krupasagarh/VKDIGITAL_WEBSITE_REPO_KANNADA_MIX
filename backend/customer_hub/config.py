"""Paths and flags for the unified customer portal."""

from __future__ import annotations

import os
from pathlib import Path

_BACKEND_DIR = Path(__file__).resolve().parents[1]
_REPO_ROOT = _BACKEND_DIR.parent
_DEFAULT_HUB_ROOT = _REPO_ROOT.parent


def hub_root() -> Path:
    raw = (os.getenv("VK_DIGITAL_HUB_ROOT") or "").strip()
    return Path(raw) if raw else _DEFAULT_HUB_ROOT


def customer_portal_enabled() -> bool:
    return (os.getenv("CUSTOMER_PORTAL_ENABLED") or "false").strip().lower() in {
        "1",
        "true",
        "yes",
    }


def jwt_secret() -> str:
    secret = (os.getenv("CUSTOMER_JWT_SECRET") or os.getenv("ADMIN_SECRET") or "").strip()
    if not secret:
        secret = "vk-customer-dev-secret-change-me"
    return secret


def jwt_ttl_hours() -> int:
    try:
        return max(1, min(int(os.getenv("CUSTOMER_JWT_TTL_HOURS", "24")), 168))
    except ValueError:
        return 24


def bix_archive_db_path() -> Path:
    raw = (os.getenv("BIX_ARCHIVE_DB") or "").strip()
    if raw:
        return Path(raw)
    return hub_root() / "bix42_export" / "vk_digital_history.db"


def operator_agent_path() -> Path:
    """Railtel, Hathway, and Mobize portal scripts for the VK Digital website."""
    return hub_root() / "railtel_debugger" / "vk_agent"


def railtel_agent_path() -> Path:
    return operator_agent_path()


def hathway_agent_path() -> Path:
    return operator_agent_path()
