import Image from "next/image";
import insightBrand from "@/assets/auth/insight-brand.svg";
import insightInfo from "@/assets/auth/insight-info.svg";
import insightPurple from "@/assets/auth/insight-purple.svg";
import windowDotGreen from "@/assets/auth/window-dot-green.svg";
import windowDotRed from "@/assets/auth/window-dot-red.svg";
import windowDotYellow from "@/assets/auth/window-dot-yellow.svg";

const bars = [
  "h-[28%]",
  "h-[46%]",
  "h-[38%]",
  "h-[66%]",
  "h-[52%]",
  "h-[78%]",
  "h-[58%]",
  "h-[88%]",
] as const;

export function LoginIllustration() {
  return (
    <div
      aria-label="CloudCost 비용 대시보드 미리보기"
      className="auth-illustration relative aspect-[1.08] w-full max-w-[540px] overflow-hidden rounded-[26px] border border-border-default"
      role="img"
    >
      <div className="auth-dashboard-window absolute top-[23.4%] left-[13.1%] h-[54%] w-[72.2%] overflow-hidden rounded-xxlarge border border-border-default bg-background-default shadow-strong">
        <div className="absolute inset-x-0 top-0 h-[12.6%] bg-background-lower" />
        <div className="absolute top-[4.8%] left-[3.3%] flex gap-[5px]">
          <Image src={windowDotRed} width={7} height={7} alt="" />
          <Image src={windowDotYellow} width={7} height={7} alt="" />
          <Image src={windowDotGreen} width={7} height={7} alt="" />
        </div>

        <div className="absolute top-[12.2%] bottom-0 left-0 w-[16.4%] bg-fill-brand-weak">
          <span className="absolute top-[12%] left-[17%] h-2 w-[62%] rounded-xsmall bg-fill-brand" />
          <span className="absolute top-[25%] left-[17%] h-2 w-[44%] rounded-xsmall bg-fill-neutral-medium" />
          <span className="absolute top-[38%] left-[17%] h-2 w-[44%] rounded-xsmall bg-fill-neutral-medium" />
          <span className="absolute top-[51%] left-[17%] h-2 w-[44%] rounded-xsmall bg-fill-neutral-medium" />
        </div>

        <div className="absolute top-[20.4%] right-[6.4%] left-[20.8%] grid grid-cols-3 gap-gap-small">
          {["bg-fill-brand", "bg-fill-sky", "bg-fill-brand"].map(
            (color, index) => (
              <div
                key={color + index}
                className="auth-kpi-card h-[58px] rounded-large border border-border-default bg-background-lower p-padding-small"
              >
                <span className="block h-[7px] w-[34px] rounded-xsmall bg-fill-neutral-medium" />
                <span
                  className={`mt-gap-medium block h-3 w-[52px] rounded-xsmall ${color}`}
                />
              </div>
            ),
          )}
        </div>

        <div className="absolute right-[6.4%] bottom-[9.3%] left-[20.8%] flex h-[41.5%] items-end gap-gap-medium rounded-large border border-border-default bg-background-default px-padding-medium pt-padding-small pb-padding-medium">
          {bars.map((heightClass, index) => (
            <span
              key={heightClass}
              className={`auth-chart-bar flex-1 rounded-t-small ${heightClass} ${index === 5 ? "bg-fill-brand" : "bg-fill-sky"}`}
            />
          ))}
        </div>
      </div>

      <Image
        className="auth-insight auth-insight-first absolute top-[16.2%] left-[5.7%] w-[21.9%]"
        src={insightBrand}
        alt=""
      />
      <Image
        className="auth-insight auth-insight-second absolute top-[14.2%] right-[7.6%] w-[20.4%]"
        src={insightInfo}
        alt=""
      />
      <Image
        className="auth-insight auth-insight-third absolute right-[8.3%] bottom-[11%] w-[25.2%]"
        src={insightPurple}
        alt=""
      />
    </div>
  );
}
