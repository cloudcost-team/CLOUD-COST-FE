import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cloud-cost.cloud"),
  title: { default: "CloudCost", template: "%s | CloudCost" },
  description: "AWS EC2 사용량과 비용 조회",
  openGraph: {
    type: "website",
    siteName: "CloudCost",
    locale: "ko_KR",
    url: "/",
    title: "CloudCost — AWS 비용, 어디서 새는지 한눈에",
    description: "EC2 사용량과 비용, 낭비 리소스를 한 화면에서 확인하세요",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudCost — AWS 비용, 어디서 새는지 한눈에",
    description: "EC2 사용량과 비용, 낭비 리소스를 한 화면에서 확인하세요",
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
