# Website tab — Google Sheet content guide

Add a new tab named **`Website`** in the same spreadsheet as the **`Data`** tab (plan builder).

Import `docs/Website-sheet-template.csv` into that tab, or copy the rows manually.

**Term & welcome plans:** If your template is older, paste rows from `docs/Website-term-welcome-additions.csv` into the **Website** tab (below your existing rows).

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
| id (optional*) | title | icon | features (pipe-separated) | price | note | popular | link | cta | cycle | titleKn (optional) |

\*If column **B (id)** is left empty, the site auto-generates one from the title. Optional **titleKn** in column **L** shows Kannada under the card title on the homepage.

Icons: `Wifi`, `MonitorPlay`, `Tv`, `Briefcase`

### Section: `hero_slide`
Homepage hero slider.

| B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|
| id | title | titleKn | subtitle | subtitleKn | highlight | highlightKn | price | extra | extraKn | image URL |

**Kannada:** English goes in `title` / `subtitle` / `highlight` / `extra`; Kannada goes in `titleKn` / `subtitleKn` / `highlightKn` / `extraKn`. Empty Kannada cells fall back to bundled defaults. Swapped EN/Kn columns are auto-corrected.

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
- `welcome_plans_enabled` — Show Welcome Plans on Home Plans + Plan Builder (`yes` / `no`, default `no`)

Example: `setting | welcome_plans_enabled | yes` — turns on Welcome Plans sections.

**If column B (key) is left empty**, a lone `yes` or `no` in column C is treated as `welcome_plans_enabled`. You can also put the key in column C and the value in column D: `setting | | welcome_plans_enabled | yes`.

Plan data (`welcome_plan` rows) can stay in the sheet either way.

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

### Section: `term_offer`
Internet-only term promotions (used on Home Plans + Plan Builder **Term Plans** tab).

| B | C | D | E |
|---|---|---|---|
| id | total_months | free_months | label |

Examples:
- `term_offer | 1 | 6 | 1 | Buy 6 Months — 1 Month Free` (pay for 6 months, get 1 month free → 7 months service)
- `term_offer | 2 | 10 | 2 | Buy 10 Months — 2 Months Free` (pay for 10 months, get 2 months free → 12 months service)

Pricing uses monthly internet rates from the **Data** tab (columns A/B): **monthly price × total_months** (ex GST). GST (18%) is added automatically.

### Section: `term_plan`
Which internet speeds appear in term plans. Must match **Data** tab speed names (e.g. `50 MBPS`).

| B | C |
|---|---|
| id | speed |

If you omit all `term_plan` rows, every speed from the Data tab is used.

### Section: `welcome_plan`
Fixed welcome bundles (Home Plans cards + Plan Builder **Welcome Plans** tab).

| B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|
| id | name | speed | months | price (ex GST) | ott_count | ott_apps (pipe-separated) |

Examples:
- `welcome_plan | 1 | Welcome Plan 50 Mbps | 50 MBPS | 6 | 2399 | 10 | Zee5 Premium|Sony Liv Premium|…`
- `welcome_plan | 2 | Welcome Plan 100 Mbps (6 Months) | 100 MBPS | 6 | 2999 | 16 | ShemarooMe|ZEE5|…`

## Other tabs (unchanged)

| Tab | Used for |
|-----|----------|
| **Data** | Plan Builder — speeds (A/B), IPTV (D/E), OTT (G/H), OTT app lists (cols 9–11) |
| **Website** | All public plan cards, hero slider, homepage pricing, **term plans**, **welcome plans** |

## After editing the sheet
Reload the website, or use **Refresh prices** on the Plan Builder page.

Optional env vars:

```
REACT_APP_GOOGLE_SHEETS_ID=your_sheet_id
REACT_APP_GOOGLE_SHEETS_TAB=Data
REACT_APP_GOOGLE_SHEETS_WEBSITE_TAB=Website
```
