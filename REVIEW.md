# Final review — decisions

Found during the final review. All five open decisions are now **resolved**, each in its own commit.

## 1. Links that didn't open a page yet: resolved (`af4cfc6`)

**Decision:** links with no destination become disabled buttons with a small "Coming soon" tooltip. Privacy and Terms link to the funder's own pages.

**Done:**
- **Disabled buttons:** these now render as disabled buttons, using `ComingSoon` in `components/ui/ComingSoon.tsx`:
  - "Call the merchant" and "Open" on Funded deals;
  - "Open profile" on Merchants;
  - the Offers pipeline row actions;
  - "Message" and the round message button on Merchant Link.
- **Tooltip:** each sits in a wrapper with the "Coming soon" tooltip, and screen readers hear "(Coming soon)".
- **Seven text links missed in the first review:** they were placeholders too and now get the same treatment through `MaybeLink`:
  - "Export audit log", "View registry record", "Open street view", "Export record" and "How they work" on the deal tabs;
  - "See all … owner groups" on Merchants;
  - "See all …" on Renewals.
  - Their wording now marks the missing destination as `href: null` instead of `"#"`.
- **Privacy and Terms:** they link to the new `privacyUrl` and `termsUrl` fields on the workspace record. The consistency test checks this.
- **What's left:** no `#` link remains in the app, apart from the developer component gallery at `/dev/components`.

## 2. Plan & usage average: resolved (`ea146af`)

**Decision:** work the average out from the bars instead of storing it.

**Done:**
- The stored `avgPerDay` is gone.
- The label is now the bars' own average, rounded to a whole deal: 124 deals over 12 days reads **"10 avg"**.
- Today (15, the busiest day) and the day before (11) are unchanged.
- A test checks the label against the bars.

## 3. Recorded times: resolved (`8752463`)

**Decision:** recorded actions use the same clock as the rest of the app (`getNow`).

**Done:**
- Recording a decision and signing the integrity review now ask the new Server Action `currentTime()` in `lib/data/actions/clock.ts`. It returns `getNow()`: the sample clock in sample mode, real time with the backend.
- Times are shown with `clockTime` in the workspace's time zone. In the sample this reads "Recorded by Maya Chen at 10:45" and "Recorded at 10:45 by Maya Chen".
- DATA-PLAN.md explains this under the rules.

## 4. Clicks before a page finishes loading: resolved (`9559a92`)

**Decision:** a tick box can never look ticked without counting.

**Done:**
- All 20 tick boxes whose state lives in React now use `components/ui/TickBox.tsx`. That includes Merchant Link's "I agree", the funding queue and Submissions' select-all.
- **How it works:** once the page has started up, `TickBox` compares the box with React's value. If a click made before start-up is still unaccounted for, it reports that click through `onChange`. It waits until after React's own replay of the click, so a click is never counted twice.
- **Checked in the browser:**
  - With "I agree" ticked before the page had started up, "Sign and continue" became enabled once it did.
  - Normal clicks, the funding queue selection and select-all (including its half-ticked state) work as before.
- CLAUDE.md now says to use `TickBox` for these boxes.

## 5. Merchant Link's pronoun: resolved (`7328778`)

**Decision:** use neutral wording.

**Done:** the finishing line now reads "Maya has everything needed and will be in touch today."

## For the record (no decision needed)

- **Undo label:** the funding queue's undo button reads "Undo release · m:ss". The Offers prototype has no undo button, so this wording isn't from the design.
- **Manual lead send button:** the Merchant Link send button in step 3 is solid teal. The design shows it pale grey on the mint card, which CLAUDE.md rule 7 doesn't allow, so the rule was followed.
- **Rows of different heights:** three rows have boxes of different heights on purpose:
  - Home: My queue spans two rows.
  - Settings › Policy: the Policy simulator is sticky beside the rules.
  - Decision tab: the memo Sections are sticky beside the memo.
- **Final checks:** type-check, lint, all 133 tests and the production build (40 routes) pass.
