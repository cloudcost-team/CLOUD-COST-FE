import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background-lower">
      <EmptyState title="대시보드를 준비하고 있어요" />
    </main>
  );
}
