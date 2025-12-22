import type { Metadata } from "next";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Engagement",
  description:
    "Understand the Malaysian legal terms that govern Nextrend Systems audio dashboards and services.",
};

export default function TermsPage() {
  return <TermsContent />;
}
