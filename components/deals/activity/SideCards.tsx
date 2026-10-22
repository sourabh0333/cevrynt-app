"use client";

import { useState } from "react";
import { messages as m, noteCard as t, type Thread } from "@/lib/sample-data/deal-activity";

/**
 * "Add a note" from design/Deal-Activity.html and its prototype: the note
 * box with the @Priya and @Jordan buttons, the Following avatars and the
 * "Remind me tomorrow" toggle. Posting hands the note to the timeline.
 */
export function NoteCard({ onAdd }: { onAdd: (text: string) => void }) {
  const [draft, setDraft] = useState("");
  const [remind, setRemind] = useState(false);
  const can = draft.trim().length > 0;
  const mention = (name: string) => setDraft((d) => (d ? `${d} ` : "") + `${name} `);
  const add = () => {
    if (!can) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <article aria-labelledby="h-note" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-note" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
      <span className="text-[12.5px] text-grey-text">{t.intro}</span>
      <textarea
        aria-label="Note"
        rows={3}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={t.placeholder}
        className="box-border resize-y rounded-[16px] border border-line-deep bg-card px-3.5 py-3 font-sans text-body-sm text-ink outline-none placeholder:text-hint focus:outline-2 focus:outline-offset-1 focus:outline-teal"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {t.mentions.map((name) => (
            <button key={name} type="button" onClick={() => mention(name)} className="h-8 cursor-pointer rounded-pill border-0 bg-white/75 px-3 text-label font-semibold text-ink">
              {name}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-disabled={!can}
          onClick={add}
          className={`h-[38px] rounded-pill border-0 px-4 text-[12.5px] font-semibold ${can ? "cursor-pointer bg-teal text-white" : "bg-white/60 text-hint-soft"}`}
        >
          {t.add}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/8 pt-2.5">
        <span className="flex items-center gap-2 text-label text-grey-text">
          <span className="flex">
            {t.following.people.map((p, i) => (
              <span
                key={p.ini}
                className={`grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-card-deep text-[9px] font-bold ${p.fill} ${i > 0 ? "-ml-2" : ""}`}
              >
                {p.ini}
              </span>
            ))}
          </span>
          {t.following.label}
        </span>
        <button
          type="button"
          aria-pressed={remind}
          onClick={() => setRemind((r) => !r)}
          className={`h-8 cursor-pointer rounded-pill border-0 px-3 text-label font-semibold ${remind ? "bg-teal text-white" : "bg-white/75 text-ink"}`}
        >
          {remind ? t.remind.on : t.remind.off}
        </button>
      </div>
    </article>
  );
}

const bubble = {
  me: "self-end max-w-[85%] rounded-[16px_16px_4px_16px] bg-mint px-3 py-2.5 text-[12.5px] text-ink",
  them: "self-start max-w-[85%] rounded-[16px_16px_16px_4px] bg-white/10 px-3 py-2.5 text-[12.5px]",
  system: "self-center rounded-pill bg-teal/8 px-3 py-1.5 text-[11.5px] text-muted",
};

/** "Messages": the Broker / Merchant threads with delivery status and the reply box. */
export function MessagesCard() {
  const [thread, setThread] = useState<Thread>("broker");
  return (
    <article
      aria-labelledby="h-msg"
      className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-msg" className="m-0 font-heading text-[20px] font-semibold">{m.title}</h2>
        <div role="group" aria-label="Conversation" className="flex gap-0.5 rounded-pill bg-teal/7 p-[3px]">
          {m.tabs.map((tab) => {
            const on = tab.key === thread;
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={on}
                onClick={() => setThread(tab.key)}
                className={`h-[30px] cursor-pointer rounded-pill border-0 px-3 text-[11.5px] font-semibold ${on ? "bg-card text-ink" : "bg-transparent text-muted"}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2.5" aria-live="polite">
        {m.threads[thread].map((msg) => (
          <div key={msg.text} className={bubble[msg.from]}>
            {msg.text}
            {msg.from === "system" ? (
              <span className="ml-1.5 text-[10.5px] text-muted">{msg.meta}</span>
            ) : (
              <span className="mt-1 block text-[10.5px] text-muted">{msg.meta}</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1.5">
        <input
          aria-label="Reply"
          placeholder={m.replyHint[thread]}
          className="box-border h-10 min-w-0 flex-1 rounded-pill border border-teal/7 bg-teal/7 px-3.5 text-[12.5px] text-ink outline-none placeholder:text-hint focus:outline-2 focus:outline-offset-1 focus:outline-teal"
        />
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-card px-3.5 text-label font-semibold text-ink">
          {m.send}
        </button>
      </div>
      <span className="text-label-sm text-muted">{m.channel[thread]}</span>
    </article>
  );
}
