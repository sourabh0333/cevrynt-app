import { OfferTab } from "@/components/deals/offer/OfferTab";

export const metadata = { title: "Deal offer and disclosures · Cevrynt" };

// Offer & disclosures, from design/Deal-Offer.html and its prototype.
// The early payoff, offer history, disclosure and package rows come in the next step.
export default function Page() {
  return <OfferTab />;
}
