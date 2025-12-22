

import type { Metadata } from "next";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Statement",
  description:
    "How Nextrend Systems protects personal data within Malaysia under the PDPA while delivering premium audio dashboards and services.",
};

export default function PrivacyStatementPage() {
  return <PrivacyContent />;
}
