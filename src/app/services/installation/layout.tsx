import type { ReactNode } from "react";
import { ServicesPageShell } from "../layout";

export default function InstallationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7efe3]">
      <ServicesPageShell>{children}</ServicesPageShell>
    </div>
  );
}
