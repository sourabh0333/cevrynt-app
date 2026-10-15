# Build plan — copy these requests into Claude Code one at a time

End every request with: **"Only do this step, then stop and wait for me."**

Check each step in the browser before moving to the next one. If something doesn't match the design, tell Claude Code what is different and point to the finished page in `design/`.

## Design files

Every screen has two files. Claude Code reads both before building it:

- **Look** — `design/<Name>.html`: the finished static page. Match it exactly.
- **Behavior** — `design/prototypes/<Name>.dc.html`: the prototype with sample data and interactions in its script.

The sidebar only has a prototype (`design/prototypes/Sidebar.dc.html`); its finished look is the sidebar rendered inside every internal page, for example `design/Main.html`.

## Page map

| Look (`design/`) | Behavior (`design/prototypes/`) | Route |
|---|---|---|
| sidebar inside any internal page, e.g. Main.html | Sidebar.dc.html | shared app shell |
| Main.html | Main.dc.html | `/` (Home) |
| Tasks.html | Tasks.dc.html | `/tasks` |
| Intake.html | Intake.dc.html | `/intake` |
| Intake-Manual.html | Intake-Manual.dc.html | `/intake/manual` |
| Intake-Single.html | Intake-Single.dc.html | `/intake/package` |
| Intake-Bulk.html | Intake-Bulk.dc.html | `/intake/bulk` |
| Submissions.html | Submissions.dc.html | `/submissions` |
| Deal-Summary.html | Deal-Summary.dc.html | `/deals/[id]` |
| Deal-CashFlow.html | Deal-CashFlow.dc.html | `/deals/[id]/cash-flow` |
| Deal-Positions.html | Deal-Positions.dc.html | `/deals/[id]/positions` |
| Deal-Integrity.html | Deal-Integrity.dc.html | `/deals/[id]/integrity` |
| Deal-Business.html | Deal-Business.dc.html | `/deals/[id]/business` |
| Deal-Conditions.html | Deal-Conditions.dc.html | `/deals/[id]/conditions` |
| Deal-Offer.html | Deal-Offer.dc.html | `/deals/[id]/offer` |
| Deal-Decision.html | Deal-Decision.dc.html | `/deals/[id]/decision` |
| Deal-Activity.html | Deal-Activity.dc.html | `/deals/[id]/activity` |
| Offers.html | Offers.dc.html | `/offers` |
| Merchants.html | Merchants.dc.html | `/merchants` |
| Funded.html | Funded.dc.html | `/funded` |
| Renewals.html | Renewals.dc.html | `/renewals` |
| Stacking.html | Stacking.dc.html | `/stacking` |
| Brokers.html | Brokers.dc.html | `/brokers` |
| Reports.html | Reports.dc.html | `/reports` |
| Settings.html | Settings.dc.html | `/settings/policy` |
| Settings-Pricing.html | Settings-Pricing.dc.html | `/settings/pricing` |
| Settings-Intake.html | Settings-Intake.dc.html | `/settings/intake` |
| Settings-Renewals.html | Settings-Renewals.dc.html | `/settings/renewals` |
| Settings-Team.html | Settings-Team.dc.html | `/settings/team` |
| Settings-Workspace.html | Settings-Workspace.dc.html | `/settings/workspace` |
| Settings-Plan.html | Settings-Plan.dc.html | `/settings/plan` |
| Settings-Security.html | Settings-Security.dc.html | `/settings/security` |
| Settings-Audit.html | Settings-Audit.dc.html | `/settings/audit` |
| Coming.html | Coming.dc.html | `/whats-coming` |
| Merchant-Link.html | Merchant-Link.dc.html | `/m/[token]` (public, merchant-facing, funder branding) |
| Apply-Form.html | Apply-Form.dc.html | `/apply` (public, "coming soon" preview) |

## Step 1 — Foundation

1. `Read CLAUDE.md. Set up a Next.js App Router project with TypeScript and Tailwind. Add the design tokens (colors, fonts, radii, shadows) from CLAUDE.md to the Tailwind config and load the three Google Fonts.`
2. `Create the shared UI components we will reuse everywhere: Card (grey, white, mint variants), Chip (green, amber, red, blue, purple, grey), Button (primary teal, secondary, outline), ProgressBar, Ring (score/progress ring), Avatar, Tabs, SegmentedSwitch, SectionHeader, StatTile. Look at several finished pages in design/*.html to get the exact styles. Make a /dev/components page that shows them all.`
3. `Add the motion rules from CLAUDE.md as reusable helpers: grow-in bar, ring sweep, line draw, pop-in, row stagger. Entrance only, no hover effects, respect prefers-reduced-motion.`

## Step 2 — App shell

4. `Build the app shell: the look from the sidebar and page frame in design/Main.html, the behavior from design/prototypes/Sidebar.dc.html. Fixed sidebar with the three parts, collapsible to an icon rail (button, drag, double-click), remembered in localStorage, and a white content panel that scrolls on its own. Use the logos in /public/brand.`
5. `Add the Ask Cevrynt first-visit popup and the small floating button: look from design/Main.html, behavior from design/prototypes/Sidebar.dc.html.`

## Step 3 — Daily work pages

6. `Build Home (/) from design/Main.html (look) and design/prototypes/Main.dc.html (behavior) with sample data.`
7. `Build My tasks (/tasks) from design/Tasks.html (look) and design/prototypes/Tasks.dc.html (behavior), including Mine/Team, Add task, filters, expandable tasks and the done-today ring.`
8. `Build Submissions (/submissions) from design/Submissions.html (look) and design/prototypes/Submissions.dc.html (behavior). The queue must match the preview column's height and scroll inside, with no horizontal scroll.`
9. `Build the Intake pages: /intake, /intake/manual (sticky Live fit check), /intake/package, /intake/bulk.`

## Step 4 — Deal workspace

10. `Create the deal layout shared by all 9 deal tabs (deal header with score, amounts, deadline bar and actions, plus the tab bar) from design/Deal-Summary.html (look) and design/prototypes/Deal-Summary.dc.html (behavior).`
11. Then one tab per request: Summary, Cash flow, Positions, Integrity, Business, Conditions, Offer, Decision (sticky memo Sections), Activity.

## Step 5 — Portfolio and partners

12. `/offers` from Offers.html and prototypes/Offers.dc.html (stage stepper, funding queue with send summary).
13. `/merchants`, `/funded`, `/renewals`, `/stacking`, `/brokers`, `/reports` — one per request.

## Step 6 — Settings and roadmap

14. `Create the settings layout with the sticky settings menu from design/Settings.html (look) and design/prototypes/Settings.dc.html (behavior).`
15. Then one section per request: policy (sticky simulator), pricing, intake channels, renewal rules, team, workspace, plan, security, audit log.
16. `/whats-coming` from Coming.html and prototypes/Coming.dc.html.

## Step 7 — Outside pages

17. `/m/[token]` — Merchant Link (public, funder branding, no app sidebar). It must work well on phones.
18. `/apply` — application form preview with the "coming soon" banner. Also mobile-friendly.

## Step 8 — Real data

19. `Define TypeScript types for deals, merchants, brokers, tasks, alerts and payments from the sample data, then create an API layer that returns sample data. We will replace it with the real backend endpoints one by one.`

## Tips

- If a page looks off, send a screenshot to Claude Code and say which finished page in `design/` it should match. If it behaves wrong, point to the prototype in `design/prototypes/`.
- Keep CLAUDE.md up to date when you make a new decision, so every later page follows it.
