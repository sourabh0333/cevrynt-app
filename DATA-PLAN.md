# Cevrynt — data layer plan

Status: proposal, no code changed yet. Follows BUILD-PLAN.md item 19.

## Where we are today

- About 130 components import `lib/sample-data/*` directly. About 78 of them are server components; the rest are client components (`"use client"`) that read the sample data at module level.
- The sample-data files mix three different things:
  1. **Records**: deals, merchants, brokers, tasks and so on.
  2. **Interface wording**: titles, button labels, hints and empty-state text.
  3. **Pre-formatted values**: `"$45K"`, `"Today 08:12"`, `"2.1%"`.
- Some values are already shared across pages, and the data layer must keep them single-sourced:
  - **Policy limits:** `policyLimits`, $10K / $45K / $100K / $150K.
  - **Cost per deal:** `COST_PER_DEAL`, $5.20.
  - **Decision target:** `DECISION_TARGET_HOURS`, 4.
  - **Workloads:** `teamWorkload`, 7 / 9 / 6 / 3.
  - **Channel counts:** 132 / 98 / 39 / 18.
  - **Saved renewal rules:** 9 merchants ready.
  - **Roadmap size:** the feature count, 10.
- Pure calculation modules already exist and stay as they are. They are not data access:
  - `lib/offer-math.ts`
  - `lib/policy-sim.ts`
  - `lib/renewal-rules.ts`
  - `lib/security-score.ts`
- The deal workspace already uses the right pattern: `getDealHeader(id)` returns `null`, and the layout calls `notFound()`.

The goal: pages ask the data layer for **records**. Components keep their **wording** and do their own **formatting**. Later, only the data layer's internals change to call the real backend.

---

## 1. Main data types

Rules for every type:

- **Money** is a plain `number` in US dollars, for example `45000`, never `"$45K"`. Formatting uses the shared helpers: `money`, `moneyShort` and `percent`.
- **Dates and times** are ISO 8601 strings, for example `"2026-10-14T08:12:00-04:00"`. A small `lib/format.ts` turns them into "Today 08:12" or "Oct 14".
- **IDs** are strings. Deals keep their public form, such as `"APP-7H2K4Q"`. Other ids are opaque, such as `"mer_harbor"` or `"usr_maya"`.
- **References between records** use ids, for example `merchantId` and `brokerId`. Joining them for display happens in the data layer's "view" functions (see section 2).
- **Colors are not data.** Avatar gradients and tones come from small UI maps keyed by status or id, not from the backend.
- Types live in `lib/data/types/` with one file per area, re-exported from `lib/data/types/index.ts`. Components import them with `import type`.

### People and organization

```ts
type Role = "underwriter" | "senior" | "funding" | "collections" | "admin";

type Workspace = {
  id: string; name: string; legalName: string; address: string;
  timeZone: string; emailFrom: string; supportPhone: string;
  brandColor: string;               // the funder's choice, used only on merchant-facing pages
  decisionTargetHours: number;      // 4, read by Submissions and Workspace
};

type TeamMember = {
  id: string; name: string; initials: string; email: string; role: Role;
  approvalLimit: number | null;     // dollars; null for roles that don't decide
  openDeals: number;                // today's workload, read by Submissions and Team
  dailyCapacity: number;            // 10
  mfa: boolean; away: boolean;
};

type Invite = { id: string; name: string; email: string; role: Role; approvalLimit: number | null; sentAt: string };
```

### Brokers and merchants

```ts
type BrokerTier = "top" | "good" | "watch" | "paused";

type Broker = {
  id: string; name: string; contactName: string; contactEmail: string;
  score: number; tier: BrokerTier;
  submitted90d: number; funded90d: number; completeOnFirstSendPct: number;
  fraudFlags90d: number; fundedVolume: number; paidLatePct: number; stipReplyHours: number;
  commissionPts: number; renewalCommissionPts: number; owedNow: number;
  renewalRightsMonths: number | null;
  weeklySubmissions: number[];       // last 8 weeks
  declineReasons: { reason: string; count: number }[];
  note: string;
};

type Merchant = {
  id: string; name: string; industry: string; state: string;
  ownerName: string; relationship: "new" | "active" | "renewal" | "paid-off" | "declined";
  healthScore: number | null; brokerId: string | null; underwriterId: string | null;
  lastContactAt: string; note: string;
};
```

### Deals (applications) and the deal workspace

```ts
type DealStatus = "new" | "docs" | "review" | "ready" | "offer" | "funded" | "declined";
type Risk = "low" | "medium" | "high" | null;

type Deal = {
  id: string;                         // "APP-7H2K4Q"
  merchantId: string; brokerId: string | null; ownerId: string | null;
  status: DealStatus; channel: "package" | "bulk" | "manual" | "merchant-link";
  requested: number; recommended: number | null;
  score: number | null; risk: Risk;
  receivedAt: string; decisionDueAt: string | null;
  flags: { text: string; severe: boolean }[];
};

// The deal workspace reads one deal plus these parts, each its own function,
// so each tab loads only what it shows.
type DealSummary     = { trueMonthlyRevenue: number; statedMonthlyRevenue: number; scoreParts: ScorePart[]; recommendation: OfferTerms; needsALook: LookItem[] };
type CashFlow        = { months: MonthFlow[]; transactions: Transaction[]; setAsides: SetAside[] };
type Position        = { id: string; funder: string; dailyPayment: number; balance: number; startedAt: string; disclosed: boolean; source: "statement" | "ucc" | "credit" };
type IntegrityCheck  = { id: string; document: string; test: string; result: "pass" | "warn" | "fail"; detail: string };
type Condition       = { id: string; title: string; status: "open" | "requested" | "received" | "waived"; requestedAt?: string; owner: "merchant" | "broker" | "us" };
type DecisionRecord  = { id: string; outcome: "approve" | "counter" | "decline" | null; byId: string | null; at: string | null; memo: string };
type ActivityEvent   = { id: string; at: string; actorId: string | "system"; kind: ActivityKind; text: string };
```

### Offers, funding and payments

```ts
type OfferTerms = { amount: number; factor: number; termMonths: number; frequency: "daily" | "weekly"; feePct: number; method: "ach" | "split"; payoffExisting: boolean };
// Same shape as OfferInput in lib/offer-math.ts, which already turns terms into payback, payment and APR.

type Offer = { id: string; dealId: string; terms: OfferTerms; stage: "drafted" | "sent" | "accepted" | "signed" | "funding" | "funded" | "lost"; sentAt: string | null; expiresAt: string | null; lostReason?: string };

type Release = { id: string; offerId: string; startedById: string; releasedById: string | null; method: "ach" | "wire"; reference: string | null; status: "awaiting" | "sent" | "settled" | "returned"; at: string };

type Advance = {                      // a funded deal
  id: string; dealId: string; merchantId: string; brokerId: string | null;
  fundedAt: string; amount: number; payback: number; factor: number;
  dailyPayment: number; paidAmount: number; status: "on-track" | "late" | "paused" | "paid-off" | "default";
  revenueTrend: number[];             // daily revenue vs. level at funding
};

type Payment = { id: string; advanceId: string; date: string; amount: number; status: "cleared" | "pending" | "returned"; method: "ach" | "card-split" };
```

### Renewals and risk

```ts
// The renewal check already exists as ReadinessMerchant in lib/renewal-rules.ts; the data layer supplies those inputs.
type RenewalCandidate = { advanceId: string; merchantId: string; repaidPct: number; daysSinceReturn: number; revenueVsFundingPct: number; health: number; stacking: boolean; suggested: number; maxOffer: number; baseFactor: number; status: "ready" | "sent" | "accepted" | "soon" };

type StackingAlert = { id: string; merchantId: string; dealId: string | null; advanceId: string | null; severity: "high" | "medium"; kind: "ucc" | "debit" | "bank" | "duplicate" | "inquiry"; seenAt: string; summary: string; facts: [string, string][]; status: "open" | "reviewed" };

type Task = { id: string; type: TaskType; title: string; dealId: string | null; assigneeId: string; dueAt: string; why: string; prep: string[]; source: "system" | "user" };
```

### Settings and policy

```ts
type PolicyLimits = { minAmount: number; seniorAbove: number; seniorLimit: number; maxAmount: number };
type Policy = { version: number; liveSince: string; rules: PolicyRule[]; limits: PolicyLimits; scoreWeights: { part: string; points: number }[]; restrictedIndustries: string[]; versions: PolicyVersion[]; draft?: PolicyDraft };
// PolicyRule keeps today's shape (sentence parts, outcome, on/off). Slider-linked values come from `limits` and the simulator inputs.

type PricingSettings = { grid: { band: string; factors: number[] }[]; terms: number[]; adjustments: Adjustment[]; earlyPayoff: { days: number; factor: number }[]; industryAdjustments: { industry: string; delta: number }[]; sizing: { band: string; multiple: number }[]; guardrails: { brokerUpsellMax: number; minMarginPct: number }; disclosures: DisclosureTemplate[]; forgiveUnearnedFees: boolean; showBrokerPay: boolean };

type IntakeChannel  = { key: "link" | "email" | "forms" | "api"; live: boolean; settings: Record<string, boolean> };
type SecuritySettings = { protections: Record<ProtectionKey, boolean>; outside: Record<string, boolean>; supportAccessUntil: string | null };
type SignInEvent    = { id: string; userId: string | null; device: string; location: string; at: string; result: "ok" | "blocked" | "no-mfa" };
type PlanUsage      = { plan: { name: string; monthly: number; includedDeals: number; seats: number; renewsOn: string; extraDealPrice: number; spendLimit: number }; costPerDeal: number; dealsUsed: number; dealsByChannel: { channel: string; deals: number }[]; dealsPerDay: number[]; pagesSkipped: number; linkSessions: number; invoices: Invoice[] };
type NotificationRule = { event: string; urgent: boolean; app: boolean; email: boolean; text: boolean };
```

### Records shown across pages

```ts
type AuditEntry = { id: string; number: number; at: string; actorId: string | "system" | "unknown"; category: AuditCategory; what: string; object: string; location: string; before?: string; after?: string; note: string; seal: string; link: { kind: "deal" | "offers" | "policy" | "security" | "team" | "reports"; id?: string } };
type RoadmapFeature = ComingFeature;      // as today
type MerchantLink = { token: string; dealId: string; merchantId: string; steps: LinkStep[]; expiresAt: string; language: "en" | "es" };
type ReportSnapshot = { period: Period; kpis: Kpi[]; funnel: FunnelStage[]; monthly: MonthlyFunded[]; declines: DeclineRule[]; unitEconomics: UnitEconomics; team: TeamStat[] };
```

What stays out of the types: any sentence a person reads, such as titles, hints, notes on cards and button labels. Those move to `lib/copy/` (see step 0 in section 4) and stay with the components.

---

## 2. Where the data functions live and how pages call them

### Folder layout

```
lib/
  data/
    types/                 one file per area, plus index.ts
    source.ts              picks the source: "sample" now, "api" later (env CEVRYNT_DATA_SOURCE)
    sample/                the raw sample records, typed (moved out of lib/sample-data piece by piece)
    api/                   later: fetch calls to the real backend, same function signatures
    deals.ts               getDeal, listDeals, getDealSummary, getCashFlow, getPositions, ...
    merchants.ts           getMerchant, listMerchants
    brokers.ts             getBroker, listBrokers, getBrokerScorecards
    tasks.ts               listTasks
    offers.ts              listOffers, getFundingQueue, listReleases
    advances.ts            listAdvances, getAdvance, listPayments
    renewals.ts            listRenewalCandidates, getRenewalRules
    risk.ts                listStackingAlerts, getStackingSummary
    settings.ts            getWorkspace, getPolicy, getPricing, getIntakeChannels, getSecurity, getPlanUsage, getNotificationRules
    team.ts                listTeam, listInvites, getCurrentUser
    audit.ts               listAuditEntries
    reports.ts             getReportSnapshot(period)
    roadmap.ts             listRoadmapFeatures
    public.ts              getMerchantLink(token), getApplyFormConfig()
    views/                 page-shaped joins, e.g. homeView(), submissionsView(), dealHeaderView(id)
  copy/                    interface wording per page (moved from lib/sample-data)
  format.ts                money, percent, dates ("Today 10:42"), relative time
```

### Function rules

- Every function is `async` and returns plain, serializable data. That way it can be handed from a server component to a client component.
- **One record:** returns `T | null`, where `null` means "not found". The page decides what to do, usually `notFound()`.
- **Lists:** return `T[]`, and the empty list is a normal result. Filters are typed arguments, for example `listDeals({ status, ownerId, search })`.
- **Not reachable from the browser:** each file starts with `import "server-only"`, so a client component can't import it by mistake.
- **Two sources, one shape:** both the sample source and the API source implement the same signatures. `source.ts` exports whichever is active, so switching to the backend is one file per area, never a page change.
- **Cross-page numbers come from one place:** the policy limits, the cost per deal, the decision target, team workloads and the renewal rules each have exactly one getter. The current "these must match" constants become data, and a test keeps them in line (see section 4).
- **"View" functions** in `views/` join records into what one page or card needs. For example, `submissionsView()` adds each deal's merchant name, broker name and owner initials. They make many independent calls in parallel with `Promise.all`.

### How pages call them

- **`page.tsx` and `layout.tsx` stay server components.** They `await` the data function inside a Suspense boundary, as the deal layout already does with cacheComponents, and pass the result down as props:

  ```tsx
  // app/(app)/stacking/page.tsx
  export default function StackingPage() {
    return (
      <Suspense fallback={<StackingSkeleton />}>
        <StackingData />
      </Suspense>
    );
  }
  async function StackingData() {
    const [summary, alerts] = await Promise.all([getStackingSummary(), listStackingAlerts()]);
    return <StackingView summary={summary} alerts={alerts} />;
  }
  ```

- **Client components** (tabs, sliders, selections) receive data as props and never import data functions. Their local state, such as selected row, filters and switches, stays as it is now.
- **Server components** that only display data can call data functions themselves where that keeps props small, for example the sidebar badge counts in the shell.
- **Calculation modules** stay pure and are called wherever needed: `computeOffer`, `simulatePolicy`, `readiness` and `securityScore`. The data layer supplies their inputs.
- **Writes are out of scope for this plan.** Today they are local state: vote, switches, Pause broker, release payment. Later they become Server Actions in `lib/data/actions/`. Each one calls the backend and then `revalidateTag()`s the affected reads. Until then, pages keep the current in-memory behaviour.
- **Caching:** the sample source needs none. The API source will tag reads by area, such as `deals`, `policy` and `team`, so a write can refresh exactly what it changed.

---

## 3. Loading, "not found" and error states

There are no designs for these yet. The proposal reuses the existing tokens and shapes, and needs your approval on one point (the open question at the end).

### Loading

- **Shape:** each page's Suspense fallback is a static skeleton that mirrors that page's real layout: the same cards, radii and heights. The page doesn't jump when data arrives.
- **Shared parts:** a small set in `components/ui/Skeleton.tsx` (`SkeletonCard`, `SkeletonRow`, `SkeletonTile`) using `bg-card` and `bg-line` blocks.
- **Motion:** skeletons don't animate. CLAUDE.md allows motion only on data visuals, and that rules out a shimmer.
- **Granularity:** a page gets one boundary around its data. If one part is slow, it gets its own boundary so the rest shows first. The deal header and each deal tab already load separately.
- **Shell:** the sidebar and header never wait for page data. Shell badge counts get their own tiny Suspense with no placeholder, so the number just appears.

### Not found

- **Rule:** a data function returns `null`, and the page or layout calls `notFound()`. This is already how `getDealHeader` works.
- **`app/(app)/not-found.tsx`:** shown inside the shell with the sidebar visible. It's a grey card with "We couldn't find that page" and a teal "Back to Home" button.
- **`app/(app)/deals/[id]/not-found.tsx`:** a deal-specific message, "There's no deal APP-XXXXXX in Ridgeline Capital", with "Open Submissions".
  - **Limitation:** this needs the id, which a not-found file can't read. The deal layout will pass it through a small client hook that reads the URL.
- **Detail panels:** the same rule applies to merchants, brokers and alerts if they get their own URLs later.
- **`app/(public)/m/[token]/not-found.tsx`:** branded as the funder, with no Cevrynt app chrome. It reads "This link has expired or isn't valid. Ask Ridgeline Capital to send a new one." It shows the funder's phone number.
- **Empty lists** are not "not found". They keep the empty messages the designs already have, such as "Nothing here yet." and "Nothing of this type today."

### Errors

- **Internal pages:** `app/(app)/error.tsx` is a client component, as Next.js requires. It shows "Something went wrong loading this page" with a teal "Try again" (`reset()`) and a link to Home, and stays inside the shell.
- **Public pages:** `app/(public)/error.tsx` is the funder-branded version.
- **Data functions:** they throw on backend failures and never return fake data, so errors aren't silently hidden. "Not found" (`null`) is kept separate from "failed" (thrown).

---

## 4. Conversion order, in small steps

Each step converts one page, or one deal tab, end to end. Each one:
- moves its records into `lib/data/sample/` with the new types;
- moves its wording into `lib/copy/`;
- adds the getter or getters;
- makes the page call them;
- adds the page's skeleton.

The rule for every step: **the page looks and behaves exactly as before.** Each step ends with a type-check, lint, `npm test`, a browser comparison and a commit.

**Step 0 — Foundations (no page changes)**
- `lib/data/` skeleton, `source.ts`, `server-only`, shared types for money, dates and ids, and `lib/format.ts` with tests.
- The `Skeleton` parts, the three `not-found.tsx` files, and the two `error.tsx` files.
- A **consistency test** that pins today's cross-page facts against the sample source:
  - 9 renewals ready;
  - 287 deals and the 132 / 98 / 39 / 18 split;
  - workloads 7 / 9 / 6 / 3;
  - limits $10K / $45K / $100K / $150K;
  - $5.20 per deal;
  - 10 roadmap features;
  - Leo without 2-step login.

**Step 1 — Pilot: What's coming.** One small list, with the sidebar's "10 new" badge read through the data layer. This proves the server-page → client-view → props pattern.

**Steps 2–5 — Reference data that other pages read.** These go first so later pages read them from the data layer.

2. **Team & roles:** members, invite and workloads, plus `getCurrentUser()` for "Maya Chen".
3. **Workspace:** the decision target, brand and notification rules.
4. **Policy:** limits, rules, weights and versions. Then **Pricing:** grid, early payoff, adjustments and disclosures. Offer, Apply, Team and Renewals then read these.
5. **The other settings:** Renewal rules, Intake channels, Plan & usage (cost per deal), Security (sign-ins) and Audit log.

**Steps 6–7 — Deals.**

6. **Submissions:** `listDeals`, plus the `submissionsView` join.
7. **Deal workspace,** one tab per step, header first:
   - 7a. header and tabs, replacing `getDealHeader`;
   - 7b. Summary;
   - 7c. Cash flow;
   - 7d. Positions;
   - 7e. Integrity;
   - 7f. Business & owners;
   - 7g. Conditions;
   - 7h. Offer, using the same `computeOffer`;
   - 7i. Decision;
   - 7j. Activity.

**Steps 8–15 — Pages built on deals and advances.**

8. **My tasks.**
9. **Intake:** recent intake rows, then the three intake flows, which keep their forms as they are.
10. **Offers & funding:** pipeline, funding queue and releases. The Audit log entries then point at these records.
11. **Merchants.**
12. **Funded deals:** advances and payments.
13. **Renewals:** candidates feed `readiness()`, and the result stays 9 ready.
14. **Stacking Watch.**
15. **Brokers.**

**Steps 16–17 — Pages that summarize everything.** These go last because they read from most of the areas above.

16. **Reports:** `getReportSnapshot(period)`.
17. **Home:** `homeView()`, which joins tasks, deals, alerts, offers and portfolio numbers.

**Step 18 — Public pages.** `getMerchantLink(token)` replaces the "demo" check, and **Apply** reads its form config and policy limits.

**Step 19 — Clean up.**
- Delete `lib/sample-data/`.
- Make sure no component imports data except through props or `lib/data`.
- Add a lint rule, `no-restricted-imports`, that blocks `lib/data/sample/*` outside `lib/data/`.

**After that:** connect the real backend one area at a time, by adding `lib/data/api/<area>.ts` and switching that area in `source.ts`. The consistency test keeps running against the sample source.

---

## Open question for you

Loading skeletons: the plan proposes **static** placeholders, with no shimmer or pulse, because CLAUDE.md allows motion only on data visuals. If you'd prefer a soft pulse while loading, say so and it will be added once in the shared `Skeleton` parts, with reduced motion respected.
