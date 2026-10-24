"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { findDuplicate, manualCopy, manualSteps, requiredDocs as requiredDocsFor, runChecks, useOfFunds, type RequiredDocView, type Status } from "@/lib/copy/intake-manual";
import type { ManualDraft, ManualLead } from "@/lib/data/types";
import type { ManualLeadData } from "@/lib/data/views/intake";

type Position = ManualLead["request"]["positions"][number];

/* ---------- small pieces ---------- */

const inputClass =
  "box-border h-[46px] min-w-0 rounded-tile border border-line-soft bg-field px-3.5 text-body text-ink outline-none focus:bg-tile focus:outline-2 focus:outline-offset-1 focus:outline-teal";

function Field({
  id,
  label,
  value,
  onChange,
  hint,
  mono,
  big,
  full,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: ReactNode;
  mono?: boolean;
  big?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${full ? "col-span-full" : ""}`}>
      <label htmlFor={id} className="text-label font-semibold text-grey-text">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} ${mono ? "font-mono" : ""} ${
          big ? "font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]" : ""
        }`}
      />
      {hint}
    </div>
  );
}

const h2 = "m-0 font-heading text-[22px] font-semibold text-ink";
const hint = "mt-1 mb-0 text-body-sm text-hint";
const grid = "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5";
const pill = (on: boolean) =>
  `h-[38px] cursor-pointer rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-tile text-ink"}`;

/* ---------- the page ---------- */

/**
 * The manual lead form for the draft in `data` (from the data layer). The
 * live fit check and the duplicate check run on every change, against the
 * shared policy and the past deals the draft came with.
 */
export function ManualLeadForm({ data }: { data: ManualLeadData }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lead, setLead] = useState<ManualLead>(data.draft.lead);

  const set = <K extends keyof ManualLead>(part: K, patch: Partial<ManualLead[K]>) =>
    setLead((l) => ({ ...l, [part]: { ...l[part], ...patch } }));
  const setPos = (i: number, patch: Partial<Position>) =>
    set("request", { positions: lead.request.positions.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

  const { checks, fits } = runChecks(lead, data.policy, data.now);
  const dup = findDuplicate(lead, data.draft.pastDeals);
  const docs = requiredDocsFor(data.draft, data.policy, data.now);

  const back = () => setStep((s) => Math.max(1, s - 1));
  const next = () => (step === 4 ? router.push("/submissions") : setStep((s) => Math.min(4, s + 1)));

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={manualCopy.back.href} className="inline-flex items-center gap-1.5 text-cap font-semibold uppercase text-muted no-underline">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {manualCopy.back.label}
          </Link>
          <h1 className="mt-2 mb-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            {manualCopy.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-label text-hint">{manualCopy.saved(data.draft.savedAt)}</span>
          <Link href={manualCopy.saveExit.href} className="inline-flex h-11 items-center rounded-tile bg-card px-4 text-body-sm font-semibold text-ink no-underline">
            {manualCopy.saveExit.label}
          </Link>
        </div>
      </header>

      {/* Stepper */}
      <nav aria-label="Steps" className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2 rounded-[22px] bg-card p-1.5">
        {manualSteps.map((s, i) => {
          const k = i + 1;
          const cur = k === step;
          const done = k < step;
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => setStep(k)}
              aria-current={cur ? "step" : undefined}
              className={`flex cursor-pointer items-center gap-3 rounded-[16px] border-0 px-3 py-2.5 text-left ${
                cur ? "bg-teal text-white" : done ? "bg-mint-bg text-teal-dark" : "bg-transparent text-grey-text"
              }`}
            >
              <span
                className={`grid h-8 w-8 flex-none place-items-center rounded-[10px] font-mono text-label ${
                  cur ? "bg-mint text-ink" : done ? "bg-teal text-white" : "bg-tile text-grey-text"
                }`}
              >
                {s.n}
              </span>
              <span>
                <b className="block text-body-sm">{s.title}</b>
                <span className="text-[11.5px] opacity-75">{s.sub}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-start gap-3.5">
        {/* Form card */}
        <section className="flex min-w-0 flex-[999_1_520px] flex-col gap-5 rounded-card-lg bg-card p-6 text-ink">
          {step === 1 ? <StepCompany lead={lead} set={set} registry={data.draft.registry} /> : null}
          {step === 2 ? <StepRequest lead={lead} set={set} setPos={setPos} /> : null}
          {step === 3 ? <StepDocuments lead={lead} set={set} docs={docs} /> : null}
          {step === 4 ? <StepReview lead={lead} set={set} goto={setStep} docsReceived={data.draft.docsReceived} /> : null}

          <div className="flex items-center justify-between gap-2.5 border-t border-line pt-1.5">
            <button
              type="button"
              onClick={back}
              className={`h-[46px] cursor-pointer rounded-pill border-0 bg-tile px-[18px] text-body-sm font-semibold text-ink ${step === 1 ? "invisible" : ""}`}
            >
              Back
            </button>
            <span className="text-[11.5px] text-hint">Step {step} of 4</span>
            <button
              type="button"
              onClick={next}
              className="h-[46px] cursor-pointer rounded-pill border-0 bg-teal px-[22px] text-body-sm font-semibold text-white"
            >
              {step === 4 ? "Start underwriting" : "Continue"}
            </button>
          </div>
        </section>

        {/* Live fit check: sticky while the form scrolls */}
        <aside
          aria-labelledby="h-live"
          className="scrollbar-none sticky top-0 box-border flex max-h-[calc(100vh-64px)] min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5 self-start overflow-y-auto pb-[72px]"
        >
          <div className="flex flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink">
            <div className="flex items-center justify-between">
              <h2 id="h-live" className="m-0 font-heading text-[19px] font-semibold">Live fit check</h2>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-teal-deep">
                <span className="h-[7px] w-[7px] rounded-full bg-mint" />
                Updating
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {checks.map((c) => (
                <div key={c.key} className="flex items-start gap-2.5 rounded-tile bg-teal/7 px-3 py-2.5">
                  <StatusIcon status={c.status} />
                  <span>
                    <b className="text-body-sm">{c.title}</b>
                    <span className="block text-[11.5px] text-muted">{c.detail}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-[16px] border border-mint/30 bg-mint/14 px-3.5 py-3 text-[12.5px] text-muted">
              So far this lead{" "}
              <b className="text-ink">{fits ? "fits your policy" : "does not fit your policy"}</b>
              {fits ? "." : " yet."}
            </div>
          </div>

          <div className={`flex flex-col gap-2.5 rounded-card-lg p-5 ${dup ? "bg-amber-bg" : "bg-cream"}`}>
            <span className="text-cap font-semibold uppercase text-amber-text">Already in Cevrynt?</span>
            <b className="text-body">
              {dup
                ? `Possible match: ${dup.business} (${dup.dealId}).`
                : "No other deal matches this business, owner or phone."}
            </b>
            <span className="text-[11.5px] text-muted">
              {dup
                ? "Open it before you continue so you do not create a duplicate or miss a stack."
                : "We check every new lead against your past deals to catch duplicates and stacking early."}
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "good")
    return (
      <span className="mt-px grid h-5 w-5 flex-none place-items-center rounded-full bg-mint text-ink">
        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-10" />
        </svg>
      </span>
    );
  if (status === "warn")
    return <span className="mt-px grid h-5 w-5 flex-none place-items-center rounded-full bg-amber-light text-label font-bold text-ink">!</span>;
  if (status === "bad")
    return <span className="mt-px grid h-5 w-5 flex-none place-items-center rounded-full bg-red-light text-label font-bold text-ink">✕</span>;
  return <span className="mt-px box-border h-5 w-5 flex-none rounded-full border-2 border-hint" />;
}

/* ---------- steps ---------- */

type SetFn = <K extends keyof ManualLead>(part: K, patch: Partial<ManualLead[K]>) => void;

function StepCompany({ lead, set, registry }: { lead: ManualLead; set: SetFn; registry: ManualDraft["registry"] }) {
  const b = lead.business;
  const o = lead.owner;
  const found = registry !== null && b.name.trim().toLowerCase().includes(registry.matches);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={h2}>The business</h2>
        <p className={hint}>Start typing the legal name. We look it up in the state registry and fill in what we find.</p>
      </div>
      <div className={grid}>
        <Field
          id="m-name"
          label="Legal business name"
          value={b.name}
          onChange={(v) => set("business", { name: v })}
          full
          hint={
            found ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-teal-deep">
                <span className="h-[7px] w-[7px] rounded-full bg-teal" />
                {registry ? manualCopy.registryFound(registry) : null}
              </span>
            ) : (
              <span className="text-[11.5px] text-hint">{manualCopy.registryNone}</span>
            )
          }
        />
        <Field id="m-dba" label="Doing business as" value={b.dba} onChange={(v) => set("business", { dba: v })} />
        <Field id="m-ein" label="EIN" value={b.ein} onChange={(v) => set("business", { ein: v })} mono />
        <Field id="m-ind" label="Industry" value={b.industry} onChange={(v) => set("business", { industry: v })} />
        <Field id="m-start" label="Business start date" value={b.start} onChange={(v) => set("business", { start: v })} />
        <Field id="m-addr" label="Business address" value={b.address} onChange={(v) => set("business", { address: v })} full />
        <Field id="m-ph" label="Business phone" value={b.phone} onChange={(v) => set("business", { phone: v })} />
        <Field id="m-ent" label="Entity type" value={b.entity} onChange={(v) => set("business", { entity: v })} />
        <Field id="m-st" label="State of formation" value={b.state} onChange={(v) => set("business", { state: v })} />
        <Field id="m-web" label="Website" value={b.website} onChange={(v) => set("business", { website: v })} />
      </div>
      <div className="h-px bg-line" />
      <div className="flex items-end justify-between">
        <div>
          <h2 className={h2}>Owners</h2>
          <p className={hint}>Everyone with 20% or more. They get their own identity check later.</p>
        </div>
        <button type="button" className="h-[38px] cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-[12.5px] font-semibold text-ink">
          + Add owner
        </button>
      </div>
      <div className={`${grid} rounded-tile-lg border border-line bg-tile p-4`}>
        <Field id="o-name" label="Full name" value={o.name} onChange={(v) => set("owner", { name: v })} />
        <Field id="o-own" label="Ownership" value={o.ownership} onChange={(v) => set("owner", { ownership: v })} />
        <Field id="o-mail" label="Email" value={o.email} onChange={(v) => set("owner", { email: v })} />
        <Field id="o-ph" label="Mobile" value={o.mobile} onChange={(v) => set("owner", { mobile: v })} />
        <Field
          id="o-addr"
          label="Home address"
          value={o.address}
          onChange={(v) => set("owner", { address: v })}
          full
          hint={
            <span className="text-[11.5px] text-hint">
              Used for the identity and sanctions check. Date of birth and credit consent are collected by the owner through Merchant Link.
            </span>
          }
        />
      </div>
    </div>
  );
}

function StepRequest({ lead, set, setPos }: { lead: ManualLead; set: SetFn; setPos: (i: number, p: Partial<Position>) => void }) {
  const r = lead.request;
  const toggleUse = (u: string) =>
    set("request", { uses: r.uses.includes(u) ? r.uses.filter((x) => x !== u) : [...r.uses, u] });
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={h2}>The request</h2>
        <p className={hint}>What the merchant asked for and what they told you. We compare it with the bank statements later.</p>
      </div>
      <div className={grid}>
        <Field id="r-amt" label="Requested amount" value={r.amount} onChange={(v) => set("request", { amount: v })} big />
        <Field id="r-rev" label="Stated monthly revenue" value={r.revenue} onChange={(v) => set("request", { revenue: v })} big />
      </div>
      <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
        <legend className="mb-2 text-label font-semibold text-grey-text">Use of funds</legend>
        <div className="flex flex-wrap gap-2">
          {useOfFunds.map((u) => (
            <button key={u} type="button" aria-pressed={r.uses.includes(u)} onClick={() => toggleUse(u)} className={pill(r.uses.includes(u))}>
              {u}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-3 rounded-tile-lg border border-line bg-tile p-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <b className="text-body">Existing advances or loans the merchant disclosed</b>
          <span role="group" aria-label="Disclosed positions" className="inline-flex rounded-pill bg-tile p-[3px]">
            <button type="button" aria-pressed={r.hasPositions} onClick={() => set("request", { hasPositions: true })} className={`h-8 cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${r.hasPositions ? "bg-teal text-white" : "bg-transparent text-ink"}`}>
              Yes
            </button>
            <button type="button" aria-pressed={!r.hasPositions} onClick={() => set("request", { hasPositions: false })} className={`h-8 cursor-pointer rounded-pill border-0 px-3.5 text-label font-semibold ${!r.hasPositions ? "bg-teal text-white" : "bg-transparent text-ink"}`}>
              None
            </button>
          </span>
        </div>
        {r.hasPositions ? (
          <>
            {r.positions.map((p, i) => (
              <div key={i} className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                <Field id={`p-f-${i}`} label="Funder" value={p.funder} onChange={(v) => setPos(i, { funder: v })} />
                <Field id={`p-p-${i}`} label="Payment" value={p.payment} onChange={(v) => setPos(i, { payment: v })} />
                <Field id={`p-b-${i}`} label="Balance left (approx.)" value={p.balance} onChange={(v) => setPos(i, { balance: v })} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("request", { positions: [...r.positions, { funder: "", payment: "", balance: "" }] })}
              className="h-[34px] cursor-pointer self-start rounded-pill border-0 bg-transparent px-3 text-[12.5px] font-semibold text-teal"
            >
              + Add another position
            </button>
          </>
        ) : null}
      </div>
      <div className={grid}>
        <Field id="b-name" label="Broker" value={r.broker} onChange={(v) => set("request", { broker: v })} hint={<span className="text-[11.5px] text-hint">Leave empty for a direct merchant</span>} />
        <Field id="b-com" label="Broker commission" value={r.commission} onChange={(v) => set("request", { commission: v })} />
      </div>
    </div>
  );
}

const docChip = {
  partial: "bg-amber-bg text-amber-text",
  received: "bg-mint-bg text-teal-dark",
  missing: "bg-grey-bg text-grey-text",
};

function StepDocuments({ lead, set, docs }: { lead: ManualLead; set: SetFn; docs: RequiredDocView[] }) {
  const { merchantLinkSent: sent, copyBroker } = lead.documents;
  const first = lead.owner.name.trim().split(" ")[0] || "the owner";
  const brokerFirst = (lead.request.brokerContact ?? "").trim().split(" ")[0];
  const hasBroker = !!lead.request.broker.trim() && !!brokerFirst;
  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <h2 className={h2}>Documents</h2>
        <p className={hint}>Drop what you have now. Anything missing can be requested straight from the merchant.</p>
      </div>
      <div className="flex flex-col items-center gap-2.5 rounded-card border-[1.5px] border-dashed border-line-dashed bg-tile p-[30px] text-center">
        <span className="grid h-[52px] w-[52px] place-items-center rounded-[18px] bg-mint-bg text-teal">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V3M7 8l5-5 5 5M5 21h14" />
          </svg>
        </span>
        <b className="text-[15px]">Drag files here</b>
        <span className="text-[12.5px] text-hint">PDF, image, XLS or CSV · we sort and name them for you</span>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-teal px-[18px] text-body-sm font-semibold text-white">
          Browse files
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-cap font-semibold uppercase text-hint">Required by your policy</span>
        {docs.map((d) => (
          <div key={d.id} className="flex items-center gap-3 rounded-[16px] bg-tile px-3.5 py-3">
            <span className="flex-1">
              <b className="text-[13.5px]">{d.title}</b>
              <span className="block text-[11.5px] text-hint">{d.note}</span>
            </span>
            <span className={`rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${docChip[d.status]}`}>{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 rounded-card border border-mint-border bg-mint-card p-[18px] text-ink">
        <div className="flex-[1_1_260px]">
          <b className="font-heading text-[18px] font-semibold">Ask the merchant instead</b>
          <p className="mt-1 mb-0 text-[12.5px] text-muted">
            Merchant Link sends {first} a secure page to upload statements, connect the bank, verify ID and sign. Everything lands in this deal.
          </p>
          <p className="mt-1.5 mb-0 text-[12.5px] text-muted">
            Goes to the owner: <b className="text-ink">{lead.owner.email || "no email yet"}</b>
            {lead.owner.mobile ? (
              <>
                {" "}and <b className="text-ink">{lead.owner.mobile}</b> by text
              </>
            ) : null}
            .
          </p>
          {hasBroker ? (
            <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-[12.5px] text-ink">
              <input
                type="checkbox"
                checked={copyBroker}
                disabled={sent}
                onChange={(e) => set("documents", { copyBroker: e.target.checked })}
                className="h-[18px] w-[18px] accent-teal"
              />
              Also copy the broker ({brokerFirst})
            </label>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => set("documents", { merchantLinkSent: true })}
          disabled={sent}
          className={`h-[42px] rounded-pill border-0 px-[18px] text-body-sm font-semibold ${
            sent ? "cursor-default bg-mint-bg text-teal-dark" : "cursor-pointer bg-card text-ink"
          }`}
        >
          {sent
            ? `Sent to ${lead.owner.email}${copyBroker && hasBroker ? ` · copied ${brokerFirst}` : ""}`
            : `Send Merchant Link to ${first}`}
        </button>
      </div>
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cursor-pointer border-0 bg-transparent p-0 text-label font-semibold text-teal">
      Edit
    </button>
  );
}

function StepReview({ lead, set, goto, docsReceived }: { lead: ManualLead; set: SetFn; goto: (n: number) => void; docsReceived: ManualDraft["docsReceived"] }) {
  const b = lead.business;
  const o = lead.owner;
  const r = lead.request;
  const nPos = r.hasPositions ? r.positions.filter((p) => p.funder.trim()).length : 0;
  const card = "rounded-tile-lg bg-tile p-4";
  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <h2 className={h2}>Review and start</h2>
        <p className={hint}>Check the details, choose who gets it, and start underwriting.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        <div className={card}>
          <div className="flex justify-between"><span className="text-cap font-semibold uppercase text-hint">Business</span><EditButton onClick={() => goto(1)} /></div>
          <b className="mt-1.5 block text-[15px]">{b.name || "—"}</b>
          <span className="text-[12.5px] text-hint">{b.industry} · since {b.start}<br />{b.address}</span>
        </div>
        <div className={card}>
          <div className="flex justify-between"><span className="text-cap font-semibold uppercase text-hint">Owner</span><EditButton onClick={() => goto(1)} /></div>
          <b className="mt-1.5 block text-[15px]">{o.name} · {o.ownership}</b>
          <span className="text-[12.5px] text-hint">{o.email}<br />{o.mobile}</span>
        </div>
        <div className={card}>
          <div className="flex justify-between"><span className="text-cap font-semibold uppercase text-hint">Request</span><EditButton onClick={() => goto(2)} /></div>
          <b className="mt-1.5 block font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em]">{r.amount}</b>
          <span className="text-[12.5px] text-hint">
            {r.uses.length ? r.uses.map((u, i) => (i ? u.toLowerCase() : u)).join(", ") : "No use of funds"} · {nPos} position{nPos === 1 ? "" : "s"} disclosed
            <br />
            {r.broker ? `${r.broker} · ${r.commission}` : "Direct merchant"}
          </span>
        </div>
        <div className={card}>
          <div className="flex justify-between"><span className="text-cap font-semibold uppercase text-hint">Documents</span><EditButton onClick={() => goto(3)} /></div>
          <b className="mt-1.5 block text-[15px]">{docsReceived.received} of {docsReceived.total} received</b>
          <span className="text-[12.5px] text-hint">
            {lead.documents.merchantLinkSent ? "Merchant Link sent for the rest" : "Merchant Link not sent yet"}
            <br />Underwriting starts now, missing items become stips
          </span>
        </div>
      </div>
      <div className={grid}>
        <Field id="a-to" label="Assign to" value={lead.review.assignTo} onChange={(v) => set("review", { assignTo: v })} />
        <Field id="a-pr" label="Priority" value={lead.review.priority} onChange={(v) => set("review", { priority: v })} />
      </div>
    </div>
  );
}
