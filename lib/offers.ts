// The funnels this site runs. Each page passes its offer to <FunnelProvider>.

export type OfferId = "strategy" | "bfcm";

export type Offer = {
  id: OfferId;
  /** Paid offers go details → Stripe → Calendly; free ones go details → Calendly. */
  paid: boolean;
  /** Used for Meta content_name and in notifications. */
  contentName: string;
  modalTitle: string;
  modalSub: string;
  submitLabel: string;
  confirmTitle: (first: string) => string;
  confirmSub: string;
};

export const OFFERS: Record<OfferId, Offer> = {
  strategy: {
    id: "strategy",
    paid: true,
    contentName: "2027 strategy",
    modalTitle: "Claim your 2027 strategy",
    modalSub: "Tell us where to send it. Takes 30 seconds.",
    submitLabel: "Continue to order",
    confirmTitle: (first) => `Payment confirmed${first ? `, ${first}` : ""}.`,
    confirmSub: "Last step: book your 30-minute kickoff so we can start building your 2027 strategy.",
  },
  bfcm: {
    id: "bfcm",
    paid: false,
    contentName: "BFCM free creative analysis",
    modalTitle: "Claim your free creative analysis",
    modalSub: "Free for Black Friday & Cyber Monday. Takes 30 seconds.",
    submitLabel: "Continue to book a call",
    confirmTitle: (first) => `You’re in${first ? `, ${first}` : ""}.`,
    confirmSub: "Book your 30-minute call. Once you’ve booked, we’ll tell you how to send your 5 creatives.",
  },
};
