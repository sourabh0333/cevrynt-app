import Image from "next/image";
import { funder, linkFooter } from "@/lib/sample-data/merchant-link";

/** The funder's logo square and name, top left on every public page. */
export function FunderBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-teal font-heading text-body-sm font-bold text-white max-[900px]:h-8 max-[900px]:w-8">
        {funder.initials}
      </span>
      <b className="font-heading text-card-title font-semibold max-[900px]:text-[16px]">{funder.name}</b>
    </div>
  );
}

/**
 * The footer on every public page: the funder's legal line, Privacy, Terms
 * and "Powered by Cevrynt" with the CY mark. `barSpace` leaves room for a
 * fixed bottom bar on phones.
 */
export function PublicFooter({ barSpace = false }: { barSpace?: boolean }) {
  return (
    <footer className={`flex flex-wrap justify-between gap-3 border-t border-line-strong px-8 py-[18px] text-label text-hint max-[900px]:px-4 ${barSpace ? "max-[900px]:pb-28" : ""}`}>
      <span>{funder.legal}</span>
      <span className="flex flex-wrap gap-4">
        <a href="#" className="text-hint no-underline">
          {linkFooter.privacy}
        </a>
        <a href="#" className="text-hint no-underline">
          {linkFooter.terms}
        </a>
        <span className="inline-flex items-center gap-1.5">
          {linkFooter.powered}
          <Image src="/brand/cevrynt-mark-solid.png" alt="" width={15} height={14} className="h-3.5 w-auto" />
          {linkFooter.brand}
        </span>
      </span>
    </footer>
  );
}
