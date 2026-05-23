from fastapi import FastAPI, APIRouter, Header, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import smtplib
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
from email.message import EmailMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# MongoDB connection (defaults so server can start for email-only use)
mongo_url = os.environ.get("MONGO_URL", "mongodb://127.0.0.1:27017")
db_name = os.environ.get("DB_NAME", "vk_digital")
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


async def _try_send_email(subject: str, body: str) -> bool:
    """Send email via SMTP if SMTP_HOST and credentials are set in .env."""
    host = (os.environ.get("SMTP_HOST") or "").strip()
    if not host:
        logger.info("SMTP_HOST not set — skipping outbound email")
        return False
    user = (os.environ.get("SMTP_USER") or "").strip()
    password = (os.environ.get("SMTP_PASSWORD") or "").strip()
    mail_from = (os.environ.get("MAIL_FROM") or user).strip()
    mail_to = (os.environ.get("MAIL_TO") or "vkdigitaltiptur@gmail.com").strip()
    port = int(os.environ.get("SMTP_PORT", "587"))
    if not user or not password:
        logger.warning("SMTP_USER or SMTP_PASSWORD missing — skip email")
        return False

    def _send() -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = mail_from
        msg["To"] = mail_to
        msg.set_content(body)
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.starttls()
            smtp.login(user, password)
            smtp.send_message(msg)

    try:
        await asyncio.to_thread(_send)
        logger.info("Lead email sent to %s", mail_to)
        return True
    except Exception:
        logger.exception("Failed to send lead email")
        return False


async def _try_save_lead(collection: str, doc: Dict[str, Any]) -> bool:
    """Store lead in MongoDB. Returns False if DB is down (email/WhatsApp flow still continues)."""
    try:
        # Mongo connection failures can take a long time (default server selection timeout),
        # which would delay the HTTP response and make the frontend think email failed.
        # Keep this short so email sending/response can proceed quickly.
        await asyncio.wait_for(db[collection].insert_one(doc), timeout=5)
        logger.info("Lead saved to %s id=%s", collection, doc.get("id", doc.get("at", "")))
        return True
    except asyncio.TimeoutError:
        logger.warning("MongoDB insert timeout for collection %s", collection)
        return False
    except Exception:
        logger.exception("MongoDB insert failed for collection %s", collection)
        return False


def _admin_ok(x_admin_secret: Optional[str]) -> None:
    secret = (os.environ.get("ADMIN_SECRET") or "").strip()
    if not secret or (x_admin_secret or "").strip() != secret:
        raise HTTPException(status_code=404, detail="Not found")


def _strip_object_ids(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for doc in items:
        d = dict(doc)
        if "_id" in d:
            d["_id"] = str(d["_id"])
        out.append(d)
    return out


def _format_plan_lead_email(p: "PlanLeadPayload") -> str:
    c = p.contact or {}
    lines = [
        f"Custom plan request — {p.id}",
        f"Time: {p.createdAt}",
        "",
        f"Type: {p.segment}",
        f"Speed: {p.speed}",
        f"OTT bundle: {'Yes' if p.ott else 'No'}",
        f"IPTV / Live TV: {'Yes' if p.iptv else 'No'}",
        f"Estimated monthly: ₹{p.estimatedMonthly}",
        "",
        "Price breakdown:",
    ]
    for row in p.breakdown:
        lines.append(f"  - {row.get('label', '')}: ₹{row.get('amount', '')}")
    lines += [
        "",
        "Contact:",
        f"  Name: {c.get('name', '')}",
        f"  Phone: {c.get('phone', '')}",
    ]
    if c.get("email"):
        lines.append(f"  Email: {c.get('email')}")
    if c.get("locality"):
        lines.append(f"  Area: {c.get('locality')}")
    if c.get("notes"):
        lines.append(f"  Notes: {c.get('notes')}")
    return "\n".join(lines)


def _format_contact_lead_email(p: "ContactLeadPayload") -> str:
    lines = [
        "Website enquiry",
        f"Submitted: {p.at}",
        "",
        f"Name: {p.name}",
        f"Phone: {p.phone}",
    ]
    if p.email:
        lines.append(f"Email: {p.email}")
    if p.address:
        lines.append(f"Address / locality: {p.address}")
    if p.message:
        lines.append(f"Message:\n{p.message}")
    return "\n".join(lines)


class PlanLeadPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    createdAt: str
    segment: str
    speed: str
    ott: bool
    iptv: bool
    estimatedMonthly: int
    breakdown: List[Dict[str, Any]]
    contact: Dict[str, Any]


class ContactLeadPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str
    phone: str
    email: str = ""
    address: str = ""
    message: str = ""
    at: str


@api_router.post("/leads/plan-request")
async def post_plan_request_lead(payload: PlanLeadPayload):
    doc = payload.model_dump()
    doc["receivedAt"] = datetime.now(timezone.utc).isoformat()
    saved = await _try_save_lead("plan_requests", doc)
    subject = f"VK Digital — Custom plan request ({payload.id})"
    body = _format_plan_lead_email(payload)
    sent = await _try_send_email(subject, body)
    return {"ok": True, "email_sent": sent, "saved_to_db": saved}


@api_router.post("/leads/contact")
async def post_contact_lead(payload: ContactLeadPayload):
    doc = payload.model_dump()
    doc["receivedAt"] = datetime.now(timezone.utc).isoformat()
    saved = await _try_save_lead("contact_requests", doc)
    subject = f"VK Digital — Website enquiry from {payload.name}"
    body = _format_contact_lead_email(payload)
    sent = await _try_send_email(subject, body)
    return {"ok": True, "email_sent": sent, "saved_to_db": saved}


@api_router.get("/admin/leads/plan-requests")
async def admin_list_plan_requests(
    x_admin_secret: Optional[str] = Header(default=None),
    limit: int = 50,
):
    _admin_ok(x_admin_secret)
    cap = min(max(limit, 1), 200)
    cur = db.plan_requests.find({}).sort("receivedAt", -1).limit(cap)
    items = await cur.to_list(cap)
    return {"items": _strip_object_ids(items)}


@api_router.get("/admin/leads/contact-requests")
async def admin_list_contact_requests(
    x_admin_secret: Optional[str] = Header(default=None),
    limit: int = 50,
):
    _admin_ok(x_admin_secret)
    cap = min(max(limit, 1), 200)
    cur = db.contact_requests.find({}).sort("receivedAt", -1).limit(cap)
    items = await cur.to_list(cap)
    return {"items": _strip_object_ids(items)}


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# CORS first, then routes (avoids preflight issues on some setups)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()