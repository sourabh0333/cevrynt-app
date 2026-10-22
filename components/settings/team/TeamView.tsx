"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  accessReview as ar,
  DAILY_CAPACITY,
  invite,
  ladder,
  leaving,
  limitText,
  outside,
  people,
  peopleCard as pc,
  permissions as pm,
  roleNames,
  roleOrder,
  roleShort,
  sharing,
  teamHeader as th,
  twoPeople,
  type Perm,
  type RoleKey,
} from "@/lib/sample-data/team";

const roleChip: Record<RoleKey, string> = {
  uw: "bg-mint-bg text-teal-dark",
  sr: "bg-teal text-white",
  fund: "bg-blue-bg text-blue-text",
  col: "bg-amber-bg text-amber-text",
  adm: "bg-purple-bg text-purple-text",
};
const markStyle: Record<Perm, string> = {
  y: "bg-teal text-white",
  l: "bg-amber-bg text-amber-text",
  n: "bg-transparent text-hint-mute",
};
const markSym: Record<Perm, string> = { y: "✓", l: "½", n: "–" };

/*
 * Design: minmax(180px,1.4fr) 140px 110px 120px 90px 110px with a 720px
 * minimum and sideways scroll. Here the fixed columns are a little tighter,
 * the name truncates, and as the list narrows "Can approve", then "Today"
 * hide (container queries on the card). "2-step login" always stays, so an
 * "Off" is never hidden; at the narrowest the role chip shrinks instead.
 */
const pcols =
  "grid grid-cols-[minmax(0,1.4fr)_128px_80px_110px_80px_84px] items-center gap-3 @max-[700px]:grid-cols-[minmax(0,1.4fr)_128px_110px_80px_84px] @max-[700px]:[&>:nth-child(3)]:hidden @max-[600px]:grid-cols-[minmax(0,1.4fr)_128px_64px_84px] @max-[600px]:[&>:nth-child(4)]:hidden @max-[480px]:grid-cols-[minmax(0,1fr)_minmax(0,110px)_48px_84px] @max-[480px]:gap-2";

/* Permissions: action + five roles; when narrow only the highlighted role's column stays. */
const mcols = "grid grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))] gap-1.5 @max-[600px]:grid-cols-[minmax(0,1fr)_96px]";

const whiteCard = "box-border flex min-w-0 flex-col rounded-card-lg border border-line bg-tile p-5 text-ink";
const greyCard = "box-border flex min-w-0 flex-col rounded-card-lg bg-card p-5 text-ink";
const mintCard = "box-border flex min-w-0 flex-col rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink";
const h2 = "m-0 font-heading text-card-title font-semibold";
const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";

/**
 * Settings → Team & roles from design/Settings-Team.html and its prototype.
 * The People list toggles each person between Working and Away; workloads
 * come from the Submissions page's figures. Clicking a role highlights its
 * column in the permissions grid. The approval ladder reads the same
 * limits the Offer and Policy pages use. No hover.
 */
export function TeamView() {
  const [away, setAway] = useState<Record<string, boolean>>({});
  const [role, setRole] = useState<RoleKey>("uw");
  const ci = roleOrder.indexOf(role);
  const faces = th.faces.map((ini) => people.find((p) => p.ini === ini)!);

  const roleButton = (k: RoleKey) => (
    <button
      key={k}
      type="button"
      aria-pressed={k === role}
      onClick={() => setRole(k)}
      className={`h-[34px] cursor-pointer whitespace-nowrap rounded-pill border-0 px-3 text-label font-bold ${k === role ? "bg-teal text-white" : "bg-card text-grey-text"}`}
    >
      {roleShort[k]}
    </button>
  );

  return (
    <>
      <section
        aria-labelledby="h-team"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="h-team" className="m-0 font-heading text-[24px] font-semibold">{th.title}</h2>
          <span className="text-[12.5px] text-grey-text">{th.text}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex" aria-label={`${people.length} people`}>
            {faces.map((p, i) => (
              <Avatar key={p.ini} initials={p.ini} name={p.name} color={p.avatar} size={32} className={`border-2 border-mint-light ${i ? "-ml-2" : ""}`} />
            ))}
            <span className="-ml-2 grid h-8 w-8 place-items-center rounded-full border-2 border-mint-light bg-tile text-[10.5px] font-bold">
              +{people.length - faces.length}
            </span>
          </span>
          <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-teal px-4 text-[12.5px] font-semibold text-white">
            {th.invite}
          </button>
        </div>
      </section>

      <section aria-labelledby="h-mem" className={`@container ${greyCard} gap-2.5`}>
        <div>
          <h2 id="h-mem" className="m-0 font-heading text-[19px] font-semibold">{pc.title}</h2>
          <span className="text-label text-hint">{pc.subtitle}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className={`${pcols} items-end! px-3.5 pb-0.5 text-[10px] leading-[1.3] font-semibold tracking-[0.08em] uppercase text-hint`}>
            {pc.columns.map((c) => (
              <span key={c} className="min-w-0 break-words">
                {c}
              </span>
            ))}
          </div>
          {people.map((p, i) => {
            const isAway = !!away[p.ini];
            const isUw = p.role === "uw" || p.role === "sr";
            const load = typeof p.load === "number" ? p.load : 0;
            return (
              <div key={p.ini} className={`${pcols} rounded-[16px] bg-tile px-3.5 py-2.5 text-[12.5px]`}>
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar initials={p.ini} color={p.avatar} size={34} />
                  <span className="min-w-0">
                    <b className="block truncate text-body-sm">{p.name}</b>
                    <span className="block truncate text-[11.5px] text-hint">{p.email}</span>
                  </span>
                </span>
                <span className={`max-w-full justify-self-start truncate rounded-pill px-[9px] py-[3px] text-label-sm font-bold ${roleChip[p.role]}`}>{roleNames[p.role]}</span>
                <b className="font-heading tabular-nums tracking-[-0.03em]">{limitText(p.limit)}</b>
                <span className="min-w-0">
                  <span className="block truncate text-label">{isUw ? pc.loadText(load) : p.load}</span>
                  <ProgressBar
                    className="mt-1"
                    value={isUw ? (load / DAILY_CAPACITY) * 100 : 0}
                    height={5}
                    track="line"
                    color={load >= 9 ? "amber" : "teal"}
                    delay={0.2 + i * 0.06}
                    aria-label={isUw ? `${p.name}: ${pc.loadText(load)}` : undefined}
                  />
                </span>
                <span className={`justify-self-start rounded-pill px-[9px] py-[3px] text-label-sm font-bold ${p.mfa ? "bg-mint-bg text-teal-dark" : "bg-red-bg text-red-text"}`}>
                  {p.mfa ? pc.mfa.on : pc.mfa.off}
                </span>
                <button
                  type="button"
                  aria-pressed={isAway}
                  aria-label={`${p.name}: ${isAway ? pc.status.away : pc.status.working}`}
                  onClick={() => setAway((a) => ({ ...a, [p.ini]: !a[p.ini] }))}
                  className={`h-[30px] cursor-pointer justify-self-start rounded-pill border-0 px-3 text-[11.5px] font-semibold ${isAway ? "bg-amber-bg text-amber-text" : "bg-card text-grey-text"}`}
                >
                  {isAway ? pc.status.away : pc.status.working}
                </button>
              </div>
            );
          })}
          <div className={`${pcols} rounded-[16px] border-[1.5px] border-dashed border-line-dash-soft px-3.5 py-2.5 text-[12.5px]`}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="box-border grid h-[34px] w-[34px] flex-none place-items-center rounded-full border-[1.5px] border-dashed border-grey-dot text-label-sm text-hint">{invite.ini}</span>
              <span className="min-w-0">
                <b className="block truncate text-body-sm">{invite.name}</b>
                <span className="block truncate text-[11.5px] text-hint">{invite.email}</span>
              </span>
            </span>
            <span className="truncate">{roleNames[invite.role]}</span>
            <span className="font-heading tabular-nums tracking-[-0.03em]">{limitText(invite.limit)}</span>
            <span className="truncate text-[11.5px] text-hint">{invite.sent}</span>
            <span />
            <button type="button" className="h-[30px] cursor-pointer justify-self-start rounded-pill border-0 bg-card px-3 text-[11.5px] font-semibold text-ink">
              {invite.resend}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-roles" className={`@container ${whiteCard} gap-3`}>
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-roles" className="m-0 font-heading text-[19px] font-semibold">{pm.title}</h2>
            <span className="text-label text-hint">{pm.subtitle}</span>
          </div>
          <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
            {pm.add}
          </button>
        </div>
        {/* When the grid is narrow, the role buttons move to a chip row that scrolls with a hidden scrollbar. */}
        <div role="group" aria-label="Roles" className="scrollbar-none hidden flex-nowrap gap-1.5 overflow-x-auto @max-[600px]:flex">
          {roleOrder.map(roleButton)}
        </div>
        <div className="flex flex-col gap-1">
          <div className={`${mcols} items-end px-2.5 pb-1 @max-[600px]:hidden`} role="group" aria-label="Roles">
            <span />
            {roleOrder.map(roleButton)}
          </div>
          {pm.rows.map((r) => (
            <div key={r.label} className={`${mcols} items-center rounded-[12px] bg-card px-2.5 py-2 text-[12.5px]`}>
              <span className="min-w-0">{r.label}</span>
              {r.marks.map((m, i) => (
                <span key={i} className={`grid h-[30px] place-items-center rounded-[10px] ${i === ci ? "bg-mint-light" : ""} ${i === ci ? "" : "@max-[600px]:hidden"}`}>
                  <span
                    role="img"
                    aria-label={`${roleShort[roleOrder[i]]}: ${pm.markLabel[m]}`}
                    className={`grid h-6 w-6 place-items-center rounded-full text-label font-bold ${markStyle[m]}`}
                  >
                    <span aria-hidden="true">{markSym[m]}</span>
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="@container flex flex-col gap-3.5">
        <section aria-label="Approvals, two-person rules and sharing" className={row3}>
          <article aria-labelledby="h-lad" className={`${mintCard} gap-2.5`}>
            <h2 id="h-lad" className={h2}>{ladder.title}</h2>
            <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
              {ladder.steps.map((s) => (
                <li key={s.range} className={`flex items-center gap-2.5 rounded-tile px-3 py-[11px] ${s.outside ? "bg-red-bg text-red-text" : "bg-tile"}`}>
                  <b className="w-[104px] flex-none whitespace-nowrap font-heading text-body-sm tabular-nums tracking-[-0.03em]">{s.range}</b>
                  <span className="min-w-0 text-[12.5px]">{s.who}</span>
                </li>
              ))}
            </ol>
          </article>

          <article aria-labelledby="h-two" className={`${whiteCard} gap-2`}>
            <h2 id="h-two" className={h2}>{twoPeople.title}</h2>
            <span className="text-label text-hint">{twoPeople.text}</span>
            {twoPeople.items.map((t) => (
              <span key={t} className="flex items-center gap-2.5 rounded-tile bg-card px-3 py-2.5 text-[12.5px]">
                <b aria-hidden="true" className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal font-heading text-label-sm text-white">
                  2
                </b>
                {t}
              </span>
            ))}
          </article>

          <article aria-labelledby="h-asg" className={`${greyCard} gap-2`}>
            <h2 id="h-asg" className={h2}>{sharing.title}</h2>
            {sharing.rows.map((s) => (
              <span key={s.label} className="flex justify-between gap-2 rounded-tile bg-tile px-3 py-2.5 text-[12.5px]">
                <span>{s.label}</span>
                <b className="text-right">{s.value}</b>
              </span>
            ))}
          </article>
        </section>

        <section aria-label="Outside access, access review and leaving" className={row3}>
          <article aria-labelledby="h-out" className={`${whiteCard} gap-2`}>
            <h2 id="h-out" className={h2}>{outside.title}</h2>
            <span className="text-label text-hint">{outside.text}</span>
            {outside.rows.map((o) => (
              <span key={o.title} className="flex items-center justify-between gap-2 rounded-tile bg-card px-3 py-[11px] text-[12.5px]">
                <span className="min-w-0">
                  <b className="block">{o.title}</b>
                  <span className="text-[11.5px] text-hint">{o.hint}</span>
                </span>
                {o.soon ? (
                  <span className="rounded-pill bg-blue-bg px-2 py-0.5 text-[10.5px] font-bold text-blue-text">{o.soon}</span>
                ) : (
                  <b className="font-heading tabular-nums tracking-[-0.03em]">{o.count}</b>
                )}
              </span>
            ))}
          </article>

          <article aria-labelledby="h-rev" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-red-bg p-5 text-ink">
            <div className="flex items-center justify-between gap-2">
              <h2 id="h-rev" className={h2}>{ar.title}</h2>
              <span className="whitespace-nowrap rounded-pill bg-tile px-[9px] py-[3px] text-label-sm font-bold text-red-text">{ar.chip}</span>
            </div>
            <span className="text-[12.5px] text-red-deep">{ar.text}</span>
            <div className="grid grid-cols-2 gap-1.5">
              {ar.facts.map((f) => (
                <span key={f.label} className="min-w-0 rounded-tile bg-white/75 px-3 py-2.5">
                  <span className="block text-label-sm text-red-deep">{f.label}</span>
                  <b className="text-body-sm">{f.value}</b>
                </span>
              ))}
            </div>
            <button type="button" className="mt-auto h-10 cursor-pointer rounded-pill border-0 bg-teal text-[12.5px] font-semibold text-white">
              {ar.cta}
            </button>
          </article>

          <article aria-labelledby="h-leave" className={`${mintCard} gap-2`}>
            <h2 id="h-leave" className={h2}>{leaving.title}</h2>
            <span className="text-label text-grey-text">{leaving.text}</span>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {leaving.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 rounded-tile bg-tile px-3 py-2.5 text-[12.5px]">
                  <b aria-hidden="true" className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-teal font-heading text-label-sm text-white">
                    {i + 1}
                  </b>
                  {s}
                </li>
              ))}
            </ol>
          </article>
        </section>
      </div>
    </>
  );
}
