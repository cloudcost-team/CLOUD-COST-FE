import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { DemoSetupScreen } from "@/components/demo/DemoSetupScreen";
import { LoadingState } from "@/components/ui/LoadingState";

async function RequestTimeDemoSetup() {
  await connection();
  return <DemoSetupScreen />;
}

export const metadata: Metadata = { title: "체험 설정" };

export default function DemoSetupPage() {
  return (
    <Suspense fallback={<LoadingState title="체험 설정을 불러오고 있어요" />}>
      <RequestTimeDemoSetup />
    </Suspense>
  );
}
