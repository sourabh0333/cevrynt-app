# Cevrynt — rules for building the app

> **Work one step at a time.** Only do the single step, page or component the user asks for. When it's done, stop, explain briefly what you built and how to check it in the browser, then wait. Never start the next step, page or feature on your own, and never build "everything" in one go.

Cevrynt is an underwriting platform for merchant cash advance (MCA) funders. Underwriters receive deal packages from brokers, Cevrynt reads the bank statements, checks fraud, debt and policy, and the team decides, prices, funds and renews deals.

This repo turns the finished design into a real Next.js app. **The design is final. Match it exactly.**

## Where the design is

The design comes in two layers. Always use both.

- **Look: `/design/<Name>.html`** — one finished, static page per screen (for example `design/Main.html`). These are the source of truth for how every page looks: layout, spacing, colors, type, the rendered sidebar, and the entrance animations in their `<style>`. They have no scripts and no placeholders. Match them exactly.
- **Behavior: `/design/prototypes/<Name>.dc.html`** — the matching prototype for each screen (for example `design/prototypes/Main.dc.html`). Each is HTML markup with `{{holes}}` plus a `<script>` at the bottom (`class Component`) that fills the holes. That script is the **sample data and the interaction logic** for the page. Use it as the spec for what each element shows and how it reacts (tabs, filters, selection, toggles, localStorage keys). A few prototypes have an empty script and no holes; for those, the finished `.html` is the whole spec.
- Before building any page, read **both** files for that screen: the `.html` for the look, the `.dc.html` for the behavior and sample data. If the two disagree on how something looks, the finished `.html` wins.
- `design/prototypes/Sidebar.dc.html` is the shared navigation used by every internal page (collapse, drag, Ask Cevrynt popup). There is no separate `Sidebar.html`: the finished look of the sidebar is the one rendered inside every internal page, for example `design/Main.html`.
- Logos are in `/public/brand` (`cevrynt-logo-full-onlight.png` for the open sidebar, `cevrynt-mark-solid.png` for the collapsed sidebar and favicon). The finished `.html` pages embed the same logos as base64; always use the files in `/public/brand` instead.
- Both design folders are reference only. Do not copy their inline styles one by one. Rebuild them with our components and Tailwind tokens.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS.
- Charts: Recharts for line, area and bar charts. Plain CSS/SVG for small rings and progress bars.
- Start every page with typed sample data copied from the prototype's script in `design/prototypes/<Name>.dc.html` (`/lib/sample-data`). Real API calls come later and replace the sample data behind the same types.

## Design tokens (put these in Tailwind config once)

**Where they live:** `app/globals.css`, inside the `@theme` block. This project uses Tailwind v4, so there is no `tailwind.config` file; the `@theme` block in CSS is the config. The default Tailwind palette is removed, so only the Cevrynt colors below exist. Use these utilities instead of raw hex values or arbitrary classes.

Utilities created (use the same name with `bg-`, `text-`, `border-` for colors):
- Surfaces: `page` (warm grey), `panel` (white content panel), `card` (grey card on white), `card-deep` (#E6DFD0, the darker queue card on Home), `tile` (white tile on a card), `ring-track` (#ECE9E2 behind the decision rings). Example: `bg-page`, `bg-card`.
- Also `red-deep` (#6B2216) for small text on a red card, `amber-deep` (#8E4E08), `blue-deep` (#24588A), `card-stone` (#DDDAD3, the Stacking alerts tile) and `mint-edge` (#E3EFEA, border of the light mint gradient cards).
- Text: `ink`, `muted`, `hint`. Example: `text-ink`, `text-muted`.
- Brand: `teal`, `teal-dark`, `teal-deep`, `mint`, `mint-bg`, `mint-light`, `mint-border`. Example: `bg-teal text-white`, `bg-mint-bg text-teal-dark`.
- Status: `red`, `red-bg`, `red-text`; `amber`, `amber-bg`, `amber-text`; `blue`, `blue-bg`, `blue-text`; `purple`, `purple-bg`, `purple-text`; `grey-bg`, `grey-text`, `grey-dot` (neutral chips). Example: `bg-red-bg text-red-text`.
- Avatar fills: `sand` (#E8D9C1, with `sand-text` #3A2817), `cream` (#F2E7CF), `mint-soft` (#CFE6DD).
- `track` (#E8E4DB): the soft switch track behind Today / 7 days / 30 days.
- Borders: `line` (`#ECE8E0`), `line-strong` (`#E3DFD6`), `panel-border` (`#E7E3DB`, the content panel edge), `line-dashed` (`#C9C4B8`). Example: `border-line`.
- Shell: `hover` (`#F3F1EC`, sidebar item hover), `icon-soft` (`#8E9994`), `scrollbar` (`#D8D3C8`), `coral` / `coral-text` (alert count badges, coral at 20%), `line-soft` (`#DDD9CF`, dividers in the collapsed rail). Utilities `scrollbar-thin` (content panel) and `scrollbar-none` (hidden).
- Sidebar state: the `collapsed:` variant applies when `<html data-sidebar="collapsed">`. An inline script in `app/layout.tsx` sets it from localStorage `cevrynt-sidebar` before first paint (no flash); `components/shell/sidebar-state.ts` keeps the attribute, React state and localStorage in sync. The drag and double-click edge is an invisible 8px strip on the left edge of the content panel (`ResizeHandle`), not on the sidebar. The collapse eases width and padding over 300ms with `ease-sidebar`; icons stay put, only text fades.
- Ask Cevrynt (`components/shell/AskCevrynt.tsx`): the same boot script sets `<html data-ask="seen">` from localStorage `cevrynt-ask-seen`; the component renders nothing on the server and then either the first-visit popup or the floating button. It is positioned inside the content panel's wrapper (28px from the screen edges) so it never covers the sidebar. Entrance uses `anim-rise`.
- Fonts: `font-heading` (Bricolage Grotesque), `font-sans` (Instrument Sans, the body default), `font-mono` (IBM Plex Mono).
- Type sizes (each includes line height and letter spacing): `text-page-title` (30px), `text-card-title-lg` (20px), `text-card-title` (18px), `text-card-title-sm` (17px), `text-body` (14px), `text-body-sm` (13px), `text-label` (12px), `text-label-sm` (11px), `text-cap` (10.5px with 0.08em tracking, for uppercase captions and "View all" links; add `uppercase font-semibold`).
- Radii: `rounded-panel` (34px), `rounded-card-lg` (30px), `rounded-card` (24px), `rounded-tile-lg` (20px), `rounded-tile` (14px), `rounded-pill` (999px).
- Shadow: `shadow-float` (the floating panel shadow).
- Gradient: `bg-mint-card` (the mint card gradient; pair it with `border-mint-border`).
- Fonts are loaded with `next/font` in `app/layout.tsx` and exposed as `--font-bricolage`, `--font-instrument`, `--font-plex-mono`.

Colors
- Page background `#EEECE6` (warm grey). Content panel `#FFFFFF`.
- Card on white `#F5F3EF`. Tile on a card `#FFFFFF`.
- Ink `#0F1513`. Muted text `#4B524F`, hint text `#5F6662`.
- Teal (brand, main buttons) `#0E6B5C`. Dark teal text `#083E35` / `#0A5246`.
- Mint `#8FD9C3`, mint background `#DCF0E9`, light mint `#EAF5F1`.
- Mint card gradient: `linear-gradient(150deg, #D5ECE5 0%, #EAF5F1 55%, #F7FBF9 100%)` with border `#CDE6DE`.
- Red / risk `#C2412D` (background `#F6DED8`, text `#8E2B19`).
- Amber / warning `#D98A2B` (background `#F5E6CC`, text `#7A4206`).
- Blue / info `#4F86BD` (background `#DCE9F5`, text `#1F4C78`).
- Purple accent `#8670B8` (background `#EDE4F7`, text `#4B2F7A`).
- Borders `#ECE8E0` / `#E3DFD6`.

Fonts (Google Fonts)
- Headings and big numbers: **Bricolage Grotesque** 500/600/700, slight negative letter spacing.
- Body text: **Instrument Sans** 400/500/600.
- IDs, codes, times: **IBM Plex Mono** 400/500.
- Page titles about 30px. Card titles 17–20px. Body 13–14px. Small labels 11–12px. Minimum 11px anywhere.

Shape
- Content panel radius 34px. Cards 24–30px. Tiles 14–20px. Buttons and chips fully rounded (999px).
- Floating panel shadow: `0 24px 60px -32px rgba(15,21,19,.28)`.

## App layout

- The page itself never scrolls. The **sidebar is fixed** on the left; the **white content panel scrolls on its own** (thin grey scrollbar).
- Sidebar has three parts: top (logo, collapse button, workspace switcher) and bottom (What's coming, profile) never move; **only the middle list of pages scrolls, with a hidden scrollbar**.
- Sidebar collapses from 240px to a 76px icon rail (button, drag on its edge, or double-click the edge). Remember the choice (localStorage `cevrynt-sidebar`). Collapsed: icons only with tooltips, badges as small dots, logo becomes the CY mark.
- **Ask Cevrynt**: a popup at the bottom right on first visit only (remember `cevrynt-ask-seen`). After closing, a small teal "Ask Cevrynt" button stays at the bottom right.
- Settings pages have their own left menu that **sticks** while the settings content scrolls.

## Layout rules (important — these were fixed many times in the design)

1. Boxes side by side in a row **must line up in height**. No empty space under the shorter box.
2. When a list sits next to a detail panel, the **list box matches the panel's height and the list scrolls inside it**, with sticky column headings. The detail panel does not scroll.
3. **No horizontal scrolling in tables or lists.** Columns use flexible widths and long text ends with "…". Hide less important columns on narrow screens.
4. Rows of filter chips stay on one line and scroll sideways with a **hidden scrollbar**.
5. Never leave a row of 3 cards wrapping as 2 + 1. Use a fixed 3-column grid (stacking to 1 column on small screens) or a single panel split into columns.
6. Helper panels next to long forms (Live fit check, Policy simulator, memo Sections) are **sticky**.
7. Main action buttons are solid teal with white text. Never put a pale grey button on a mint card.
8. Avoid generic colored left-stripe cards.

## Motion

- Animate **only data visuals** (charts, rings, progress bars, dots), **once when the page opens**: bars grow from the left or bottom, rings sweep around, lines draw left to right, dots pop in, list rows stagger slightly.
- Approved exception: the "Next in your queue" hero dot on Home keeps the design's soft repeating pulse (`anim-hero-pulse`).
- **No hover effects** on cards, events or buttons (only the basic sidebar item highlight and link color).
- Respect `prefers-reduced-motion`: show the final state with no animation.

## What is live and what is "coming soon"

Live today: manual lead, single package upload, bulk ZIP upload, Merchant Link.
Coming soon (show as dashed "Coming soon" cards or a preview banner, never as working features): email forwarding, public application forms, CRM / LOS / API, broker portal, Reconciliation Desk, AI decision log, funding-call assistant, mobile approvals, peer benchmarks, cross-funder network.

## Sample data to keep consistent

- Workspace: Ridgeline Capital. Signed-in user: Maya Chen, Underwriter. Senior: Priya Shah. Funding: Sam Lee. Admin: Nina Ortiz.
- Main deal: Harbor Street Bakery LLC, APP-7H2K4Q, broker Apex Funding Partners (Dana Ruiz), owner Elena Brooks. Score 88, $61.4K/month true revenue, suggested $40,000 at factor 1.32 over 6 months, $419/day, 1 existing position (Kingsway), funding call Thursday 10:00.
- Portfolio: 86 active merchants, 94% paying on time, 9 renewals ready ($402K), $1.24M funded this month, 2.1% loss rate.
- Today: 23 submissions, 7 tasks for Maya, 3 stacking alerts, $24.1K of $28.4K collected.

## How to work

- **One step per request, then stop and wait for the user.**
- Build **one page or one component per task**. Read both design files first: `design/<Name>.html` for the look, `design/prototypes/<Name>.dc.html` for the behavior.
- Reuse shared components (see BUILD-PLAN.md) instead of writing one-off styles.
- Keep text exactly as in the design (plain, friendly wording).
- After each page, run the app and compare it with the finished `design/<Name>.html` page.
- Make a git commit at the end of every step the user approves, with a short message that names the step.
