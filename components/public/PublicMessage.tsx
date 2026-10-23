import type { ReactNode } from "react";
import { FunderBrand, PublicFooter } from "./PublicChrome";

/**
 * A full public page with one message card, branded as the funder: used for
 * an invalid Merchant Link and for errors on public pages. No Cevrynt app
 * chrome.
 */
export function PublicMessage({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <div className="box-border flex min-h-full flex-col bg-page font-sans text-body text-ink">
      <header className="flex items-center px-8 py-[18px] max-[900px]:px-4 max-[900px]:py-3">
        <FunderBrand />
      </header>
      <main className="mx-auto box-border flex w-full max-w-[640px] flex-1 flex-col px-8 pt-6 pb-10 max-[900px]:px-4">
        <section className="flex flex-col items-center gap-3 rounded-[32px] bg-tile p-9 text-center max-[900px]:p-6">
          <h1 className="m-0 font-heading text-[26px] leading-[1.15] font-semibold">{title}</h1>
          <p className="m-0 text-body text-grey-text">{text}</p>
          {children ? <div className="mt-1 flex flex-wrap justify-center gap-2">{children}</div> : null}
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
