import type { ReactNode } from "react";
import { ServicesPageShell } from "../layout";

export default function ConsultationLayout({ children }: { children: ReactNode }) {
  return <ServicesPageShell>{children}</ServicesPageShell>;
}
