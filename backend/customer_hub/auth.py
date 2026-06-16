"""Simple JWT auth for customer dashboard sessions."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt

from .config import jwt_secret, jwt_ttl_hours


def normalize_phone(raw: str) -> str:
    digits = "".join(ch for ch in str(raw or "") if ch.isdigit())
    if len(digits) == 12 and digits.startswith("91"):
        return digits[2:]
    return digits


def validate_phone(raw: str) -> str:
    phone = normalize_phone(raw)
    if len(phone) != 10:
        raise ValueError("Enter a valid 10-digit mobile number")
    return phone


def create_customer_token(phone: str, stb_id: Optional[str] = None) -> str:
    now = datetime.now(timezone.utc)
    payload: Dict[str, Any] = {
        "sub": phone,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=jwt_ttl_hours())).timestamp()),
    }
    if stb_id:
        payload["stb_id"] = stb_id.strip().upper()
    return jwt.encode(payload, jwt_secret(), algorithm="HS256")


def decode_customer_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=["HS256"])
    except JWTError as exc:
        raise ValueError("Invalid or expired session") from exc
    phone = normalize_phone(str(payload.get("sub") or ""))
    if len(phone) != 10:
        raise ValueError("Invalid session")
    return {
        "phone": phone,
        "stb_id": (payload.get("stb_id") or "").strip().upper() or None,
    }
