type ChartTooltipProps = {
  title: string;
  value: string;
  hint?: string;
};

export function ChartTooltip({ title, value, hint }: ChartTooltipProps) {
  return (
    <div className="flex flex-col gap-gap-xxsmall rounded-medium bg-fill-neutral p-padding-small whitespace-nowrap text-text-on-fill shadow-default">
      <p className="text-label-xsmall">{title}</p>
      <p className="text-subtext-medium">{value}</p>
      {hint && <p className="text-subtext-small opacity-70">{hint}</p>}
    </div>
  );
}
