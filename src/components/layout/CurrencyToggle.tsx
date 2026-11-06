"use client";

import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useCurrencyStore } from "@/stores/currencyStore";

export function CurrencyToggle() {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  return (
    <SegmentedControl
      aria-label="통화"
      options={[
        { value: "KRW", label: "원" },
        { value: "USD", label: "달러" },
      ]}
      value={currency}
      onChange={setCurrency}
    />
  );
}
