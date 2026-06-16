"""Child-process entry for Playwright portal lookups."""
from __future__ import annotations

import json
import sys
from pathlib import Path

# Ensure backend package imports work when spawned from uvicorn.
BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from customer_hub.agent_import import isolated_agent_import  # noqa: E402


def main() -> int:
    payload = json.load(sys.stdin)
    agent_dir = Path(payload["agent_dir"])
    module_name = payload["import_module"]
    call_name = payload["call_name"]
    args = payload.get("args") or []
    kwargs = payload.get("kwargs") or {}

    real_stdout = sys.stdout
    sys.stdout = sys.stderr
    try:
        with isolated_agent_import(agent_dir):
            mod = __import__(module_name)
            fn = getattr(mod, call_name)
            result = fn(*args, **kwargs)
    finally:
        sys.stdout = real_stdout

    real_stdout.write(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        sys.stderr.write(f"{type(exc).__name__}: {exc}")
        raise SystemExit(1)
