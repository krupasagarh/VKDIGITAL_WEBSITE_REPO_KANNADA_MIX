"""Run Playwright portal lookups in a fresh process (avoids Windows asyncio errors)."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Callable, Dict, Optional

from dotenv import dotenv_values

from .config import operator_agent_path

_BACKEND_DIR = Path(__file__).resolve().parents[1]
_RUNNER = Path(__file__).resolve().parent / "scripts" / "portal_lookup_runner.py"

# Bot-only multi-LCO config (hathway_agent access map / accounts JSON) must not leak in.
_STRIP_FROM_PORTAL_ENV = (
    "HATHWAY_ACCOUNTS_FILE",
    "RAILWIRE_ACCOUNTS_FILE",
    "HATHWAY_OPERATOR_ACCESS_MAP_FILE",
    "HATHWAY_DEFAULT_ACCOUNT_ID",
    "RAILTEL_DEFAULT_ACCOUNT_ID",
)


def _should_use_subprocess() -> bool:
    if (os.getenv("CUSTOMER_PORTAL_SUBPROCESS") or "true").strip().lower() in {"0", "false", "no"}:
        return False
    return sys.platform == "win32"


def _portal_subprocess_env(agent_dir: Path) -> dict[str, str]:
    """
    Build env for portal child processes.

    Credentials come from railtel_debugger/vk_agent/.env (+ backend/.env for hub paths).
    Multi-LCO hathway_agent JSON maps are explicitly stripped.
    """
    env = {k: v for k, v in os.environ.items() if v is not None}

    for path in (_BACKEND_DIR / ".env", agent_dir / ".env"):
        if path.is_file():
            for key, value in dotenv_values(path).items():
                if value is not None:
                    env[key] = value

    for key in _STRIP_FROM_PORTAL_ENV:
        env.pop(key, None)

    env.setdefault("PYTHONIOENCODING", "utf-8")
    env.setdefault("RAILTEL_HEADLESS", "true")
    env.setdefault("HATHWAY_HEADLESS", "true")
    env.setdefault("MOBIZE_HEADLESS", "true")
    env.setdefault("HATHWAY_SLOW_MO", "0")

    hub_root = (env.get("VK_DIGITAL_HUB_ROOT") or "").strip()
    if not hub_root:
        env["VK_DIGITAL_HUB_ROOT"] = str(operator_agent_path().resolve().parents[1])

    return env


def run_portal_lookup(
    agent_dir: Path,
    *,
    import_module: str,
    call_name: str,
    args: list[Any] | None = None,
    kwargs: dict[str, Any] | None = None,
    timeout_sec: int = 300,
) -> Dict[str, Any]:
    """Invoke agent portal code in a child Python process; returns parsed JSON dict."""
    payload = {
        "agent_dir": str(agent_dir.resolve()),
        "import_module": import_module,
        "call_name": call_name,
        "args": args or [],
        "kwargs": kwargs or {},
    }
    env = _portal_subprocess_env(agent_dir)

    try:
        proc = subprocess.run(
            [sys.executable, str(_RUNNER)],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout_sec,
            env=env,
            cwd=str(agent_dir),
        )
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": f"{call_name} timed out after {timeout_sec}s",
            "configured": True,
        }
    except Exception as exc:
        return {
            "success": False,
            "error": f"Portal subprocess failed: {type(exc).__name__}: {exc}",
            "configured": True,
        }

    stdout = (proc.stdout or "").strip()
    stderr = (proc.stderr or "").strip()

    if proc.returncode != 0:
        detail = stderr or stdout or f"exit code {proc.returncode}"
        return {
            "success": False,
            "error": detail[:500],
            "configured": True,
        }

    if not stdout:
        return {
            "success": False,
            "error": stderr or "Portal subprocess returned no output",
            "configured": True,
        }

    try:
        return json.loads(stdout)
    except json.JSONDecodeError:
        return {
            "success": False,
            "error": f"Invalid portal JSON: {stdout[:200]}",
            "configured": True,
        }


def maybe_run_portal_lookup(
    agent_dir: Path,
    *,
    import_module: str,
    call_name: str,
    inprocess: Callable[[], Dict[str, Any]],
    args: list[Any] | None = None,
    kwargs: dict[str, Any] | None = None,
    timeout_sec: int = 300,
) -> Dict[str, Any]:
    if _should_use_subprocess():
        return run_portal_lookup(
            agent_dir,
            import_module=import_module,
            call_name=call_name,
            args=args,
            kwargs=kwargs,
            timeout_sec=timeout_sec,
        )
    return inprocess()
