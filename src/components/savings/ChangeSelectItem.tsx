import type { Currency } from "@/api/costs";
import type { SimulationSelectedItem } from "@/api/simulations";
import { Checkbox } from "@/components/ui/Checkbox";
import { formatMoney } from "@/lib/formatMoney";

type ChangeSelectItemProps = {
  item: SimulationSelectedItem;
  currency: Currency;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ChangeSelectItem({
  item,
  currency,
  checked,
  onCheckedChange,
}: ChangeSelectItemProps) {
  return (
    <label className="flex cursor-pointer items-center gap-gap-medium border-b border-border-weak py-padding-medium last:border-b-0">
      <Checkbox
        checked={checked}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        aria-label={`${item.name ?? item.instanceId} 적용`}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-gap-xxsmall">
        <span className="text-label-small text-text-strong">
          {item.name ?? item.instanceId} · {item.kindLabel}
        </span>
        <span className="text-subtext-medium text-text-tertiary">
          {item.action}
        </span>
      </span>
      <span className="text-label-small text-text-brand">
        월 {formatMoney(item.monthlySavings, currency)} 절감
      </span>
    </label>
  );
}
