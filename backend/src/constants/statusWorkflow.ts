export const allowedTransitions: Record<string, string[]> = {
  Applied: ["Screening", "Rejected"],
  Screening: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: ["Hired", "Rejected"],

  // Terminal states — no further transitions allowed
  Hired: [],
  Rejected: [],
  Withdrawn: [],
};
