import type { Metadata } from "next";
import { BenchmarkScreen } from "@/components/benchmark/BenchmarkScreen";

export const metadata: Metadata = { title: "체험 팀 벤치마킹" };

export default function DemoBenchmarkPage() {
  return <BenchmarkScreen />;
}
