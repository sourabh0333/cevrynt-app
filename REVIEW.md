# Final review — open decisions

Found during the final review. Small issues were fixed in their own commits; these need a decision, so nothing was changed.

## 1. Links that don't open a page yet

These buttons are styled as links but point to `#`, because the page or action behind them doesn't exist yet:

| Where | Link | File |
| --- | --- | --- |
| Funded deals, deal detail | "Call the merchant", "Open" | `components/funded/BookView.tsx` |
| Merchants, merchant preview | "Open" (merchant profile) | `components/merchants/MerchantsView.tsx` |
| Offers & funding, pipeline rows | the row action (for example "Nudge merchant") | `components/offers/PipelineCard.tsx` |
| Merchant Link | "Message" and the round message button | `components/merchant-link/MerchantLinkView.tsx` |
| Public footer (Merchant Link, Apply) | "Privacy", "Terms" | `components/public/PublicChrome.tsx` |

**Decision:** for each one, choose one of:
- point it at an existing page (for example, the deal page for "Open");
- turn it into a button with a "coming soon" note;
- keep it as it is until the feature exists.

Privacy and Terms need the funder's own URLs, so they belong in the workspace record.

## 2. Plan & usage: "11 avg" doesn't match the bars

The per-day chart now matches "Today 15, the busiest day yet": today is 15 and the day before is 11. But the "11 avg" label is a separately stored number. The 12 bars add up to 124 deals, which is an average of **10.3**. The design has the same mismatch.

**Decision:** pick one:
- work the average out from the bars, so it shows "10 avg";
- adjust the daily numbers so they really average 11, which changes some bar heights;
- keep the stored 11.

## 3. Recorded times use the device clock

The sample workspace is frozen on Tue Oct 13 at 10:45, and every page reads that time. But actions recorded in the browser stamp the real time of the computer. For example, recording a decision says "Recorded by Maya Chen at 17:13".

**Decision:** should recorded actions use the workspace clock (`getNow`, so 10:45 in the sample)? With the real backend the two clocks are the same, so this only affects the sample.

## 4. Clicks before a page has finished loading

If a tick box is clicked in the moment before the page finishes starting up in the browser, the box can show as ticked while the page doesn't know. The button it unlocks then stays disabled until the box is clicked again. Only the first click is affected. I saw this on:
- the Merchant Link credit check ("Sign and continue");
- the funding queue's tick boxes.

It showed up in a slowed-down background tab; on a normal connection the window is very short.

**Decision:** pick one:
- disable these inputs until the page is ready;
- have each one read its real ticked state when the page starts;
- accept it as it is.

## 5. "Maya has everything she needs"

The Merchant Link's finishing line now names whichever underwriter owns the deal, but "she" comes from the design text.

**Decision:** pick one:
- reword it without a pronoun (for example, "Maya has everything needed and will be in touch today");
- add a pronoun to each team member's record.

## For the record (no decision needed)

- **Undo label:** the funding queue's undo button reads "Undo release · m:ss". The Offers prototype has no undo button, so this wording isn't from the design.
- **Manual lead send button:** the Merchant Link send button in step 3 is solid teal. The design shows it pale grey on the mint card, which CLAUDE.md rule 7 doesn't allow, so the rule was followed.
- **Rows of different heights:** three rows have boxes of different heights on purpose:
  - Home: My queue spans two rows.
  - Settings › Policy: the Policy simulator is sticky beside the rules.
  - Decision tab: the memo Sections are sticky beside the memo.
- **Final checks, at 1440 and 820 wide:**
  - no console errors, no horizontal scrolling and no cut-off text on any page;
  - every other internal link and in-page anchor opens a real target;
  - type-check, lint, all 132 tests and the production build pass.
