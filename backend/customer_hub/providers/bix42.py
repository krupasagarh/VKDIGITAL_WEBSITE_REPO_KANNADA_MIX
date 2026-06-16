"""Offline Bix42 SQLite customer lookup."""

from __future__ import annotations

import sqlite3
from typing import Any, Dict, List

from ..agent_import import isolated_agent_import
from ..config import bix_archive_db_path, railtel_agent_path


def lookup_bix42(phone: str, limit: int = 5) -> Dict[str, Any]:
    db_path = bix_archive_db_path()
    if not db_path.is_file():
        return {
            "success": False,
            "provider": "bix42",
            "error": f"Bix42 archive not found at {db_path}",
            "configured": False,
        }

    agent_path = railtel_agent_path()
    try:
        with isolated_agent_import(agent_path):
            from bix_archive import fetch_history, find_customers  # type: ignore
    except Exception as exc:
        return {
            "success": False,
            "provider": "bix42",
            "error": f"Bix42 module unavailable: {exc}",
            "configured": False,
        }

    try:
        conn = sqlite3.connect(str(db_path))
        try:
            rows = find_customers(conn, phone, bix_customer_id=None, limit_candidates=limit)
            customers: List[Dict[str, Any]] = []
            for row in rows:
                item = {
                    "customer_id": row["customer_id"],
                    "name": row["customer_name"],
                    "phone": row["phone"],
                    "status": row["status"],
                }
                try:
                    history = fetch_history(conn, row["customer_id"], "9999-12-31")
                    item["recent_entries"] = [
                        {
                            "date": h["date"],
                            "bill_name": h["bill_name"],
                            "amount": h["txn_amount"],
                            "balance": h["balance"],
                        }
                        for h in history[-5:]
                    ]
                except Exception:
                    item["recent_entries"] = []
                customers.append(item)
        finally:
            conn.close()

        return {
            "success": True,
            "provider": "bix42",
            "configured": True,
            "customers": customers,
            "count": len(customers),
        }
    except Exception as exc:
        return {
            "success": False,
            "provider": "bix42",
            "configured": True,
            "error": str(exc),
        }
