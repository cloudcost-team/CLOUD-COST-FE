import { BrandAppIcon } from "@/components/ui/BrandAppIcon";

export default function Home() {
  return (
    <main className="flex flex-col gap-gap-large p-padding-xxlarge">
      <BrandAppIcon size={96} />
      <h1 className="text-title-large text-text-strong">CloudCost Insight</h1>
    </main>
  );
}
