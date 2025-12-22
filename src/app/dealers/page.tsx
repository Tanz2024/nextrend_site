// src/app/dealers/page.tsx
import type { Metadata } from "next";
import { DealersContent } from "./DealersContent";

export const metadata: Metadata = {
  title: "Find a Dealer | Nextrend",
  description:
    "Locate Nextrend certified partners for private listening suites, hospitality deployments, and architectural audio commissions across Malaysia and Singapore.",
};

export default function DealersPage() {
  return <DealersContent />;
}
