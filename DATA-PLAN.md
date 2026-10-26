# Cevrynt — the data layer

Status: **done.** Every page, the shell and the two public pages read their data through `lib/data`. `lib/sample-data/` is gone. This file describes how the data layer works now, and how to switch it to the real backend.

## The idea in one line

Pages ask the data layer for **records**. The wording lives in `lib/copy`, and formatting happens there or in the components. To go live, only the data layer's source changes: no page or component changes.

---

## 1. Where everything lives

```
lib/
  data/
    types/          one file per area, re-exported from types/index.ts; source.ts defines the DataSource interface
    sample/         the sample records, typed, plus index.ts (sampleSource: the sample DataSource)
    api/            index.ts (apiSource): the real backend, one area at a time; areas not connected yet throw
    source.ts       picks the source from CEVRYNT_DATA_SOURCE ("sample" by default, or "api")
    <area>.ts       the getters, one file per area (deals.ts, settings.ts, team.ts, public.ts, ...)
    views/          page-shaped joins: homeView(), submissionsView(), merchantLinkView(token), ...
    consistency.test.ts   checks that every fact shared by several pages comes out the same
  copy/             interface wording per page: titles, labels, hints, and functions that word records
  format.ts         money, percent, dates and times in the workspace's zone
  offer-math.ts, policy-sim.ts, renewal-rules.ts, security-score.ts, deal-figures.ts
                    pure calculations; callers pass the records they loaded (no defaults, no sample imports)
```

### Getters (`lib/data/<area>.ts`)

| Area | Getters |
| --- | --- |
| advances | `listAdvances`, `getFundedBook` |
| audit | `listAuditEntries`, `getAuditLog` |
| brokers | `listBrokers`, `getBrokerBook` |
| clock | `getNow` (the sample world is fixed on one working day) |
| deals | `listDeals`, `getDeal`, `getQueueSummary`, `getQueueStats`, and one per deal tab: `getDealSummary`, `getDealCashFlow`, `getDealPositions`, `getDealIntegrity`, `getDealBusiness`, `getDealConditions`, `getDealOffer`, `getDealDecision`, `getDealActivity` |
| desk | `listStips`, `listCalendar`, `listActivity` |
| funding | `listPipeline`, `getFundingQueue`, `listReleases`, `getFundingDesk`, `getFundingSummary` |
| intake | `getIntakeSummary`, `getManualDraft`, `getPackageIntake`, `getBulkIntake` |
| merchants | `listMerchants`, `listMerchantListings`, `getMerchantBook` |
| public | `getMerchantLink(token)` |
| renewals | `listRenewalCandidates`, `getRenewalRules`, `getRenewalSummary` |
| reports | `listReportSnapshots`, `getReportsBook` |
| roadmap | `listRoadmapFeatures`, `countRoadmapFeatures` |
| settings | `getWorkspace`, `listNotificationRules`, `getPolicy`, `getPricing`, `getIntakeChannels`, `getPlan`, `getSecurity`, `listSignIns`, `listApiKeys` |
| stacking | `listStackingAlerts`, `getStackingSummary` |
| tasks | `listTasks`, `getTaskBoard` |
| team | `listTeam`, `getCurrentUser`, `listInvites`, `getAccessReview`, `getOutsideAccess` |

### Views (`lib/data/views/`)

A view joins records into what one page needs, with independent calls in parallel (`Promise.all`). For example: `homeView`, `reportsView`, `submissionsView`, `dealFrameView(id)`, `dealTabsView(id)` and the other deal tabs, `offersView`, `fundedView`, `merchantsView`, `renewalsView`, `stackingView`, `brokersView`, `tasksView`, the intake and settings views, `settingsMenuView` (the Policy version in the settings menu), `merchantLinkView(token)`, `applyView` and `publicFunder`.

---

## 2. The rules

- **Records only.** Types hold plain values. Money is a `number` in dollars, times are ISO 8601 strings and ids are strings. References between records use ids (`dealId`, `brokerId`, `conditionId`). Sentences people read never live in the data; they're in `lib/copy`.
- **Server only.** Every getter and view starts with `import "server-only"`. A client component can't import one by mistake: the build fails.
- **Not found vs failed.** A single record comes back as `T | null`, and `null` means "not found": the page calls `notFound()`. A backend failure throws, and the route's `error.tsx` shows it. Data functions never return made-up data.
- **One place for each fact.** Anything several pages show is stored once and read or worked out everywhere else. Examples:
  - the policy limits, debt limit and late-payment target;
  - the cost per deal, channel counts and workloads;
  - readiness for renewal, today's stacking alerts and broker flags;
  - the workspace, the signed-in person and the Policy version.
  - The sidebar badges (My tasks, Submissions, Renewals, Stacking Watch, "10 new") are counted from the records too.
  - `consistency.test.ts` checks each of these across the pages that quote it.
- **Nobody outside `lib/data` touches its sources.** An ESLint rule (`no-restricted-imports` in `eslint.config.mjs`) fails any import of `lib/data/sample`, `lib/data/api` or `lib/data/source` from outside `lib/data`, and any import of the old `lib/sample-data`.
- **Pure math takes its inputs.** `computeOffer`, `disclosureFor`, `earlyPayoff`, `renewalOffer`, `simulatePolicy` and the rest take the deal's figures, the policy and the pricing as arguments. `offerTerms` is the part of the offer math that needs no deal (Pricing's example, renewals).
- **Writes are still local.** Votes, switches, Pause broker, release payment and similar actions are component state for now. Later they become Server Actions in `lib/data/actions/`, which call the backend and then `revalidateTag()` the reads they changed.

---

## 3. How pages use it

- **`page.tsx` and `layout.tsx` are server components.** They wait for the data inside a Suspense boundary, then hand it to the page's view as props:

  ```tsx
  export default function BrokersPage() {
    return (
      <Suspense fallback={<BrokersSkeleton />}>
        <BrokersData />
      </Suspense>
    );
  }
  async function BrokersData() {
    const data = await brokersView();
    return (
      <Arrive>
        <BrokersView data={data} />
      </Arrive>
    );
  }
  ```

- **Client components** (tabs, sliders, selections) get records as props and keep only their own UI state. They word records with `lib/copy` functions.
- **Loading.** Each page's fallback is a static skeleton in the page's own shape, measured at 1440 wide (`components/ui/Skeleton.tsx`). Skeletons don't shimmer. `<Arrive>` fades the content in.
- **The shell** never waits for page data.
  - The workspace switcher and profile (`components/shell/SidebarIdentity.tsx`, reading `getWorkspace()` and `getCurrentUser()`) stream in, each in its own Suspense with an empty box of the same size as the placeholder.
  - The badge counts (`CountBadges.tsx`, `StackingBadge.tsx`, `ComingNote.tsx`) also stream in, each in its own Suspense with no placeholder.
  - If any of these fails to load, it's left out instead of breaking the page.
- **Settings menu.** The settings layout loads the live Policy version for the menu's "v3" and the "Policy · version 3, active since Sep 2" line.
- **Public pages** (`app/(public)`):
  - The layout loads the funder (the workspace record) once and shares it through `FunderProvider`. The header, the footer, the "link has expired" page and the error page are all branded from it.
  - `/m/[token]` looks the link up with `merchantLinkView(token)`. An unknown or expired token shows the branded "This link has expired or isn't valid" page.
  - `/apply` reads the policy's offer range, the form's web address and the support phone through `applyView()`.
- **Not found and errors.**
  - `app/(app)/not-found.tsx` handles a page that doesn't exist, `app/(app)/deals/not-found.tsx` an unknown deal, and `app/(public)/m/[token]/not-found.tsx` a bad link.
  - `app/(app)/error.tsx` and `app/(public)/error.tsx` handle failures.

---

## 4. Switching to the real backend

`lib/data/source.ts` chooses the source once, from the environment:

| `CEVRYNT_DATA_SOURCE` | Source | What you get |
| --- | --- | --- |
| unset or `sample` | `sampleSource` (`lib/data/sample/index.ts`) | the sample workspace, frozen on Tue Oct 13, 2026 |
| `api` | `apiSource` (`lib/data/api/index.ts`) | the real backend; the clock is real time |

Set it in `.env.local` (or the host's environment) and restart the server:

```bash
CEVRYNT_DATA_SOURCE=api npm run dev
```

To connect an area:

1. In `lib/data/api/`, replace that area's `notConnected(...)` stubs with calls to the backend. Each function must return exactly the type in `lib/data/types/source.ts` (`DataSource`), with the same `null` for "not found". For a large area, put the calls in `lib/data/api/<area>.ts` and import them into `index.ts`.
2. Tag each read by area (`deals`, `policy`, `team`, ...) so a later write can `revalidateTag()` exactly what it changed.
3. Nothing else changes: getters, views, copy and pages stay the same.

Until every area is connected, `api` mode is all or nothing: a page that reads an area still on `notConnected` shows its error page with "The *area* data isn't connected to the backend yet. Set CEVRYNT_DATA_SOURCE=sample." Keep `sample` for day-to-day work, and switch to `api` to check the areas you've connected.

`npm test` always runs against the sample source, so the consistency test keeps guarding the cross-page facts while areas move over.

---

## 5. Checking changes

- `npx tsc --noEmit`, `npx eslint components lib app scripts` and `npm test` must all pass. The tests are Node's own runner, with `scripts/test-hooks.mjs` resolving `@/` and `server-only`.
- **When a change touches data a page shows:**
  - compare the page before and after in the browser;
  - replay its interactions;
  - add or update the matching check in `consistency.test.ts`.
