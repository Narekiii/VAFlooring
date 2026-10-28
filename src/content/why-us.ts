import { facts } from "./site";

/** Reasons to choose V & A Flooring Inc (Why Us page and homepage). Verified facts only. */
export const reasons: { title: string; body: string }[] = [
  {
    title: "Materials and installation from one company",
    body: "We sell the flooring and install it, so selection, ordering and installation stay with one accountable team instead of being handed between a store and a separate installer.",
  },
  {
    title: "Our own installation crews",
    body: `${facts.installationCrewsLong} install for homeowners, contractors and property managers, which lets us take on a single room or a multi-building project.`,
  },
  {
    title: "Family owned since 1999",
    body: "Founded by flooring installer Armond Markarian, the company is still family owned, and the people who answer for the work are the people who run it.",
  },
  {
    title: "Licensed, bonded and insured",
    body: "California CSLB license #866991 with B, C-15 (flooring) and C-54 (tile) classifications, and an EPA Lead-Safe Certified Firm.",
  },
  {
    title: "Showroom, design center and warehouse",
    body: "Compare samples in our Sun Valley showroom and design center. Our fully stocked, operational warehouse supplies customers, contractors and our own crews.",
  },
  {
    title: "Established manufacturers",
    body: `Products from manufacturers including ${facts.manufacturers.join(", ")}, with American-made options, and honest guidance on which products suit the space.`,
  },
];
