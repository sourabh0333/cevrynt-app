/**
 * Sample data for the merchant-facing Merchant Link page (/m/[token]),
 * copied from design/prototypes/Merchant-Link.dc.html (look:
 * design/Merchant-Link.html). Spanish follows the prototype's own
 * translations. "demo" is the only sample token. Real links come later.
 */

export type Lang = "en" | "es";
export type StepKind = "consent" | "upload" | "bank";

export const DEMO_TOKEN = "demo";

export type LinkStep = {
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

export const linkSteps: LinkStep[] = [
  { key: "verify", title: { en: "Confirm it’s you", es: "Confirme que es usted" }, sub: "Code sent to (207) 555-0188", done: true, note: "Confirmed at 9:43" },
  { key: "stmts", title: { en: "Bank statements", es: "Estados de cuenta" }, sub: "June to September 2026", done: true, note: "4 statements received at 9:40" },
  { key: "id", title: { en: "Photo ID and selfie", es: "Identificación y selfie" }, sub: "Driver license and a quick selfie", done: true, note: "Checked at 9:58" },
  { key: "void", title: { en: "Voided check", es: "Cheque anulado" }, sub: "So we know where to send money", done: true, note: "Matches account ending 7712" },
  { key: "consent", title: { en: "Credit check permission", es: "Permiso de crédito" }, sub: "Soft check, no effect on your score", done: false, kind: "consent" },
  { key: "letter", title: { en: "Landlord letter", es: "Carta del arrendador" }, sub: "Lease is current and rent is paid", done: false, kind: "upload" },
  { key: "bank", title: { en: "Connect your bank", es: "Conectar su banco" }, sub: "Recommended · skip future statements", done: false, kind: "bank", optional: true },
];

/** The step open when the page loads. */
export const startOpen = "consent";

export const funder = { initials: "RC", name: "Ridgeline Capital", legal: "Ridgeline Capital LLC · 100 Federal St, Boston, MA" };
export const merchant = { first: "Elena", name: "Elena Brooks", business: "Harbor Street Bakery LLC", email: "elena@harborstreetbakery.com", requested: "$45,000" };

/** Interface text, English and Spanish (as far as the prototype translates). */
export const ui: Record<Lang, {
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
}> = {
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
    subline: (n) => `${n} quick ${n === 1 ? "step" : "steps"} left for your ${funder.name} application.`,
    finished: "Maya has everything she needs and will be in touch today.",
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
    subline: (n) => `Faltan ${n} pasos para su solicitud con ${funder.name}.`,
    finished: "Maya revisará todo y le escribirá hoy.",
    continueTo: (step) => `Continuar: ${step}`,
  },
};

/** About two minutes a step, plus one. */
export const minutesLeft = (requiredLeft: number) => `${requiredLeft === 0 ? 0 : requiredLeft * 2 + 1} min`;

export const languages: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];

export const stepPanels = {
  consent: {
    text: `You allow ${funder.name} to get a business and personal credit report for ${merchant.name} and ${merchant.business}, to review this application and while any advance is open. This is a soft check and won't affect your credit score.`,
    agree: `I agree, and I'm signing as ${merchant.name}`,
    sign: "Sign and continue",
  },
  upload: {
    text: "A short letter from your landlord saying your lease at 418 Commercial St is current and rent is paid. A photo of the signed letter is fine.",
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

export const application = {
  timeline: [
    { title: "Application received", hint: "Today, 9:40", state: "done" },
    { title: "Being reviewed", hint: "Decision expected today", state: "now" },
    { title: "Offer and contract", hint: "Signed right here, online", state: "later" },
    { title: "Money sent", hint: "Usually within 2 business days", state: "later" },
  ] as { title: string; hint: string; state: "done" | "now" | "later" }[],
};

export const helpCard = {
  person: { initials: "MC", name: "Maya Chen", role: "Your underwriter at Ridgeline" },
  message: "Message",
  messageAria: "Message Maya",
  phone: "(617) 555-0190",
  broker: "Your broker, Dana Ruiz at Apex Funding Partners, can also help.",
};

export const privacy = {
  lead: "Your information is private.",
  text: "It's encrypted and only used to review your application.",
  sent: `This link was sent to ${merchant.email} and works for 7 days.`,
};

export const linkFooter = { privacy: "Privacy", terms: "Terms", powered: "Powered by", brand: "Cevrynt" };
