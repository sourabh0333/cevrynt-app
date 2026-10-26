/**
 * Interface wording for the merchant-facing Merchant Link page (/m/[token],
 * design/Merchant-Link.html and its prototype). Spanish follows the
 * prototype's own translations. Every name, time and figure is read from
 * the link and its deal (merchantLinkView): the owner, the business and
 * what it asked for, the statement months, the account, the address, the
 * underwriter, the broker's contact, the funder and how long a link works.
 */
import type { LinkStepKey } from "@/lib/data/types";
import type { MerchantLinkData } from "@/lib/data/views/public";
import { clockTime, daysBetween, money, monthName, plural } from "@/lib/format";
import { firstName } from "./team";
import { shortFunderName } from "./public";

export type Lang = "en" | "es";
export type StepKind = "consent" | "upload" | "bank";

/** A step as the page draws it. */
export type LinkStepView = {
  key: string;
  title: Record<Lang, string>;
  sub: string;
  /** already finished when the link opens */
  done: boolean;
  /** what a finished step says when opened */
  note?: string;
  kind?: StepKind;
  optional?: boolean;
};

const stepWords: Record<LinkStepKey, { title: Record<Lang, string>; kind?: StepKind }> = {
  verify: { title: { en: "Confirm it’s you", es: "Confirme que es usted" } },
  stmts: { title: { en: "Bank statements", es: "Estados de cuenta" } },
  id: { title: { en: "Photo ID and selfie", es: "Identificación y selfie" } },
  void: { title: { en: "Voided check", es: "Cheque anulado" } },
  consent: { title: { en: "Credit check permission", es: "Permiso de crédito" }, kind: "consent" },
  letter: { title: { en: "Landlord letter", es: "Carta del arrendador" }, kind: "upload" },
  bank: { title: { en: "Connect your bank", es: "Conectar su banco" }, kind: "bank" },
};

/** "June to September 2026", from the statement months. */
const monthSpan = (months: string[]) => {
  const first = months[0], last = months[months.length - 1];
  return `${monthName(first, "long")} to ${monthName(last, "long")} ${last.slice(0, 4)}`;
};

/** What each step says under its title, and once it's done. */
function stepLines(key: LinkStepKey, d: MerchantLinkData, doneAt: string | null): { sub: string; note?: string } {
  const time = doneAt ? clockTime(doneAt) : "";
  switch (key) {
    case "verify":
      return { sub: `Code sent to ${d.owner.phone}`, note: `Confirmed at ${time}` };
    case "stmts":
      return { sub: monthSpan(d.statementMonths), note: `${plural(d.statementMonths.length, "statement")} received at ${time}` };
    case "id":
      return { sub: "Driver license and a quick selfie", note: `Checked at ${time}` };
    case "void":
      return { sub: "So we know where to send money", note: `Matches account ending ${d.accountLast4}` };
    case "consent":
      return { sub: "Soft check, no effect on your score" };
    case "letter":
      return { sub: "Lease is current and rent is paid" };
    case "bank":
      return { sub: "Recommended · skip future statements" };
  }
}

/** The browser tab's title. */
export const pageTitle = (funder: string) => `${funder} · Finish your application`;

/** About two minutes a step, plus one. */
export const minutesLeft = (requiredLeft: number) => `${requiredLeft === 0 ? 0 : requiredLeft * 2 + 1} min`;

export const languages: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

/** Everything the page says for one link, worded from its records. */
export function merchantLinkCopy(d: MerchantLinkData) {
  const merchant = { first: firstName(d.owner.name), name: d.owner.name, business: d.business, email: d.owner.email, requested: money(d.requested) };
  const funder = d.funder.name;
  const underwriter = d.underwriter ? firstName(d.underwriter.name) : funder;

  const linkSteps: LinkStepView[] = d.steps.map((s) => {
    const w = stepWords[s.key];
    const done = s.doneAt !== null;
    const lines = stepLines(s.key, d, s.doneAt);
    return { key: s.key, title: w.title, sub: lines.sub, done, ...(done && lines.note ? { note: lines.note } : {}), ...(w.kind ? { kind: w.kind } : {}), ...(s.optional ? { optional: true } : {}) };
  });

  const ui: Record<
    Lang,
    {
      secure: string;
      done: string;
      left: string;
      saved: string;
      yourApp: string;
      requested: string;
      help: string;
      status: { done: string; optional: string; next: string; todo: string };
      headline: { working: string; finished: string };
      subline: (left: number) => string;
      finished: string;
      continueTo: (step: string) => string;
    }
  > = {
    en: {
      secure: `Secure link for ${merchant.name}`,
      done: "done",
      left: "About this much left",
      saved: "Everything saves as you go",
      yourApp: "Your application",
      requested: "Amount you asked for",
      help: "Need help?",
      status: { done: "Done", optional: "Optional", next: "Next", todo: "To do" },
      headline: { working: `Hi ${merchant.first}, you’re nearly there`, finished: `All done, ${merchant.first}!` },
      subline: (n) => `${plural(n, "quick step")} left for your ${funder} application.`,
      finished: `${underwriter} has everything she needs and will be in touch today.`,
      continueTo: (step) => `Continue: ${step}`,
    },
    es: {
      secure: `Enlace seguro para ${merchant.name}`,
      done: "listo",
      left: "Tiempo restante",
      saved: "Guardamos todo automáticamente",
      yourApp: "Su solicitud",
      requested: "Cantidad solicitada",
      help: "¿Necesita ayuda?",
      status: { done: "Listo", optional: "Opcional", next: "Siguiente", todo: "Pendiente" },
      headline: { working: `Hola ${merchant.first}, ya casi termina`, finished: `¡Todo listo, ${merchant.first}!` },
      subline: (n) => `Faltan ${n} pasos para su solicitud con ${funder}.`,
      finished: `${underwriter} revisará todo y le escribirá hoy.`,
      continueTo: (step) => `Continuar: ${step}`,
    },
  };

  const stepPanels = {
    consent: {
      text: `You allow ${funder} to get a business and personal credit report for ${merchant.name} and ${merchant.business}, to review this application and while any advance is open. This is a soft check and won't affect your credit score.`,
      agree: `I agree, and I'm signing as ${merchant.name}`,
      sign: "Sign and continue",
    },
    upload: {
      text: `A short letter from your landlord saying your lease at ${d.street} is current and rent is paid. A photo of the signed letter is fine.`,
      drop: "Take a photo or choose a file",
      hint: "PDF or photo, up to 20 MB",
    },
    bank: {
      text: "Connecting your bank takes about a minute and lets us check new activity without asking you for more statements. We only ever read your account; we can't move money.",
      banks: ["Chase", "Bank of America", "TD Bank"],
      find: "Find my bank",
    },
    doneNote: "Done, thank you",
  };

  const received = daysBetween(d.receivedAt, d.now) === 0 ? `Today, ${clockTime(d.receivedAt)}` : clockTime(d.receivedAt);
  const application = {
    timeline: [
      { title: "Application received", hint: received, state: "done" },
      { title: "Being reviewed", hint: "Decision expected today", state: "now" },
      { title: "Offer and contract", hint: "Signed right here, online", state: "later" },
      { title: "Money sent", hint: `Usually within ${plural(d.fundTargetDays, "business day")}`, state: "later" },
    ] as { title: string; hint: string; state: "done" | "now" | "later" }[],
  };

  const helpCard = {
    person: d.underwriter
      ? { initials: d.underwriter.initials, name: d.underwriter.name, role: `Your underwriter at ${shortFunderName(funder)}` }
      : { initials: d.funder.initials, name: funder, role: "Your funder" },
    message: "Message",
    messageAria: `Message ${underwriter}`,
    phone: d.funder.supportPhone,
    broker: d.broker ? `Your broker, ${d.broker.contact} at ${d.broker.name}, can also help.` : "",
  };

  const privacy = {
    lead: "Your information is private.",
    text: "It's encrypted and only used to review your application.",
    sent: `This link was sent to ${merchant.email} and works for ${plural(d.expiryDays, "day")}.`,
  };

  const startOpen = linkSteps.find((s) => !s.done)?.key ?? null;

  return { merchant, linkSteps, startOpen, ui, stepPanels, application, helpCard, privacy };
}
