import type { ReactNode } from "react";
import { SessionExpiredDialog } from "@/components/layout/SessionExpiredDialog";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <SessionExpiredDialog />
    </>
  );
}
