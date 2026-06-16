"""Load vk_agent modules without cross-importing Hathway vs Railtel multi_credentials."""

from __future__ import annotations

import sys
import threading
import traceback
from contextlib import contextmanager
from pathlib import Path
from typing import Callable, Iterator, TypeVar

T = TypeVar("T")

_AGENT_MODULES = (
    "multi_credentials",
    "portal",
    "hathway_portal",
    "mobize_portal",
    "bix_archive",
)

# Playwright + sys.path/sys.modules must not be touched concurrently across agents.
_global_agent_lock = threading.Lock()


def format_agent_error(exc: BaseException) -> str:
    detail = str(exc).strip()
    if not detail:
        detail = repr(exc)
    return f"{type(exc).__name__}: {detail}"


@contextmanager
def isolated_agent_import(agent_dir: Path) -> Iterator[Path]:
    """
    Pin sys.path + sys.modules so portal.py imports the correct multi_credentials.
    Holds a process-wide lock for the whole block (including Playwright work).
    """
    agent_dir = agent_dir.resolve()
    agent_str = str(agent_dir)
    with _global_agent_lock:
        saved_path = sys.path.copy()
        saved_modules = {
            name: sys.modules.pop(name) for name in _AGENT_MODULES if name in sys.modules
        }
        try:
            if agent_str in sys.path:
                sys.path.remove(agent_str)
            sys.path.insert(0, agent_str)
            yield agent_dir
        finally:
            for name in _AGENT_MODULES:
                sys.modules.pop(name, None)
            sys.modules.update(saved_modules)
            sys.path[:] = saved_path


def run_agent_task(agent_dir: Path, callback: Callable[[], T]) -> T:
    """Run callback while this agent's modules are isolated."""
    with isolated_agent_import(agent_dir):
        return callback()


def log_agent_trace(prefix: str, exc: BaseException) -> None:
    print(f"{prefix} {format_agent_error(exc)}", flush=True)
    traceback.print_exc()
