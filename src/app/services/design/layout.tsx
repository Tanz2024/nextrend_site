import type { ReactNode } from "react";
import { ServicesPageShell } from "../layout";

export default function DesignLayout({ children }: { children: ReactNode }) {
  return <ServicesPageShell>{children}</ServicesPageShell>;
}
