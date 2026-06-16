# Unified Customer Portal

One login on the VK Digital website shows:

| Service | Source | Lookup key |
|---------|--------|------------|
| Internet | Railtel / Railwire portal | Customer mobile (10 digits) |
| Cable TV | Hathway portal | STB / VC id (`N…` or `T…`) |
| Billing history | Bix42 SQLite archive | Mobile / customer id |
| Billing (live) | Mobize / MobiCable | Mobile number |

## How it works

Customers sign in with **mobile number** (+ optional STB for cable TV).  
The **backend uses your operator portal credentials** (same as the Telegram bots) — customers never see LCO passwords.

## Enable locally

1. **Backend** `backend/.env`:
   ```
   CUSTOMER_PORTAL_ENABLED=true
   CUSTOMER_JWT_SECRET=your-long-secret
   VK_DIGITAL_HUB_ROOT=C:/Users/A1/Desktop/AI agent/vk_digital_hub
   ```
2. Portal credentials live in **`railtel_debugger/vk_agent/.env`** (and/or `vk_digital_hub/.env`):
   - `RAILWIRE_USER` / `RAILWIRE_PASS` — Railtel
   - `HATHWAY_USER` / `HATHWAY_PASS` — Hathway cable
   - `MOBIZE_USER` / `MOBIZE_PASS` — Mobize billing
3. Browsers run **headless** (no GUI) via `RAILTEL_HEADLESS=true`, `HATHWAY_HEADLESS=true`, `MOBIZE_HEADLESS=true` in `backend/.env`.
4. Ensure Bix42 DB exists: `vk_digital_hub/bix42_export/vk_digital_history.db`
4. Install Playwright + Tesseract on the backend machine (same as bot setup):
   ```
   pip install playwright python-dotenv Pillow pytesseract
   playwright install chromium
   ```
5. Start backend: `cd backend && python -m uvicorn server:app --port 8002`
6. Frontend `frontend/.env`: `REACT_APP_API_URL=http://127.0.0.1:8002`

## API

- `POST /api/customer/login` — `{ phone, stb_id?, password? }` → JWT
- `GET /api/customer/dashboard` — Bearer token → unified service cards
- `GET /api/customer/portal-status` — feature flag

## Mobize (Mobicable)

All portal scripts are loaded from **`railtel_debugger/vk_agent`** (`portal.py`, `hathway_portal.py`, `mobize_portal.py`).

Configured via `railtel_debugger/vk_agent/.env` or `backend/.env`:

```
MOBIZE_USER=...
MOBIZE_PASS=...
MOBIZE_LOGIN_URL=https://hathway.mobicable.in/index.php
```

Test:

```
cd railtel_debugger
py -3 vk_agent/mobize_portal.py 8088028242
```

## Security notes

- Add OTP/SMS verification before production customer login.
- Run portal lookups on a dedicated server (Playwright is heavy).
- Rate-limit `/api/customer/dashboard` per IP/phone.
