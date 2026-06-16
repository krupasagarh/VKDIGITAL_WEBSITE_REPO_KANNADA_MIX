# Website tab — Google Sheet content guide

Add a new tab named **`Website`** in the same spreadsheet as the **`Data`** tab (plan builder).

Import `docs/Website-sheet-template.csv` into that tab, or copy the rows manually.

## Sheet must be shared
**Anyone with the link → Viewer** so the website can read it without login.

## Column layout

| Column | Purpose |
|--------|---------|
| A | Section type (see below) |
| B | ID |
| C–L | Fields per section |

### Section: `home_plan`
Home Plans page cards.

| B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|
| id | speed | price | validity | data | ott (yes/no) | iptv (yes/no) |

### Section: `business_plan`
Business Plans page cards.

| B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|
| id | speed | price | validity | data | staticIp (yes/no) | gst (yes/no) |

### Section: `homepage_card`
Homepage “Find Perfect Network Solutions” cards.

| B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|
| id (optional*) | title | icon | features (pipe-separated) | price | note | popular | link | cta | cycle |

\*If column **B (id)** is left empty, the site auto-generates one from the title. Your feature text (column **E**, pipe-separated) is still read correctly — e.g. `Up to 50Mbps|16 OTT|Free Installation|Free WiFi router*`

Icons: `Wifi`, `MonitorPlay`, `Tv`, `Briefcase`

### Section: `hero_slide`
Homepage hero slider.

| B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|
| id | title | titleKn | subtitle | subtitleKn | highlight | highlightKn | price | extra | extraKn | image URL |

### Section: `setting`
Site-wide display values.

| B | C |
|---|---|
| key | value |

Keys used today:
- `subscribe_start_price` — Subscribe section “Starts From”
- `feature_top_speed` — Feature strip top speed label
- `ott_display_label` — Reference label for OTT (use in homepage_card features)
- `iptv_display_label` — Reference label for IPTV

### Section: `phone`
Phone numbers shown across the site (navbar, footer, contact, WhatsApp floater).

| B | C | D |
|---|---|---|
| role | number | display (optional) |

Roles:
- `main` — top navbar phone
- `helpdesk` — footer & contact helpdesk
- `owner` — footer & contact owner line
- `whatsapp` — WhatsApp floater button
- `all` — one row updates **all four** roles above

Example: `phone | helpdesk | 7259316656 | +91 72593 16656`

#### Option B — different numbers per place (recommended)

Fill **column B with the role** for each row. Column C = number, column D = how it should look on the site.

| A (Section) | B (role) | C (number) | D (display) | Shows on website |
|-------------|----------|------------|-------------|------------------|
| `phone` | `main` | `7259316656` | `+91 72593 16656` | Top navbar |
| `phone` | `helpdesk` | `7259316656` | `+91 72593 16656` | Footer, Contact page, CTA banner |
| `phone` | `owner` | `7259316656` | `+91 72593 16656` | Footer & Contact (Owner line) |
| `phone` | `whatsapp` | `7259316656` | `+91 72593 16656` | Green WhatsApp floater |

Change only the row you need — e.g. update `helpdesk` without changing `whatsapp`.

**If column B (role) is empty**, rows are assigned in order: `main` → `helpdesk` → `owner` → `whatsapp`.

**To change one number everywhere**, use a single row: `phone | all | 7259316656 | +91 72593 16656`

You can also use settings: `setting | helpdesk_phone | 7259316656` and `setting | helpdesk_phone_display | +91 72593 16656`

### Section: `technician`
Field technicians on the About page.

| B | C | D |
|---|---|---|
| name | phone | display (optional) |

Example: `technician | Dilip | 9008414666 | 9008414666`

## Other tabs (unchanged)

| Tab | Used for |
|-----|----------|
| **Data** | Plan Builder — speeds (A/B), IPTV (D/E), OTT (G/H), OTT app lists |
| **Website** | All public plan cards, hero slider, homepage pricing display |

## After editing the sheet
Reload the website, or use **Refresh prices** on the Plan Builder page.

Optional env vars:

```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SHEETS_TAB=Data
REACT_APP_GOOGLE_SHEETS_WEBSITE_TAB=Website
```
