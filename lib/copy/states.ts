/**
 * Wording for the shared "not found" and error views (DATA-PLAN.md,
 * section 3). Empty lists keep their own messages from the designs.
 */
export const notFoundCopy = {
  page: {
    title: "We couldn't find that page",
    text: "The link may be old, or the page may have moved.",
    action: { label: "Back to Home", href: "/" },
  },
  deal: {
    title: (id: string, workspace: string) => `There's no deal ${id} in ${workspace}`,
    titleNoId: "We couldn't find that deal",
    text: "Check the ID, or find the deal in Submissions.",
    action: { label: "Open Submissions", href: "/submissions" },
  },
  link: {
    title: "This link has expired or isn't valid",
    text: (funder: string) => `Ask ${funder} to send a new one.`,
    call: "Call us",
  },
};

export const errorCopy = {
  page: {
    title: "Something went wrong loading this page",
    text: "Nothing was changed. Try again, and if it keeps happening, let your admin know.",
    retry: "Try again",
    home: { label: "Back to Home", href: "/" },
  },
  public: {
    title: "Something went wrong",
    text: "Your progress is saved. Try again in a moment.",
    retry: "Try again",
  },
};

export const loadingLabel = "Loading";

/** The tooltip on a button whose page or action isn't built yet. */
export const comingSoonHint = "Coming soon";
